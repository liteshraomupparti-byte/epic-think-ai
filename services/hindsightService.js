/**
 * Epic Think AI - Production Hindsight Long-Term Semantic Memory Service
 * 
 * Interacts directly with the official Hindsight Cloud API (https://api.hindsight.vectorize.io)
 * using the official @vectorize-io/hindsight-client SDK.
 * 
 * Provides:
 * 1. retainMemory() - with automatic sensitive-data filtering and bank provisioning
 * 2. recallMemory() - semantic memory retrieval with entity recognition and LLM prompt serialization
 * 3. reflectMemory() - higher-order synthesis across recalled memories
 * 4. listMemories() - retrieve all consolidated facts and preferences for a user
 * 5. clearMemory() - securely wipes the user's isolated memory bank
 * 6. getHealth() - health and connectivity validation
 * 
 * SECURITY:
 * - API Key is kept strictly server-side in environment variables
 * - Never logs secrets, passwords, tokens, or raw credentials
 * - Gracefully falls back when Hindsight is unreachable without breaking the caller
 */

import { HindsightClient, recallResponseToPromptString } from '@vectorize-io/hindsight-client';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';
const API_KEY = process.env.HINDSIGHT_API_KEY || '';

// Verify configuration safely (never log API keys)
if (!API_KEY) {
  console.warn('[HINDSIGHT] Warning: HINDSIGHT_API_KEY is not configured in environment variables.');
  console.warn('[HINDSIGHT] Memory operations will operate in graceful fallback mode.');
} else {
  console.log('[HINDSIGHT] Configured with endpoint:', BASE_URL);
}

// Initialize official Hindsight client
const client = API_KEY ? new HindsightClient({
  baseUrl: BASE_URL,
  apiKey: API_KEY,
  userAgent: 'Epic-Think-AI/1.0.0 (Hindsight-Memory-Service)'
}) : null;

// Track initialized banks to avoid redundant PUT requests
const provisionedBanks = new Set();

/**
 * Filter out sensitive content to prevent storing credentials, tokens, or passwords
 */
function sanitizeContent(content) {
  if (!content || typeof content !== 'string') return '';

  let sanitized = content;

  // Mask common API keys, bearer tokens, passwords, and private keys
  sanitized = sanitized.replace(/(?:api[_-]?key|secret|token|password|auth[_-]?token)\s*[:=]\s*['"][^\s'"]+['"]/gi, '[REDACTED_CREDENTIAL]');
  sanitized = sanitized.replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, 'Bearer [REDACTED_TOKEN]');
  sanitized = sanitized.replace(/-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g, '[REDACTED_PRIVATE_KEY]');
  sanitized = sanitized.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[REDACTED_CARD]');
  
  return sanitized.trim();
}

/**
 * Ensure user's isolated memory bank exists in Hindsight
 */
export async function ensureBank(bankId) {
  if (!client) return false;
  if (provisionedBanks.has(bankId)) return true;

  try {
    await client.createBank(bankId, {
      name: `Epic Think AI Bank (${bankId})`
    });
    provisionedBanks.add(bankId);
    return true;
  } catch (err) {
    // If bank already exists, consider provisioned
    const msg = (err && err.message) || '';
    if (msg.includes('already exists') || msg.includes('409') || (err.statusCode === 409)) {
      provisionedBanks.add(bankId);
      return true;
    }
    console.warn(`[HINDSIGHT] Bank initialization note for ${bankId}:`, msg);
    return false;
  }
}

/**
 * Retain useful long-term information into user's isolated memory bank
 * 
 * @param {string} bankId - Isolated user bank (e.g. `epic-think-user-<uid>`)
 * @param {string} content - Text to retain
 * @param {string} [context] - Context category (e.g. 'preference', 'tech_stack', 'project')
 * @param {string[]} [tags] - Search tags
 * @returns {Promise<{ success: boolean, itemsCount: number, error?: string }>}
 */
export async function retainMemory(bankId, content, context = 'general', tags = ['epic-think']) {
  if (!client) {
    console.log('[HINDSIGHT] Hindsight unavailable - retain skipped gracefully');
    return { success: false, itemsCount: 0, error: 'Hindsight client not configured' };
  }

  const cleanContent = sanitizeContent(content);
  if (!cleanContent || cleanContent.length < 5) {
    return { success: false, itemsCount: 0, error: 'Content too short or fully redacted' };
  }

  try {
    await ensureBank(bankId);

    const result = await client.retain(bankId, cleanContent, {
      context: context || 'general',
      tags: Array.isArray(tags) ? tags : ['epic-think'],
      async: false
    });

    console.log(`[HINDSIGHT] Retain successful for bank: ${bankId} (items: ${result.items_count || 1})`);
    return {
      success: true,
      itemsCount: result.items_count || 1,
      operationId: result.operation_id
    };
  } catch (error) {
    console.error(`[HINDSIGHT] Retain error for bank ${bankId}:`, error.message || error);
    return {
      success: false,
      itemsCount: 0,
      error: error.message || 'Failed to retain memory'
    };
  }
}

