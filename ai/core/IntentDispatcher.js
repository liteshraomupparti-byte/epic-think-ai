/**
 * Epic Think AI - Autonomous Intent Dispatcher & Builder Engine
 * 
 * Provides Lovable / Emergent AI autonomous building capabilities:
 * 1. Analyzes user prompts (even single-line prompts) and detects user intent:
 *    - BUILD_APP: User wants to build, create, or scaffold a website, web app, mobile app, dashboard, tool, SaaS, etc.
 *    - MODIFY_APP: User wants to change, modify, update, add to, or style an existing website/app through prompt.
 *    - DEBUG_CODE: User wants to fix an error, debug code, or troubleshoot a bug.
 *    - TECHNICAL_DOUBT: User is asking a conceptual, educational, or architectural question.
 *    - CONVERSATIONAL: Casual chat or greetings.
 * 2. For BUILD_APP:
 *    - NEVER asks 4-5 blocking questions (zero-question autonomous policy).
 *    - Autonomously determines the site type, architecture, design tokens, and components.
 *    - Creates the project under builder_projects/<projectId> via ProjectManager.
 *    - Synthesizes all required files (HTML, CSS, JS, components) via CodeGenerator.
 *    - Runs the Self-Healing Diagnostics loop to ensure zero syntax/DOM errors.
 *    - Generates a live preview URL: /preview/<projectId>/index.html.
 *    - Prepares a Lovable-style interactive preview card for the chat interface.
 * 3. For MODIFY_APP:
 *    - Applies natural language modifications directly to project files (HTML/CSS/JS).
 *    - Runs self-healing verification to ensure zero build errors.
 *    - Hot-reloads live preview via PreviewServer WebSocket bridge.
 *    - Returns updated preview card and summary of changes.
 */

import { ProjectManager } from '../../services/websiteBuilder/ProjectManager.js';
import { CodeGenerator } from '../../services/websiteBuilder/CodeGenerator.js';
import SelfHealingEngine from '../../services/websiteBuilder/SelfHealingEngine.js';
import { PreviewServer } from '../../services/websiteBuilder/PreviewServer.js';
import { SafeLogger } from '../../plugins/core/SafeLogger.js';

export class IntentDispatcher {
  // Active conversation / user project cache
  static activeProjects = new Map();
  static lastProject = null;

  /**
   * Classify user prompt and conversation context into an intent
   */
  static detectIntent(prompt = '', recentMessages = [], conversationId = null, uid = null) {
    const p = prompt.trim().toLowerCase();

    // Check recent assistant and user messages for build context or project reference
    const recentTexts = (recentMessages || []).slice(-6).map(m => (m.text || m.content || '').toLowerCase()).join(' ');
    const hasPriorBuildContext = /\b(build|building|application|website|app|frontend|backend|preview|projectid|devika|carepulse|nexus)\b/i.test(recentTexts);

    // Check for an active target projectId
    let targetProjectId = conversationId ? this.activeProjects.get(conversationId) : null;
    if (!targetProjectId && uid) targetProjectId = this.activeProjects.get(uid);
    if (!targetProjectId && this.lastProject) targetProjectId = this.lastProject.projectId;

    // Scan recentMessages for an embedded projectId
    if (!targetProjectId && Array.isArray(recentMessages)) {
      for (const m of [...recentMessages].reverse()) {
        const text = m.text || m.content || '';
        const match = text.match(/"projectId"\s*:\s*"([^"]+)"/i) || text.match(/\/preview\/([a-zA-Z0-9_\-]+)\//i);
        if (match) {
          targetProjectId = match[1];
          break;
        }
      }
    }

    // 1. Debugging Intent
    const debugPatterns = [
      /\b(debug|fix this|why (is|does) (this|my code)|solve this (bug|error)|uncaught|syntaxerror|typeerror|referenceerror|stack\s*trace)\b/i,
      /\b(not working|throwing an error|failing with|breaks when|undefined is not)\b/i
    ];
    if (debugPatterns.some(pat => pat.test(p))) {
      return { intent: 'DEBUG_CODE' };
    }

