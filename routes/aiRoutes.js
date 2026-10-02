/**
 * Epic Think AI - Multi-Provider AI Engine API Routes
 * 
 * Exposes:
 * - POST /api/ai/chat (Authenticated multi-provider chat with tools & memory)
 * - POST /api/ai/stream (Server-Sent Events streaming endpoint)
 * - GET  /api/ai/providers (Provider configuration status)
 * - GET  /api/ai/models (Available model registry)
 * - GET  /api/ai/health (Circuit breaker telemetry)
 * - POST /api/ai/image (AI Image Studio generation helper)
 * - POST /api/ai/video (AI Video Generation prompt synthesizer)
 */

import express from 'express';
import { requireAuth } from '../services/firebaseAuthService.js';
import { AIEngine, healthMonitor, modelRegistry, providers, diagnosticsStore } from '../ai/index.js';
import { SafeLogger } from '../plugins/core/SafeLogger.js';

const router = express.Router();

// Helper to allow both authenticated users and local/guest users seamless access
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return requireAuth(req, res, next);
  }
  req.user = { uid: 'guest_user', email: 'guest@epicthink.ai' };
  next();
};

/**
 * Primary AI Chat & Tool Execution
 * POST /api/ai/chat
 */
router.post('/chat', optionalAuth, async (req, res) => {
  const {
    prompt,
    text,
    message,
    conversationId,
    recentMessages,
    history,
    messages,
    modelPreset,
    confirmationId,
    isContinuation = false,
    partialResponse = '',
    maxTokens = null,
    webSearch = false,
    reasoning = false
  } = req.body || {};
  const userPrompt = prompt || text || message || (Array.isArray(messages) ? messages[messages.length - 1]?.content : null);
  const effectiveMessages = recentMessages || history || (Array.isArray(messages) ? messages.slice(0, -1) : []);

  if (!userPrompt && !confirmationId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: "prompt" or "message" or "confirmationId".'
    });
  }

  try {
    const result = await AIEngine.chat({
      uid: req.user.uid,
      prompt: userPrompt,
      conversationId,
      recentMessages: effectiveMessages,
      modelPreset: modelPreset || 'Epic Think 4o',
      confirmationId,
      isContinuation,
      partialResponse,
      maxTokens,
      webSearch: Boolean(webSearch),
      reasoning: Boolean(reasoning)
    });

    res.json({
      success: true,
      text: result.text,
      response: result.text,
      content: result.text,
      provider: result.provider,
      model: result.model,
      finishReason: result.finishReason || 'stop',
      isTruncated: Boolean(result.isTruncated || result.finishReason === 'length'),
      canContinue: Boolean(result.canContinue || result.isTruncated || result.finishReason === 'length'),
      maxOutputTokens: result.maxOutputTokens,
      latency: result.latency || result.durationMs,
      recalledMemoriesCount: result.recalledMemoriesCount,
      executedToolCalls: result.executedToolCalls,
      requiresConfirmation: result.requiresConfirmation,
      confirmationTicket: result.confirmationTicket,
      ticket: result.confirmationTicket ? {
        ...result.confirmationTicket,
        id: result.confirmationTicket.confirmationId || result.confirmationTicket.id,
        confirmationId: result.confirmationTicket.confirmationId || result.confirmationTicket.id,
        tool: result.confirmationTicket.toolName || result.confirmationTicket.tool,
        toolName: result.confirmationTicket.toolName || result.confirmationTicket.tool,
        risk: result.confirmationTicket.riskTier || result.confirmationTicket.risk,
        riskTier: result.confirmationTicket.riskTier || result.confirmationTicket.risk,
        params: result.confirmationTicket.parameters || result.confirmationTicket.params,
        parameters: result.confirmationTicket.parameters || result.confirmationTicket.params
      } : null,
      durationMs: result.durationMs || result.latency,
      builderProject: result.builderProject
    });
  } catch (err) {
    SafeLogger.error('AI chat endpoint failure', {
      user: SafeLogger.hashUid(req.user.uid),
      error: err.message
    });

    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message,
      type: err.name || 'AIProviderError'
    });
  }
});

/**
 * Server-Sent Events (SSE) Real-Time AI Streaming
 * POST /api/ai/stream
 */