/**
 * Recall memories relevant to a user query
 * 
 * @param {string} bankId - Isolated user bank
 * @param {string} query - Natural language query
 * @param {object} [options] - Options (maxTokens, budget, etc.)
 * @returns {Promise<{ results: Array, promptContext: string, entities: Array, trace?: any }>}
 */
export async function recallMemory(bankId, query, options = {}) {
  if (!client) {
    console.log('[HINDSIGHT] Hindsight unavailable - continuing without memory');
    return { results: [], promptContext: '', entities: [] };
  }

  const cleanQuery = (query || '').trim();
  if (!cleanQuery) {
    return { results: [], promptContext: '', entities: [] };
  }

  console.log(`[HINDSIGHT] Recall started for query: "${cleanQuery.slice(0, 45)}..."`);

  try {
    const response = await client.recall(bankId, cleanQuery, {
      maxTokens: options.maxTokens || 4096,
      includeEntities: true
    });

    const results = Array.isArray(response.results) ? response.results : [];
    
    // Format LLM prompt context string
    let promptContext = '';
    try {
      if (results.length > 0) {
        promptContext = recallResponseToPromptString(response);
      }
    } catch {
      // Fallback manual serialization
      promptContext = results.map(r => `- ${r.text}`).join('\n');
    }

    const entities = response.entities ? Object.keys(response.entities) : [];

    console.log(`[HINDSIGHT] Recall successful (${results.length} memories recalled)`);
    return {
      results: results.map(r => ({
        id: r.id,
        text: r.text,
        context: r.context,
        entities: r.entities || [],
        score: r.scores?.final ?? null,
        timestamp: r.mentioned_at || null
      })),
      promptContext,
      entities
    };
  } catch (error) {
    const msg = error.message || '';
    // Bank not found is normal for brand new users who haven't saved any memories yet
    if (msg.includes('not found') || error.statusCode === 404) {
      console.log(`[HINDSIGHT] User bank ${bankId} is fresh/empty. Returning 0 memories.`);
      return { results: [], promptContext: '', entities: [] };
    }

    console.warn(`[HINDSIGHT] Recall error: ${msg}. Continuing without memory.`);
    return { results: [], promptContext: '', entities: [], error: msg };
  }
}

/**
 * Higher-order reflection across memories
 */
export async function reflectMemory(bankId, query, options = {}) {
  if (!client) {
    return { answer: null, error: 'Hindsight client not configured' };
  }

  try {
    const res = await client.reflect(bankId, query, options);
    return {
      answer: res.answer || res.content || null,
      trace: res.trace || null
    };
  } catch (error) {
    console.warn(`[HINDSIGHT] Reflect error:`, error.message);
    return { answer: null, error: error.message };
  }
}

/**
 * List all memories/facts for a user bank
 */
export async function listMemories(bankId) {
  if (!client) return { memories: [] };

  try {
    // Broad recall to surface stored preferences and facts
    const response = await client.recall(bankId, 'User preferences, background context, rules, and coding specifications', {
      maxTokens: 4096,
      includeEntities: true
    });

    const results = (response.results || []).map(r => ({
      id: r.id,
      text: r.text,
      context: r.context,
      entities: r.entities || [],
      timestamp: r.mentioned_at || new Date().toISOString()
    }));

    return { memories: results };
  } catch (error) {
    if (error.message?.includes('not found') || error.statusCode === 404) {
      return { memories: [] };
    }
    console.warn(`[HINDSIGHT] List memories error:`, error.message);
    return { memories: [] };
  }
}

/**
 * Delete and clear a user's isolated memory bank
 */
export async function clearMemory(bankId) {
  if (!client) {
    return { success: false, error: 'Hindsight client not configured' };
  }

  console.log(`[HINDSIGHT] Clearing bank: ${bankId}`);
  try {
    await client.deleteBank(bankId);
    provisionedBanks.delete(bankId);
    console.log(`[HINDSIGHT] Bank cleared successfully: ${bankId}`);
    return { success: true, message: `Bank ${bankId} wiped successfully` };
  } catch (error) {
    if (error.message?.includes('not found') || error.statusCode === 404) {
      return { success: true, message: 'Bank was already empty' };
    }
    console.error(`[HINDSIGHT] Clear bank error:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Health check & status verification
 */
export async function getHealth() {
  if (!client) {
    return {
      status: 'unconfigured',
      ready: false,
      message: 'HINDSIGHT_API_KEY is not set'
    };
  }

  try {
    const version = await client.getVersion();
    return {
      status: 'healthy',
      ready: true,
      baseUrl: BASE_URL,
      version: version.version || 'v1',
      deployment: 'Hindsight Cloud'
    };
  } catch (err) {
    return {
      status: 'degraded',
      ready: false,
      error: err.message
    };
  }
}
