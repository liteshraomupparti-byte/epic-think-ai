/**
 * Epic Think AI - MongoDB Database Service
 * 
 * Provides:
 * 1. Production-grade MongoDB connection management with connection pooling
 * 2. Strict multi-tenant isolation per Firebase UID
 * 3. Real-time conversation and message persistence
 * 4. Resilient local fallback store if MongoDB is temporarily unreachable
 * 5. Automatic background reconnection and data synchronization
 */

import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FALLBACK_STORE_PATH = path.resolve(__dirname, '../.mongo_resilient_store.json');

let client = null;
let db = null;
let conversationsCol = null;
let isConnected = false;
let isConnecting = false;
let reconnectTimer = null;

// In-memory + file-backed resilient fallback cache
let fallbackStore = {
  conversations: {} // { [uid]: { [chatId]: conversationDoc } }
};

// Load existing fallback cache from disk if available
try {
  if (fs.existsSync(FALLBACK_STORE_PATH)) {
    const raw = fs.readFileSync(FALLBACK_STORE_PATH, 'utf8');
    fallbackStore = JSON.parse(raw) || { conversations: {} };
    if (!fallbackStore.conversations) fallbackStore.conversations = {};
  }
} catch (err) {
  console.warn('[MONGODB:FALLBACK] Failed to read fallback store from disk:', err.message);
}

function persistFallbackStore() {
  try {
    fs.writeFileSync(FALLBACK_STORE_PATH, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (err) {
    console.warn('[MONGODB:FALLBACK] Failed to persist fallback store to disk:', err.message);
  }
}

/**
 * Sanitize MongoDB URI for logging (hide passwords)
 */
function sanitizeUri(uri) {
  if (!uri) return 'undefined';
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
}

/**
 * Initialize connection to MongoDB with auto-reconnection
 */
export async function initMongoDB() {
  if (isConnected || isConnecting) return;

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/epic_think_ai';
  const dbName = process.env.MONGODB_DB_NAME || 'epic_think_ai';

  isConnecting = true;

  try {
    console.log(`[MONGODB] Connecting to: ${sanitizeUri(uri)} (Database: ${dbName})...`);

    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 3000,
      socketTimeoutMS: 10000,
      maxPoolSize: 20
    });

    await client.connect();
    db = client.db(dbName);
    conversationsCol = db.collection('conversations');

    // Create unique compound and query indexes
    await conversationsCol.createIndex({ uid: 1, updatedAt: -1 });
    await conversationsCol.createIndex({ uid: 1, id: 1 }, { unique: true });

    isConnected = true;
    isConnecting = false;
    console.log(`[MONGODB] Connected successfully to database: "${db.databaseName}"`);

    // Sync any pending fallback data into MongoDB
    await syncFallbackToMongo();

    // Listen to connection closing
    client.on('close', () => {
      console.warn('[MONGODB] Connection closed. Falling back to resilient storage.');
      isConnected = false;
      scheduleReconnect();
    });

    client.on('error', (err) => {
      console.warn('[MONGODB] Connection error:', err.message);
      isConnected = false;
      scheduleReconnect();
    });

  } catch (err) {
    isConnected = false;
    isConnecting = false;
    console.warn(`[MONGODB] Live connection not established (${err.message}). Resilient offline cache active. Retrying in background...`);
    scheduleReconnect();
  }
}

/**
 * Schedule periodic reconnection attempts
 */
function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    if (!isConnected) {
      await initMongoDB();
    }
  }, 10000);
}

/**
 * Automatically sync offline fallback documents into MongoDB once connected
 */
