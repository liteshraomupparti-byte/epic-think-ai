/**
 * Epic Think AI - MongoDB Real-Time Chat Service (Frontend Client)
 * 
 * Provides:
 * 1. Real-time conversation persistence with MongoDB Cloud / Server
 * 2. Instant optimistic local caching (zero UI latency)
 * 3. Bidirectional WebSocket synchronization across multiple tabs and devices
 * 4. Automatic offline fallback and transparent re-sync
 * 5. Multi-tenant isolation per Firebase UID
 */

import { getIdToken } from './authService.js';

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return '';
    if (window.location.port === '3001') return '';
  }
  return 'http://localhost:3001';
};

const getWsUrl = () => {
  if (typeof window === 'undefined') return 'ws://localhost:3001/ws';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' 
    ? window.location.host 
    : (window.location.port === '3001' ? window.location.host : 'localhost:3001');
  return `${protocol}//${host}/ws`;
};

class MongoChatServiceClient {
  constructor() {
    this.currentUser = null;
    this.ws = null;
    this.wsConnected = false;
    this.reconnectTimer = null;
    this.eventListeners = new Set();
    this.syncStatusListeners = new Set();
    this.currentSyncStatus = 'offline'; // 'offline' | 'connecting' | 'connected' | 'saving' | 'saved'
    this.debounceSaveTimers = new Map();
  }

  /**
   * Set synchronization status and notify listeners
   */
  setSyncStatus(status) {
    this.currentSyncStatus = status;
    this.syncStatusListeners.forEach(fn => {
      try { fn(status); } catch (_) {}
    });
  }

