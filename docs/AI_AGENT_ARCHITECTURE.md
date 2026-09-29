# Epic Think AI - Agent Architecture & Multi-Tool Orchestration

This document describes the internal architecture of the Epic Think AI Agent, detailing how the multi-turn agent loop, Hindsight memory, multi-provider routing, and tool execution operate together in production.

---

## 1. System Overview Architecture

```
User Prompt (Client / Web Interface)
                 │
                 ▼
     Firebase Authentication
        (Bearer ID Token)
                 │
                 ▼
        Context Manager
  ┌───────────────────────────────┐
  │ • Redact Passwords & Secrets  │
  │ • Enforce Token/Context Window│
  │ • Selective Hindsight Recall │
  └──────────────┬────────────────┘
                 ▼
        AI Model Router
  ┌───────────────────────────────┐
  │ • Task Classification         │
  │ • Circuit Breaker Check       │
  │ • Latency & Cost Optimization │
  └──────────────┬────────────────┘
                 ├──► Groq LPU (Fastest ~120-200ms)
                 ├──► OpenRouter (Flagship reasoning)
                 └──► Google Gemini (Multimodal / Long context)
                 │
                 ▼
       Agent Orchestrator Loop
  ┌──────────────────────────────────────────────────────────────┐
  │ 1. Dispatch prompt with normalized tool declarations          │
  │ 2. Inspect response for tool call requests                   │
  │ 3. Parallel Execution for independent READ operations         │
  │ 4. Sequential Confirmation Check for WRITE operations         │
  │ 5. Execute tools (GitHub, Notion, Drive, Gmail, Search, etc.) │
  │ 6. Sanitize tool results (prevent prompt injection/leaks)     │
  │ 7. Return tool outputs to model context                       │
  │ 8. Continue loop until final answer (max iterations bounded)  │
  └──────────────────────────────┬───────────────────────────────┘
                                 ▼
                    Hindsight Long-Term Memory
                     (Retain conversation insight)
                                 │
                                 ▼
                     Real-Time Streaming / WS
                  (Client receives normalized events)
```

---

## 2. Agent Orchestrator Loop

The agent loop in [ai/core/AgentOrchestrator.js](file:///d:/Ai%20Agent%20HPS/ai/core/AgentOrchestrator.js) provides strict execution guarantees:

1. **Max Iteration Limit:** Default `AI_MAX_TOOL_ITERATIONS=5`. Eliminates the possibility of infinite model loops.
2. **Duplicate Detection:** Fingerprints tool arguments to identify and abort repetitive tool calls.
3. **Cancellation Token:** Listens to client abort signals. If the user presses Cancel or closes the window, all active provider requests and tool executions terminate immediately.
4. **Error Recovery:** If a tool call fails, the error is normalized and fed back into model context so the model can rectify parameters or select an alternative tool.

---

## 3. Parallel Tool Execution

When an AI model requests multiple tool executions in a single turn:

### Independent READ Operations (Concurrent)
- E.g., `github_search_repositories` + `notion_search_pages` + `google_drive_search`
- These tools have no mutual side effects or dependencies.
- The Orchestrator groups them and executes via `Promise.allSettled()`, dramatically cutting response latency from sequential $O(N)$ down to $O(1)$.

### Sensitive & WRITE Operations (Sequential & Controlled)
- E.g., `gmail_send_message`, `github_create_pull_request`, file deletion
- Handled by `PermissionManager` and `ConfirmationManager`.
- If user confirmation is required, the loop halts, issues an authorization ticket to the frontend, and resumes only after explicit user approval.

---

## 4. Hindsight Long-Term Memory Integration

Epic Think AI integrates with Hindsight (`https://api.hindsight.vectorize.io`):

1. **Selective Recall:** Before querying the LLM, relevant memories are recalled for the specific user's bank (`epic-think-user-<uid>`).
2. **Relevance Filtering:** Low-scoring or irrelevant memories are discarded to prevent bloating context.
3. **Retention:** Upon generating a final response, key facts and preferences are retained asynchronously without delaying the user response stream.
4. **Privacy & Redaction:** Sensitive credentials (`gsk_`, `sk-`, `AQ.`, passwords) are stripped by `ContextManager` before reaching memory storage.

---

## 5. Streaming Protocol Events

The system unifies streaming over HTTP Chunked Transfer and WebSockets. Regardless of provider, the client receives standardized events:

| Event | Payload | Purpose |
|---|---|---|
| `ai:start` | `{ requestId, model, provider }` | Stream initialization |
| `ai:delta` | `{ text }` | Incremental token stream |
| `ai:tool_call` | `{ name, args, callId }` | Model requesting a tool call |
| `ai:tool_result` | `{ callId, result, success }` | Tool execution finished |
| `ai:complete` | `{ content, usage, latency, provider }` | Generation finalized |
| `ai:error` | `{ error, code, isRetryable }` | Safe human-readable error |

---

## 6. Multi-Tenant UID Isolation

Every user operation is validated through Firebase Authentication:
- Tokens are verified via Firebase Admin SDK.
- Decoded `uid` is passed down to all services.
- Tool credentials, OAuth tokens, Hindsight memory banks, and MongoDB chat histories are namespaced strictly to the authenticated `uid`. Cross-user data leakage is structurally impossible.
