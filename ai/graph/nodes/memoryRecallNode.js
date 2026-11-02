/**
 * Epic Think AI - LangGraph Memory & Intelligence Gathering Node
 * 
 * Recalls long-term facts from Hindsight semantic memory, fetches the user's
 * personalization profile, and performs proactive real-time search / SEO auditing.
 */

import { recallMemory } from '../../../services/hindsightService.js';
import { getUserProfile } from '../../../services/mongoService.js';
import { WebSearchClient } from '../../../plugins/providers/web-search/WebSearchClient.js';
import { SeoAuditEngine } from '../../../services/websiteBuilder/SeoAuditEngine.js';
import { ProjectManager } from '../../../services/websiteBuilder/ProjectManager.js';
import { SafeLogger } from '../../../plugins/core/SafeLogger.js';

export async function memoryRecallNode(state, config = {}) {
  const { userPrompt, uid, intent, location } = state;
  const emit = config.configurable?.emit || (() => {});

  emit('graph:node:start', { node: 'memoryRecall' });

  const bankId = `epic-think-user-${uid}`;
  let recalledMemories = [];
  let recalledPromptContext = '';
  let userProfile = null;

  // 1. Recall Hindsight Semantic Memory
  try {
    const memoryRecall = await recallMemory(bankId, userPrompt, { maxTokens: 2048 });
    recalledMemories = memoryRecall.results || [];
    recalledPromptContext = memoryRecall.promptContext || '';
    if (recalledMemories.length > 0) {
      emit('graph:thinking', { thought: `Recalled ${recalledMemories.length} personalized facts from Hindsight memory bank.` });
    }
  } catch (err) {
    SafeLogger.warn('Graph: Hindsight memory recall failed gracefully', { uid: SafeLogger.hashUid(uid), error: err.message });
  }

  // 2. Fetch User Profile
  try {
    if (uid && uid !== 'guest_user') {
      userProfile = await getUserProfile(uid);
    }
  } catch (err) {
    SafeLogger.warn('Graph: Failed to fetch user profile', { uid, error: err.message });
  }

  // 3. Proactive Intelligence Gathering (Live Web Search / Maps / SEO)
  let webSearchContext = '';
  let mapCardBlock = '';

  if (intent?.needsSeoAudit) {
    emit('graph:thinking', { thought: 'LangGraph: Running technical SEO audit analysis...' });
    try {
      const urlMatch = userPrompt.match(/https?:\/\/[^\s]+|[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
      let seoReport = null;
      if (urlMatch) {
        seoReport = await SeoAuditEngine.auditUrl(urlMatch[0]);
      } else {
        const projects = await ProjectManager.listProjects().catch(() => []);
        if (projects.length > 0) {
          seoReport = await SeoAuditEngine.auditProject(projects[0].id);
        }
      }
      if (seoReport && seoReport.success) {
        mapCardBlock += `:::seo-audit\n${JSON.stringify(seoReport)}\n:::\n\n`;
        webSearchContext += `\n\n[VERIFIED TECHNICAL SEO ENGINE AUDIT RESULTS]:\nScore: ${seoReport.score}/100 (${seoReport.grade})\nTotal Checks: ${seoReport.totalChecks} (Passed: ${seoReport.passedCount}, Issues: ${seoReport.issuesCount})\nPassed Checks: ${seoReport.passed.map(p => p.check).join(', ')}\nIssues: ${seoReport.issues.map(i => `[${i.severity.toUpperCase()}] ${i.message} -> Fix: ${i.recommendation}`).join('\n')}`;
      }
    } catch (err) {
      SafeLogger.warn('Graph: SEO audit failed gracefully', { error: err.message });
    }
  }

  if (intent?.needsWebSearch) {
    const searchEngine = process.env.SERPAPI_API_KEY ? 'Google (SerpAPI)' : 'DuckDuckGo';
    emit('graph:thinking', { thought: `LangGraph: Conducting real-time web search via ${searchEngine}...` });
    try {
      const searchRes = await WebSearchClient.search({ query: userPrompt, location, maxResults: 6 });
      if (searchRes) {
        if (Array.isArray(searchRes.places) && searchRes.places.length > 0) {
          const placesData = {
            title: `${userPrompt.replace(/\b(?:near me|nearby|around here|closest|in my area)\b/gi, '').trim() || 'Places'} Near You`,
            location: searchRes.location || 'Local Area',
            count: searchRes.places.length,
            center: {
              lat: searchRes.places[0].lat || 17.3850,
              lng: searchRes.places[0].lng || 78.4867,
              label: searchRes.location || 'Local Area'
            },
            places: searchRes.places.slice(0, 8)
          };
          mapCardBlock += `:::places-result\n${JSON.stringify(placesData)}\n:::\n\n`;
          webSearchContext += `[LOCAL MAPS INTELLIGENCE (${searchRes.location || ''})]:\n` +
            searchRes.places.map((p, i) => `${i + 1}. ${p.title} (${p.category || 'Place'}) - Rating: ${p.rating} | Address: ${p.address}`).join('\n');
        } else if (Array.isArray(searchRes.results) && searchRes.results.length > 0) {
          const formatted = searchRes.results.map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}`).join('\n\n');
          webSearchContext += `[LIVE WEB SEARCH INTELLIGENCE]:\n${formatted}`;
        }
      }
    } catch (err) {
      SafeLogger.warn('Graph: Web search failed gracefully', { error: err.message });
    }
  }

  emit('graph:node:end', { node: 'memoryRecall', memoriesCount: recalledMemories.length });

  return {
    recalledMemories,
    recalledPromptContext,
    userProfile,
    webSearchContext,
    mapCardBlock
  };
}
