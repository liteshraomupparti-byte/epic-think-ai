/**
 * Epic Think AI - Tool Result Sanitizer & Anti-Prompt-Injection Boundary
 * 
 * Treats ALL external API data, web content, emails, documents, and messages
 * as UNTRUSTED DATA.
 * 
 * Protects against Indirect Prompt Injection by neutralizing injection markers
 * and wrapping outputs in strict semantic containment tags.
 */

export class ResultSanitizer {
  /**
   * Neutralize potentially harmful characters, control codes, and scripts
   */
  static cleanText(text) {
    if (typeof text !== 'string') return '';

    return text
      // Strip ASCII control characters except standard whitespace
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Neutralize HTML script tags and execution vectors
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[REDACTED_SCRIPT]')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '[REDACTED_IFRAME]')
      // Neutralize common system prompt injection prefix overrides
      .replace(/(?:ignore all (?:previous )?instructions|system[:\s]+override|you are now in developer mode|disregard (?:all )?previous)/gi, '[FILTERED_PROMPT_INJECTION]');
  }

  /**
   * Recursively sanitize any payload returned by a tool handler
   */
  static sanitizePayload(data, maxDepth = 4) {
    if (maxDepth <= 0 || data === null || data === undefined) return data;

    if (typeof data === 'string') {
      const cleaned = ResultSanitizer.cleanText(data);
      // Hard cap at 12,000 characters to prevent context stuffing attacks
      if (cleaned.length > 12000) {
        return cleaned.slice(0, 12000) + '\n... [CONTENT TRUNCATED FOR SECURITY AND CONTEXT LIMITS]';
      }
      return cleaned;
    }

    if (Array.isArray(data)) {
      return data.slice(0, 50).map(item => ResultSanitizer.sanitizePayload(item, maxDepth - 1));
    }

    if (typeof data === 'object') {
      const sanitized = {};
      for (const [key, val] of Object.entries(data)) {
        sanitized[ResultSanitizer.cleanText(key)] = ResultSanitizer.sanitizePayload(val, maxDepth - 1);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Wrap sanitized tool results in an explicit, tamper-resistant untrusted data boundary
   * 
   * @param {string} pluginId - Plugin identifier
   * @param {string} toolName - Tool identifier
   * @param {any} rawOutput - Output from tool handler
   * @returns {string} Safe, delimited context string for LLM
   */
  static formatForAgentContext(pluginId, toolName, rawOutput) {
    const sanitized = ResultSanitizer.sanitizePayload(rawOutput);
    const content = typeof sanitized === 'string' ? sanitized : JSON.stringify(sanitized, null, 2);

    return `<untrusted_tool_output plugin="${pluginId}" tool="${toolName}">\n[EXTERNAL DATA START]\n${content}\n[EXTERNAL DATA END]\n</untrusted_tool_output>`;
  }
}
