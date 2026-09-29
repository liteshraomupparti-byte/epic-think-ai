# Epic Think AI - Intelligent Model Routing & Benchmarks

This document details the routing logic, preset models, live benchmark measurements, and automatic fallback mechanisms in the **Epic Think AI** Multi-Provider AI Engine.

---

## 1. Model Presets in Epic Think AI

Epic Think AI organizes multi-provider capabilities into three intuitive user-facing presets:

| Preset Name | Badge Tag | Description | Primary Engine | Fallback Engine |
|---|---|---|---|---|
| **Epic Think Fast** | `Ultra Fast` | Lightweight and instant for everyday tasks, quick drafting, and real-time tool loops. | **Groq LPU** (`qwen/qwen3.8-27b`) | **OpenRouter** (`meta-llama/llama-3.3-70b-instruct`) |
| **Epic Think o1** | `Deep Think` | Advanced chain-of-thought reasoning with multi-step validation and deep analysis. | **Groq LPU** (`openai/gpt-oss-20b`) | **OpenRouter** (`meta-llama/llama-3.3-70b-instruct`) |
| **Epic Think 4o** | `Smartest` | High-intelligence flagship model for complex reasoning, multi-language coding, and synthesis. | **OpenRouter** (`meta-llama/llama-3.3-70b-instruct`) | **Google Gemini** (`gemini-3.7-flash`) |

---

## 2. Live Measured Latency Benchmarks

Tested with live credentials under production network conditions:

| Provider | Model Identifier | Live Latency (First Token / Ping) | Throughput / Strengths |
|---|---|---|---|
| **Groq LPU** | `qwen/qwen3.8-27b` | **119ms – 205ms** ⚡ | **Fastest in class**. Instant responsiveness for conversational chat, fast drafting, and rapid multi-turn tool calling loops. |
| **Groq LPU** | `openai/gpt-oss-20b` | **260ms – 450ms** | High-speed structured chain-of-thought reasoning without stalling user workflows. |
| **OpenRouter** | `meta-llama/llama-3.3-70b-instruct` | **860ms – 1,770ms** | Flagship-tier instruction following, code generation, and complex analysis. |
| **Google Gemini** | `gemini-3.7-flash` / `gemini-2.5-flash` | **2,300ms – 3,500ms** | Massive context window (1M+ tokens), multimodal image/video understanding, comprehensive reasoning. |

---

## 3. Task Classification & Auto-Routing

When `modelPreset: 'auto'` is requested (or unspecified), `AIModelRouter` inspects the request and classifies it into one of the following task categories:

- `FAST_RESPONSE` / `CHAT`: Routed to **Groq LPU** (`qwen/qwen3.8-27b`) for sub-second delivery.
- `CODE_GENERATION` / `CODE_DEBUGGING`: Routed to **OpenRouter** (`meta-llama/llama-3.3-70b-instruct`) or **Groq** (`qwen/qwen3.8-27b`).
- `REASONING` / `RESEARCH`: Routed to **Groq o1** (`openai/gpt-oss-20b`) or **Gemini Flash**.
- `IMAGE_UNDERSTANDING` / `LONG_CONTEXT`: Routed to **Google Gemini** (`gemini-2.5-flash`).
- `TOOL_EXECUTION`: Routed to **Groq LPU** for low-latency tool loop execution with fallback to OpenRouter.

---

## 4. Fallback Chain & Circuit Breaker

The system implements a production-grade resilience pipeline:

```
Primary Provider Request
          │
    (Fails with 429 / 502 / 503 / 504 / Timeout)
          ▼
Retry with Exponential Backoff + Jitter (Max 2 retries)
          │
    (Still failing)
          ▼
Fallback Provider Dispatch (e.g., Groq ──► OpenRouter ──► Gemini)
          │
    (Still failing)
          ▼
Graceful Degraded Error (Safe, sanitized message to user)
```

### Circuit Breaker States
Each provider has an isolated Circuit Breaker tracked by [HealthMonitor.js](file:///d:/Ai%20Agent%20HPS/ai/core/HealthMonitor.js):

1. **CLOSED (Normal):** All requests route through the provider. Failure count is 0.
2. **OPEN (Tripped):** After 3 consecutive network/timeout/rate-limit failures, the circuit trips to `OPEN`. Traffic is automatically diverted to the fallback provider without making futile outgoing network calls.
3. **HALF_OPEN (Probe):** After a 30-second cooldown, a single probe request is permitted. If successful, the circuit resets to `CLOSED`. If it fails, the cooldown resets.
