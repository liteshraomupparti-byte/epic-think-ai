/**
 * Epic Think AI - Open LLM Observability & Tracing Engine (Langfuse Inspired)
 * 
 * Tracks distributed agent spans, tool latencies, model token costs,
 * and error telemetry across all conversation workflows.
 */

import crypto from 'crypto';

class TraceStore {
  constructor(maxTraces = 1500) {
    this.maxTraces = maxTraces;
    this.traces = new Map();
    this.stats = {
      totalRequests: 0,
      totalCostUsd: 0,
      totalTokens: 0,
      totalErrors: 0,
      providerBreakdown: {}
    };
  }

  startTrace({ uid = 'guest_user', conversationId = null, name = 'agent_run', tags = [] }) {
    const traceId = `trc_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const trace = {
      traceId,
      uid,
      conversationId,
      name,
      tags,
      startTime: Date.now(),
      endTime: null,
      durationMs: 0,
      totalCostUsd: 0,
      totalTokens: 0,
      status: 'RUNNING',
      spans: []
    };

    if (this.traces.size >= this.maxTraces) {
      // Evict oldest trace
      const oldestKey = this.traces.keys().next().value;
      this.traces.delete(oldestKey);
    }

    this.traces.set(traceId, trace);
    return traceId;
  }

  startSpan(traceId, { name, type = 'llm', input = null }) {
    const trace = this.traces.get(traceId);
    if (!trace) return null;

    const spanId = `spn_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const span = {
      spanId,
      name,
      type, // 'llm' | 'tool' | 'graph_node' | 'browser' | 'builder'
      input,
      output: null,
      startTime: Date.now(),
      endTime: null,
      durationMs: 0,
      tokens: { prompt: 0, completion: 0, total: 0 },
      costUsd: 0,
      status: 'RUNNING',
      error: null
    };

    trace.spans.push(span);
    return spanId;
  }

  endSpan(traceId, spanId, { output = null, tokens = {}, costUsd = 0, status = 'SUCCESS', error = null } = {}) {
    const trace = this.traces.get(traceId);
    if (!trace) return null;

    const span = trace.spans.find(s => s.spanId === spanId);
    if (!span) return null;

    span.endTime = Date.now();
    span.durationMs = span.endTime - span.startTime;
    span.output = output;
    span.tokens = {
      prompt: tokens.prompt || tokens.promptTokens || 0,
      completion: tokens.completion || tokens.completionTokens || 0,
      total: tokens.total || tokens.totalTokens || 0
    };
    span.costUsd = Number(costUsd || 0);
    span.status = status;
    span.error = error;

    // Aggregate into trace
    trace.totalCostUsd = Number((trace.totalCostUsd + span.costUsd).toFixed(6));
    trace.totalTokens += span.tokens.total;
    if (status === 'ERROR') {
      trace.status = 'ERROR';
    }

    return span;
  }

  endTrace(traceId, { status = 'SUCCESS', metadata = {} } = {}) {
    const trace = this.traces.get(traceId);
    if (!trace) return null;

    trace.endTime = Date.now();
    trace.durationMs = trace.endTime - trace.startTime;
    trace.status = status;
    trace.metadata = metadata;

    // Update global observability stats
    this.stats.totalRequests += 1;
    this.stats.totalCostUsd = Number((this.stats.totalCostUsd + trace.totalCostUsd).toFixed(6));
    this.stats.totalTokens += trace.totalTokens;
    if (status === 'ERROR') {
      this.stats.totalErrors += 1;
    }

    return trace;
  }

  getTrace(traceId) {
    return this.traces.get(traceId) || null;
  }

  listTraces({ limit = 50, uid = null } = {}) {
    let list = Array.from(this.traces.values()).reverse();
    if (uid) {
      list = list.filter(t => t.uid === uid);
    }
    return list.slice(0, limit);
  }

  getStats() {
    return {
      ...this.stats,
      activeTracesCount: this.traces.size,
      errorRate: this.stats.totalRequests > 0 
        ? Number(((this.stats.totalErrors / this.stats.totalRequests) * 100).toFixed(2)) 
        : 0
    };
  }
}

export const traceManager = new TraceStore();