router.post('/stream', optionalAuth, async (req, res) => {
  const {
    prompt,
    text,
    message,
    conversationId,
    recentMessages,
    history,
    messages,
    modelPreset,
    isContinuation = false,
    partialResponse = '',
    maxTokens = null,
    webSearch = false,
    reasoning = false
  } = req.body || {};
  const userPrompt = prompt || text || message || (Array.isArray(messages) ? messages[messages.length - 1]?.content : null);
  const effectiveMessages = recentMessages || history || (Array.isArray(messages) ? messages.slice(0, -1) : []);

  if (!userPrompt) {
    return res.status(400).json({ success: false, error: 'Missing required field: "prompt" or "message".' });
  }

  // Setup SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const abortController = new AbortController();
  res.on('close', () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

  try {
    let streamedAnyChunks = false;
    const streamResult = await AIEngine.chat({
      uid: req.user.uid,
      prompt: userPrompt,
      conversationId,
      recentMessages: effectiveMessages,
      modelPreset: modelPreset || 'Epic Think 4o',
      isContinuation,
      partialResponse,
      maxTokens,
      webSearch: Boolean(webSearch),
      reasoning: Boolean(reasoning),
      signal: abortController.signal,
      onEvent: (evt) => {
        if (evt.event === 'ai:chunk') {
          streamedAnyChunks = true;
          const content = evt.content || evt.text || '';
          sendEvent('chunk', { type: 'chunk', content, text: content });
        } else if (evt.event === 'ai:complete') {
          // Only send full content as chunk if nothing was streamed token-by-token (avoids duplicating response)
          if (evt.text && !streamedAnyChunks) {
            sendEvent('chunk', { type: 'chunk', content: evt.text, text: evt.text });
          }
          sendEvent('ai:complete', evt);
        } else {
          sendEvent(evt.event, evt);
        }
      }
    });

    sendEvent('ai:done', {
      type: 'done',
      done: true,
      success: true,
      provider: streamResult.provider,
      model: streamResult.model,
      finishReason: streamResult.finishReason || 'stop',
      isTruncated: Boolean(streamResult.isTruncated || streamResult.finishReason === 'length'),
      canContinue: Boolean(streamResult.canContinue || streamResult.isTruncated || streamResult.finishReason === 'length'),
      maxOutputTokens: streamResult.maxOutputTokens,
      durationMs: streamResult.durationMs || streamResult.latency,
      builderProject: streamResult.builderProject || null
    });
    res.end();
  } catch (err) {
    sendEvent('ai:error', {
      error: err.message,
      type: err.name
    });
    res.end();
  }
});

/**
 * Provider Readiness
 * GET /api/ai/providers
 */
router.get('/providers', (req, res) => {
  res.json({
    success: true,
    providers: AIEngine.getProviders()
  });
});

/**
 * Model Registry
 * GET /api/ai/models
 */
router.get('/models', (req, res) => {
  const models = AIEngine.getModels();
  res.json({
    success: true,
    count: models.length,
    presets: {
      'Epic Think Fast': {
        name: 'Epic Think Fast',
        tag: 'Ultra Fast',
        description: 'Sub-second inference for instant answers, fast drafting, and rapid iteration.',
        recommendedProvider: 'groq',
        recommendedModel: 'openai/gpt-oss-20b'
      },
      'Epic Think o1': {
        name: 'Epic Think o1',
        tag: 'Deep Think',
        description: 'Advanced chain-of-thought reasoning with multi-step validation and 8192-token output.',
        recommendedProvider: 'groq',
        recommendedModel: 'openai/gpt-oss-20b'
      },
      'Epic Think 4o': {
        name: 'Epic Think 4o',
        tag: 'Smartest',
        description: 'High-intelligence flagship 120B model for complex reasoning, analysis, and extensive coding.',
        recommendedProvider: 'groq',
        recommendedModel: 'openai/gpt-oss-120b'
      }
    },
    models
  });
});

/**
 * Health & Circuit Breaker Status
 * GET /api/ai/health
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    health: AIEngine.getHealth()
  });
});

/**
 * Generation Telemetry & Observability Diagnostics
 * GET /api/ai/diagnostics
 */
router.get('/diagnostics', optionalAuth, (req, res) => {
  res.json({
    success: true,
    summary: diagnosticsStore.getSummary(),
    recent: diagnosticsStore.getRecent(30)
  });
});

/**
 * AI Image Studio Generator Helper
 * POST /api/ai/image
 */
router.post('/image', requireAuth, async (req, res) => {
  const { prompt, style = 'photorealistic', aspectRatio = '1:1' } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt is required for image generation.' });
  }

  try {
    // Synthesize high-fidelity prompt expansion using Groq/OpenRouter
    const synthPrompt = `Act as an expert generative AI prompt engineer.
Create an ultra-detailed, cinematic visual prompt based on the user's concept: "${prompt}".
Style: ${style}. Aspect Ratio: ${aspectRatio}.
Respond with ONLY the optimized image generation prompt.`;

    const generated = await AIEngine.generate({
      prompt: synthPrompt,
      modelPreset: 'Epic Think Fast'
    });

    const enhanced = generated.content ? generated.content.trim() : prompt;

    // Determine dimensions based on aspect ratio
    let width = 1024;
    let height = 1024;
    if (aspectRatio === '16:9') { width = 1280; height = 720; }
    else if (aspectRatio === '9:16') { width = 720; height = 1280; }
    else if (aspectRatio === '4:3') { width = 1024; height = 768; }

    const cleanPrompt = `${prompt}, ${style} style, high resolution, highly detailed, masterwork`;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&nologo=true&enhance=true`;

    res.json({
      success: true,
      imageUrl,
      engine: `Epic Think AI Studio (${generated.providerUsed || 'Groq LPU'})`,
      originalPrompt: prompt,
      enhancedPrompt: enhanced,
      style,
      aspectRatio,
      providerUsed: generated.providerUsed,
      modelUsed: generated.modelUsed
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * AI Video Prompt & Storyboard Studio Helper
 * POST /api/ai/video
 */
router.post('/video', requireAuth, async (req, res) => {
  const { prompt, duration = '5s', durationSeconds, cameraMotion = 'cinematic dolly' } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt is required for video generation.' });
  }

  const durationSec = durationSeconds || parseInt(duration, 10) || 5;

  try {
    const videoPrompt = `You are a film director and AI video generator specialist.
Create a structured scene-by-scene storyboard JSON for the following concept: "${prompt}".
Target Duration: ${durationSec} seconds. Camera Motion Style: ${cameraMotion}.

Format your response strictly as valid JSON with NO commentary:
{
  "scenes": [
    {
      "scene": 1,
      "timeframe": "0s - 2s",
      "cameraMotion": "Wide establishing dolly-in",
      "description": "Short scene narrative description",
      "visualPrompt": "Detailed visual generator prompt for scene 1"
    }
  ]
}`;

    const generated = await AIEngine.generate({
      prompt: videoPrompt,
      modelPreset: 'Epic Think Fast'
    });

    let storyboard = [];
    try {
      const raw = generated.content || '';
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
          storyboard = parsed.scenes;
        }
      }
    } catch {
      // Fallback manual scene generation if model output was not strict JSON
    }

    if (storyboard.length === 0) {
      const sceneDur = Math.max(2, Math.round(durationSec / 3));
      storyboard = [
        {
          scene: 1,
          timeframe: `0s - ${sceneDur}s`,
          cameraMotion: cameraMotion || 'Wide Establishing Shot',
          description: `Opening hook: Visual introduction for "${prompt}"`,
          visualPrompt: `Cinematic wide shot, ${prompt}, atmospheric lighting, 4k ultra-detailed`
        },
        {
          scene: 2,
          timeframe: `${sceneDur}s - ${sceneDur * 2}s`,
          cameraMotion: 'Dynamic Tracking Pan',
          description: `Core action and focus development`,
          visualPrompt: `Dynamic tracking medium shot, intricate details of ${prompt}, cinematic depth of field`
        },
        {
          scene: 3,
          timeframe: `${sceneDur * 2}s - ${durationSec}s`,
          cameraMotion: 'Slow Motion Orbit Close-up',
          description: `Climactic resolution and lasting visual impact`,
          visualPrompt: `Dramatic slow-motion close-up, vivid colors, resolution for ${prompt}`
        }
      ];
    }

    res.json({
      success: true,
      storyboard,
      scenesCount: storyboard.length,
      originalPrompt: prompt,
      videoScript: generated.content?.trim(),
      cameraMotion,
      duration: `${durationSec}s`,
      providerUsed: generated.providerUsed,
      modelUsed: generated.modelUsed
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