async function syncFallbackToMongo() {
  if (!isConnected || !conversationsCol) return;

  try {
    let syncedCount = 0;
    const uids = Object.keys(fallbackStore.conversations);

    for (const uid of uids) {
      const userChats = Object.values(fallbackStore.conversations[uid] || {});
      for (const chat of userChats) {
        if (!chat || !chat.id) continue;
        await conversationsCol.updateOne(
          { uid, id: chat.id },
          { $set: chat },
          { upsert: true }
        );
        syncedCount++;
      }
    }

    if (syncedCount > 0) {
      console.log(`[MONGODB:SYNC] Successfully synced ${syncedCount} conversations from cache to MongoDB.`);
    }
  } catch (err) {
    console.warn('[MONGODB:SYNC] Error syncing cache to MongoDB:', err.message);
  }
}

/**
 * Get MongoDB Status
 */
export async function getMongoStatus() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/epic_think_ai';
  const dbName = process.env.MONGODB_DB_NAME || 'epic_think_ai';

  let totalConversations = 0;

  if (isConnected && conversationsCol) {
    try {
      totalConversations = await conversationsCol.countDocuments({});
    } catch (_) {}
  } else {
    // Count from fallback store
    for (const uid of Object.keys(fallbackStore.conversations)) {
      totalConversations += Object.keys(fallbackStore.conversations[uid] || {}).length;
    }
  }

  return {
    connected: isConnected,
    uri: sanitizeUri(uri),
    database: dbName,
    collection: 'conversations',
    totalConversations,
    mode: isConnected ? 'mongodb_cloud' : 'resilient_storage',
    status: isConnected ? 'online' : 'resilient_offline_cache'
  };
}

/**
 * Get all conversations for an authenticated Firebase user
 * 
 * @param {string} uid - Firebase UID
 * @returns {Promise<Array>} List of conversations sorted by updatedAt desc
 */
