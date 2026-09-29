/**
 * Epic Think AI - Real-Time WebSocket Synchronization Service
 * 
 * Provides:
 * 1. Low-latency, bidirectional real-time synchronization across browser tabs and devices
 * 2. Multi-tenant socket isolation per authenticated Firebase UID
 * 3. Heartbeat health checking to maintain persistent connections
 * 4. Automatic broadcast of chat saves, message updates, renames, and deletions
 */

import { WebSocketServer, WebSocket } from 'ws';
import { verifyToken } from './firebaseAuthService.js';
import { saveConversation, saveMessage, getConversations } from './mongoService.js';

// Map of userId -> Set of active WebSocket connections
const userSockets = new Map();

let wss = null;

/**
 * Initialize WebSocket Server attached to existing HTTP Server
 * 
 * @param {import('http').Server} httpServer
 */
export function initRealtimeSync(httpServer) {
  wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  console.log('[WEBSOCKET] Real-Time WebSocket Server initialized on path "/ws"');

  wss.on('connection', (ws, req) => {
    ws.isAlive = true;
    ws.uid = null;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Check for token in URL query parameter (?token=...)
    try {
      const url = new URL(req.url, 'http://localhost');
      const token = url.searchParams.get('token');
      if (token) {
        authenticateSocket(ws, token);
      }
    } catch (_) {}

    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data.toString());

        // 1. Authenticate WebSocket with Firebase Token
        if (msg.type === 'auth') {
          await authenticateSocket(ws, msg.token);
          return;
        }

        // Require authentication for all subsequent actions
        if (!ws.uid) {
          ws.send(JSON.stringify({
            type: 'error',
            error: 'Unauthorized: WebSocket must be authenticated with Firebase ID token first.'
          }));
          return;
        }

        // 2. Real-time message streaming / saving
        if (msg.type === 'save_message' && msg.chatId && msg.message) {
          const result = await saveMessage(ws.uid, msg.chatId, msg.message);
          // Broadcast to other tabs of the same user
          broadcastToUser(ws.uid, {
            type: 'message_saved',
            chatId: msg.chatId,
            message: msg.message,
            timestamp: Date.now()
          }, ws);

          ws.send(JSON.stringify({
            type: 'ack_save_message',
            chatId: msg.chatId,
            success: true
          }));
          return;
        }

        // 3. Real-time full conversation save
        if (msg.type === 'save_chat' && msg.conversation) {
          const result = await saveConversation(ws.uid, msg.conversation);
          broadcastToUser(ws.uid, {
            type: 'chat_saved',
            conversation: result.conversation,
            timestamp: Date.now()
          }, ws);

          ws.send(JSON.stringify({
            type: 'ack_save_chat',
            chatId: msg.conversation.id,
            success: true
          }));
          return;
        }

        // 4. Ping message
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          return;
        }

      } catch (err) {
        console.warn('[WEBSOCKET] Message handling error:', err.message);
        ws.send(JSON.stringify({ type: 'error', error: err.message }));
      }
    });

    ws.on('close', () => {
      if (ws.uid && userSockets.has(ws.uid)) {
        const set = userSockets.get(ws.uid);
        set.delete(ws);
        if (set.size === 0) {
          userSockets.delete(ws.uid);
        }
      }
    });

    ws.on('error', (err) => {
      console.warn('[WEBSOCKET] Client socket error:', err.message);
    });
  });

  // Heartbeat interval to check alive connections every 30 seconds
  const interval = setInterval(() => {
    if (!wss) return;
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
}

/**
 * Authenticate a WebSocket connection using a Firebase ID token
 */
async function authenticateSocket(ws, token) {
  if (!token) return;

  try {
    const user = await verifyToken(token);
    ws.uid = user.uid;

    if (!userSockets.has(user.uid)) {
      userSockets.set(user.uid, new Set());
    }
    userSockets.get(user.uid).add(ws);

    ws.send(JSON.stringify({
      type: 'auth_success',
      uid: user.uid,
      timestamp: Date.now(),
      message: 'Authenticated with real-time sync service.'
    }));
    // console.log(`[WEBSOCKET] User ${user.uid} connected to real-time channel.`);
  } catch (err) {
    console.warn('[WEBSOCKET] Authentication failed:', err.message);
    ws.send(JSON.stringify({
      type: 'auth_error',
      error: 'Authentication failed: ' + err.message
    }));
  }
}

/**
 * Broadcast an event to all open connections of a specific user
 * 
 * @param {string} uid - Firebase UID
 * @param {object} payload - Message payload
 * @param {WebSocket} [excludeSocket] - Optional socket to skip (e.g. sender)
 */
export function broadcastToUser(uid, payload, excludeSocket = null) {
  if (!uid || !userSockets.has(uid)) return;

  const set = userSockets.get(uid);
  const data = JSON.stringify(payload);

  for (const client of set) {
    if (client !== excludeSocket && client.readyState === WebSocket.OPEN) {
      try {
        client.send(data);
      } catch (err) {
        console.warn('[WEBSOCKET] Broadcast error:', err.message);
      }
    }
  }
}