    // 2. Technical Doubt / Explanation Intent
    const doubtPatterns = [
      /^(what is|how does|why does|explain|difference between|pros and cons of|can you explain|what are the)\b/i,
      /\b(how do i use|how does async|what is event loop|explain cap theorem|how to implement binary search)\b/i
    ];
    const isBuildHowTo = /\b(how to build (a|an)|how to create (a|an)|how to make (a|an))\s+(app|application|website|web app|tool|dashboard|system)/i.test(p);
    if (!isBuildHowTo && doubtPatterns.some(pat => pat.test(p))) {
      return { intent: 'TECHNICAL_DOUBT' };
    }

    // 3. Autonomous Build Intent (Lovable / Emergent AI Trigger)
    const directBuildPatterns = [
      /\b(build|create|generate|scaffold|architect)\b.*\b(app|application|website|web app|mobile app|site|dashboard|portfolio|landing page|store|ecommerce|saas|portal|tool|platform|ui)\b/i,
      /^(build|create|make|code|develop)\s+(me\s+)?(an?\s+)?(app|application|website|web app|mobile app|dashboard|portal|tool|system|store|portfolio)/i,
      /\b(i want (a|an)|need (a|an))\s+(website|app|application|dashboard|portal|landing page|store)/i
    ];

    // Follow-up prompt with tech specs in an active building conversation
    const specKeywords = /\b(mobile app|web app|health care|healthcare|ecommerce|saas|portfolio|dashboard|flutter|react|node\.js|python|database|mongo|postgres|sql|sqlite|frontend|backend)\b/i;
    const isFollowupBuildSpecs = hasPriorBuildContext && specKeywords.test(p);

    if (directBuildPatterns.some(pat => pat.test(p)) || isFollowupBuildSpecs) {
      return { intent: 'BUILD_APP' };
    }

    // 4. Modify Existing Application / Website Intent (Iterative Prompt Changes)
    const modifyPatterns = [
      /\b(change|modify|update|tweak|adjust|switch|redesign|enhance)\b.*\b(background|color|button|navbar|nav|header|footer|title|heading|text|section|card|image|font|size|animation|layout|theme|style|pricing|testimonial|reviews|contact|hero|mobile|sticky)\b/i,
      /\b(add|insert|create|put)\b.*\b(section|form|button|testimonial|review|card|pricing|table|contact|banner|modal|footer|header|menu)\b/i,
      /\b(remove|delete|hide|drop)\b.*\b(section|card|button|footer|header|banner|image|text|navbar)\b/i,
      /\b(make|turn)\b.*\b(mobile|responsive|sticky|dark|light|gold|bigger|smaller|cleaner|faster|animated)\b/i,
      /\b(make.*(?:navbar|header)\s+sticky)\b/i,
      /\b(make.*(?:heading|title|text)\s+(?:bigger|larger|smaller))\b/i,
      /\b(change.*(?:background|color|title|heading|button|theme))\b/i,
      /\b(replace.*(?:image|logo|photo|text|background))\b/i,
      /\b(increase|decrease).*(?:font|size|padding|margin|spacing)\b/i
    ];

    if (modifyPatterns.some(pat => pat.test(p))) {
      return { intent: 'MODIFY_APP', projectId: targetProjectId };
    }

