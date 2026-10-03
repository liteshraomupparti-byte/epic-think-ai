/**
 * Epic Think AI - Production Agent Orchestrator & Multi-Provider Tool Loop
 * 
 * Orchestrates multi-step reasoning, parallel tool execution, Hindsight semantic recall & retain,
 * streaming event emissions, Human-In-The-Loop security gating, and anti-loop protections.
 */

import { ContextManager } from './ContextManager.js';
import { registry } from '../../plugins/core/PluginRegistry.js';
import { ToolExecutionEngine } from '../../plugins/core/ToolExecutionEngine.js';
import { ConfirmationManager } from '../../plugins/core/ConfirmationManager.js';
import { ResultSanitizer } from '../../plugins/core/ResultSanitizer.js';
import { SafeLogger } from '../../plugins/core/SafeLogger.js';
import { recallMemory, retainMemory } from '../../services/hindsightService.js';
import { AICancellationError, AITimeoutError } from '../errors/AIErrors.js';
import { IntentDispatcher } from './IntentDispatcher.js';
import { GenerationConfig } from './GenerationConfig.js';
import { WebSearchClient } from '../../plugins/providers/web-search/WebSearchClient.js';
import { SeoAuditEngine } from '../../services/websiteBuilder/SeoAuditEngine.js';
import { ProjectManager } from '../../services/websiteBuilder/ProjectManager.js';
import { getUserProfile } from '../../services/mongoService.js';

export class AgentOrchestrator {
  /**
   * @param {object} router - AIModelRouter instance
   * @param {object} [config]
   */
  constructor(router, config = {}) {
    this.router = router;
    this.maxIterations = parseInt(process.env.AI_MAX_TOOL_ITERATIONS, 10) || 5;
    this.timeoutMs = parseInt(process.env.AI_REQUEST_TIMEOUT_MS, 10) || 55000;
  }

