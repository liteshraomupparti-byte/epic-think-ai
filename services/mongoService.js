/**
 * Epic Think AI - MongoDB Database Service
 * 
 * Provides:
 * 1. Production-grade MongoDB connection management with connection pooling
 * 2. Multi-tenant isolation strictly keyed on Firebase UID (canonical identity)
 * 3. Separate normalized collections:
 *    - users: { firebaseUid, email, name, createdAt, updatedAt }
 *    - conversations: { id, firebaseUid, uid, title, createdAt, updatedAt, lastMessageAt, messages, metadata }
 *    - messages: { id, conversationId, firebaseUid, uid, role, content, text, createdAt, ... }
 * 4. High-performance compound indexes for rapid lookup and sorting
 * 5. Resilient file-backed local fallback cache if MongoDB is offline
 * 6. Automatic background reconnection and data reconciliation
 * 7. Structured sanitized logging: [AUTH], [DB], [CONVERSATION], [MESSAGE]
 */

import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUNDLED_STORE_PATH = path.resolve(__dirname, '../.mongo_resilient_store.json');
const WRITABLE_STORE_PATH = process.env.VERCEL
  ? path.resolve('/tmp', '.mongo_resilient_store.json')
  : BUNDLED_STORE_PATH;

let client = null;
let db = null;
let usersCol = null;
let conversationsCol = null;
let messagesCol = null;
let isConnected = false;
let isConnecting = false;
let reconnectTimer = null;

// In-memory + file-backed resilient fallback cache
let fallbackStore = {
  users: {},         // { [firebaseUid]: userDoc }
  conversations: {}, // { [firebaseUid]: { [chatId]: conversationDoc } }
  messages: {}       // { [chatId]: [messageDoc] }
};

// Load existing fallback cache from disk (bundled first, then /tmp if exists)
try {
  if (fs.existsSync(BUNDLED_STORE_PATH)) {
    const raw = fs.readFileSync(BUNDLED_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) || {};
    fallbackStore = {
      users: parsed.users || {},
      conversations: parsed.conversations || {},
      messages: parsed.messages || {}
    };
  }
} catch (err) {
  console.warn('[DB:FALLBACK] Note reading bundled store:', err.message);
}

try {
  if (WRITABLE_STORE_PATH !== BUNDLED_STORE_PATH && fs.existsSync(WRITABLE_STORE_PATH)) {
    const raw = fs.readFileSync(WRITABLE_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) || {};
    if (parsed.conversations) {
      fallbackStore.conversations = { ...fallbackStore.conversations, ...parsed.conversations };
    }
    if (parsed.users) {
      fallbackStore.users = { ...fallbackStore.users, ...parsed.users };
    }
    if (parsed.messages) {
      fallbackStore.messages = { ...fallbackStore.messages, ...parsed.messages };
    }
  }
} catch (_) {}

