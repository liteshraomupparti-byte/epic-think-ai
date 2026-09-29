# Epic Think AI — Production Plugin System Implementation Plan

## 1. Current Architecture Summary
- **Runtime & Language**: Node.js v22 (ES Modules), Express 4.x on port 3001.
- **Frontend**: Vanilla ES Modules and CSS3 in `index.html` and `Epic Think AI.html`.
- **Authentication**: Firebase Authentication (Google, Email/Password), verified on the server via `firebaseAuthService.js` (Firebase Admin SDK + Google Identity Toolkit fallback).
- **Core Memory**: Hindsight Cloud API (`@vectorize-io/hindsight-client`), multi-tenant isolation with bank ID `epic-think-user-<uid>`.
- **Persistence**: MongoDB (`mongodb` v7 native driver) storing conversations with resilient local fallback store (`.mongo_resilient_store.json`).
- **Real-Time Sync**: WebSockets (`ws` v8) on `/ws` broadcasting state changes across active sessions per Firebase UID.
- **Existing Test Suites**:
  - `npm run test:memory` (`test/test-hindsight-integration.js`) -> 100% passing
  - `npm run test:mongo` (`test/test-mongo-realtime.js`) -> 19/19 passing (100%)
  - `test/test-full-stack.js` -> 100% passing

## 2. Target Architecture (Approved v2.0)
- **Decoupled Core Memory**: Hindsight remains a core memory service (`services/hindsightService.js`), fully independent of plugin install/enable states.
- **Plugin System Core (`plugins/core/`)**:
  - `BasePlugin.js`: Declarative manifest, validation, lifecycle, and tool definition contract.
  - `PluginRegistry.js`: Global plugin discovery, manifest verification, and tenant-scoped plugin state.
  - `TokenVault.js`: Hardware-grade AES-256-GCM encryption with `PLUGIN_ENCRYPTION_KEY`, opaque `CredentialHandle`, and auto-refresh.
  - `PermissionManager.js`: 4-tier risk classification (`READ`, `WRITE`, `EXTERNAL_ACTION`, `DESTRUCTIVE`).
  - `ResultSanitizer.js`: Anti-prompt-injection boundary framing (`<untrusted_tool_output>`), script neutralization, and data sanitization.
  - `ConfirmationManager.js`: Human-in-the-loop action gateway with short-lived, single-use, cryptographically signed action tickets.
  - `AgentPlanner.js`: Multi-step goal decomposition, tool selection, 5-iteration loop cap, loop detection, and timeout guard.
  - `SafeLogger.js`: PII and credential-scrubbed structured audit logger.
- **OAuth Infrastructure (`plugins/oauth-adapters/`)**:
  - `OAuthManager.js`: Central router with HMAC-signed CSRF state, PKCE validation, and provider adapters (`GoogleOAuthAdapter`, `GitHubOAuthAdapter`, `NotionOAuthAdapter`, `BotTokenAdapter`).
- **Modular Providers (`plugins/providers/`)**:
  - Implemented in priority order: GitHub -> Gmail -> Google Calendar -> Google Drive -> Notion -> Web Search -> Telegram -> Discord -> WhatsApp.
- **Database Collections (MongoDB)**:
  - `conversations` (existing)
  - `user_plugin_settings` (new: lifecycle states per UID)
  - `user_plugin_credentials` (new: AES-256-GCM encrypted blobs per UID)
  - `user_action_confirmations` (new: short-lived action tickets)
- **Frontend Enhancements**:
  - Plugin Store Modal in `index.html` & `Epic Think AI.html`.
  - Active Tools Indicator in Composer.
  - Action Confirmation Modal Gate.

## 3. Files to Be Created
- `plugins/core/BasePlugin.js`
- `plugins/core/PluginRegistry.js`
- `plugins/core/TokenVault.js`
- `plugins/core/PermissionManager.js`
- `plugins/core/ResultSanitizer.js`
- `plugins/core/ConfirmationManager.js`
- `plugins/core/AgentPlanner.js`
- `plugins/core/ToolExecutionEngine.js`
- `plugins/core/SafeLogger.js`
- `plugins/core/OAuthManager.js`
- `plugins/oauth-adapters/BaseOAuthAdapter.js`
- `plugins/oauth-adapters/GitHubOAuthAdapter.js`
- `plugins/oauth-adapters/GoogleOAuthAdapter.js`
- `plugins/oauth-adapters/NotionOAuthAdapter.js`
- `plugins/oauth-adapters/BotTokenAdapter.js`
- `plugins/providers/github/*` (index.js, manifest.json, tools.js, client.js)
- `plugins/providers/gmail/*`
- `plugins/providers/google-calendar/*`
- `plugins/providers/google-drive/*`
- `plugins/providers/notion/*`
- `plugins/providers/web-search/*`
- `plugins/providers/telegram/*`
- `plugins/providers/discord/*`
- `plugins/providers/whatsapp/*`
- `plugins/index.js`
- `routes/pluginRoutes.js`
- `routes/agentRoutes.js`
- `test/test-phase1-primitives.js`
- `test/test-phase2-planner.js`
- `test/test-phase3-oauth.js`
- `test/test-phase4-github.js`
- `test/test-phase5-google.js`
- `test/test-phase6-notion-websearch.js`
- `test/test-phase7-messaging.js`
- `test/test-security-audit.js`

## 4. Files to Be Modified
- `.env` & `.env.example`: Add `PLUGIN_ENCRYPTION_KEY` and provider client ID/secrets.
- `server.js`: Mount plugin routes (`/api/plugins`), agent routes (`/api/agent`), initialize plugin registry and token vault.
- `services/realtimeSync.js`: Add confirmation request and status broadcast types.
- `services/hindsightService.js`: Add pre-retention privacy filter for sensitive secrets.
- `package.json`: Add required provider SDK dependencies (`@octokit/rest`, `googleapis`, `@notionhq/client`, etc.).
- `index.html` & `Epic Think AI.html`: Add Plugin Store modal, confirmation modal, active tool chips (keeping both files 100% byte-for-byte identical).

## 5. Risk Assessment & Mitigation
| Risk | Severity | Mitigation Strategy |
|---|---|---|
| Existing Chat / WebSocket breakage | Critical | All existing routes and WebSocket handlers remain untouched. Plugin routes mount as dedicated sub-routers. |
| Credential Exposure | Critical | AES-256-GCM encryption with `PLUGIN_ENCRYPTION_KEY`. Use `CredentialHandle` closures; raw tokens never enter LLM or context objects. |
| Indirect Prompt Injection | High | `ResultSanitizer` neutralizes markdown/HTML exploits and wraps external data in `<untrusted_tool_output>` boundaries. |
| Autonomous Infinite Loops | High | `AgentPlanner` enforces hard cap of 5 tool iterations and terminates on duplicate tool/argument calls. |
| Unauthorized Action Execution | High | `ConfirmationManager` enforces explicit user confirmation via WebSockets/UI for `EXTERNAL_ACTION` and `DESTRUCTIVE` tools. |
| Single Point of Failure | Medium | Graceful degradation: if a plugin throws or is offline, other plugins and core chat proceed normally. If Hindsight is offline, chat proceeds without memory. |

## 6. Migration & Verification Strategy
1. **Incremental Execution**: Implement phase-by-phase. Run dedicated test suites after each phase before advancing.
2. **Regression Testing**: Continuously run `npm run test:memory` and `npm run test:mongo` to guarantee zero regressions.
3. **Synchronization Check**: Run `fc.exe "index.html" "Epic Think AI.html"` after any UI modification to ensure absolute file parity.