  /**
   * Subscribe to real-time events (chat updates from other tabs / backend)
   */
  onEvent(callback) {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  /**
   * Subscribe to sync status changes
   */
  onSyncStatus(callback) {
    this.syncStatusListeners.add(callback);
    callback(this.currentSyncStatus);
    return () => this.syncStatusListeners.delete(callback);
  }

  /**
   * Initialize service for the authenticated user
   */
  async init(user) {
    this.currentUser = user;
    if (!user) {
      this.disconnectWebSocket();
      this.setSyncStatus('offline');
      return;
    }

    this.connectWebSocket();
  }

  /**
   * Establish WebSocket connection for real-time synchronization
   */
  async connectWebSocket() {
    if (!this.currentUser) return;
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    try {
      this.setSyncStatus('connecting');
      const wsUrl = getWsUrl();
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = async () => {
        try {
          const token = await getIdToken();
          if (token && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'auth', token }));
          }
        } catch (err) {
          console.warn('[MongoChatService:WS] Auth send error:', err.message);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'auth_success') {
            this.wsConnected = true;
            this.setSyncStatus('saved');
            return;
          }

          // Broadcast real-time events to UI listeners
          this.eventListeners.forEach(listener => {
            try { listener(data); } catch (_) {}
          });

        } catch (err) {
          console.warn('[MongoChatService:WS] Message parse error:', err.message);
        }
      };

      this.ws.onclose = () => {
        this.wsConnected = false;
        this.setSyncStatus('offline');
        this.scheduleWsReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[MongoChatService:WS] WebSocket error:', err);
      };

    } catch (err) {
      console.warn('[MongoChatService:WS] Connection failed:', err.message);
      this.scheduleWsReconnect();
    }
  }

  scheduleWsReconnect() {
    if (this.reconnectTimer || !this.currentUser) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.currentUser && (!this.ws || this.ws.readyState === WebSocket.CLOSED)) {
        this.connectWebSocket();
      }
    }, 5000);
  }

  disconnectWebSocket() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try { this.ws.close(); } catch (_) {}
      this.ws = null;
    }
    this.wsConnected = false;
  }

  /**
   * Fetch all conversations for the user from MongoDB (with localStorage cache fallback)
   */
  async getConversations(uid) {
    const targetUid = uid || this.currentUser?.uid;
    const cacheKey = targetUid ? `eta_chats_${targetUid}` : 'eta_chats';

    // Read local cache first for instant UI response
    let cached = [];
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) cached = JSON.parse(raw) || [];
    } catch (_) {}

    try {
      const token = await getIdToken();
      if (!token) return cached;

      const res = await fetch(`${getApiBase()}/api/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.warn(`[MongoChatService] HTTP ${res.status} fetching conversations`);
        return cached;
      }

      const data = await res.json();
      if (data && Array.isArray(data.conversations)) {
        // Update local cache with source of truth from MongoDB
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data.conversations));
        } catch (_) {}
        this.setSyncStatus('saved');
        return data.conversations;
      }

      return cached;
    } catch (err) {
      console.warn('[MongoChatService] Network error, using local cache:', err.message);
      return cached;
    }
  }

  /**
   * Save or upsert a conversation in real time to MongoDB
   * 
   * @param {object} conversation - Chat object
   * @param {boolean} [immediate=false] - Whether to bypass debouncing
   */
  async saveConversation(conversation, immediate = false) {
    if (!conversation || !conversation.id) return;

    this.setSyncStatus('saving');

    const doSave = async () => {
      try {
        const token = await getIdToken();
        if (!token) return;

        // 1. Try WebSocket first if connected for real-time speed
        if (this.ws && this.wsConnected && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'save_chat',
            conversation
          }));
        }

        // 2. Also persist via REST endpoint to ensure guaranteed durability
        const res = await fetch(`${getApiBase()}/api/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ conversation })
        });

        if (res.ok) {
          this.setSyncStatus('saved');
        } else {
          console.warn('[MongoChatService] REST save failed, status:', res.status);
        }
      } catch (err) {
        console.warn('[MongoChatService] saveConversation error:', err.message);
      }
    };

    if (immediate) {
      if (this.debounceSaveTimers.has(conversation.id)) {
        clearTimeout(this.debounceSaveTimers.get(conversation.id));
        this.debounceSaveTimers.delete(conversation.id);
      }
      return await doSave();
    }

    // Debounce rapid updates (e.g. streaming chunks) by 300ms
    if (this.debounceSaveTimers.has(conversation.id)) {
      clearTimeout(this.debounceSaveTimers.get(conversation.id));
    }

    this.debounceSaveTimers.set(conversation.id, setTimeout(async () => {
      this.debounceSaveTimers.delete(conversation.id);
      await doSave();
    }, 300));
  }

  /**
   * Save a single message in real time
   */
  async saveMessageRealtime(chatId, message) {
    if (!chatId || !message) return;

    this.setSyncStatus('saving');

    try {
      const token = await getIdToken();
      if (!token) return;

      // 1. WebSocket real-time push
      if (this.ws && this.wsConnected && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'save_message',
          chatId,
          message
        }));
      }

      // 2. HTTP POST
      await fetch(`${getApiBase()}/api/conversations/${encodeURIComponent(chatId)}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      this.setSyncStatus('saved');
    } catch (err) {
      console.warn('[MongoChatService] saveMessageRealtime error:', err.message);
    }
  }

  /**
   * Update conversation title
   */
  async updateTitle(chatId, title) {
    if (!chatId) return;

    try {
      const token = await getIdToken();
      if (!token) return;

      await fetch(`${getApiBase()}/api/conversations/${encodeURIComponent(chatId)}/title`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });

      this.setSyncStatus('saved');
    } catch (err) {
      console.warn('[MongoChatService] updateTitle error:', err.message);
    }
  }

  /**
   * Save user feedback (thumbs up/down)
   */
  async saveFeedback(chatId, messageIndex, feedback) {
    if (!chatId || typeof messageIndex !== 'number') return;

    try {
      const token = await getIdToken();
      if (!token) return;

      await fetch(`${getApiBase()}/api/conversations/${encodeURIComponent(chatId)}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messageIndex, feedback })
      });

      this.setSyncStatus('saved');
    } catch (err) {
      console.warn('[MongoChatService] saveFeedback error:', err.message);
    }
  }

  /**
   * Delete a single conversation
   */
  async deleteConversation(chatId) {
    if (!chatId) return;

    try {
      const token = await getIdToken();
      if (!token) return;

      await fetch(`${getApiBase()}/api/conversations/${encodeURIComponent(chatId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      this.setSyncStatus('saved');
    } catch (err) {
      console.warn('[MongoChatService] deleteConversation error:', err.message);
    }
  }

  /**
   * Delete all conversations
   */
  async deleteAllConversations() {
    try {
      const token = await getIdToken();
      if (!token) return;

      await fetch(`${getApiBase()}/api/conversations`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      this.setSyncStatus('saved');
    } catch (err) {
      console.warn('[MongoChatService] deleteAllConversations error:', err.message);
    }
  }

  /**
   * Query database status
   */
  async getStatus() {
    try {
      const res = await fetch(`${getApiBase()}/api/conversations/status`);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
    return { success: false, connected: false };
  }
}

export const MongoChatService = new MongoChatServiceClient();
