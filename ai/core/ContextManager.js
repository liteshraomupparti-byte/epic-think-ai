/**
 * Epic Think AI - Intelligent Context Manager
 * 
 * Assembles balanced prompt contexts without exceeding token budgets or leaking private data:
 * 1. Current user prompt
 * 2. Recent conversation history window (last 6-8 messages)
 * 3. Hindsight semantic memories (sanitized & prioritized)
 * 4. System instructions with persona & safety guidelines
 * 5. PII and secret redaction filters
 */

export class ContextManager {
  static REDACTION_PATTERNS = [
    { pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, replacement: '[REDACTED_BEARER_TOKEN]' },
    { pattern: /(?:api[_-]?key|secret|password|auth[_-]?token|access[_-]?token|refresh[_-]?token|private[_-]?key)\s*(?:[:=]|\bis\b)\s*['"]?[^\s'"]+['"]?/gi, replacement: '[REDACTED_CREDENTIAL]' },
    { pattern: /\b(?:sk|gsk|ghp|gho|ghu|ghs|ghr)[-_A-Za-z0-9]{14,}\b/gi, replacement: '[REDACTED_API_KEY]' },
    { pattern: /\bAQ\.[A-Za-z0-9_\-]{20,}\b/g, replacement: '[REDACTED_API_KEY]' },
    { pattern: /\b(?:\d{4}[- ]?){3}\d{4}\b/g, replacement: '[REDACTED_CARD_NUMBER]' },
    { pattern: /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g, replacement: '[REDACTED_PRIVATE_KEY]' }
  ];

  /**
   * Redact sensitive credentials and tokens from text
   */
  static sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    let sanitized = text;
    for (const { pattern, replacement } of ContextManager.REDACTION_PATTERNS) {
      sanitized = sanitized.replace(pattern, replacement);
    }
    return sanitized;
  }

  /**
   * Build complete LLM message context
   */
  static buildContext({
    userPrompt,
    recentMessages = [],
    recalledMemories = [],
    recalledPromptContext = '',
    maxHistoryMessages = 8,
    activeModelPreset = 'Epic Think 4o',
    systemInstruction = null
  }) {
    const messages = [];

    // 1. System Prompt Assembly
    let system = systemInstruction || `You are Epic Think AI, an advanced, production-grade autonomous AI assistant and software architect.
You possess deep technical expertise across full-stack development, distributed systems, system design, databases, security, and general problem solving.
Always provide direct, clear, highly accurate, and helpful answers. Format code clearly in markdown with language tags.`;

    // Real-time temporal grounding
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });
    system += `\n\n[SYSTEM CONTEXT & REAL-TIME CLOCK]:\nCurrent UTC Date & Time: ${dateStr}, ${timeStr}.\nUse this accurate temporal reference for any questions about today's date, day, month, year, or current time.`;

    // Tool calling guidance
    system += `\n\n[TOOL USAGE GUIDELINES]:
- Only invoke external tools when you genuinely need to query external services (e.g. searching the web for real-time external documentation, breaking news, GitHub, Notion, Drive, or sending emails).
- Do NOT invoke web search for simple greetings (such as "hello", "hi", "how are you"), common knowledge, mathematical calculations, writing code/scripts, or reasoning questions. Answer those directly.
- When tool results are provided to you, synthesize a comprehensive, direct, and detailed answer. NEVER output generic placeholders like "I completed the necessary checks" or empty replies. Always answer the user's question directly.`;

    if (activeModelPreset && activeModelPreset.includes('o1')) {
      system += `\nYou are operating in Deep Think (o1 Reasoning) mode. Thoroughly reason through edge cases, constraints, and architecture trade-offs.`;
    } else if (activeModelPreset && activeModelPreset.includes('Fast')) {
      system += `\nYou are operating in Ultra Fast mode. Deliver immediate, concise, and direct answers without unnecessary fluff.`;
    }

    // 2. Incorporate Hindsight Long-Term Memory Context
    if (recalledMemories && recalledMemories.length > 0) {
      const memoryLines = recalledMemories
        .slice(0, 5)
        .map((m, idx) => `• [Memory ${idx + 1}]: ${ContextManager.sanitizeText(m.text || m.content || '')}`)
        .join('\n');

      system += `\n\n[USER PERSONALIZATION & RECALLED LONG-TERM MEMORY]:
The following verified facts and preferences were recalled from the user's private Hindsight semantic memory bank:
${memoryLines}
Use these preferences naturally to personalize your response without explicitly announcing "according to your memory" unless relevant.`;
    } else if (recalledPromptContext) {
      system += `\n\n[USER CONTEXT]:\n${ContextManager.sanitizeText(recalledPromptContext)}`;
    }

    // 3. Recent Conversation History Window
    if (Array.isArray(recentMessages) && recentMessages.length > 0) {
      const windowed = recentMessages.slice(-maxHistoryMessages);
      for (const msg of windowed) {
        if (!msg || !msg.text) continue;
        const role = msg.role === 'assistant' || msg.role === 'model' ? 'assistant' : 'user';
        messages.push({
          role,
          content: ContextManager.sanitizeText(msg.text)
        });
      }
    }

    // 4. Current User Prompt (if not already the last message in history)
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== userPrompt) {
      messages.push({
        role: 'user',
        content: ContextManager.sanitizeText(userPrompt)
      });
    }

    return {
      systemPrompt: system,
      messages
    };
  }

  sanitizeText(text) {
    return ContextManager.sanitizeText(text);
  }

  pruneHistory(history, maxCount = 8) {
    if (!Array.isArray(history)) return [];
    return history.slice(-maxCount);
  }

  buildContext(options) {
    return ContextManager.buildContext(options);
  }
}
