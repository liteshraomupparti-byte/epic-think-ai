/**
 * Epic Think AI - LangGraph Intent Classifier Node
 * 
 * Classifies query intent, evaluates task complexity, discovers active tools,
 * and sets up search/builder/browser-use routing flags.
 */

import { IntentDispatcher } from '../../core/IntentDispatcher.js';
import { registry } from '../../../plugins/core/PluginRegistry.js';
import { SafeLogger } from '../../../plugins/core/SafeLogger.js';

export async function intentClassifierNode(state, config = {}) {
  const { userPrompt, uid, conversationId, messages } = state;
  const emit = config.configurable?.emit || (() => {});

  emit('graph:node:start', { node: 'intentClassifier', prompt: userPrompt });

  const trimmed = (userPrompt || '').trim();

  // 1. Detect pure greetings
  const isGreeting = /^(?:hi|hello|hey|greetings|good\s+(?:morning|afternoon|evening)|howdy|sup|how\s+are\s+you|who\s+are\s+you|what\s+can\s+you\s+do)\b[!?.]*$/i.test(trimmed);

  // 2. Discover active user tools
  let activeTools = [];
  try {
    if (!isGreeting) {
      activeTools = await registry.getUserActiveTools(uid);
    }
  } catch (err) {
    SafeLogger.warn('Failed to discover active tools for user', { uid, error: err.message });
  }

  // 3. Detect autonomous website builder intent
  const builderIntent = IntentDispatcher.detectIntent(userPrompt, messages, conversationId, uid);
  const needsBuilder = builderIntent.intent === 'BUILD_APP' || builderIntent.intent === 'MODIFY_APP';

  // 4. Detect web search / local place intent
  const isLocalPlaceIntent = /(?:\bnear\s+me\b|\bnearby\b|\baround\s+here\b|\bclosest\b|\bin\s+my\s+area\b|\bhostel|\bhotel|\bresort|\blodge|\bmotel|\binn\b|\bpg\b|\bpaying\s+guest|\bco-?living|\baccommodation|\broom\s+for\s+rent|\bstay\s+in\b|\bplaces?\s+to\s+stay|\brestaurant|\bcafe\b|\bcafes\b|\bdiner|\beatery|\bbakery|\bfood\s+court|\bbiryani|\bpizza|\bburger|\bbar\b|\bbars\b|\bpub\b|\bpubs\b|\blounge|\bclub\b|\bclubs\b|\bshop|\bshops|\bstore|\bstores|\bmart\b|\bmall\b|\bmalls\b|\bmarket|\bsupermarket|\bgrocery|\bpharmacy|\bchemist|\bmedicals?\b|\bhospital|\bclinic|\bdoctor|\bdentist|\bgym\b|\bgyms\b|\bfitness|\byoga|\bturf\b|\bcourt\b|\bstadium|\bground|\bpark|\bparks|\bgarden|\bpicnic|\blake\b|\bzoo\b|\bmuseum|\bmonument|\bfort\b|\btemple|\bmosque|\bchurch|\btheatre|\btheater|\bcinema|\bmovie|\batm\b|\bbank\b|\bpetrol\b|\bfuel\b|\bgas\s+station|\bservice\s+center|\bmechanic|\bcar\s+wash|\bsalon\b|\bspa\b|\bparlour|\btourist|\bsightseeing|\bplaces?\s+to\s+visit|\bthings?\s+to\s+do)/i.test(userPrompt);
  const needsWebSearch = isLocalPlaceIntent || /(?:search (?:the )?web|web search|browse the web|latest news|search online|search google|current news)\b/i.test(userPrompt);
  const needsSeoAudit = /(?:seo audit|seo analysis|audit seo|analyze seo|technical seo|meta tags audit|seo report|check seo|lighthouse seo)\b/i.test(userPrompt);

  // 5. Detect autonomous browser agent / Browser Use intent
  const needsBrowserUse = /(?:open (?:the )?browser|use browser|browser automation|browser-use|browse to|navigate to|click on|fill (?:the )?form|automate (?:the )?web|scrape with browser|stealth browser)\b/i.test(userPrompt);

  // 6. Evaluate complexity
  let complexity = 'LOW';
  if (needsBuilder || needsBrowserUse || (activeTools.length > 0 && /(?:create|delete|update|send|fetch|query|analyze|debug|deploy|build)\b/i.test(userPrompt))) {
    complexity = 'HIGH';
  } else if (needsWebSearch || needsSeoAudit || userPrompt.length > 120 || /\b(?:compare|step by step|detailed|analyze|explain why)\b/i.test(userPrompt)) {
    complexity = 'MEDIUM';
  }

  const intent = {
    type: needsBuilder ? 'BUILDER' : (needsBrowserUse ? 'BROWSER_AUTOMATION' : (isGreeting ? 'GREETING' : (needsWebSearch ? 'RESEARCH' : (activeTools.length > 0 ? 'TOOL_EXECUTION' : 'CHAT')))),
    complexity,
    isGreeting,
    needsBuilder,
    builderIntent,
    needsWebSearch,
    isLocalPlaceIntent,
    needsSeoAudit,
    needsBrowserUse
  };

  emit('graph:node:end', { node: 'intentClassifier', intent });

  return {
    intent,
    tools: activeTools
  };
}
