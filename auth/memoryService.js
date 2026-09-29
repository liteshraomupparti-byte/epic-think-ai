/**
 * Epic Think AI - Production Hindsight Long-Term Memory Client Service
 * 
 * Provides strict multi-tenant memory isolation keyed by Firebase UID.
 * Communicates with the secure Epic Think AI backend proxy to access
 * Hindsight Cloud API (https://api.hindsight.vectorize.io).
 * 
 * SECURITY:
 * - HINDSIGHT_API_KEY is NEVER exposed to the browser.
 * - Every request carries a cryptographically verifiable Firebase ID Token.
 * - The backend derives the user bank ID (`epic-think-user-<uid>`) from the verified token.
 * - Graceful fallbacks ensure chat continuity if the server or Hindsight is unreachable.
 */

import { getIdToken } from "./authService.js";

const getApiBase = () => {
  // If running directly on the backend server port, use relative path
  if (window.location.port === '3001') return '';
  // Fallback to local server address for cross-port development (e.g. port 8080)
  return 'http://localhost:3001';
};

export class MemoryService {
  /**
   * Derive the isolated namespace for this specific authenticated user.
   * Format: `epic-think-user-${uid}`
   */
  static getNamespace(uid) {
    if (!uid) throw new Error("A valid Firebase UID is required to access memory namespace.");
    return `epic-think-user-${uid}`;
  }

  /**
   * Recall relevant memories from Hindsight for a user query
   * 
   * @param {string} query - The prompt or question to recall context for
   * @returns {Promise<{ results: Array, promptContext: string, entities: Array, count: number }>}
   */
  static async recall(query) {
    if (!query || !query.trim()) {
      return { results: [], promptContext: '', entities: [], count: 0 };
    }

    try {
      const token = await getIdToken();
      if (!token) {
        console.warn("[MemoryService] Cannot recall: User is not authenticated.");
        return { results: [], promptContext: '', entities: [], count: 0 };
      }

      const res = await fetch(`${getApiBase()}/api/memory/recall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: query.trim() })
      });

      if (!res.ok) {
        console.warn(`[MemoryService] Recall HTTP error ${res.status}`);
        return { results: [], promptContext: '', entities: [], count: 0 };
      }

      const data = await res.json();
      return {
        results: data.results || [],
        promptContext: data.promptContext || '',
        entities: data.entities || [],
        count: data.count || (data.results || []).length
      };
    } catch (err) {
      console.warn("[MemoryService] Recall fallback (backend unreachable):", err.message);
      return { results: [], promptContext: '', entities: [], count: 0 };
    }
  }

  /**
   * Retain durable facts, preferences, or project details in Hindsight
   * 
   * @param {string} content - Text to commit to long-term memory
   * @param {string} [context] - Context category (e.g. 'preference', 'tech_stack')
   * @param {string[]} [tags] - Search tags
   * @returns {Promise<{ success: boolean, count: number }>}
   */
  static async retain(content, context = 'general', tags = ['epic-think']) {
    if (!content || !content.trim()) return { success: false, count: 0 };

    // Prevent storing sensitive data locally or remotely
    if (/password|secret|bearer\s+|private[_-]?key|credit[_-]?card/i.test(content)) {
      console.warn("[MemoryService] Retain rejected: Content contains sensitive patterns.");
      return { success: false, count: 0, reason: 'sensitive_data_rejected' };
    }

    try {
      const token = await getIdToken();
      if (!token) {
        console.warn("[MemoryService] Cannot retain: User is not authenticated.");
        return { success: false, count: 0 };
      }

      const res = await fetch(`${getApiBase()}/api/memory/retain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content.trim(),
          context: context || 'general',
          tags: tags || ['epic-think']
        })
      });

      if (!res.ok) {
        console.warn(`[MemoryService] Retain HTTP error ${res.status}`);
        return { success: false, count: 0 };
      }

      const data = await res.json();
      return { success: data.success, count: data.itemsCount || 1 };
    } catch (err) {
      console.warn("[MemoryService] Retain failed (backend unreachable):", err.message);
      return { success: false, count: 0 };
    }
  }

  /**
   * Load memories for the active authenticated user
   * Queries Hindsight Cloud and syncs local cache
   */
  static async getMemories(uid) {
    if (!uid) return [];

    const storageKey = `eta_mems_${uid}`;

    try {
      const token = await getIdToken();
      if (token) {
        const res = await fetch(`${getApiBase()}/api/memory/list`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.memories)) {
            const formatted = data.memories.map(m => ({
              id: m.id,
              text: m.text,
              time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : 'Recently',
              timestamp: m.timestamp || Date.now(),
              entities: m.entities || [],
              context: m.context || 'general',
              uid: uid
            }));

            // Sync with local cache
            localStorage.setItem(storageKey, JSON.stringify(formatted));
            return formatted;
          }
        }
      }
    } catch (e) {
      console.warn("[MemoryService] Unable to list remote memories, using local cache:", e.message);
    }

    // Local storage fallback
    try {
      const localData = localStorage.getItem(storageKey);
      return localData ? JSON.parse(localData) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add a memory (combines Hindsight remote retain and local state)
   */
  static async addMemory(uid, memoryText, context = 'preference') {
    if (!uid || !memoryText || !memoryText.trim()) return null;

    // Trigger async Hindsight retain
    this.retain(memoryText, context, ['user-preference', 'durable-fact']).catch(err => {
      console.warn("[MemoryService] Background retain error:", err);
    });

    const memories = await this.getMemories(uid);
    const newEntry = {
      id: 'mem_' + Math.random().toString(36).substring(2, 9),
      text: memoryText.trim(),
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }),
      timestamp: Date.now(),
      context: context,
      uid: uid
    };

    memories.push(newEntry);
    localStorage.setItem(`eta_mems_${uid}`, JSON.stringify(memories));
    return newEntry;
  }

  /**
   * Remove a specific memory belonging to this user UID
   */
  static async removeMemory(uid, memoryId) {
    if (!uid) return false;
    let memories = await this.getMemories(uid);
    memories = memories.filter(m => m.id !== memoryId && m.text !== memoryId);
    localStorage.setItem(`eta_mems_${uid}`, JSON.stringify(memories));
    return true;
  }

  /**
   * Clear all memories belonging strictly to this user UID (both in Hindsight and local cache)
   */
  static async clearAllMemories(uid) {
    if (!uid) return;

    // 1. Clear local cache
    localStorage.removeItem(`eta_mems_${uid}`);

    // 2. Clear remote Hindsight bank
    try {
      const token = await getIdToken();
      if (token) {
        await fetch(`${getApiBase()}/api/memory`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(`[MemoryService] Hindsight memory wiped for user: ${uid}`);
      }
    } catch (err) {
      console.warn("[MemoryService] Remote memory clear error:", err.message);
    }
  }

  /**
   * Check Hindsight backend health and status
   */
  static async getStatus() {
    try {
      const res = await fetch(`${getApiBase()}/api/memory/status`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback status
    }
    return { ready: false, status: 'offline', deployment: 'Offline Fallback' };
  }
}
