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
    systemInstruction = null,
    builderProject = null,
    userProfile = null
  }) {
    const messages = [];

    // 1. System Prompt Assembly
    let system = systemInstruction || `You are Epic Think AI, an advanced, production-grade autonomous AI assistant and software architect.
You possess deep technical expertise across full-stack development, distributed systems, system design, databases, security, and general problem solving.
Always provide direct, clear, highly accurate, and helpful answers. Format code clearly in markdown with language tags.`;

    // Real-time temporal grounding (Indian Standard Time - IST / UTC+5:30)
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZoneName: 'short', timeZone: 'Asia/Kolkata' });
    system += `\n\n[SYSTEM CONTEXT & REAL-TIME CLOCK]:\nCurrent Date & Time: ${dateStr}, ${timeStr} (Indian Standard Time / IST, UTC+5:30).\nAlways use Indian Standard Time (IST) as your default time zone reference whenever the user asks for the current time, today's date, day, month, year, or timing/scheduling.`;

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

    // 2. Autonomous Builder & Intent Guidance (Lovable & Emergent AI Mode)
    system += `\n\n[AUTONOMOUS BUILDER POLICY & ZERO-BLOCKING-QUESTION RULE (Lovable / Emergent AI Mode)]:
- You are not a passive text chatbot; you are an autonomous full-stack software engineer and website builder like Lovable, Emergent AI, and v0.
- When the user asks you to build, create, develop, or code an application or website (or provides features/tech stack specs):
  1. NEVER interrogate the user with 4-5 blocking questions! Never ask "What kind of app?", "What features do you need?", "Preferred tech stack?", or "Which specific database?".
  2. Make intelligent, production-grade default choices immediately:
     • Modern responsive mobile-first UI with dark glassmorphism / luxury gold or clean modern aesthetic
     • Cohesive layout hierarchy with clean navigation, hero, interactive cards, and responsive grids
     • Complete working interactive JavaScript logic (forms, modals, filters, local state)
     • Realistic mock data, REST APIs, or database schemas (MongoDB, PostgreSQL, or Firebase)
  3. The website/app files are already synthesized and written directly into the project repository. DO NOT dump long raw source code files into the chat. Instead, highlight the architecture and features, provide the live preview link, and invite the user to modify any aspect through prompt.
  4. Always empower the user to preview their application immediately and iterate with natural language prompts!

[SINGLE-LINE INTENT UNDERSTANDING]:
- BUILD: Start building immediately with zero blocking questions. Create the application and provide the live preview.
- MODIFY: If the user provides a prompt to change or modify the application (e.g. "change background to navy blue", "add contact form", "make navbar sticky"), apply the update directly to the project files, reload the live preview, and confirm the modification without dumping raw code.
- DOUBT / EXPLANATION: If the user came with a doubt or question ("what is...", "how does..."), provide a deep, clear, authoritative explanation with examples and diagrams without building an unnecessary project.
- DEBUG: If the user came to fix a bug or error, pinpoint the root cause immediately and provide the exact corrected code.`;

    if (builderProject) {
      const isEdit = builderProject.action === 'modified';
      system += `\n\n[AUTONOMOUS WEBSITE BUILDER - PROJECT ${isEdit ? 'UPDATED' : 'SYNTHESIZED'}]:
A live, working project has already been autonomously ${isEdit ? 'modified' : 'synthesized'} and verified in the Website Builder:
• Project ID: ${builderProject.projectId}
• Title: ${builderProject.title}
• Live Preview URL: ${builderProject.previewUrl}
• Files: ${(builderProject.files || []).join(', ')}
Acknowledge the build/update with excitement! Explain the architecture and features created. Remind the user they can continue modifying the application through prompt!`;
    }

    // Incorporate User Profile Personalization & Custom Instructions
    if (userProfile) {
      const personalParts = [];
      const name = userProfile.displayName || userProfile.firstName;
      if (name) {
        personalParts.push(`User's Name: ${name}`);
      }
      if (userProfile.personalization?.aboutUser) {
        personalParts.push(`About User: ${ContextManager.sanitizeText(userProfile.personalization.aboutUser)}`);
      }
      if (userProfile.personalization?.customInstructions) {
        personalParts.push(`Custom Instructions: ${ContextManager.sanitizeText(userProfile.personalization.customInstructions)}`);
      }
      const rawStyle = userProfile.personalization?.responseStyle || userProfile.personalization?.responsePreferences || userProfile.preferences?.responseStyle;
      if (rawStyle) {
        const styleStr = String(rawStyle).trim();
        const capitalized = styleStr.charAt(0).toUpperCase() + styleStr.slice(1);
        personalParts.push(`Response Style Preference: ${capitalized}`);
      }
      if (personalParts.length > 0) {
        system += `\n\n[USER PERSONALIZATION & PROFILE PREFERENCES]:\n${personalParts.join('\n')}\n(Adhere to custom instructions and response style naturally. Avoid repeatedly greeting or stating the user's name on every response.)`;
      }
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
