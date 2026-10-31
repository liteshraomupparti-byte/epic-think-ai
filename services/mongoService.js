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
import { QuotaTrackingService, USER_TIERS } from './usage/QuotaTrackingService.js';

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
let usageRecordsCol = null;
let userQuotasCol = null;
let isConnected = false;
let isConnecting = false;
let reconnectTimer = null;

// In-memory + file-backed resilient fallback cache
let fallbackStore = {
  users: {},         // { [firebaseUid]: userDoc }
  conversations: {}, // { [firebaseUid]: { [chatId]: conversationDoc } }
  messages: {},      // { [chatId]: [messageDoc] }
  usage_records: [], // [usageRecordDoc]
  user_quotas: {}    // { [firebaseUid]: userQuotaDoc }
};

// Load existing fallback cache from disk (bundled first, then /tmp if exists)
try {
  if (fs.existsSync(BUNDLED_STORE_PATH)) {
    const raw = fs.readFileSync(BUNDLED_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) || {};
    fallbackStore = {
      users: parsed.users || {},
      conversations: parsed.conversations || {},
      messages: parsed.messages || {},
      usage_records: parsed.usage_records || [],
      user_quotas: parsed.user_quotas || {}
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
    if (Array.isArray(parsed.usage_records)) {
      fallbackStore.usage_records = parsed.usage_records;
    }
    if (parsed.user_quotas) {
      fallbackStore.user_quotas = { ...fallbackStore.user_quotas, ...parsed.user_quotas };
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
      usageRecordsCol = db.collection('usage_records');
      userQuotasCol = db.collection('user_quotas');

      // Create / verify compound and query indexes for maximum performance and data integrity
      await Promise.allSettled([
        // Users collection indexes
        usersCol.createIndex({ firebaseUid: 1 }, { unique: true }),
        usersCol.createIndex({ username: 1 }, { unique: true, sparse: true }),
        usersCol.createIndex({ email: 1 }),
        usersCol.createIndex({ tier: 1 }),
        usersCol.createIndex({ updatedAt: -1 }),
        usersCol.createIndex({ "usage.lastActiveAt": -1 }),

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
        messagesCol.createIndex({ id: 1 }, { unique: true, sparse: true }),

        // Usage Records collection indexes for fast time-series & user telemetry
        usageRecordsCol.createIndex({ firebaseUid: 1, timestamp: -1 }),
        usageRecordsCol.createIndex({ firebaseUid: 1, type: 1, timestamp: -1 }),
        usageRecordsCol.createIndex({ date: 1, type: 1 }),
        usageRecordsCol.createIndex({ month: 1 }),
        usageRecordsCol.createIndex({ timestamp: -1 }),

        // User Quotas collection index
        userQuotasCol.createIndex({ firebaseUid: 1 }, { unique: true })
      ]);

      isConnected = true;
      isConnecting = false;
      console.log(`[DB] Connected successfully to MongoDB database: "${db.databaseName}" (with Usage & Quota collections)`);

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
        const cleanUser = { ...u };
        for (const k of Object.keys(cleanUser)) {
          if (k.includes('.')) delete cleanUser[k];
        }
        await usersCol.updateOne(
          { firebaseUid: cleanUser.firebaseUid },
          { $set: cleanUser },
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

    // Sync usage records
    if (Array.isArray(fallbackStore.usage_records) && fallbackStore.usage_records.length > 0 && usageRecordsCol) {
      try {
        for (const rec of fallbackStore.usage_records) {
          if (rec.id) {
            await usageRecordsCol.updateOne({ id: rec.id }, { $set: rec }, { upsert: true });
          }
        }
      } catch (_) {}
    }

    // Sync user quotas
    if (fallbackStore.user_quotas && userQuotasCol) {
      try {
        for (const [qUid, qDoc] of Object.entries(fallbackStore.user_quotas)) {
          if (qDoc && qUid) {
            await userQuotasCol.updateOne({ firebaseUid: qUid }, { $set: qDoc }, { upsert: true });
          }
        }
      } catch (_) {}
    }

    if (syncedChats > 0 || syncedUsers > 0) {
      console.log(`[DB:SYNC] Reconciled ${syncedUsers} users & ${syncedChats} conversations to MongoDB.`);
    }
  } catch (err) {
    console.warn('[DB:SYNC] Note while syncing cache to MongoDB:', err.message);
  }
}

/**
 * Ensure MongoDB connection is established (especially for serverless cold starts)
 */
export async function ensureConnected() {
  if (isConnected) return;
  try {
    await initMongoDB();
  } catch (_) {}
}

/**
 * Generate a clean base slug for a username
 */
function generateCleanUsername(nameOrEmail) {
  let base = (nameOrEmail || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 20);
  if (!base || base.length < 3) base = `thinker_${Math.floor(100 + Math.random() * 900)}`;
  return base;
}

/**
 * Check if a username is valid and available (unique)
 * 
 * @param {string} username - Desired username
 * @param {string} [excludeUid] - Current user's Firebase UID to exclude from collision
 * @returns {Promise<{ available: boolean, username?: string, reason?: string }>}
 */
export async function checkUsernameAvailability(username, excludeUid = null) {
  if (!username || typeof username !== 'string') {
    return { available: false, reason: 'Username is required.' };
  }
  const clean = username.trim().toLowerCase();
  if (!/^[a-z0-9_-]{3,30}$/.test(clean)) {
    return {
      available: false,
      reason: 'Username must be 3-30 characters long and contain only lowercase letters, numbers, underscores, or hyphens.'
    };
  }

  // Reserved usernames blacklist
  const RESERVED_USERNAMES = new Set([
    'admin', 'administrator', 'root', 'support', 'help', 'system', 'api',
    'bot', 'epicthink', 'epicthinkai', 'official', 'null', 'undefined',
    'mod', 'moderator', 'staff', 'security', 'billing', 'auth', 'login', 'signup'
  ]);
  if (RESERVED_USERNAMES.has(clean)) {
    return { available: false, reason: 'This username is reserved and cannot be claimed.' };
  }

  await ensureConnected();

  if (isConnected && usersCol) {
    const query = { username: clean };
    if (excludeUid) {
      query.firebaseUid = { $ne: String(excludeUid) };
    }
    const existing = await usersCol.findOne(query);
    if (existing) {
      return { available: false, reason: 'Username is already taken.' };
    }
  } else {
    // Check local resilient fallback cache
    for (const [fUid, u] of Object.entries(fallbackStore.users || {})) {
      if (excludeUid && fUid === String(excludeUid)) continue;
      if (u.username && u.username.toLowerCase() === clean) {
        return { available: false, reason: 'Username is already taken.' };
      }
    }
  }

  return { available: true, username: clean };
}

/**
 * Compute numeric profile completion percentage (0 - 100%)
 * 
 * @param {object} doc - User document
 * @returns {number} Percentage completed (0 - 100)
 */
export function computeProfileCompletion(doc = {}) {
  let score = 0;
  if (doc.firstName && String(doc.firstName).trim().length > 0) score += 20;
  if (doc.lastName && String(doc.lastName).trim().length > 0) score += 20;
  if (doc.username && String(doc.username).trim().length >= 3) score += 20;
  if (doc.profilePhotoUrl && String(doc.profilePhotoUrl).trim().length > 0) score += 20;
  if (doc.bio && String(doc.bio).trim().length > 0) score += 10;
  const hasJobTitle = doc.jobTitle && String(doc.jobTitle).trim().length > 0;
  const hasAbout = doc.personalization && doc.personalization.aboutUser && String(doc.personalization.aboutUser).trim().length > 0;
  if (hasJobTitle || hasAbout) score += 10;
  return Math.min(100, Math.max(0, score));
}

/**
 * Retrieve production User Profile for an authenticated user.
 * Automatically backfills and normalizes fields if document is missing or newly created.
 * 
 * @param {string} uid - Firebase UID
 * @param {object} [userFallback] - Additional metadata from verified Firebase token
 */
export async function getUserProfile(uid, userFallback = null) {
  if (!uid) return null;
  await ensureConnected();
  const fUid = String(uid);

  let doc = null;
  if (isConnected && usersCol) {
    doc = await usersCol.findOne({ firebaseUid: fUid });
  }
  if (!doc && fallbackStore.users && fallbackStore.users[fUid]) {
    doc = fallbackStore.users[fUid];
  }

  const now = Date.now();

  // If user document doesn't exist yet, synthesize canonical profile
  if (!doc) {
    const rawName = userFallback?.name || userFallback?.displayName || (userFallback?.email ? userFallback.email.split('@')[0] : '');
    const nameParts = rawName ? rawName.trim().split(/\s+/) : [];
    const firstName = nameParts.length > 0 ? nameParts[0] : (userFallback?.email ? userFallback.email.split('@')[0] : 'Epic');
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (nameParts.length > 0 ? '' : 'Thinker');
    const displayName = rawName || `${firstName} ${lastName}`.trim();

    // Generate unique initial username
    let baseUsername = generateCleanUsername(displayName || userFallback?.email);
    let candidateUsername = baseUsername;
    let suffix = 1;
    while (true) {
      const avail = await checkUsernameAvailability(candidateUsername, fUid);
      if (avail.available) break;
      candidateUsername = `${baseUsername}_${suffix++}`;
    }

    const photoUrl = userFallback?.photoUrl || userFallback?.picture || userFallback?.photoURL || null;

    doc = {
      firebaseUid: fUid,
      email: userFallback?.email || null,
      firstName,
      lastName,
      displayName,
      username: candidateUsername,
      profilePhotoUrl: photoUrl,
      bio: '',
      jobTitle: '',
      preferredLanguage: 'en',
      timezone: 'Asia/Kolkata',
      tier: userFallback?.tier || 'free',
      onboardingCompleted: Boolean(firstName && lastName && (userFallback?.signInProvider === 'google.com' || photoUrl)),
      profileCompleted: 0,
      preferences: {
        theme: 'dark',
        accentColor: '#3b82f6',
        responseStyle: 'professional',
        compactMode: false,
        showAnimations: true,
        reducedMotion: false,
        codeFontLigatures: true,
        timezone: 'Asia/Kolkata',
        defaultModelMode: 'auto',
        defaultLandingPage: 'chat'
      },
      personalization: {
        customInstructions: '',
        aboutUser: '',
        responsePreferences: '',
        responseStyle: 'professional',
        language: 'en'
      },
      usage: {
        totalChats: 0,
        totalMessages: 0,
        lastActiveAt: now
      },
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    };
    doc.profileCompleted = computeProfileCompletion(doc);

    if (isConnected && usersCol) {
      try {
        await usersCol.insertOne(doc);
      } catch (err) {
        doc = (await usersCol.findOne({ firebaseUid: fUid })) || doc;
      }
    }

    if (!fallbackStore.users) fallbackStore.users = {};
    fallbackStore.users[fUid] = doc;
    persistFallbackStore();
  } else {
    // Migration & backfill safeguard for existing accounts
    let needsUpdate = false;
    const updates = {};

    if (!doc.preferences) {
      doc.preferences = {
        theme: 'dark',
        accentColor: '#3b82f6',
        responseStyle: 'professional',
        compactMode: false,
        showAnimations: true,
        reducedMotion: false,
        defaultModelMode: 'auto',
        defaultLandingPage: 'chat'
      };
      updates.preferences = doc.preferences;
      needsUpdate = true;
    }
    if (!doc.personalization) {
      doc.personalization = {
        customInstructions: '',
        aboutUser: '',
        responsePreferences: '',
        responseStyle: 'professional',
        language: 'en'
      };
      updates.personalization = doc.personalization;
      needsUpdate = true;
    }
    if (!doc.usage) {
      doc.usage = {
        totalChats: 0,
        totalMessages: 0,
        lastActiveAt: now
      };
      updates.usage = doc.usage;
      needsUpdate = true;
    }

    if (!doc.username) {
      let baseUsername = generateCleanUsername(doc.displayName || doc.name || doc.email);
      let candidateUsername = baseUsername;
      let suffix = 1;
      while (true) {
        const avail = await checkUsernameAvailability(candidateUsername, fUid);
        if (avail.available) break;
        candidateUsername = `${baseUsername}_${suffix++}`;
      }
      doc.username = candidateUsername;
      updates.username = candidateUsername;
      needsUpdate = true;
    }

    if (!doc.firstName) {
      const parts = (doc.displayName || doc.name || '').trim().split(/\s+/);
      doc.firstName = parts[0] || (doc.email ? doc.email.split('@')[0] : 'Epic');
      doc.lastName = parts.slice(1).join(' ') || '';
      updates.firstName = doc.firstName;
      updates.lastName = doc.lastName;
      needsUpdate = true;
    }

    if (doc.displayName === undefined) {
      doc.displayName = doc.name || `${doc.firstName} ${doc.lastName}`.trim();
      updates.displayName = doc.displayName;
      needsUpdate = true;
    }

    if (doc.profilePhotoUrl === undefined && (userFallback?.photoUrl || userFallback?.picture)) {
      doc.profilePhotoUrl = userFallback.photoUrl || userFallback.picture;
      updates.profilePhotoUrl = doc.profilePhotoUrl;
      needsUpdate = true;
    }

    if (doc.profilePhotoUrl && typeof doc.profilePhotoUrl === 'string' && doc.profilePhotoUrl.startsWith('/uploads/avatars/')) {
      try {
        const diskFile = path.resolve(__dirname, '..', doc.profilePhotoUrl.replace(/^\//, ''));
        if (fs.existsSync(diskFile)) {
          const buf = fs.readFileSync(diskFile);
          const ext = path.extname(diskFile).toLowerCase().replace('.', '') || 'png';
          const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
          doc.profilePhotoUrl = `data:${mime};base64,${buf.toString('base64')}`;
          updates.profilePhotoUrl = doc.profilePhotoUrl;
          needsUpdate = true;
        }
      } catch (_) {}
    }

    if (doc.jobTitle === undefined) {
      doc.jobTitle = '';
      updates.jobTitle = '';
      needsUpdate = true;
    }

    // Ensure profileCompleted is a numeric percentage
    const computedScore = computeProfileCompletion(doc);
    if (typeof doc.profileCompleted !== 'number' || doc.profileCompleted !== computedScore) {
      doc.profileCompleted = computedScore;
      updates.profileCompleted = computedScore;
      needsUpdate = true;
    }

    doc.lastLoginAt = now;
    updates.lastLoginAt = now;
    if (doc.usage) {
      doc.usage.lastActiveAt = now;
      updates['usage.lastActiveAt'] = now;
    }

    if (needsUpdate || updates.lastLoginAt) {
      if (isConnected && usersCol) {
        try {
          await usersCol.updateOne({ firebaseUid: fUid }, { $set: updates });
        } catch (_) {}
      }
      if (!fallbackStore.users) fallbackStore.users = {};
      fallbackStore.users[fUid] = { ...doc };
      persistFallbackStore();
    }
  }

  return doc;
}

/**
 * Upsert authenticated user profile into users collection (Maintains backwards compatibility)
 * 
 * @param {{ uid: string, email?: string, name?: string, photoUrl?: string, picture?: string }} user
 */
export async function upsertUser(user) {
  if (!user || !user.uid) return null;
  return await getUserProfile(user.uid, user);
}

/**
 * Update authenticated user profile fields
 * 
 * @param {string} uid - Firebase UID
 * @param {object} updateFields - Allowlisted fields to update
 */
export async function updateUserProfile(uid, updateFields = {}) {
  if (!uid) throw new Error('User UID is required');
  await ensureConnected();
  const fUid = String(uid);

  // Strictly allowlisted fields only
  const allowedKeys = [
    'firstName', 'lastName', 'displayName', 'username', 'bio', 'jobTitle',
    'preferredLanguage', 'timezone', 'profilePhotoUrl',
    'onboardingCompleted'
  ];

  const sanitized = {};
  for (const key of allowedKeys) {
    if (updateFields[key] !== undefined) {
      if (typeof updateFields[key] === 'string') {
        sanitized[key] = updateFields[key].trim();
      } else {
        sanitized[key] = updateFields[key];
      }
    }
  }

  // Username validation if provided
  if (sanitized.username) {
    const avail = await checkUsernameAvailability(sanitized.username, fUid);
    if (!avail.available) {
      throw new Error(avail.reason || 'Username is not available.');
    }
    sanitized.username = avail.username;
  }

  // Derive displayName if not explicitly supplied but firstName/lastName changed
  if ((sanitized.firstName || sanitized.lastName) && !sanitized.displayName) {
    sanitized.displayName = `${sanitized.firstName || ''} ${sanitized.lastName || ''}`.trim();
  }

  const now = Date.now();
  sanitized.updatedAt = now;

  // Recalculate profileCompleted percentage
  const existing = await getUserProfile(fUid);
  const mergedForScore = {
    ...existing,
    ...sanitized
  };
  sanitized.profileCompleted = computeProfileCompletion(mergedForScore);

  if (isConnected && usersCol) {
    await usersCol.updateOne(
      { firebaseUid: fUid },
      { $set: sanitized },
      { upsert: true }
    );
  }

  if (!fallbackStore.users) fallbackStore.users = {};
  fallbackStore.users[fUid] = {
    ...(fallbackStore.users[fUid] || {}),
    ...sanitized
  };
  persistFallbackStore();

  return await getUserProfile(fUid);
}

/**
 * Update user preferences
 * 
 * @param {string} uid - Firebase UID
 * @param {object} preferences - User preferences object
 */
export async function updateUserPreferences(uid, preferences = {}) {
  if (!uid) throw new Error('User UID is required');
  await ensureConnected();
  const fUid = String(uid);

  const allowed = [
    'theme', 'accentColor', 'responseStyle', 'compactMode',
    'showAnimations', 'reducedMotion', 'codeFontLigatures', 'timezone',
    'defaultModelMode', 'defaultLandingPage'
  ];

  const sanitized = {};
  for (const k of allowed) {
    if (preferences[k] !== undefined) {
      sanitized[`preferences.${k}`] = preferences[k];
    }
  }
  sanitized.updatedAt = Date.now();

  if (isConnected && usersCol) {
    await usersCol.updateOne({ firebaseUid: fUid }, { $set: sanitized });
  }

  if (fallbackStore.users && fallbackStore.users[fUid]) {
    fallbackStore.users[fUid].preferences = {
      ...(fallbackStore.users[fUid].preferences || {}),
      ...preferences
    };
    fallbackStore.users[fUid].updatedAt = Date.now();
    persistFallbackStore();
  }

  return await getUserProfile(fUid);
}

/**
 * Update user personalization (Custom instructions, aboutUser, responsePreferences)
 * 
 * @param {string} uid - Firebase UID
 * @param {object} personalization - User personalization object
 */
export async function updateUserPersonalization(uid, personalization = {}) {
  if (!uid) throw new Error('User UID is required');
  await ensureConnected();
  const fUid = String(uid);

  const allowed = ['customInstructions', 'aboutUser', 'responsePreferences', 'responseStyle', 'language'];
  const sanitized = {};
  for (const k of allowed) {
    if (personalization[k] !== undefined) {
      sanitized[`personalization.${k}`] = typeof personalization[k] === 'string' ? personalization[k].trim() : personalization[k];
    }
  }
  sanitized.updatedAt = Date.now();

  // Recalculate profileCompleted percentage
  const existing = await getUserProfile(fUid);
  const updatedDoc = {
    ...existing,
    personalization: {
      ...(existing.personalization || {}),
      ...personalization
    }
  };
  sanitized.profileCompleted = computeProfileCompletion(updatedDoc);

  if (isConnected && usersCol) {
    await usersCol.updateOne({ firebaseUid: fUid }, { $set: sanitized });
  }

  if (fallbackStore.users && fallbackStore.users[fUid]) {
    fallbackStore.users[fUid].personalization = {
      ...(fallbackStore.users[fUid].personalization || {}),
      ...personalization
    };
    fallbackStore.users[fUid].profileCompleted = sanitized.profileCompleted;
    fallbackStore.users[fUid].updatedAt = Date.now();
    persistFallbackStore();
  }

  return await getUserProfile(fUid);
}

/**
 * Get user usage statistics directly from MongoDB
 * 
 * @param {string} uid - Firebase UID
 */
export async function getUserUsageStats(uid) {
  if (!uid) return { totalChats: 0, totalConversations: 0, totalMessages: 0, createdAt: Date.now(), memberSince: Date.now(), lastActiveAt: Date.now() };
  await ensureConnected();
  const fUid = String(uid);

  let totalChats = 0;
  let totalMessages = 0;

  if (isConnected && conversationsCol) {
    try {
      totalChats = await conversationsCol.countDocuments({
        $or: [{ firebaseUid: fUid }, { uid: fUid }]
      });
      if (messagesCol) {
        totalMessages = await messagesCol.countDocuments({
          $or: [{ firebaseUid: fUid }, { uid: fUid }]
        });
      }
    } catch (_) {}
  } else if (fallbackStore.conversations && fallbackStore.conversations[fUid]) {
    const chats = Object.values(fallbackStore.conversations[fUid] || {});
    totalChats = chats.length;
    for (const c of chats) {
      totalMessages += (c.messages || []).length;
    }
  }

  const profile = await getUserProfile(fUid);
  const created = profile?.createdAt || Date.now();
  const summary = QuotaTrackingService.getUsageSummary(fUid, profile?.tier || 'free');

  return {
    totalChats,
    totalConversations: totalChats,
    totalMessages,
    tier: profile?.tier || 'free',
    tierName: summary.tierName,
    tierBadge: summary.tierBadge,
    createdAt: created,
    memberSince: created,
    lastActiveAt: profile?.lastLoginAt || profile?.updatedAt || Date.now(),
    summary
  };
}

/**
 * Record a single usage record into MongoDB & Fallback Cache
 */
export async function recordUsageToDb(record) {
  if (!record || !record.id) return;
  await ensureConnected();

  // Save to fallbackStore
  if (!fallbackStore.usage_records) fallbackStore.usage_records = [];
  fallbackStore.usage_records.push(record);
  if (fallbackStore.usage_records.length > 500) {
    fallbackStore.usage_records.shift();
  }
  persistFallbackStore();

  if (isConnected && usageRecordsCol) {
    try {
      await usageRecordsCol.updateOne(
        { id: record.id },
        { $set: record },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[DB:USAGE] recordUsageToDb error:', err.message);
    }
  }
}

/**
 * Get atomic user quota document from MongoDB or Fallback Cache
 */
export async function getUserQuotaDoc(uid) {
  if (!uid) return null;
  await ensureConnected();
  const fUid = String(uid);

  if (isConnected && userQuotasCol) {
    try {
      const doc = await userQuotasCol.findOne({ firebaseUid: fUid });
      if (doc) return doc;
    } catch (_) {}
  }

  if (fallbackStore.user_quotas && fallbackStore.user_quotas[fUid]) {
    return fallbackStore.user_quotas[fUid];
  }

  return null;
}

/**
 * Update atomic user quota document in MongoDB & Fallback Cache
 */
export async function updateUserQuotaDoc(uid, quotaDoc) {
  if (!uid || !quotaDoc) return;
  await ensureConnected();
  const fUid = String(uid);

  // Save to fallbackStore
  if (!fallbackStore.user_quotas) fallbackStore.user_quotas = {};
  fallbackStore.user_quotas[fUid] = quotaDoc;
  persistFallbackStore();

  if (isConnected && userQuotasCol) {
    try {
      await userQuotasCol.updateOne(
        { firebaseUid: fUid },
        { $set: quotaDoc },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[DB:USAGE] updateUserQuotaDoc error:', err.message);
    }
  }
}

/**
 * Get detailed usage records and activity history for a user
 */
export async function getUserDetailedUsage(uid, limit = 50) {
  if (!uid) return { records: [], summary: QuotaTrackingService.getUsageSummary() };
  await ensureConnected();
  const fUid = String(uid);

  let records = [];
  if (isConnected && usageRecordsCol) {
    try {
      records = await usageRecordsCol
        .find({ firebaseUid: fUid })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    } catch (_) {}
  }

  if (records.length === 0 && fallbackStore.usage_records) {
    records = fallbackStore.usage_records
      .filter(r => r.firebaseUid === fUid)
      .slice(-limit)
      .reverse();
  }

  const profile = await getUserProfile(fUid);
  const summary = QuotaTrackingService.getUsageSummary(fUid, profile?.tier || 'free');

  return {
    records,
    summary,
    tier: profile?.tier || 'free',
    count: records.length
  };
}

/**
 * Update user account tier (e.g. 'free' -> 'pro' -> 'admin')
 */
export async function updateUserTier(uid, tier) {
  if (!uid) throw new Error('UID is required');
  if (!USER_TIERS[tier]) throw new Error(`Invalid tier: "${tier}". Allowed: ${Object.keys(USER_TIERS).join(', ')}`);
  await ensureConnected();
  const fUid = String(uid);

  if (isConnected && usersCol) {
    await usersCol.updateOne(
      { firebaseUid: fUid },
      { $set: { tier, updatedAt: Date.now() } }
    );
  }

  if (fallbackStore.users && fallbackStore.users[fUid]) {
    fallbackStore.users[fUid].tier = tier;
    fallbackStore.users[fUid].updatedAt = Date.now();
    persistFallbackStore();
  }

  // Update in QuotaTrackingService
  QuotaTrackingService.getOrInitUserQuota(fUid, USER_TIERS[tier]);

  return await getUserProfile(fUid);
}

// Register DB hooks with QuotaTrackingService
QuotaTrackingService.registerDbHooks({
  recordUsageToDb,
  updateUserQuotaDoc
});

/**
 * Securely delete user profile and all user-owned data from MongoDB
 * 
 * @param {string} uid - Firebase UID
 */
export async function deleteUserProfileAndData(uid) {
  if (!uid) return false;
  await ensureConnected();
  const fUid = String(uid);

  let deletedConversations = 0;
  let deletedMessages = 0;

  if (isConnected && db) {
    try {
      const convRes = await conversationsCol.deleteMany({
        $or: [{ firebaseUid: fUid }, { uid: fUid }]
      });
      deletedConversations = convRes.deletedCount || 0;

      if (messagesCol) {
        const msgRes = await messagesCol.deleteMany({
          $or: [{ firebaseUid: fUid }, { uid: fUid }]
        });
        deletedMessages = msgRes.deletedCount || 0;
      }

      await usersCol.deleteOne({ firebaseUid: fUid });
    } catch (err) {
      console.warn('[DB] Error during user account deletion:', err.message);
    }
  }

  // Remove from fallbackStore
  if (fallbackStore.users) delete fallbackStore.users[fUid];
  if (fallbackStore.conversations) delete fallbackStore.conversations[fUid];
  persistFallbackStore();

  return true;
}

/**
 * Get MongoDB Status
 */
export async function getMongoStatus() {
  await ensureConnected();

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
 * @param {string} [email] - User email
 * @returns {Promise<Array>} List of conversations sorted by updatedAt desc
 */
export async function getConversations(uid, email = null) {
  if (!uid) throw new Error('A valid Firebase UID is required.');
  await ensureConnected();
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
  await ensureConnected();
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
  await ensureConnected();
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
  await ensureConnected();

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
  await ensureConnected();
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