function persistFallbackStore() {
  try {
    fs.writeFileSync(WRITABLE_STORE_PATH, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (err) {
    if (WRITABLE_STORE_PATH !== '/tmp/.mongo_resilient_store.json') {
      try {
        fs.writeFileSync('/tmp/.mongo_resilient_store.json', JSON.stringify(fallbackStore, null, 2), 'utf8');
      } catch (_) {}
    }
  }
}

/**
 * Sanitize MongoDB URI for logging (hide credentials)
 */
function sanitizeUri(uri) {
  if (!uri) return 'undefined';
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
}

/**
 * Initialize connection to MongoDB with auto-reconnection and index verification
 */
export async function initMongoDB() {
  if (isConnected) return;
  if (isConnecting && global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/epic_think_ai';
  const dbName = process.env.MONGODB_DB_NAME || 'epic_think_ai';

  isConnecting = true;

  const connectTask = async () => {
    try {
      console.log(`[DB] Connecting to MongoDB: ${sanitizeUri(uri)} (Database: "${dbName}")...`);

      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 30000,
        maxPoolSize: 20
      });

      await client.connect();
      db = client.db(dbName);

      usersCol = db.collection('users');
      conversationsCol = db.collection('conversations');
      messagesCol = db.collection('messages');

      // Create / verify compound and query indexes for maximum performance and data integrity
      await Promise.allSettled([
        // Users collection indexes
        usersCol.createIndex({ firebaseUid: 1 }, { unique: true }),
        usersCol.createIndex({ email: 1 }),

        // Conversations collection indexes
        conversationsCol.createIndex({ firebaseUid: 1, updatedAt: -1 }),
        conversationsCol.createIndex({ firebaseUid: 1, id: 1 }, { unique: true }),
        conversationsCol.createIndex({ uid: 1, updatedAt: -1 }),
        conversationsCol.createIndex({ uid: 1, id: 1 }),
        conversationsCol.createIndex({ email: 1, updatedAt: -1 }),
        conversationsCol.createIndex({ email: 1, id: 1 }),

        // Messages collection indexes
        messagesCol.createIndex({ conversationId: 1, createdAt: 1 }),
        messagesCol.createIndex({ firebaseUid: 1, conversationId: 1 }),
        messagesCol.createIndex({ email: 1, conversationId: 1 }),
        messagesCol.createIndex({ id: 1 }, { unique: true, sparse: true })
      ]);

      isConnected = true;
      isConnecting = false;
      console.log(`[DB] Connected successfully to MongoDB database: "${db.databaseName}"`);

      // Sync any pending fallback data into MongoDB
      await syncFallbackToMongo();

      // Connection lifecycle listeners
      client.on('close', () => {
        console.warn('[DB] MongoDB connection closed. Switching to resilient offline cache.');
        isConnected = false;
        scheduleReconnect();
      });

      client.on('error', (err) => {
        console.warn('[DB] MongoDB connection error:', err.message);
        isConnected = false;
        scheduleReconnect();
      });

    } catch (err) {
      isConnected = false;
      isConnecting = false;
      console.warn(`[DB] Live connection not established (${err.message}). Resilient offline cache active. Retrying in background...`);
      scheduleReconnect();
    }
  };

  global._mongoClientPromise = connectTask();
  return global._mongoClientPromise;
}

/**
 * Schedule periodic background reconnection attempts
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
 * Automatically sync offline fallback documents into MongoDB once live connection is active
 */
async function syncFallbackToMongo() {
  if (!isConnected || !conversationsCol) return;

  try {
    let syncedChats = 0;
    let syncedUsers = 0;
    const uids = Object.keys(fallbackStore.conversations);

    // Sync users
    for (const fUid of Object.keys(fallbackStore.users || {})) {
      const u = fallbackStore.users[fUid];
      if (u && u.firebaseUid) {
        await usersCol.updateOne(
          { firebaseUid: u.firebaseUid },
          { $set: u },
          { upsert: true }
        );
        syncedUsers++;
      }
    }

    // Sync conversations and nested messages
    for (const uid of uids) {
      const userChats = Object.values(fallbackStore.conversations[uid] || {});
      for (const chat of userChats) {
        if (!chat || !chat.id) continue;
        const normDoc = {
          ...chat,
          firebaseUid: String(chat.firebaseUid || uid),
          uid: String(chat.uid || uid)
        };
        await conversationsCol.updateOne(
          { $or: [{ firebaseUid: normDoc.firebaseUid, id: normDoc.id }, { uid: normDoc.uid, id: normDoc.id }] },
          { $set: normDoc },
          { upsert: true }
        );
        syncedChats++;

        // Sync messages into messages collection
        if (Array.isArray(chat.messages) && messagesCol) {
          for (const msg of chat.messages) {
            if (!msg) continue;
            const msgDoc = {
              id: msg.id || `${chat.id}_${msg.timestamp || Date.now()}`,
              conversationId: chat.id,
              firebaseUid: normDoc.firebaseUid,
              uid: normDoc.uid,
              role: msg.role || 'user',
              content: msg.text || msg.content || '',
              text: msg.text || msg.content || '',
              files: msg.files || [],
              thoughts: msg.thoughts || null,
              provider: msg.provider || null,
              model: msg.model || null,
              latency: msg.latency || null,
              recalledMemories: msg.recalledMemories || 0,
              feedback: msg.feedback || null,
              createdAt: msg.timestamp || msg.createdAt || Date.now()
            };
            await messagesCol.updateOne(
              { id: msgDoc.id },
              { $set: msgDoc },
              { upsert: true }
            );
          }
        }
      }
    }

    if (syncedChats > 0 || syncedUsers > 0) {
      console.log(`[DB:SYNC] Reconciled ${syncedUsers} users & ${syncedChats} conversations to MongoDB.`);
    }
  } catch (err) {
    console.warn('[DB:SYNC] Note while syncing cache to MongoDB:', err.message);
  }
}

/**
 * Upsert authenticated user profile into users collection
 * 
 * @param {{ uid: string, email?: string, name?: string }} user
 */
export async function upsertUser(user) {
  if (!user || !user.uid) return null;
  const now = Date.now();
  const userDoc = {
    firebaseUid: String(user.uid),
    email: user.email || null,
    name: user.name || (user.email ? user.email.split('@')[0] : 'Epic Thinker'),
    updatedAt: now
  };

  // Cache locally
  if (!fallbackStore.users) fallbackStore.users = {};
  fallbackStore.users[user.uid] = {
    ...fallbackStore.users[user.uid],
    ...userDoc,
    createdAt: fallbackStore.users[user.uid]?.createdAt || now
  };
  persistFallbackStore();

  if (isConnected && usersCol) {
    try {
      await usersCol.updateOne(
        { firebaseUid: userDoc.firebaseUid },
        { 
          $set: userDoc,
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );
      console.log(`[AUTH] User session synchronized in database: ${user.uid}`);
    } catch (err) {
      console.warn('[AUTH] Error upserting user in MongoDB:', err.message);
    }
  }

  return userDoc;
}

/**
 * Get MongoDB Status
 */
export async function getMongoStatus() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/epic_think_ai';
  const dbName = process.env.MONGODB_DB_NAME || 'epic_think_ai';

  let totalConversations = 0;
  let totalMessages = 0;
  let totalUsers = 0;

  if (isConnected && conversationsCol) {
    try {
      totalConversations = await conversationsCol.countDocuments({});
      if (messagesCol) totalMessages = await messagesCol.countDocuments({});
      if (usersCol) totalUsers = await usersCol.countDocuments({});
    } catch (_) {}
  } else {
    for (const uid of Object.keys(fallbackStore.conversations)) {
      totalConversations += Object.keys(fallbackStore.conversations[uid] || {}).length;
    }
    totalUsers = Object.keys(fallbackStore.users || {}).length;
  }

  return {
    connected: isConnected,
    uri: sanitizeUri(uri),
    database: dbName,
    collection: 'conversations',
    totalConversations,
    totalMessages,
    totalUsers,
    mode: isConnected ? 'mongodb_cloud' : 'resilient_storage',
    status: isConnected ? 'online' : 'resilient_offline_cache'
  };
}

/**
 * Get all conversations for an authenticated Firebase user (strictly isolated)
 * 
 * @param {string} uid - Firebase UID
 * @returns {Promise<Array>} List of conversations sorted by updatedAt desc
 */
export async function getConversations(uid, email = null) {
  if (!uid) throw new Error('A valid Firebase UID is required.');
  const fUid = String(uid);
  const normEmail = email ? String(email).trim().toLowerCase() : null;

  if (isConnected && conversationsCol) {
    try {
      const orConditions = [{ firebaseUid: fUid }, { uid: fUid }];
      if (normEmail) {
        orConditions.push({ email: normEmail });
      }

      const docs = await conversationsCol
        .find({ $or: orConditions }, { projection: { _id: 0 } })
        .sort({ updatedAt: -1 })
        .toArray();

      // Normalize fields
      const normalized = docs.map(d => ({
        ...d,
        firebaseUid: d.firebaseUid || fUid,
        uid: d.uid || fUid,
        email: d.email || normEmail || null
      }));

      // Update local memory cache with latest from MongoDB
      if (!fallbackStore.conversations[fUid]) fallbackStore.conversations[fUid] = {};
      for (const doc of normalized) {
        fallbackStore.conversations[fUid][doc.id] = doc;
      }
      persistFallbackStore();

      console.log(`[CONVERSATION] Retrieved ${normalized.length} conversations for user: ${fUid} (${normEmail || 'no email'})`);
      return normalized;
    } catch (err) {
      console.warn('[CONVERSATION] MongoDB getConversations read error, falling back to cache:', err.message);
    }
  }

  // Fallback cache: query by fUid and normEmail
  const chatsMap = new Map();
  const uidChats = Object.values(fallbackStore.conversations[fUid] || {});
  for (const c of uidChats) {
    if (c && c.id) chatsMap.set(c.id, c);
  }

  if (normEmail) {
    for (const otherUid of Object.keys(fallbackStore.conversations || {})) {
      if (otherUid === fUid) continue;
      const otherChats = Object.values(fallbackStore.conversations[otherUid] || {});
      for (const c of otherChats) {
        if (c && c.email && c.email.toLowerCase() === normEmail) {
          chatsMap.set(c.id, c);
        }
      }
    }
  }

  const userChats = Array.from(chatsMap.values());
  return userChats.sort((a, b) => (Number(b.updatedAt) || Number(b.createdAt) || 0) - (Number(a.updatedAt) || Number(a.createdAt) || 0));
}

/**
 * Get single conversation owned by user
 * 
 * @param {string} uid - Firebase UID
 * @param {string} chatId - Conversation ID
 * @param {string} [email] - User email
 */
export async function getConversation(uid, chatId, email = null) {
  if (!uid || !chatId) return null;
  const fUid = String(uid);
  const strId = String(chatId);
  const normEmail = email ? String(email).trim().toLowerCase() : null;

  if (isConnected && conversationsCol) {
    try {
      const orConditions = [{ firebaseUid: fUid }, { uid: fUid }];
      if (normEmail) orConditions.push({ email: normEmail });

      const doc = await conversationsCol.findOne(
        { id: strId, $or: orConditions },
        { projection: { _id: 0 } }
      );
      if (doc) {
        return {
          ...doc,
          firebaseUid: doc.firebaseUid || fUid,
          uid: doc.uid || fUid,
          email: doc.email || normEmail || null
        };
      }
    } catch (err) {
      console.warn('[CONVERSATION] MongoDB getConversation error:', err.message);
    }
  }

  const direct = fallbackStore.conversations[fUid]?.[strId];
  if (direct) return direct;

  if (normEmail) {
    for (const otherUid of Object.keys(fallbackStore.conversations || {})) {
      const c = fallbackStore.conversations[otherUid]?.[strId];
      if (c && c.email && c.email.toLowerCase() === normEmail) {
        return c;
      }
    }
  }

  return null;
}

/**
 * Check if a conversation exists under ANY user (to distinguish 403 vs 404)
 * 
 * @param {string} chatId - Conversation ID
 * @returns {Promise<{ id: string, firebaseUid: string } | null>}
 */
export async function getConversationAnyUser(chatId) {
  if (!chatId) return null;
  const strId = String(chatId);

  if (isConnected && conversationsCol) {
    try {
      const doc = await conversationsCol.findOne({ id: strId }, { projection: { _id: 0, id: 1, firebaseUid: 1, uid: 1 } });
      if (doc) return { id: doc.id, firebaseUid: doc.firebaseUid || doc.uid };
    } catch (_) {}
  }

  // Search in fallback
  for (const fUid of Object.keys(fallbackStore.conversations || {})) {
    if (fallbackStore.conversations[fUid]?.[strId]) {
      return { id: strId, firebaseUid: fUid };
    }
  }

  return null;
}

/**
 * Retrieve messages for a conversation, verifying user ownership
 * 
 * @param {string} uid - Authenticated Firebase UID
 * @param {string} chatId - Conversation ID
 * @returns {Promise<Array>}
 */
export async function getMessages(uid, chatId, email = null) {
  if (!uid || !chatId) throw new Error('UID and Chat ID are required.');
  const fUid = String(uid);
  const strId = String(chatId);
  const normEmail = email ? String(email).trim().toLowerCase() : null;

  // 1. Verify conversation ownership
  const convo = await getConversation(fUid, strId, normEmail);
  if (!convo) {
    const existsOther = await getConversationAnyUser(strId);
    if (existsOther && existsOther.firebaseUid !== fUid) {
      const err = new Error('Access denied to conversation.');
      err.statusCode = 403;
      throw err;
    }
    const notFoundErr = new Error('Conversation not found.');
    notFoundErr.statusCode = 404;
    throw notFoundErr;
  }

  // 2. Query messages collection first if live
  if (isConnected && messagesCol) {
    try {
      const orConditions = [{ firebaseUid: fUid }, { uid: fUid }];
      if (normEmail) orConditions.push({ email: normEmail });

      const docs = await messagesCol
        .find({ conversationId: strId, $or: orConditions }, { projection: { _id: 0 } })
        .sort({ createdAt: 1 })
        .toArray();

      if (docs && docs.length > 0) {
        return docs;
      }
    } catch (err) {
      console.warn('[MESSAGE] getMessages collection query note:', err.message);
    }
  }

  // Fallback to conversation.messages array
  return convo.messages || [];
}

/**
 * Save or upsert a conversation in real time to MongoDB
 * 
 * @param {string} uid - Firebase UID
 * @param {object} conversationData - Conversation object
 * @param {string} [email] - User email
 */
export async function saveConversation(uid, conversationData, email = null) {
  if (!uid) throw new Error('A valid Firebase UID is required.');
  if (!conversationData || !conversationData.id) {
    throw new Error('Conversation must have an "id" field.');
  }

  const fUid = String(uid);
  const normEmail = email ? String(email).trim().toLowerCase() : (conversationData.email ? String(conversationData.email).trim().toLowerCase() : null);
  const now = Date.now();
  const messages = Array.isArray(conversationData.messages) ? conversationData.messages : [];
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const lastMessageAt = lastMsg ? (Number(lastMsg.timestamp || lastMsg.createdAt) || now) : now;

  const doc = {
    id: String(conversationData.id),
    firebaseUid: fUid,
    uid: fUid,
    email: normEmail,
    title: (conversationData.title || 'New Chat').trim(),
    createdAt: Number(conversationData.createdAt) || now,
    updatedAt: now,
    lastMessageAt,
    messages,
    metadata: {
      model: conversationData.activeModel || conversationData.metadata?.model || 'Epic Think 4o',
      messageCount: messages.length,
      savedAt: new Date(now).toISOString()
    }
  };

  // Always update resilient local cache
  if (!fallbackStore.conversations[fUid]) fallbackStore.conversations[fUid] = {};
  fallbackStore.conversations[fUid][doc.id] = doc;
  persistFallbackStore();

  let savedToMongo = false;
  if (isConnected && conversationsCol) {
    try {
      const orConditions = [{ firebaseUid: fUid }, { uid: fUid }];
      if (normEmail) orConditions.push({ email: normEmail });

      await conversationsCol.updateOne(
        { id: doc.id, $or: orConditions },
        { $set: doc },
        { upsert: true }
      );
      savedToMongo = true;

      // Also persist individual messages to messages collection
      if (messagesCol && messages.length > 0) {
        const bulkOps = messages.map(m => {
          const msgId = m.id || `${doc.id}_${m.timestamp || Date.now()}`;
          return {
            updateOne: {
              filter: { id: msgId },
              update: {
                $set: {
                  id: msgId,
                  conversationId: doc.id,
                  firebaseUid: fUid,
                  uid: fUid,
                  email: normEmail,
                  role: m.role || 'user',
                  content: m.text || m.content || '',
                  text: m.text || m.content || '',
                  files: m.files || [],
                  thoughts: m.thoughts || null,
                  provider: m.provider || null,
                  model: m.model || null,
                  latency: m.latency || null,
                  recalledMemories: m.recalledMemories || 0,
                  feedback: m.feedback || null,
                  finishReason: m.finishReason || null,
                  isTruncated: Boolean(m.isTruncated || m.finishReason === 'length'),
                  canContinue: Boolean(m.canContinue || m.isTruncated || m.finishReason === 'length'),
                  maxOutputTokens: m.maxOutputTokens || null,
                  status: m.status || (m.isTruncated ? 'interrupted' : 'completed'),
                  createdAt: m.timestamp || m.createdAt || now
                }
              },
              upsert: true
            }
          };
        });
        await messagesCol.bulkWrite(bulkOps, { ordered: false }).catch(() => {});
      }

      console.log(`[CONVERSATION] Saved conversation "${doc.title}" (${doc.id}) for user: ${fUid} (${normEmail || 'no email'})`);
    } catch (err) {
      console.warn('[CONVERSATION] MongoDB save error, cached in resilient storage:', err.message);
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
  const fUid = String(uid);
  const strId = String(chatId);
  const newTitle = (title || 'New Chat').trim();
  const now = Date.now();

  // Update fallback cache
  if (fallbackStore.conversations[fUid]?.[strId]) {
    fallbackStore.conversations[fUid][strId].title = newTitle;
    fallbackStore.conversations[fUid][strId].updatedAt = now;
    persistFallbackStore();
  }

  if (isConnected && conversationsCol) {
    try {
      await conversationsCol.updateOne(
        { id: strId, $or: [{ firebaseUid: fUid }, { uid: fUid }] },
        { $set: { title: newTitle, updatedAt: now } }
      );
      console.log(`[CONVERSATION] Updated title for ${strId}: "${newTitle}"`);
    } catch (err) {
      console.warn('[CONVERSATION] updateConversationTitle error:', err.message);
    }
  }

  return { success: true, title: newTitle, updatedAt: now };
}

/**
 * Save / append a message to a conversation in real time
 */
export async function saveMessage(uid, chatId, message) {
  if (!uid || !chatId || !message) throw new Error('UID, Chat ID, and message are required.');
  const fUid = String(uid);
  const strId = String(chatId);
  const now = Date.now();

  const msgId = message.id || `msg_${now}_${Math.random().toString(36).slice(2, 8)}`;
  const normalizedMessage = {
    id: msgId,
    conversationId: strId,
    firebaseUid: fUid,
    uid: fUid,
    role: message.role || 'user',
    content: message.text || message.content || '',
    text: message.text || message.content || '',
    files: message.files || [],
    thoughts: message.thoughts || null,
    provider: message.provider || null,
    model: message.model || null,
    latency: message.latency || null,
    recalledMemories: message.recalledMemories || 0,
    feedback: message.feedback || null,
    finishReason: message.finishReason || null,
    isTruncated: Boolean(message.isTruncated || message.finishReason === 'length'),
    canContinue: Boolean(message.canContinue || message.isTruncated || message.finishReason === 'length'),
    maxOutputTokens: message.maxOutputTokens || null,
    status: message.status || (message.isTruncated ? 'interrupted' : 'completed'),
    timestamp: message.timestamp || now,
    createdAt: message.createdAt || message.timestamp || now
  };

  let conversation = await getConversation(fUid, strId);
  if (!conversation) {
    conversation = {
      id: strId,
      firebaseUid: fUid,
      uid: fUid,
      title: normalizedMessage.text ? normalizedMessage.text.slice(0, 40) : 'New Chat',
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      messages: [normalizedMessage]
    };
  } else {
    // Upsert message in messages array
    const msgIndex = conversation.messages.findIndex(m => m.id && m.id === msgId);
    if (msgIndex >= 0) {
      conversation.messages[msgIndex] = normalizedMessage;
    } else {
      conversation.messages.push(normalizedMessage);
    }
    conversation.updatedAt = now;
    conversation.lastMessageAt = now;
  }

  // Save conversation
  const result = await saveConversation(fUid, conversation);

  // Directly save to messages collection as well
  if (isConnected && messagesCol) {
    try {
      await messagesCol.updateOne(
        { id: msgId },
        { $set: normalizedMessage },
        { upsert: true }
      );
      console.log(`[MESSAGE] Saved message ${msgId} (role: ${normalizedMessage.role}) for conversation ${strId}`);
    } catch (err) {
      console.warn('[MESSAGE] MongoDB saveMessage note:', err.message);
    }
  }

  return {
    ...result,
    messageId: msgId,
    message: normalizedMessage
  };
}

/**
 * Save user feedback on a message
 */
export async function saveMessageFeedback(uid, chatId, messageIndex, feedback) {
  if (!uid || !chatId) throw new Error('UID and Chat ID are required.');
  const fUid = String(uid);
  const strId = String(chatId);
  
  const conversation = await getConversation(fUid, strId);
  if (!conversation || !conversation.messages || !conversation.messages[messageIndex]) {
    throw new Error('Conversation or message index not found.');
  }

  conversation.messages[messageIndex].feedback = feedback;
  conversation.updatedAt = Date.now();

  return await saveConversation(fUid, conversation);
}

/**
 * Delete a single conversation and its associated messages
 */
export async function deleteConversation(uid, chatId, email = null) {
  if (!uid || !chatId) throw new Error('UID and Chat ID are required.');
  const fUid = String(uid);
  const strId = String(chatId);
  const normEmail = email ? String(email).trim().toLowerCase() : null;

  // Delete from fallback store
  if (fallbackStore.conversations[fUid]?.[strId]) {
    delete fallbackStore.conversations[fUid][strId];
    persistFallbackStore();
  }

  if (normEmail) {
    for (const otherUid of Object.keys(fallbackStore.conversations || {})) {
      if (fallbackStore.conversations[otherUid]?.[strId]?.email === normEmail) {
        delete fallbackStore.conversations[otherUid][strId];
        persistFallbackStore();
      }
    }
  }

  if (isConnected) {
    try {
      const orConditions = [{ firebaseUid: fUid }, { uid: fUid }];
      if (normEmail) orConditions.push({ email: normEmail });

      if (conversationsCol) {
        await conversationsCol.deleteOne({ id: strId, $or: orConditions });
      }
      if (messagesCol) {
        await messagesCol.deleteMany({ conversationId: strId, $or: orConditions });
      }
      console.log(`[CONVERSATION] Deleted conversation ${strId} for user: ${fUid}`);
    } catch (err) {
      console.warn('[CONVERSATION] deleteConversation error:', err.message);
    }
  }

  return { success: true, chatId: strId };
}

/**
 * Delete all conversations for an authenticated user
 */
export async function deleteAllConversations(uid) {
  if (!uid) throw new Error('UID is required.');
  const fUid = String(uid);

  // Clear fallback cache
  if (fallbackStore.conversations[fUid]) {
    fallbackStore.conversations[fUid] = {};
    persistFallbackStore();
  }

  if (isConnected) {
    try {
      if (conversationsCol) {
        await conversationsCol.deleteMany({ $or: [{ firebaseUid: fUid }, { uid: fUid }] });
      }
      if (messagesCol) {
        await messagesCol.deleteMany({ $or: [{ firebaseUid: fUid }, { uid: fUid }] });
      }
      console.log(`[CONVERSATION] Deleted all conversations for user: ${fUid}`);
    } catch (err) {
      console.warn('[CONVERSATION] deleteAllConversations error:', err.message);
    }
  }

  return { success: true, message: 'All conversations deleted' };
}
