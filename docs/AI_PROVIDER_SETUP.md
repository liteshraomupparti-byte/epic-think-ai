# Epic Think AI - Multi-Provider Engine Setup Guide

This guide details how to configure, authenticate, and verify the Multi-Provider AI Engine powering **Epic Think AI**, spanning **Groq LPU**, **OpenRouter**, and **Google Gemini / Google AI Studio**.

---

## 1. Where to Obtain Provider API Keys

### A. Groq (Ultra-Fast LPU Inference)
1. Navigate to [Groq Console](https://console.groq.com/).
2. Create an account or sign in with GitHub/Google.
3. Go to **API Keys** and click **Create API Key**.
4. Copy your key (format: `gsk_...`).
5. **Purpose in Epic Think AI:** Powers `Epic Think Fast` (~120–200ms ultra-low latency inference, instant tool calling, and high-speed drafting).

### B. OpenRouter (Multi-Model Gateway)
1. Navigate to [OpenRouter](https://openrouter.ai/).
2. Sign in and visit **Settings -> Keys**.
3. Click **Create Key**, assigning appropriate credit limits.
4. Copy your key (format: `sk-or-v1-...`).
5. **Purpose in Epic Think AI:** Powers `Epic Think 4o` (`meta-llama/llama-3.3-70b-instruct`, DeepSeek, Qwen flagship models) and acts as an immediate fallback gateway.

### C. Google Gemini / Google AI Studio
1. Navigate to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** and generate a new key.
4. Copy your key (format: `AIzaSy...` or alphanumeric string).
5. **Purpose in Epic Think AI:** Native multimodal comprehension, vision analysis, expansive context window (up to 1M tokens), and multi-turn chain-of-thought analysis.

---

## 2. Server Configuration (`.env`)

Add the keys to your server `.env` file in the project root:

```env
# Multi-Provider AI Engine Configuration
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Default & Fallback Provider Routing
AI_DEFAULT_PROVIDER=groq
AI_DEFAULT_MODEL=qwen/qwen3.8-27b
AI_FALLBACK_PROVIDER=openrouter
AI_FALLBACK_MODEL=meta-llama/llama-3.3-70b-instruct

# Engine Controls
AI_MAX_RETRIES=2
AI_REQUEST_TIMEOUT_MS=25000
AI_MAX_TOOL_ITERATIONS=5
AI_ENABLE_STREAMING=true
AI_ENABLE_PARALLEL_TOOLS=true
AI_ENABLE_MULTI_PROVIDER=true
```

> **Security Note:** Never commit your `.env` file to version control. Keys must remain strictly on the backend. The frontend never receives provider secrets or raw credentials.

---

## 3. Starting the Server

Start the Epic Think AI backend with Node.js:

```bash
node server.js
```

### Resilient Startup
The engine is built with a **graceful degradation** pattern:
- If all three provider keys are configured, all three are registered and monitored.
- If only one or two keys are present (e.g., only `GROQ_API_KEY`), the server initializes cleanly without crashing. Only the missing providers will report `configured: false`.

---

## 4. Provider Readiness & Health Endpoints

### Readiness Status (No Auth Required)
```bash
curl http://localhost:3001/api/ai/providers
```
Response:
```json
{
  "success": true,
  "providers": {
    "groq": { "configured": true, "healthy": true, "name": "Groq LPU" },
    "openrouter": { "configured": true, "healthy": true, "name": "OpenRouter Gateway" },
    "gemini": { "configured": true, "healthy": true, "name": "Google Gemini" }
  },
  "defaultProvider": "groq",
  "fallbackProvider": "openrouter"
}
```

### Models Catalog with Presets
```bash
curl http://localhost:3001/api/ai/models
```

### Circuit Breaker & Latency Health
```bash
curl http://localhost:3001/api/ai/health
```

---

## 5. Automated Verification Tests

Epic Think AI includes comprehensive test suites to verify providers and end-to-end integration:

### A. Run 32-Test Component Suite
```bash
node test/test-multi-provider-ai.js
```
Validates:
- Model Registry & Preset Resolutions
- Health Monitor & Circuit Breaker trip/reset
- Context Manager PII and Secret Sanitization
- Real Groq, OpenRouter, and Gemini API calls
- Intelligent Model Router & Auto-fallback
- Agent Orchestrator & Parallel Tool Execution
- Cancellation handling

### B. Run Live End-to-End Test (with Firebase Auth)
```bash
node test/test-live-e2e.js
```
Validates:
- Authentic Firebase token verification
- `POST /api/ai/chat` (`Epic Think Fast` via Groq)
- `POST /api/ai/chat` (`Epic Think 4o` via OpenRouter/Gemini)
- `POST /api/ai/image` (AI Studio visual generator)
- `POST /api/ai/video` (AI Video storyboard package)
- 401 Unauthorized protection on unauthenticated requests