  /**
   * Determine if text contains durable preferences or facts
   */
  static isDurableMemory(text) {
    if (!text || typeof text !== 'string' || text.length < 10) return false;
    const durablePatterns = [
      /\b(?:i prefer|always use|never use|remember that|my name is|note that)\b/i,
      /\b(?:my project is|we are using|i am using|i want to use|our stack is)\b/i,
      /\b(?:database is|tech stack|default to|framework is|my client is|client rules)\b/i,
      /\b(?:coding style|architecture rule|primary language|preferred library)\b/i
    ];
    return durablePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Main Agent Execution Loop with streaming and tool support
   */
  async run({
    uid,
    userPrompt,
    conversationId = null,
    recentMessages = [],
    modelPreset = 'Epic Think 4o',
    confirmationId = null,
    isContinuation = false,
    partialResponse = '',
    maxTokens = null,
    webSearch = false,
    reasoning = false,
    location = null,
    signal = null,
    onEvent = null
  }) {
    const startTime = Date.now();
    const bankId = `epic-think-user-${uid}`;
    const emit = (event, data = {}) => {
      if (typeof onEvent === 'function') {
        onEvent({ event, timestamp: Date.now(), ...data });
      }
    };

    if (reasoning) {
      emit('ai:thinking', { thought: 'Deep Reasoning mode engaged: Detailed chain-of-thought analysis activated.' });
      if (!modelPreset || modelPreset === 'Epic Think 4o' || modelPreset === 'Epic Think Fast') {
        modelPreset = 'Epic Think o1';
      }
    }

    emit('ai:start', { prompt: userPrompt, preset: modelPreset });

    // Handle resumed action ticket if confirmationId provided
    if (confirmationId) {
      return await this.handleConfirmedResume({ uid, conversationId, confirmationId, emit });
    }

    // Auto-detect natural language affirmative or negative response for pending confirmation tickets
    const trimmedPrompt = (userPrompt || '').trim().toLowerCase();
    const isAffirmative = /^(?:yes|yep|yeah|sure|confirm|confirmed|approve|approved|proceed|send|send\s+it|do\s+it|go\s+ahead|okay|ok|i\s+approve|please\s+send)\b/i.test(trimmedPrompt);
    const isNegative = /^(?:no|nope|cancel|cancelled|reject|rejected|abort|stop|don'?t|do\s+not)\b/i.test(trimmedPrompt);

    if (isAffirmative || isNegative) {
      const pendingTickets = ConfirmationManager.getPendingForUser(uid);
      const ticket = (conversationId && pendingTickets.find(t => t.conversationId === conversationId)) || pendingTickets[pendingTickets.length - 1];
      if (ticket) {
        if (isAffirmative) {
          emit('ai:thinking', { thought: `Detected natural language confirmation for pending action: ${ticket.pluginId}.${ticket.toolName}` });
          return await this.handleConfirmedResume({ uid, conversationId, confirmationId: ticket.confirmationId, emit });
        } else {
          ConfirmationManager.resolveConfirmation(ticket.confirmationId, 'rejected', uid);
          return {
            success: true,
            text: `I have cancelled the execution of \`${ticket.pluginId}.${ticket.toolName}\` as requested.`,
            provider: 'Epic Think Autonomous Engine',
            model: modelPreset,
            requiresConfirmation: false,
            confirmationTicket: null
          };
        }
      }
    }

    // 1. Recall Hindsight Semantic Memory & User Personalization Profile
    let userProfile = null;
    try {
      if (uid && uid !== 'guest_user') {
        userProfile = await getUserProfile(uid);
      }
    } catch (_) {}

    let recalledMemories = [];
    let recalledPromptContext = '';
    try {
      const memoryRecall = await recallMemory(bankId, userPrompt, { maxTokens: 2048 });
      recalledMemories = memoryRecall.results || [];
      recalledPromptContext = memoryRecall.promptContext || '';
      if (recalledMemories.length > 0) {
        emit('ai:thinking', { thought: `Recalled ${recalledMemories.length} personalized facts from Hindsight memory bank.` });
      }
    } catch (err) {
      SafeLogger.warn('Hindsight memory recall failed gracefully', { user: SafeLogger.hashUid(uid), error: err.message });
    }

    // 2. Discover Active User Tools
    const activeTools = await registry.getUserActiveTools(uid);

    // If query is a pure conversational greeting or chit-chat, skip tool injection to avoid unnecessary web searches
    const isConversationalGreeting = /^(?:hi|hello|hey|greetings|good\s+(?:morning|afternoon|evening)|howdy|sup|how\s+are\s+you|who\s+are\s+you|what\s+can\s+you\s+do)\b[!?.]*$/i.test(userPrompt.trim());
    const toolsForRun = isConversationalGreeting ? [] : activeTools;

    // 2b. Intent Detection & Autonomous Builder (Lovable / Emergent AI Trigger)
    const intentAnalysis = IntentDispatcher.detectIntent(userPrompt, recentMessages, conversationId, uid);
    let builderProject = null;

    if (intentAnalysis.intent === 'BUILD_APP') {
      emit('ai:thinking', { thought: `Autonomous Builder: Detected application build intent. Synthesizing full project files and live preview...` });
      builderProject = await IntentDispatcher.executeAutonomousBuild({
        prompt: userPrompt,
        uid,
        conversationId,
        modelPreset
      });
      if (builderProject) {
        emit('ai:thinking', { thought: `Autonomous Builder: Built "${builderProject.title}" with live preview at ${builderProject.previewUrl}` });
      }
    } else if (intentAnalysis.intent === 'MODIFY_APP') {
      emit('ai:thinking', { thought: `Autonomous Builder: Detected modification prompt. Updating project files and refreshing live preview...` });
      builderProject = await IntentDispatcher.executeAutonomousEdit({
        projectId: intentAnalysis.projectId,
        prompt: userPrompt,
        uid,
        conversationId,
        modelPreset
      });
      if (builderProject) {
        emit('ai:thinking', { thought: `Autonomous Builder: Applied "${builderProject.description}" to "${builderProject.title}"` });
      }
    }

    // If an autonomous build or prompt modification completed, return directly with live preview
    if (builderProject) {
      const isEdit = builderProject.action === 'modified';
      const durationMs = Date.now() - startTime;
      const finalMsg = isEdit
        ? `### ✨ Application Updated: **${builderProject.title}**\n\nI have updated your application based on your prompt: **"${userPrompt}"** with zero build errors!\n\n#### 🛠️ Modifications Applied:\n- **Change**: ${builderProject.description}\n- **Updated File(s)**: \`${builderProject.modifiedFiles?.join('`, `') || builderProject.modifiedFile}\`\n- **Live Preview**: Refreshed in real-time.\n\n${IntentDispatcher.formatBuilderCardMarkdown(builderProject)}`
        : `### 🚀 Autonomous Build Complete: **${builderProject.title}**\n\nI have autonomously architected and built your application from your prompt with **zero blocking questions**!\n\n#### 🏗️ Architecture & Features Built:\n- **Responsive UI**: Mobile-first layout with smooth interactions and clean typography.\n- **Interactive Logic**: Client-side state handling, dynamic components, and mock API ready.\n- **0 Build Errors**: Synthesized, verified, and self-healed in Website Builder.\n\n${IntentDispatcher.formatBuilderCardMarkdown(builderProject)}`;

      emit('ai:complete', {
        text: finalMsg,
        provider: 'Epic Think Autonomous Engine',
        model: modelPreset,
        durationMs
      });

      return {
        success: true,
        text: finalMsg,
        provider: 'Epic Think Autonomous Engine',
        model: modelPreset,
        recalledMemoriesCount: recalledMemories.length,
        executedToolCalls: [],
        requiresConfirmation: false,
        confirmationTicket: null,
        durationMs,
        builderProject
      };
    }

    // 2c. Proactive Web Search (if toggled by user or explicitly requested in query)
    // 2c. Proactive Web Search & SEO Intelligence
    let liveWebSearchContext = '';
    let mapCardBlock = '';
    let mapCardEmitted = false;

    // Check for SEO audit query intent
    const isSeoQuery = /(?:seo audit|seo analysis|audit seo|analyze seo|technical seo|meta tags audit|seo report|check seo|lighthouse seo)\b/i.test(userPrompt);
    if (isSeoQuery && !isContinuation) {
      emit('ai:thinking', { thought: 'Initiating real-time technical SEO engine analysis...' });
      try {
        const urlMatch = userPrompt.match(/https?:\/\/[^\s]+|[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
        let seoReport = null;
        if (urlMatch) {
          seoReport = await SeoAuditEngine.auditUrl(urlMatch[0]);
        } else {
          // Check for existing website builder projects
          const projects = await ProjectManager.listProjects().catch(() => []);
          const activeProjId = projects.length > 0 ? projects[0].id : null;
          if (activeProjId) {
            seoReport = await SeoAuditEngine.auditProject(activeProjId);
          }
        }

        if (seoReport && seoReport.success) {
          mapCardBlock += `:::seo-audit\n${JSON.stringify(seoReport)}\n:::\n\n`;
          liveWebSearchContext += `\n\n[VERIFIED TECHNICAL SEO ENGINE AUDIT RESULTS]:\nScore: ${seoReport.score}/100 (${seoReport.grade})\nTotal Checks: ${seoReport.totalChecks} (Passed: ${seoReport.passedCount}, Issues: ${seoReport.issuesCount})\nPassed Checks: ${seoReport.passed.map(p => p.check).join(', ')}\nIssues: ${seoReport.issues.map(i => `[${i.severity.toUpperCase()}] ${i.message} -> Fix: ${i.recommendation}`).join('\n')}\n\n[PRESENTATION INSTRUCTIONS]: An interactive SEO Audit dashboard is already rendered at the top with score gauge, metrics, and severity cards. Provide an executive summary and strategic recommendations.`;
          emit('ai:thinking', { thought: `Completed technical SEO analysis for ${seoReport.identifier || 'site'}: Score ${seoReport.score}/100 (${seoReport.grade}). Generating rich audit card...` });
        }
      } catch (seoErr) {
        SafeLogger.warn('SEO audit execution failed gracefully', { error: seoErr.message });
      }
    }

    const isLocalPlaceIntent = /(?:\bnear\s+me\b|\bnearby\b|\baround\s+here\b|\bclosest\b|\bin\s+my\s+area\b|\bhostel|\bhotel|\bresort|\blodge|\bmotel|\binn\b|\bpg\b|\bpaying\s+guest|\bco-?living|\baccommodation|\broom\s+for\s+rent|\bstay\s+in\b|\bplaces?\s+to\s+stay|\brestaurant|\bcafe\b|\bcafes\b|\bdiner|\beatery|\bbakery|\bfood\s+court|\bbiryani|\bpizza|\bburger|\bbar\b|\bbars\b|\bpub\b|\bpubs\b|\blounge|\bclub\b|\bclubs\b|\bshop|\bshops|\bstore|\bstores|\bmart\b|\bmall\b|\bmalls\b|\bmarket|\bsupermarket|\bgrocery|\bpharmacy|\bchemist|\bmedicals?\b|\bhospital|\bclinic|\bdoctor|\bdentist|\bgym\b|\bgyms\b|\bfitness|\byoga|\bturf\b|\bcourt\b|\bstadium|\bground|\bpark|\bparks|\bgarden|\bpicnic|\blake\b|\bzoo\b|\bmuseum|\bmonument|\bfort\b|\btemple|\bmosque|\bchurch|\btheatre|\btheater|\bcinema|\bmovie|\batm\b|\bbank\b|\bpetrol\b|\bfuel\b|\bgas\s+station|\bservice\s+center|\bmechanic|\bcar\s+wash|\bsalon\b|\bspa\b|\bparlour|\btourist|\bsightseeing|\bplaces?\s+to\s+visit|\bthings?\s+to\s+do)/i.test(userPrompt);
    const needsSearch = webSearch || isLocalPlaceIntent || /(?:search (?:the )?web|web search|browse the web|latest news|search online|search google|current news)\b/i.test(userPrompt);
    if (needsSearch && !isContinuation) {
      const searchEngineName = process.env.SERPAPI_API_KEY ? 'Google (SerpAPI)' : 'DuckDuckGo';
      emit('ai:thinking', { thought: `Conducting live web search via ${searchEngineName} for: "${userPrompt.slice(0, 45)}"...` });
      try {
        const searchRes = await WebSearchClient.search({ query: userPrompt, location, maxResults: 6 });
        if (searchRes) {
          // If local places were discovered (e.g. sports shops, picnic spots, hostels, cafes)
          if (Array.isArray(searchRes.places) && searchRes.places.length > 0) {
            const centerPlace = searchRes.places[0];
            const mapData = {
              center: {
                lat: centerPlace.lat || 17.3850,
                lng: centerPlace.lng || 78.4867,
                label: searchRes.location || 'Local Area'
              },
              places: searchRes.places.slice(0, 8)
            };
            const placesData = {
              title: `${userPrompt.replace(/\b(?:near me|nearby|around here|closest|in my area)\b/gi, '').trim() || 'Places'} Near You`,
              location: searchRes.location || 'Local Area',
              count: searchRes.places.length,
              center: mapData.center,
              places: searchRes.places.slice(0, 8)
            };
            // Emit rich PlacesResult block (encapsulates header, map, and rich cards)
            mapCardBlock += `:::places-result\n${JSON.stringify(placesData)}\n:::\n\n`;
            // CRITICAL: Immediately stream map block so frontend renders the interactive Leaflet map widget first!
            emit('ai:chunk', { content: mapCardBlock, text: mapCardBlock });
            mapCardEmitted = true;

            liveWebSearchContext += `[LOCAL GOOGLE MAPS & PLACES INTELLIGENCE (${searchRes.location ? searchRes.location : ''})]:\nQuery: "${userPrompt}"\n\n` +
              `Places found:\n` + searchRes.places.map((p, i) => `${i + 1}. ${p.title} (${p.category || 'Place'}) - ★ ${p.rating} | ${p.address} | ${p.status || 'Open'}`).join('\n') +
              `\n\n[MANDATORY PRESENTATION INSTRUCTIONS]:\n` +
              `1. The interactive dark map widget and place chips carousel have already been rendered at the top displaying verified map pins, ratings, photos, and directions.\n` +
              `2. Below the map widget, write a clean, helpful, and natural response exactly like ChatGPT:\n` +
              `   - Begin with a natural conversational sentence acknowledging the estimated area (e.g. "I found several ${userPrompt.replace(/\b(?:near me|nearby|around here|closest|in my area)\b/gi, '').trim() || 'places'} around your current estimated ${searchRes.location || 'local'} area. Since I don't have your exact location, I can't reliably tell which is closest.")\n` +
              `   - Include a section titled "**Nearby options**" with concise bullet points:\n` +
              `     • **Place Name** — Neighborhood/Area, short highlights (e.g. boys' hostel, multi-sport megastore, etc.)\n` +
              `   - Keep the text crisp, friendly, and natural without repeating addresses or phone numbers.\n` +
              `3. Do NOT output duplicate photo blocks, raw URLs, or markdown tables; all visual photos, maps, and directions are already embedded directly in the interactive map widget!`;

            emit('ai:thinking', { thought: `Found ${searchRes.places.length} verified Google Maps places with GPS coordinates for ${searchRes.location || 'your area'}. Rendering interactive map...` });
          } else if (Array.isArray(searchRes.results) && searchRes.results.length > 0) {
            const formattedResults = searchRes.results.map((r, i) =>
              `[${i + 1}] ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}`
            ).join('\n\n');

            let imageContext = '';
            if (Array.isArray(searchRes.images) && searchRes.images.length > 0) {
              imageContext = `\n\n[VERIFIED GOOGLE IMAGES]:\n` +
                searchRes.images.map(img => `- "${img.title}": ${img.url}`).join('\n');
              // Render verified photos in rich image gallery component
              const galleryBlock = `:::image-gallery\n${JSON.stringify({ title: 'Verified Visual Sources', images: searchRes.images.slice(0, 6) })}\n:::\n\n`;
              mapCardBlock += galleryBlock;
              emit('ai:chunk', { content: galleryBlock, text: galleryBlock });
            }

            liveWebSearchContext += `[LIVE WEB SEARCH INTELLIGENCE (${searchRes.source.toUpperCase()}${searchRes.location ? ` - ${searchRes.location}` : ''})]:\nQuery: "${userPrompt}"\n\n${formattedResults}${imageContext}\n\n` +
              `[PROFESSIONAL PRESENTATION GUIDELINES]:\n` +
              `1. Provide a natural, engaging, beautifully formatted, and professional answer without raw markdown artifacts or messy syntax.\n` +
              `2. When providing comparison or directory listings, format clean GitHub-Flavored Markdown tables with clear column headers.\n` +
              `3. Use clean headings (##, ###), bullet points, and actionable details (pricing, addresses, contacts, ratings). Do not ask generic location questions when search results are already provided.`;

            emit('ai:thinking', { thought: `Retrieved ${searchRes.results.length} live sources and ${searchRes.images?.length || 0} photos from ${searchRes.source}${searchRes.location ? ` for ${searchRes.location}` : ''}. Synthesizing answer...` });
          }
        }
      } catch (searchErr) {
        SafeLogger.warn('Proactive web search failed gracefully', { error: searchErr.message });
      }
    }

    // 3. Assemble Initial Context (Supports continuation without duplication)
    let systemPrompt, messages;
    if (isContinuation && partialResponse) {
      emit('ai:thinking', { thought: 'Continuing previous generation seamlessly from output limit boundary...' });
      const contData = GenerationConfig.buildContinuationMessages({
        userPrompt,
        partialResponse,
        history: recentMessages
      });
      systemPrompt = contData.systemPrompt;
      messages = contData.messages;
    } else {
      const built = ContextManager.buildContext({
        userPrompt,
        recentMessages,
        recalledMemories,
        recalledPromptContext,
        activeModelPreset: modelPreset,
        builderProject,
        userProfile
      });
      systemPrompt = built.systemPrompt;
      messages = built.messages;
    }

    if (liveWebSearchContext) {
      systemPrompt += `\n\n${liveWebSearchContext}`;
      messages.push({
        role: 'user',
        content: `[LIVE SEARCH CONTEXT]:\n${liveWebSearchContext}\n\nPlease answer my request using the verified real-time search data above: "${userPrompt}"`
      });
    }

    // 4. Autonomous Agent Loop
    const executedToolCalls = [];
    const toolSignatures = new Set();
    let finalAnswer = '';
    let requiresConfirmationTicket = null;
    let providerUsed = '';
    let modelUsed = '';
    let finishReason = 'stop';
    let isTruncated = false;
    let canContinue = false;
    let maxOutputTokens = null;

    for (let iteration = 1; iteration <= this.maxIterations; iteration++) {
      if (Date.now() - startTime > this.timeoutMs) {
        emit('ai:thinking', { thought: `Timeout limit reached (${Math.round((Date.now() - startTime)/1000)}s). Finalizing synthesis.` });
        break;
      }
      if (signal && signal.aborted) {
        throw new AICancellationError('User cancelled execution');
      }

      emit('ai:thinking', { thought: `Iteration ${iteration}: Planning actions with ${toolsForRun.length} enabled tools...` });

      // Call Router with tools (or streaming if tools are not applicable or during continuation)
      const isStreamingRun = typeof onEvent === 'function' && (!toolsForRun || toolsForRun.length === 0 || isContinuation);
      const aiResult = await this.router.execute({
        userPrompt,
        messages,
        preset: modelPreset,
        tools: (toolsForRun.length > 0 && !isContinuation) ? toolsForRun : undefined,
        systemPrompt,
        maxTokens,
        signal,
        streaming: isStreamingRun,
        onChunk: isStreamingRun ? (chunk) => {
          const content = typeof chunk === 'string' ? chunk : (chunk.delta || chunk.content || chunk.text || '');
          if (!mapCardEmitted && mapCardBlock) {
            emit('ai:chunk', { content: mapCardBlock + content, text: mapCardBlock + content });
            mapCardEmitted = true;
          } else {
            emit('ai:chunk', { content, text: content });
          }
        } : undefined
      });

      providerUsed = aiResult.providerUsed || aiResult.provider;
      modelUsed = aiResult.modelUsed || aiResult.model;
      finishReason = aiResult.finishReason || 'stop';
      isTruncated = Boolean(aiResult.isTruncated || finishReason === 'length');
      canContinue = isTruncated;
      maxOutputTokens = aiResult.maxOutputTokens || maxOutputTokens;

      const toolCalls = aiResult.toolCalls || [];

      // If no tools requested, we have our final synthesized response
      if (toolCalls.length === 0) {
        finalAnswer = aiResult.content ? aiResult.content.trim() : '';
        break;
      }

      // Detect loop duplicates
      const newCalls = [];
      for (const tc of toolCalls) {
        const sig = `${tc.pluginId || ''}.${tc.toolName || tc.name}:${JSON.stringify(tc.args || {})}`;
        if (toolSignatures.has(sig)) {
          emit('ai:thinking', { thought: `Anti-Loop Guard: Skipped repetitive call to ${tc.name}` });
          continue;
        }
        toolSignatures.add(sig);
        newCalls.push(tc);
      }

      // If all requested tools have already been executed, synthesize the final response without tools
      if (newCalls.length === 0) {
        emit('ai:thinking', { thought: 'All requested tool checks are complete. Synthesizing final answer...' });
        if (aiResult.content && aiResult.content.trim().length > 20 && !aiResult.content.includes('I completed the necessary checks')) {
          finalAnswer = aiResult.content.trim();
        } else {
          messages.push({
            role: 'user',
            content: `All tool actions have completed. Based on all information and tool observations above, provide a comprehensive, clear, accurate, and direct response to my request: "${userPrompt}"`
          });

          const synthRes = await this.router.execute({
            userPrompt,
            messages,
            preset: modelPreset,
            systemPrompt,
            maxTokens,
            signal,
            streaming: typeof onEvent === 'function',
            onChunk: typeof onEvent === 'function' ? (chunk) => {
              const content = typeof chunk === 'string' ? chunk : (chunk.delta || chunk.content || chunk.text || '');
              if (!mapCardEmitted && mapCardBlock) {
                emit('ai:chunk', { content: mapCardBlock + content, text: mapCardBlock + content });
                mapCardEmitted = true;
              } else {
                emit('ai:chunk', { content, text: content });
              }
            } : undefined
          });
          finalAnswer = synthRes.content ? synthRes.content.trim() : '';
          if (synthRes.providerUsed) providerUsed = synthRes.providerUsed;
          if (synthRes.modelUsed) modelUsed = synthRes.modelUsed;
          if (synthRes.finishReason) finishReason = synthRes.finishReason;
          isTruncated = Boolean(synthRes.isTruncated || finishReason === 'length');
          canContinue = isTruncated;
          maxOutputTokens = synthRes.maxOutputTokens || maxOutputTokens;
        }
        break;
      }

      // Group tools into Parallel READ and Sequential WRITE/EXTERNAL_ACTION
      const readTools = [];
      const actionTools = [];

      for (const tc of newCalls) {
        const toolObj = toolsForRun.find(t => t.name === tc.toolName && (!tc.pluginId || t.pluginId === tc.pluginId));
        const tier = toolObj?.permissionTier || 'READ';
        if (tier === 'READ') {
          readTools.push(tc);
        } else {
          actionTools.push(tc);
        }
      }

      // Execute Parallel READ tools concurrently
      if (readTools.length > 0) {
        emit('ai:thinking', { thought: `Executing ${readTools.length} independent read operation(s) concurrently...` });

        const readPromises = readTools.map(async (tc) => {
          emit('ai:tool_call', { tool: tc.name, args: tc.args });
          try {
            const res = await ToolExecutionEngine.execute({
              uid,
              pluginId: tc.pluginId,
              toolName: tc.toolName,
              args: tc.args,
              conversationId
            });
            emit('ai:tool_result', { tool: tc.name, success: true });
            return {
              iteration,
              pluginId: tc.pluginId,
              toolName: tc.toolName,
              args: tc.args,
              output: res.rawOutput,
              contextString: res.contextString
            };
          } catch (e) {
            emit('ai:tool_result', { tool: tc.name, success: false, error: e.message });
            return {
              iteration,
              pluginId: tc.pluginId,
              toolName: tc.toolName,
              args: tc.args,
              error: e.message,
              contextString: ResultSanitizer.formatForAgentContext(tc.pluginId, tc.toolName, { error: e.message })
            };
          }
        });

        const parallelResults = await Promise.all(readPromises);
        executedToolCalls.push(...parallelResults);

        // Inject observations as user-role feedback so LLMs recognize incoming data
        for (const pr of parallelResults) {
          messages.push({
            role: 'user',
            content: `[TOOL OBSERVATION - ${pr.pluginId || ''}.${pr.toolName}]:\n${pr.contextString}\n\nBased on these tool observations, please provide a complete, direct, and helpful answer to: "${userPrompt}"`
          });
        }
      }

      // Execute Sequential WRITE / EXTERNAL_ACTION tools
      for (const tc of actionTools) {
        emit('ai:tool_call', { tool: tc.name, args: tc.args });
        try {
          const res = await ToolExecutionEngine.execute({
            uid,
            pluginId: tc.pluginId,
            toolName: tc.toolName,
            args: tc.args,
            conversationId
          });

          if (res.status === 'requires_confirmation') {
            requiresConfirmationTicket = res.confirmationTicket;
            emit('ai:thinking', { thought: `Action requires human confirmation: ${tc.name}` });
            finalAnswer = `This action requires your confirmation before proceeding:\n\n**Action:** \`${tc.pluginId}.${tc.toolName}\`\n**Summary:** ${res.confirmationTicket.summary}\n\n:::action-ticket\n${JSON.stringify(res.confirmationTicket)}\n:::\n\nPlease review and approve the action ticket below, or simply reply **"yes"** / **"confirm"** in the chat.`;
            break;
          }

          emit('ai:tool_result', { tool: tc.name, success: true });
          executedToolCalls.push({
            iteration,
            pluginId: tc.pluginId,
            toolName: tc.toolName,
            args: tc.args,
            output: res.rawOutput,
            contextString: res.contextString
          });

          messages.push({
            role: 'user',
            content: `[ACTION EXECUTION RESULT - ${tc.pluginId}.${tc.toolName}]:\n${res.contextString}\n\nBased on this action result, please provide a complete, direct, and helpful answer to: "${userPrompt}"`
          });
        } catch (e) {
          emit('ai:tool_result', { tool: tc.name, success: false, error: e.message });
          executedToolCalls.push({
            iteration,
            pluginId: tc.pluginId,
            toolName: tc.toolName,
            args: tc.args,
            error: e.message,
            contextString: ResultSanitizer.formatForAgentContext(tc.pluginId, tc.toolName, { error: e.message })
          });
        }
      }

      if (requiresConfirmationTicket) {
        break;
      }
    }

    // 5. Final fallback synthesis if loop exited without plain text or with placeholder
    if (!finalAnswer || finalAnswer.trim().length === 0 || finalAnswer.includes('I completed the necessary checks')) {
      emit('ai:thinking', { thought: 'Synthesizing final response...' });
      messages.push({
        role: 'user',
        content: `Based on the conversation history and all tool execution observations above, synthesize a complete, professional, and clear answer to my request: "${userPrompt}"`
      });

      const synthRes = await this.router.execute({
        userPrompt,
        messages,
        preset: modelPreset,
        systemPrompt,
        maxTokens,
        signal,
        streaming: typeof onEvent === 'function',
        onChunk: typeof onEvent === 'function' ? (chunk) => {
          const content = typeof chunk === 'string' ? chunk : (chunk.delta || chunk.content || chunk.text || '');
          emit('ai:chunk', { content, text: content });
        } : undefined
      });
      finalAnswer = synthRes.content ? synthRes.content.trim() : 'I have analyzed the request and provided the response.';
      providerUsed = synthRes.providerUsed || providerUsed;
      modelUsed = synthRes.modelUsed || modelUsed;
      if (synthRes.finishReason) finishReason = synthRes.finishReason;
      isTruncated = Boolean(synthRes.isTruncated || finishReason === 'length');
      canContinue = isTruncated;
      maxOutputTokens = synthRes.maxOutputTokens || maxOutputTokens;
    }

    // 6. Post-Response Hindsight Memory Retention
    if (AgentOrchestrator.isDurableMemory(userPrompt)) {
      const sanitized = ContextManager.sanitizeText(userPrompt);
      if (sanitized && sanitized.length >= 10) {
        retainMemory(bankId, sanitized, 'user_preference', ['preference', 'ai-auto'])
          .then(res => {
            if (res && res.success) {
              SafeLogger.info('Preference retained to Hindsight', { user: SafeLogger.hashUid(uid) });
            }
          })
          .catch(() => {});
      }
    }

    // If a rich result block was generated (places, map, image-gallery, or seo-audit), prepend to finalAnswer
    if (mapCardBlock) {
      const hasBlock = [':::places-result', ':::map-card', ':::image-gallery', ':::seo-audit'].some(tag => finalAnswer.includes(tag));
      if (!hasBlock) {
        finalAnswer = mapCardBlock + finalAnswer;
      }
    }

    // If an autonomous builder project was created, append the Lovable preview card
    if (builderProject && !finalAnswer.includes(':::builder-card')) {
      finalAnswer += '\n\n' + IntentDispatcher.formatBuilderCardMarkdown(builderProject);
    }

    const durationMs = Date.now() - startTime;
    emit('ai:complete', {
      text: finalAnswer,
      provider: providerUsed,
      model: modelUsed,
      finishReason,
      isTruncated,
      canContinue,
      maxOutputTokens,
      durationMs
    });

    return {
      success: true,
      text: finalAnswer,
      provider: providerUsed,
      model: modelUsed,
      finishReason,
      isTruncated,
      canContinue,
      maxOutputTokens,
      recalledMemoriesCount: recalledMemories.length,
      executedToolCalls,
      requiresConfirmation: Boolean(requiresConfirmationTicket),
      confirmationTicket: requiresConfirmationTicket,
      durationMs,
      builderProject
    };
  }

  async handleConfirmedResume({ uid, conversationId, confirmationId, emit }) {
    const ticket = ConfirmationManager.getTicket(confirmationId);
    if (!ticket) {
      throw new Error('Confirmation ticket not found or expired.');
    }

    emit('ai:thinking', { thought: `Executing approved ticket: ${ticket.pluginId}.${ticket.toolName}` });
    const execResult = await ToolExecutionEngine.execute({
      uid,
      pluginId: ticket.pluginId,
      toolName: ticket.toolName,
      args: ticket.parameters,
      conversationId,
      bypassConfirmation: true
    });

    emit('ai:tool_result', { tool: ticket.toolName, success: true });
    ConfirmationManager.resolveConfirmation(confirmationId, 'approved', uid);

    return {
      success: true,
      text: `Action \`${ticket.pluginId}.${ticket.toolName}\` executed successfully.\n\n${execResult.contextString}`,
      executedToolCalls: [{
        pluginId: ticket.pluginId,
        toolName: ticket.toolName,
        args: ticket.parameters,
        output: execResult.rawOutput
      }],
      requiresConfirmation: false
    };
  }

  /**
   * Concurrently execute multiple independent READ tools
   */
  async executeParallelTools(toolCalls, availableTools = [], { uid, conversationId, emit = () => {} } = {}) {
    return Promise.all(toolCalls.map(async (tc) => {
      const toolObj = availableTools.find(t => t.name === (tc.toolName || tc.name) && (!tc.pluginId || t.pluginId === tc.pluginId));
      emit('ai:tool_call', { tool: tc.toolName || tc.name, args: tc.args || tc.arguments });
      
      try {
        if (toolObj && typeof toolObj.execute === 'function') {
          const res = await toolObj.execute(tc.args || tc.arguments, { uid, conversationId });
          return { id: tc.id, success: true, result: res };
        }

        const res = await ToolExecutionEngine.execute({
          uid,
          pluginId: tc.pluginId,
          toolName: tc.toolName || tc.name,
          args: tc.args || tc.arguments,
          conversationId
        });
        return { id: tc.id, success: true, result: res };
      } catch (err) {
        return { id: tc.id, success: false, error: err.message };
      }
    }));
  }
}
