/**
 * Epic Think AI - Production Backend Server with Hindsight Semantic Memory & MongoDB Real-Time Persistence
 * 
 * Provides:
 * 1. Secure proxy to Hindsight Cloud API (https://api.hindsight.vectorize.io)
 * 2. MongoDB Real-Time Conversation & Message Persistence with automatic sync
 * 3. Strict user isolation per Firebase UID (verified server-side)
 * 4. Bidirectional WebSocket synchronization for live multi-tab / multi-device updates
 * 5. Static asset hosting for Epic Think AI frontend
 * 6. Cross-Origin Resource Sharing (CORS) support for local/hosted development
 */

import fs from 'fs';
import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  retainMemory,
  recallMemory,
  reflectMemory,
  listMemories,
  clearMemory,
  getHealth
} from './services/hindsightService.js';
import { requireAuth } from './services/firebaseAuthService.js';
import {
  initMongoDB,
  getMongoStatus,
  getConversations,
  getConversation,
  getConversationAnyUser,
  getMessages,
  upsertUser,
  saveConversation,
  updateConversationTitle,
  saveMessage,
  saveMessageFeedback,
  deleteConversation,
  deleteAllConversations
} from './services/mongoService.js';
import { initRealtimeSync, broadcastToUser } from './services/realtimeSync.js';
import pluginRoutes from './routes/pluginRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import builderRoutes from './routes/builderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { PreviewServer } from './services/websiteBuilder/PreviewServer.js';
import { ProjectManager } from './services/websiteBuilder/ProjectManager.js';
import { initializePlugins } from './plugins/index.js';
import { initAIEngine } from './ai/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust reverse proxies (Vercel, Cloudflare, AWS) so req.protocol accurately reports 'https'
app.set('trust proxy', 1);

// Initialize Epic Think AI Plugins System
initializePlugins();

// Initialize Epic Think AI Multi-Provider Engine
initAIEngine();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));

// Request logging (sanitized - no tokens or keys logged)
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
  if (req.path.startsWith('/api/memory') || req.path.startsWith('/api/conversations') || req.path.startsWith('/api/plugins') || req.path.startsWith('/api/agent') || req.path.startsWith('/api/ai') || req.path.startsWith('/api/builder') || req.path.startsWith('/preview')) {
    console.log(`[HTTP IST ${timestamp}] ${req.method} ${req.path}`);
  }
  next();
});

