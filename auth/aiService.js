/**
 * Epic Think AI - Production Multi-Provider AI Client Service
 * 
 * Provides unified communication with backend Multi-Provider AI Router,
 * supporting Groq, OpenRouter, Google Gemini, image/video generation tools,
 * model health monitoring, and tool calling.
 */

import { getIdToken } from "./authService.js";

const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.port === '3001') return '';
  return 'http://localhost:3001';
};

async function fetchWithAuth(endpoint, options = {}) {
  let token = null;
  try {
    token = await getIdToken();
  } catch (_) {}

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBase()}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export class AiService {
  /**
   * Send a chat request through the Multi-Provider AI Router
   * 
   * @param {Object} params
   * @param {string} params.message - Current user prompt
   * @param {string} [params.conversationId]
   * @param {string} [params.modelPreset] - 'Epic Think 4o', 'Epic Think o1 (Reasoning)', 'Epic Think Fast', 'auto', etc.
   * @param {string} [params.provider]
   * @param {string} [params.model]
   * @param {Array}  [params.history]
   * @param {boolean} [params.reasoning]
   * @param {boolean} [params.webSearch]
   * @param {string} [params.confirmationId]
   */
  static async chat(params) {
    return await fetchWithAuth('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  /**
   * Fetch connected providers readiness status
   */
  static async getProviders() {
    return await fetchWithAuth('/api/ai/providers');
  }

  /**
   * Fetch available models catalog with presets
   */
  static async getModels() {
    return await fetchWithAuth('/api/ai/models');
  }

  /**
   * Fetch provider health and circuit breaker metrics
   */
  static async getHealth() {
    return await fetchWithAuth('/api/ai/health');
  }

  /**
   * Generate an image using AI Image Studio
   * 
   * @param {Object} params
   * @param {string} params.prompt
   * @param {string} [params.style]
   * @param {string} [params.aspectRatio]
   */
  static async generateImage(params) {
    return await fetchWithAuth('/api/ai/image', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  /**
   * Generate video prompt package and storyboard
   * 
   * @param {Object} params
   * @param {string} params.prompt
   * @param {number} [params.durationSeconds]
   * @param {string} [params.style]
   */
  static async generateVideo(params) {
    return await fetchWithAuth('/api/ai/video', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }
}
