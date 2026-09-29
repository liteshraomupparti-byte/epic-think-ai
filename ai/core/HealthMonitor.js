/**
 * Epic Think AI - Health Monitor & Circuit Breaker System
 * 
 * Tracks real-time health, latency, failure counters, and circuit breaker states for AI providers:
 * - CLOSED: Normal operational state
 * - OPEN: Provider repeatedly failing, traffic blocked during cooldown
 * - HALF_OPEN: Cooldown expired, probing single request to test recovery
 */

export const CircuitState = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN'
};

export class HealthMonitor {
  constructor({
    failureThreshold = 3,
    cooldownMs = 30000,
    probeSuccessThreshold = 1
  } = {}) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.probeSuccessThreshold = probeSuccessThreshold;

    this.stats = new Map();
  }

  getProviderStats(providerId) {
    if (!this.stats.has(providerId)) {
      this.stats.set(providerId, {
        providerId,
        state: CircuitState.CLOSED,
        consecutiveFailures: 0,
        consecutiveSuccesses: 0,
        totalRequests: 0,
        totalErrors: 0,
        lastSuccessAt: null,
        lastFailureAt: null,
        lastLatencyMs: 0,
        cooldownUntil: 0,
        rateLimitedUntil: 0,
        lastError: null
      });
    }
    return this.stats.get(providerId);
  }

  /**
   * Check if a provider can accept new requests
   */
  canExecute(providerId) {
    const s = this.getProviderStats(providerId);
    const now = Date.now();

    // Check rate limit backoff
    if (s.rateLimitedUntil > now) {
      return false;
    }

    if (s.state === CircuitState.CLOSED) {
      return true;
    }

    if (s.state === CircuitState.OPEN) {
      if (now >= s.cooldownUntil) {
        // Cooldown expired, transition to HALF_OPEN probe state
        s.state = CircuitState.HALF_OPEN;
        s.consecutiveSuccesses = 0;
        return true;
      }
      return false;
    }

    if (s.state === CircuitState.HALF_OPEN) {
      // Allow single probe request
      return true;
    }

    return true;
  }

  isAvailable(providerId) {
    return this.canExecute(providerId);
  }

  /**
   * Record successful request
   */
  recordSuccess(providerId, latencyMs = 0) {
    const s = this.getProviderStats(providerId);
    s.totalRequests++;
    s.consecutiveFailures = 0;
    s.consecutiveSuccesses++;
    s.lastSuccessAt = Date.now();
    s.lastLatencyMs = latencyMs;
    s.lastError = null;

    if (s.state !== CircuitState.CLOSED && s.consecutiveSuccesses >= this.probeSuccessThreshold) {
      s.state = CircuitState.CLOSED;
      s.cooldownUntil = 0;
    }
  }

  /**
   * Record request failure
   */
  recordFailure(providerId, error = null) {
    const s = this.getProviderStats(providerId);
    const now = Date.now();

    s.totalRequests++;
    s.totalErrors++;
    s.consecutiveFailures++;
    s.consecutiveSuccesses = 0;
    s.lastFailureAt = now;
    s.lastError = error?.message || 'Unknown error';

    // Handle rate-limits specifically
    if (error?.name === 'AIRateLimitError' || error?.statusCode === 429) {
      const waitMs = error?.retryAfterMs || 15000;
      s.rateLimitedUntil = now + waitMs;
    }

    // Trip circuit breaker if threshold exceeded
    if (s.consecutiveFailures >= this.failureThreshold) {
      s.state = CircuitState.OPEN;
      s.cooldownUntil = now + this.cooldownMs;
    }
  }

  /**
   * Get all provider statuses for /api/ai/health
   */
  getAllStatuses(providers = {}) {
    const out = {};
    for (const [id, provider] of Object.entries(providers)) {
      const s = this.getProviderStats(id);
      out[id] = {
        configured: Boolean(provider?.isConfigured),
        healthy: Boolean(provider?.isConfigured) && s.state === CircuitState.CLOSED && s.rateLimitedUntil <= Date.now(),
        circuitState: s.state,
        latencyMs: s.lastLatencyMs || null,
        consecutiveFailures: s.consecutiveFailures,
        lastSuccessAt: s.lastSuccessAt ? new Date(s.lastSuccessAt).toISOString() : null,
        lastFailureAt: s.lastFailureAt ? new Date(s.lastFailureAt).toISOString() : null,
        lastError: s.lastError
      };
    }
    return out;
  }
}

export const healthMonitor = new HealthMonitor();