export async function getConversations(uid) {
  if (!uid) throw new Error('A valid Firebase UID is required.');

  if (isConnected && conversationsCol) {
    try {
      const docs = await conversationsCol
        .find({ uid }, { projection: { _id: 0 } })
        .sort({ updatedAt: -1 })
        .toArray();
      
      // Update local memory cache with latest from MongoDB
      if (!fallbackStore.conversations[uid]) fallbackStore.conversations[uid] = {};
      for (const doc of docs) {
        fallbackStore.conversations[uid][doc.id] = doc;
      }
      persistFallbackStore();

      return docs;
    } catch (err) {
      console.warn('[MONGODB] getConversations read error, falling back to cache:', err.message);
    }
  }

  // Fallback store
  const userChats = Object.values(fallbackStore.conversations[uid] || {});
  return userChats.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

/**
 * Get single conversation
 * 
 * @param {string} uid - Firebase UID
 * @param {string} chatId - Conversation ID
 */
export async function getConversation(uid, chatId) {
  if (!uid || !chatId) return null;

  if (isConnected && conversationsCol) {
    try {
      const doc = await conversationsCol.findOne({ uid, id: chatId }, { projection: { _id: 0 } });
      if (doc) return doc;
    } catch (err) {
      console.warn('[MONGODB] getConversation error:', err.message);
    }
  }

  return fallbackStore.conversations[uid]?.[chatId] || null;
}

/**
 * Save or upsert a conversation in real time
 * 
 * @param {string} uid - Firebase UID
 * @param {object} conversationData - Conversation object
 */
export async function saveConversation(uid, conversationData) {
  if (!uid) throw new Error('A valid Firebase UID is required.');
  if (!conversationData || !conversationData.id) {
    throw new Error('Conversation must have an "id" field.');
  }

  const now = Date.now();
  const doc = {
    id: String(conversationData.id),
    uid: String(uid),
    title: (conversationData.title || 'New Chat').trim(),
    createdAt: Number(conversationData.createdAt) || now,
    updatedAt: now,
    messages: Array.isArray(conversationData.messages) ? conversationData.messages : [],
    metadata: {
      model: conversationData.activeModel || conversationData.metadata?.model || 'Epic Think 4o',
      messageCount: Array.isArray(conversationData.messages) ? conversationData.messages.length : 0,
      savedAt: new Date(now).toISOString()
    }
  };

  // Always update resilient local cache
  if (!fallbackStore.conversations[uid]) fallbackStore.conversations[uid] = {};
  fallbackStore.conversations[uid][doc.id] = doc;
  persistFallbackStore();

  let savedToMongo = false;
  if (isConnected && conversationsCol) {
    try {
      await conversationsCol.updateOne(
        { uid, id: doc.id },
        { $set: doc },
        { upsert: true }
      );
      savedToMongo = true;
    } catch (err) {
      console.warn('[MONGODB] saveConversation error, saved in resilient cache:', err.message);
    }
  }

  return {
    success: true,
    conversation: doc,
    savedToMongo,
    storage: savedToMongo ? 'mongodb' : 'resilient_storage'
  };
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(uid, chatId, title) {
  if (!uid || !chatId) throw new Error('UID and Chat ID are required.');
  const newTitle = (title || 'New Chat').trim();
  const now = Date.now();

  // Update fallback
  if (fallbackStore.conversations[uid]?.[chatId]) {
    fallbackStore.conversations[uid][chatId].title = newTitle;
    fallbackStore.conversations[uid][chatId].updatedAt = now;
    persistFallbackStore();
  }

  if (isConnected && conversationsCol) {
    try {
      await conversationsCol.updateOne(
        { uid, id: chatId },
        { $set: { title: newTitle, updatedAt: now } }
      );
    } catch (err) {
      console.warn('[MONGODB] updateConversationTitle error:', err.message);
    }
  }

  return { success: true, title: newTitle, updatedAt: now };
}

/**
 * Save / append a message to a conversation in real time
 */
export async function saveMessage(uid, chatId, message) {
  if (!uid || !chatId || !message) throw new Error('UID, Chat ID, and message are required.');

  let conversation = await getConversation(uid, chatId);
  if (!conversation) {
    conversation = {
      id: chatId,
      uid,
      title: message.text ? message.text.slice(0, 40) : 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [message]
    };
  } else {
    // If message with same id exists, update it; otherwise append
    const msgIndex = conversation.messages.findIndex(m => m.id && message.id && m.id === message.id);
    if (msgIndex >= 0) {
      conversation.messages[msgIndex] = message;
    } else {
      conversation.messages.push(message);
    }
    conversation.updatedAt = Date.now();
  }

  return await saveConversation(uid, conversation);
}

/**
 * Save user feedback on a message
 */
export async function saveMessageFeedback(uid, chatId, messageIndex, feedback) {
  if (!uid || !chatId) throw new Error('UID and Chat ID are required.');
  
  const conversation = await getConversation(uid, chatId);
  if (!conversation || !conversation.messages || !conversation.messages[messageIndex]) {
    throw new Error('Conversation or message index not found.');
  }

  conversation.messages[messageIndex].feedback = feedback;
  conversation.updatedAt = Date.now();

  return await saveConversation(uid, conversation);
}

/**
 * Delete a single conversation
 */
export async function deleteConversation(uid, chatId) {
  if (!uid || !chatId) throw new Error('UID and Chat ID are required.');

  // Delete from fallback
  if (fallbackStore.conversations[uid]?.[chatId]) {
    delete fallbackStore.conversations[uid][chatId];
    persistFallbackStore();
  }

  if (isConnected && conversationsCol) {
    try {
      await conversationsCol.deleteOne({ uid, id: chatId });
    } catch (err) {
      console.warn('[MONGODB] deleteConversation error:', err.message);
    }
  }

  return { success: true, chatId };
}

/**
 * Delete all conversations for a user
 */
export async function deleteAllConversations(uid) {
  if (!uid) throw new Error('UID is required.');

  // Clear fallback
  if (fallbackStore.conversations[uid]) {
    fallbackStore.conversations[uid] = {};
    persistFallbackStore();
  }

  if (isConnected && conversationsCol) {
    try {
      await conversationsCol.deleteMany({ uid });
    } catch (err) {
      console.warn('[MONGODB] deleteAllConversations error:', err.message);
    }
  }

  return { success: true, message: 'All conversations deleted' };
}
