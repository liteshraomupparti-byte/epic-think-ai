/**
 * Epic Think AI - Safe Generation Diagnostics & Observability Registry
 * 
 * Records bounded, privacy-safe telemetry of AI generation cycles:
 * - Latency, token metrics, finish reasons, truncation detection
 * - Sanitized request telemetry (NO API keys, NO credentials, NO user secrets)
 * - In-memory ring buffer (last 100 requests) for real-time developer monitoring
 */

import { SafeLogger } from '../../plugins/core/SafeLogger.js';

class GenerationDiagnosticsStore {
  constructor(maxRecords = 100) {
    this.maxRecords = maxRecords;
    this.records = [];
  }

  /**
   * Record a completed or failed AI generation lifecycle
   */
  record({
    requestId,
    uid,
    provider,
    model,
    preset,
    startTime,
    firstTokenTime = null,
    endTime = Date.now(),
    finishReason = 'stop',
    generatedTokens = 0,
    configuredOutputLimit = 8192,
    isTruncated = false,
    canContinue = false,
    streaming = false,
    error = null
  }) {
    const latency = Math.max(0, endTime - startTime);
    const timeToFirstToken = firstTokenTime ? Math.max(0, firstTokenTime - startTime) : null;

    const entry = {
      requestId: requestId || `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userHash: uid ? SafeLogger.hashUid(uid) : 'anonymous',
      provider: provider || 'unknown',
      model: model || 'unknown',
      preset: preset || 'Epic Think 4o',
      timestamp: endTime,
      generationStart: startTime,
      generationEnd: endTime,
      firstToken: timeToFirstToken,
      latency,
      finishReason,
      isTruncated: Boolean(isTruncated || finishReason === 'length'),
      canContinue: Boolean(canContinue || isTruncated || finishReason === 'length'),
      generatedTokens: Math.max(0, generatedTokens || 0),
      configuredOutputLimit: configuredOutputLimit || 8192,
      streaming: Boolean(streaming),
      error: error ? String(error) : null
    };

    this.records.unshift(entry);
    if (this.records.length > this.maxRecords) {
      this.records.pop();
    }

    return entry;
  }

  /**
   * Retrieve sanitized diagnostic records
   */
  getRecent(limit = 20) {
    return this.records.slice(0, Math.min(limit, this.records.length));
  }

  /**
   * Get telemetry summary
   */
  getSummary() {
    const total = this.records.length;
    if (total === 0) {
      return { total: 0, avgLatency: 0, truncationRate: 0, errorRate: 0 };
    }

    const totalLatency = this.records.reduce((acc, r) => acc + (r.latency || 0), 0);
    const truncations = this.records.filter(r => r.isTruncated).length;
    const errors = this.records.filter(r => r.error).length;

    return {
      total,
      avgLatencyMs: Math.round(totalLatency / total),
      truncationCount: truncations,
      truncationRatePercent: Math.round((truncations / total) * 100),
      errorCount: errors,
      errorRatePercent: Math.round((errors / total) * 100)
    };
  }

  clear() {
    this.records = [];
  }
}

export const diagnosticsStore = new GenerationDiagnosticsStore();