// ============================================================================
// PLUGIN, AGENT, MULTI-PROVIDER AI & WEBSITE BUILDER API ROUTES
// ============================================================================
app.use('/api/plugins', pluginRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api', agentRoutes); // Exposes /api/confirmations and aliases
app.use('/api/ai', aiRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/builder', builderRoutes);
app.use('/api/user', userRoutes);
app.use('/preview', PreviewServer.createExpressHandler());

// ============================================================================
// REAL-TIME CONVERSATIONS & MONGODB API (PROTECTED BY FIREBASE AUTH)
// ============================================================================

/**
 * MongoDB status endpoint (public)
 * GET /api/conversations/status
 */
app.get('/api/conversations/status', async (req, res) => {
  try {
    const status = await getMongoStatus();
    res.json({
      success: true,
      service: 'Epic Think AI - MongoDB Real-Time Persistence',
      ...status
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Get all conversations for authenticated user
 * GET /api/conversations
 */
app.get('/api/conversations', requireAuth, async (req, res) => {
  try {
    // Automatically record / refresh authenticated user profile in users collection
    upsertUser(req.user).catch(() => {});

    const conversations = await getConversations(req.user.uid, req.user.email);
    res.json({
      success: true,
      uid: req.user.uid,
      email: req.user.email || null,
      conversations,
      count: conversations.length
    });
  } catch (err) {
    console.error(`[API] getConversations failed for ${req.user.uid}:`, err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Get single conversation by ID (Verifies Firebase UID ownership; 403 if owned by another user)
 * GET /api/conversations/:id
 */
app.get('/api/conversations/:id', requireAuth, async (req, res) => {
  try {
    const conversation = await getConversation(req.user.uid, req.params.id, req.user.email);
    if (!conversation) {
      const existsOther = await getConversationAnyUser(req.params.id);
      if (existsOther && existsOther.firebaseUid !== req.user.uid) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Access denied to conversation.'
        });
      }
      return res.status(404).json({
        success: false,
        error: 'Conversation not found.'
      });
    }
    res.json({
      success: true,
      conversation
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Get all messages for a specific conversation
 * GET /api/conversations/:id/messages
 * Validates that conversation belongs to authenticated Firebase UID
 */
app.get('/api/conversations/:id/messages', requireAuth, async (req, res) => {
  try {
    const messages = await getMessages(req.user.uid, req.params.id, req.user.email);
    res.json({
      success: true,
      conversationId: req.params.id,
      messages,
      count: messages.length
    });
  } catch (err) {
    const statusCode = err.statusCode || (err.message.includes('Access denied') ? 403 : 500);
    res.status(statusCode).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Save or upsert conversation in real time
 * POST /api/conversations
 * Body: { conversation: object }
 */
app.post('/api/conversations', requireAuth, async (req, res) => {
  const conversation = req.body.conversation || req.body;
  if (!conversation || !conversation.id) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: conversation object with "id".'
    });
  }

  try {
    const result = await saveConversation(req.user.uid, conversation, req.user.email);

    // Broadcast update in real time to any other active tabs/sessions of this user
    broadcastToUser(req.user.uid, {
      type: 'chat_saved',
      conversation: result.conversation,
      timestamp: Date.now()
    });

    res.json(result);
  } catch (err) {
    console.error(`[API] saveConversation failed for ${req.user.uid}:`, err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Update conversation title
 * PATCH /api/conversations/:id/title
 * Body: { title: string }
 */
app.patch('/api/conversations/:id/title', requireAuth, async (req, res) => {
  const { title } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: "title" (string).'
    });
  }

  try {
    const result = await updateConversationTitle(req.user.uid, req.params.id, title);

    broadcastToUser(req.user.uid, {
      type: 'chat_title_updated',
      chatId: req.params.id,
      title: result.title,
      timestamp: result.updatedAt
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Append or update a message in a conversation in real time
 * POST /api/conversations/:id/messages
 * Body: { message: object }
 */
app.post('/api/conversations/:id/messages', requireAuth, async (req, res) => {
  const message = req.body.message || req.body;
  if (!message || !message.role) {
    return res.status(400).json({
      success: false,
      error: 'Missing valid message object with "role".'
    });
  }

  try {
    const result = await saveMessage(req.user.uid, req.params.id, message);

    broadcastToUser(req.user.uid, {
      type: 'message_saved',
      chatId: req.params.id,
      message,
      timestamp: Date.now()
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Save user feedback on a message (thumbs up / thumbs down + comment)
 * POST /api/conversations/:id/feedback
 * Body: { messageIndex: number, feedback: object }
 */
app.post('/api/conversations/:id/feedback', requireAuth, async (req, res) => {
  const { messageIndex, feedback } = req.body || {};
  if (typeof messageIndex !== 'number' || !feedback) {
    return res.status(400).json({
      success: false,
      error: 'messageIndex (number) and feedback (object) are required.'
    });
  }

  try {
    const result = await saveMessageFeedback(req.user.uid, req.params.id, messageIndex, feedback);

    broadcastToUser(req.user.uid, {
      type: 'message_feedback_updated',
      chatId: req.params.id,
      messageIndex,
      feedback,
      timestamp: Date.now()
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Delete a single conversation
 * DELETE /api/conversations/:id
 */
app.delete('/api/conversations/:id', requireAuth, async (req, res) => {
  try {
    const result = await deleteConversation(req.user.uid, req.params.id, req.user.email);

    broadcastToUser(req.user.uid, {
      type: 'chat_deleted',
      chatId: req.params.id,
      timestamp: Date.now()
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Clear all conversations for authenticated user
 * DELETE /api/conversations
 */
app.delete('/api/conversations', requireAuth, async (req, res) => {
  try {
    const result = await deleteAllConversations(req.user.uid);

    broadcastToUser(req.user.uid, {
      type: 'chats_cleared',
      timestamp: Date.now()
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// MEMORY API ENDPOINTS (PROTECTED BY FIREBASE AUTH)
// ============================================================================

/**
 * Health check & status endpoint (public)
 */
app.get('/api/memory/status', async (req, res) => {
  try {
    const health = await getHealth();
    res.json({
      success: true,
      service: 'Epic Think AI - Hindsight Long-Term Memory',
      ...health
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 'error',
      error: err.message
    });
  }
});

/**
 * Recall relevant memories for a user query
 * POST /api/memory/recall
 * Body: { query: string, maxTokens?: number }
 */
app.post('/api/memory/recall', requireAuth, async (req, res) => {
  const { query, maxTokens } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: "query" (string)'
    });
  }

  try {
    const result = await recallMemory(req.bankId, query, { maxTokens });
    res.json({
      success: true,
      bankId: req.bankId,
      results: result.results || [],
      promptContext: result.promptContext || '',
      entities: result.entities || [],
      count: (result.results || []).length
    });
  } catch (err) {
    console.error(`[API] Recall failed for ${req.bankId}:`, err.message);
    res.json({
      success: true,
      bankId: req.bankId,
      results: [],
      promptContext: '',
      entities: [],
      count: 0,
      fallback: true
    });
  }
});

/**
 * Retain new memory / preference / project facts
 * POST /api/memory/retain
 * Body: { content?: string, text?: string, context?: string, tags?: string[] }
 */
app.post('/api/memory/retain', requireAuth, async (req, res) => {
  const content = req.body.content || req.body.text;
  const context = req.body.context || 'general';
  const tags = req.body.tags || ['epic-think'];

  if (!content || typeof content !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: "content" or "text" (string)'
    });
  }

  try {
    const result = await retainMemory(req.bankId, content, context, tags);
    res.json({
      success: result.success,
      bankId: req.bankId,
      itemsCount: result.itemsCount,
      operationId: result.operationId || null,
      error: result.error || null
    });
  } catch (err) {
    console.error(`[API] Retain failed for ${req.bankId}:`, err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retain memory in Hindsight: ' + err.message
    });
  }
});

/**
 * Reflect across user memories
 * POST /api/memory/reflect
 * Body: { query: string }
 */
app.post('/api/memory/reflect', requireAuth, async (req, res) => {
  const { query } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: "query" (string)'
    });
  }

  try {
    const result = await reflectMemory(req.bankId, query);
    res.json({
      success: true,
      bankId: req.bankId,
      ...result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * List all stored memories for the authenticated user
 * GET /api/memory/list
 */
app.get('/api/memory/list', requireAuth, async (req, res) => {
  try {
    const result = await listMemories(req.bankId);
    res.json({
      success: true,
      bankId: req.bankId,
      memories: result.memories || []
    });
  } catch (err) {
    res.json({
      success: true,
      bankId: req.bankId,
      memories: []
    });
  }
});

/**
 * Clear/delete all memories for the authenticated user
 * DELETE /api/memory
 */
app.delete('/api/memory', requireAuth, async (req, res) => {
  try {
    const result = await clearMemory(req.bankId);
    res.json({
      success: result.success,
      bankId: req.bankId,
      message: result.message || 'Memory bank wiped successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// STATIC ASSET SERVING
// ============================================================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Explicit client auth module route with application/javascript MIME type
app.get(['/auth/:file', '/api/auth/:file'], (req, res) => {
  const fileName = path.basename(req.params.file);
  const publicPath = path.join(__dirname, 'public', 'auth', fileName);
  const rootPath = path.join(__dirname, 'auth', fileName);
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  if (fs.existsSync(publicPath)) {
    return res.sendFile(publicPath);
  }
  if (fs.existsSync(rootPath)) {
    return res.sendFile(rootPath);
  }
  res.status(404).send('Not found');
});

// Explicit client intro module route with application/javascript MIME type
app.get(['/intro/:file', '/api/intro/:file'], (req, res) => {
  const fileName = path.basename(req.params.file);
  const publicPath = path.join(__dirname, 'public', 'intro', fileName);
  const rootPath = path.join(__dirname, 'intro', fileName);
  if (fileName.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  } else {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  if (fs.existsSync(publicPath)) {
    return res.sendFile(publicPath);
  }
  if (fs.existsSync(rootPath)) {
    return res.sendFile(rootPath);
  }
  res.status(404).send('Not found');
});

// Explicit client assets route (three.min.js, etc.)
app.get('/assets/:file', (req, res) => {
  const fileName = path.basename(req.params.file);
  const publicPath = path.join(__dirname, 'public', 'assets', fileName);
  if (fs.existsSync(publicPath)) {
    if (fileName.endsWith('.js')) res.type('application/javascript');
    return res.sendFile(publicPath);
  }
  res.status(404).send('Not found');
});

// Route public landing and application routes to index.html
app.get(['/', '/login', '/signup', '/app', '/chat', '/app/chat', '/app/*'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket real-time synchronization
initRealtimeSync(server);

// Initialize Website Builder Live Preview WebSocket synchronization
PreviewServer.attachWebSocket(server);

// Ensure default projects exist with verified templates
try {
  await ProjectManager.ensureProjectFiles('devika_collections');
  console.log('[BUILDER] Default project "devika_collections" verified & ready.');
} catch (err) {
  console.warn('[BUILDER] Default project init note:', err.message);
}

// Initialize MongoDB connection
initMongoDB().catch((err) => {
  console.warn('[MONGODB] Initial connection warning:', err.message);
});

// Start Server if run directly
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log('====================================================');
    console.log(` Epic Think AI Backend Server Running on Port ${PORT}`);
    console.log(` Web Interface:   http://localhost:${PORT}/`);
    console.log(` Alternative URL: http://localhost:${PORT}/Epic%20Think%20AI.html`);
    console.log(` Website Builder: http://localhost:${PORT}/#website-builder`);
    console.log(` Memory Status:   http://localhost:${PORT}/api/memory/status`);
    console.log(` Mongo Status:    http://localhost:${PORT}/api/conversations/status`);
    console.log(` Real-Time WS:    ws://localhost:${PORT}/ws`);
    console.log('====================================================');
  });
}

export default app;