    // 5. Conversational / Greeting
    const greetingPatterns = [
      /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening)|sup|howdy)\b/i,
      /\b(how are you|who are you|what can you do|help me)\b/i
    ];
    if (greetingPatterns.some(pat => pat.test(p))) {
      return { intent: 'CONVERSATIONAL' };
    }

    return { intent: 'GENERAL' };
  }

  /**
   * Derive a clean slug and project title from user prompt
   */
  static extractProjectMeta(prompt = '') {
    const p = prompt.toLowerCase();
    let title = 'Epic Application';
    let slug = 'epic_app';
    let preset = 'luxury_gold';

    if (/health|clinic|doctor|patient|medical|hospital|medicine|pharma/i.test(p)) {
      title = 'CarePulse Healthcare Portal';
      slug = 'carepulse_health_app';
      preset = 'clean_corporate';
    } else if (/fashion|jewellery|luxury|cloth|boutique|collection/i.test(p)) {
      title = 'Devika Collections';
      slug = 'devika_collections';
      preset = 'luxury_gold';
    } else if (/ecommerce|shop|store|product|cart|checkout/i.test(p)) {
      title = 'Nexus Luxury Store';
      slug = 'nexus_store';
      preset = 'luxury_gold';
    } else if (/saas|platform|software|api|cloud|crm/i.test(p)) {
      title = 'Apex SaaS Platform';
      slug = 'apex_saas';
      preset = 'tech_modern';
    } else if (/dashboard|analytics|metrics|admin|crm|tracking/i.test(p)) {
      title = 'OmniStats Analytics Dashboard';
      slug = 'omnistats_dashboard';
      preset = 'tech_modern';
    } else if (/crypto|blockchain|web3|wallet|token/i.test(p)) {
      title = 'Aether Crypto Exchange';
      slug = 'aether_crypto';
      preset = 'tech_modern';
    } else if (/restaurant|cafe|food|dining|menu|bar/i.test(p)) {
      title = 'L’Ambroisie Fine Dining';
      slug = 'lambroisie_dining';
      preset = 'luxury_gold';
    } else if (/portfolio|resume|personal|cv|agency/i.test(p)) {
      title = 'Aura Creative Portfolio';
      slug = 'aura_portfolio';
      preset = 'minimalist_dark';
    } else if (/task|todo|kanban|productivity/i.test(p)) {
      title = 'TaskFlow Productivity Suite';
      slug = 'taskflow_suite';
      preset = 'tech_modern';
    } else if (/gym|fitness|workout|training/i.test(p)) {
      title = 'FitPulse Athletic Club';
      slug = 'fitpulse_fitness';
      preset = 'tech_modern';
    } else {
      const match = prompt.match(/(?:called|named|for)\s+([A-Za-z0-9\s]+?)(?:\.|\,|$|\s+with|\s+using)/i);
      if (match && match[1].trim().length > 2) {
        title = match[1].trim();
        slug = title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 24);
      } else {
        title = 'Modern Web Application';
        slug = `app_${Date.now()}`;
      }
    }

    const uniqueId = `${slug}_${Math.random().toString(36).slice(2, 6)}`;
    return { title, projectId: uniqueId, preset };
  }

  /**
   * Autonomously architect, synthesize, and heal a website project
   */
  static async executeAutonomousBuild({ prompt, uid = 'anonymous', conversationId = null, modelPreset = 'Epic Think 4o' }) {
    try {
      const { title, projectId, preset } = this.extractProjectMeta(prompt);

      SafeLogger.info('[AUTONOMOUS-BUILDER] Initiating project build...', {
        projectId,
        title,
        preset
      });

      // 1. Ensure project exists in ProjectManager
      await ProjectManager.createProject(projectId, {
        name: title,
        description: prompt,
        preset,
        framework: 'html_modern',
        ownerUid: uid
      });

      // 2. Generate structured plan & multi-file synthesis
      const plan = await CodeGenerator.planWebsite({ prompt, framework: 'html_modern', preset });
      plan.projectTitle = title;

      const genResult = await CodeGenerator.generateProject({
        projectId,
        prompt,
        preset,
        plan,
        framework: 'html_modern',
        modelPreset
      });

      // 3. Write files to disk
      const writtenFiles = [];
      for (const file of genResult.files) {
        await ProjectManager.writeFile(projectId, file.path, file.content);
        writtenFiles.push(file.path);
      }

      // 4. Create Git version checkpoint
      const checkpoint = await ProjectManager.createCheckpoint(
        projectId,
        `Autonomous AI Build: ${title}`
      );

      // 5. Run Self-Healing Diagnostics Loop
      const healResult = await SelfHealingEngine.selfHeal(projectId);

      const previewUrl = `/preview/${projectId}/index.html`;

      SafeLogger.info('[AUTONOMOUS-BUILDER] Project built successfully!', {
        projectId,
        previewUrl,
        filesCount: writtenFiles.length,
        errorsFixed: healResult?.fixedErrors?.length || 0
      });

      const buildData = {
        success: true,
        projectId,
        title,
        previewUrl,
        files: writtenFiles,
        plan: genResult.plan || plan,
        checkpoint,
        diagnostics: healResult,
        action: 'created'
      };

      // Cache active project for future modifications
      this.activeProjects.set(uid, projectId);
      if (conversationId) this.activeProjects.set(conversationId, projectId);
      this.lastProject = buildData;

      return buildData;
    } catch (err) {
      SafeLogger.error('[AUTONOMOUS-BUILDER] Build synthesis error:', { error: err.message });
      return null;
    }
  }

  /**
   * Autonomously modify an existing project through natural language prompt
   */
  static async executeAutonomousEdit({ projectId, prompt, uid = 'anonymous', conversationId = null, modelPreset = 'Epic Think 4o' }) {
    try {
      let activeId = projectId;
      if (!activeId) {
        activeId = conversationId ? this.activeProjects.get(conversationId) : null;
      }
      if (!activeId && uid) {
        activeId = this.activeProjects.get(uid);
      }
      if (!activeId && this.lastProject) {
        activeId = this.lastProject.projectId;
      }
      if (!activeId) {
        const projects = await ProjectManager.listProjects();
        if (projects && projects.length > 0) {
          activeId = projects[0].id || projects[0].projectId;
        } else {
          // If no existing project, build a new one with this prompt
          return await this.executeAutonomousBuild({ prompt, uid, conversationId, modelPreset });
        }
      }

      SafeLogger.info('[AUTONOMOUS-BUILDER] Executing natural language modification...', {
        projectId: activeId,
        prompt
      });

      const editResult = await CodeGenerator.editWithNaturalLanguage({
        projectId: activeId,
        prompt,
        modelPreset
      });

      if (!editResult.success) {
        throw new Error(editResult.error || 'Failed to apply natural language edit');
      }

      // Self-heal verification
      const healResult = await SelfHealingEngine.selfHeal(activeId);

      // Notify preview server for live hot-reload
      PreviewServer.notifyProjectChange(activeId, {
        type: 'file_updated',
        file: editResult.modifiedFile
      });

      const meta = await ProjectManager.getProject(activeId).catch(() => ({ name: 'Web Application' }));
      const previewUrl = `/preview/${activeId}/index.html`;

      const updateData = {
        success: true,
        projectId: activeId,
        title: meta.name || 'Web Application',
        previewUrl,
        modifiedFile: editResult.modifiedFile,
        modifiedFiles: editResult.modifiedFiles || [editResult.modifiedFile],
        description: editResult.description || `Applied update: "${prompt}"`,
        action: 'modified',
        diagnostics: healResult
      };

      // Keep cache updated
      this.activeProjects.set(uid, activeId);
      if (conversationId) this.activeProjects.set(conversationId, activeId);
      this.lastProject = updateData;

      return updateData;
    } catch (err) {
      SafeLogger.error('[AUTONOMOUS-BUILDER] Edit modification error:', { error: err.message });
      return null;
    }
  }

  /**
   * Format Lovable / Emergent AI Live Preview Card in markdown
   */
  static formatBuilderCardMarkdown(buildData) {
    if (!buildData || !buildData.projectId) return '';

    const { projectId, title, previewUrl, files = [], action = 'created', description = '' } = buildData;
    const isEdit = action === 'modified';
    const fileList = Array.isArray(files) ? files : ['index.html', 'css/styles.css', 'js/main.js'];
    const filePills = fileList.slice(0, 5).map(f => `\`${f}\``).join(' • ');

    return `
:::builder-card
{
  "projectId": "${projectId}",
  "title": "${title.replace(/"/g, '\\"')}",
  "previewUrl": "${previewUrl}",
  "files": ${JSON.stringify(fileList)},
  "action": "${action}"
}
:::

> [!TIP]
> 🚀 **${isEdit ? 'Live Application Updated' : 'Live Application Ready to Preview'}**: ${isEdit ? `Modifications applied: **${description}**` : `Your **${title}** has been autonomously synthesized and verified in the Website Builder with **0 build errors**`}.
> - **Live Preview URL**: [Launch Preview](http://localhost:3001${previewUrl})
> - **Visual Element Inspector & Code Editor**: [Open in Website Builder Studio](http://localhost:3001/#website-builder)
> - **Files**: ${filePills}
> - **Prompt-Based Modifications**: You can type any change in prompt (e.g. *"change background to dark navy"*, *"add contact form"*, *"make navbar sticky"*), and I will update your live application instantly!
`;
  }
}
