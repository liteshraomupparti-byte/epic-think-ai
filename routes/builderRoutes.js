/**
 * Epic Think AI - Website Builder API Routes
 * 
 * Exposes endpoints for:
 * - Project management (CRUD, file tree, atomic reads/writes)
 * - AI Plan & Generation pipeline
 * - Visual element context & natural language editing
 * - Real Git version control (Undo, Redo, Checkpoints, Diff, History)
 * - Self-healing diagnostics & automated repair loops
 * - Preview server integration & reload triggers
 * - Deployment abstractions
 */

import express from 'express';
import { ProjectManager } from '../services/websiteBuilder/ProjectManager.js';
import { CodeGenerator } from '../services/websiteBuilder/CodeGenerator.js';
import { DesignSystemEngine, THEME_PRESETS } from '../services/websiteBuilder/DesignSystemEngine.js';
import { PreviewServer } from '../services/websiteBuilder/PreviewServer.js';
import SelfHealingEngine from '../services/websiteBuilder/SelfHealingEngine.js';
import { ImageGenerationService } from '../services/websiteBuilder/ImageGenerationService.js';
import { VideoGenerationService } from '../services/websiteBuilder/VideoGenerationService.js';
import { ResponsiveAuditEngine } from '../services/websiteBuilder/ResponsiveAuditEngine.js';
import { SeoAuditEngine } from '../services/websiteBuilder/SeoAuditEngine.js';
import { MultiPageManager } from '../services/websiteBuilder/MultiPageManager.js';
import { modelRegistry } from '../ai/index.js';
import { retainMemory, recallMemory } from '../services/hindsightService.js';
import { requireAuth } from '../services/firebaseAuthService.js';

const router = express.Router();

// Helper to make requireAuth optional in local dev mode if needed, or pass-through
const optionalAuth = (req, res, next) => {
    // If authorization header present, verify it; otherwise allow local fallback for seamless experience
    if (req.headers.authorization) {
        return requireAuth(req, res, next);
    }
    // Set default local user context
    req.user = { uid: 'local_dev_user', email: 'dev@epicthink.ai' };
    next();
};

/**
 * List all theme presets
 * GET /api/builder/presets
 */
router.get('/presets', (req, res) => {
    res.json({
        success: true,
        presets: THEME_PRESETS
    });
});

/**
 * List all website projects
 * GET /api/builder/projects
 */
router.get('/projects', optionalAuth, async (req, res) => {
    try {
        const projects = await ProjectManager.listProjects();
        res.json({
            success: true,
            projects
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Create a new website project
 * POST /api/builder/projects
 */
router.post('/projects', optionalAuth, async (req, res) => {
    try {
        const { id, name, description, preset = 'luxury_gold', framework = 'html_modern' } = req.body || {};
        const projectId = id || `project_${Date.now()}`;
        const meta = await ProjectManager.createProject(projectId, {
            name: name || 'Untitled Website',
            description: description || 'Created with Epic Think AI Website Builder',
            preset,
            framework,
            ownerUid: req.user?.uid
        });

        res.json({
            success: true,
            project: meta,
            previewUrl: `/preview/${projectId}/index.html`
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Get project details and file tree
 * GET /api/builder/projects/:id
 */
router.get('/projects/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const meta = await ProjectManager.getProject(id);
        const files = await ProjectManager.listFiles(id);
        const history = await ProjectManager.getHistory(id, 10);

        res.json({
            success: true,
            project: meta,
            files,
            history,
            previewUrl: `/preview/${id}/index.html`
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Delete a project
 * DELETE /api/builder/projects/:id
 */
router.delete('/projects/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await ProjectManager.deleteProject(id);
        res.json({ success: true, message: `Project ${id} deleted successfully` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Get file tree or specific file content
 * GET /api/builder/projects/:id/files?path=index.html
 */
router.get('/projects/:id/files', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = req.query.path;

        if (filePath) {
            const content = await ProjectManager.readFile(id, filePath);
            return res.json({
                success: true,
                path: filePath,
                content
            });
        }

        const files = await ProjectManager.listFiles(id);
        res.json({
            success: true,
            files
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Update a specific file
 * PUT /api/builder/projects/:id/files
 */
router.put('/projects/:id/files', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { path: filePath, content, commitMessage } = req.body || {};

        if (!filePath || content === undefined) {
            return res.status(400).json({ success: false, error: 'path and content are required' });
        }

        await ProjectManager.writeFile(id, filePath, content);
        const checkpoint = await ProjectManager.createCheckpoint(
            id,
            commitMessage || `Manual edit: ${filePath}`
        );

        PreviewServer.notifyProjectChange(id, { type: 'file_updated', file: filePath });

        res.json({
            success: true,
            path: filePath,
            checkpoint
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Generate implementation plan from user prompt
 * POST /api/builder/projects/:id/plan
 */
router.post('/projects/:id/plan', optionalAuth, async (req, res) => {
    try {
        const { prompt, framework, preset } = req.body || {};
        if (!prompt) {
            return res.status(400).json({ success: false, error: 'prompt is required' });
        }

        const plan = await CodeGenerator.planWebsite({ prompt, framework, preset });
        res.json({
            success: true,
            plan
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Generate complete project from prompt & plan
 * POST /api/builder/projects/:id/generate
 */
router.post('/projects/:id/generate', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { prompt, preset = 'luxury_gold', plan, framework = 'html_modern', modelPreset } = req.body || {};

        if (!prompt) {
            return res.status(400).json({ success: false, error: 'prompt is required' });
        }

        // 1. Ensure project exists
        await ProjectManager.createProject(id, {
            name: (plan && plan.title) ? plan.title : 'Devika Collections',
            description: prompt,
            preset,
            framework,
            ownerUid: req.user?.uid
        });

        // 2. Synthesize all files
        const genResult = await CodeGenerator.generateProject({
            projectId: id,
            prompt,
            preset,
            plan,
            framework,
            modelPreset
        });

        // 3. Write files to project folder
        const writtenFiles = [];
        for (const f of genResult.files) {
            await ProjectManager.writeFile(id, f.path, f.content);
            writtenFiles.push(f.path);
        }

        // 4. Create initial Git checkpoint
        const checkpoint = await ProjectManager.createCheckpoint(
            id,
            `Initial AI generation: ${genResult.plan?.title || 'Website build'}`
        );

        // 5. Run Self-Healing Engine loop
        const healResult = await SelfHealingEngine.selfHeal(id);

        // 6. Notify preview server
        PreviewServer.notifyProjectChange(id, { type: 'project_generated' });

        res.json({
            success: true,
            projectId: id,
            plan: genResult.plan,
            files: writtenFiles,
            checkpoint,
            selfHealing: healResult,
            previewUrl: `/preview/${id}/index.html`
        });
    } catch (err) {
        console.error('[builderRoutes /generate error]', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Natural language & visual context editing
 * POST /api/builder/projects/:id/edit
 */
router.post('/projects/:id/edit', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { prompt, selectedElement, modelPreset } = req.body || {};

        if (!prompt) {
            return res.status(400).json({ success: false, error: 'prompt is required' });
        }

        const editResult = await CodeGenerator.editWithNaturalLanguage({
            projectId: id,
            prompt,
            selectedElement,
            modelPreset
        });

        if (!editResult.success) {
            return res.status(400).json({ success: false, error: editResult.error });
        }

        if (editResult.newContent !== undefined && editResult.modifiedFile) {
            await ProjectManager.writeFile(id, editResult.modifiedFile, editResult.newContent);
            await ProjectManager.createCheckpoint(
                id,
                editResult.description || `AI Edit: ${prompt.substring(0, 50)}`
            );
        }

        // Self-heal verification
        const diag = await SelfHealingEngine.diagnoseProject(id);
        if (diag.hasErrors) {
            await SelfHealingEngine.selfHeal(id);
        }

        // Hot reload preview
        PreviewServer.notifyProjectChange(id, {
            type: 'file_updated',
            file: editResult.modifiedFile
        });

        res.json({
            success: true,
            modifiedFile: editResult.modifiedFile,
            modifiedFiles: editResult.modifiedFiles,
            description: editResult.description,
            previewUrl: `/preview/${id}/index.html`
        });
    } catch (err) {
        console.error('[builderRoutes /edit error]', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Git Undo
 * POST /api/builder/projects/:id/undo
 */
router.post('/projects/:id/undo', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProjectManager.undo(id);
        PreviewServer.notifyProjectChange(id, { type: 'undo' });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Git Redo
 * POST /api/builder/projects/:id/redo
 */
router.post('/projects/:id/redo', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProjectManager.redo(id);
        PreviewServer.notifyProjectChange(id, { type: 'redo' });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Git History
 * GET /api/builder/projects/:id/history
 */
router.get('/projects/:id/history', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit, 10) || 20;
        const history = await ProjectManager.getHistory(id, limit);
        res.json({ success: true, history });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Git Diff
 * GET /api/builder/projects/:id/diff
 */
router.get('/projects/:id/diff', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { from, to } = req.query;
        const diffResult = await ProjectManager.getDiff(id, from, to);
        res.json({ success: true, diff: diffResult.diff !== undefined ? diffResult.diff : diffResult });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Restore specific checkpoint
 * POST /api/builder/projects/:id/restore
 */
router.post('/projects/:id/restore', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { commitHash } = req.body || {};
        if (!commitHash) {
            return res.status(400).json({ success: false, error: 'commitHash is required' });
        }
        const result = await ProjectManager.restoreCheckpoint(id, commitHash);
        PreviewServer.notifyProjectChange(id, { type: 'restore', commitHash });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Run Diagnostics
 * GET /api/builder/projects/:id/diagnose
 */
router.get('/projects/:id/diagnose', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const diag = await SelfHealingEngine.diagnoseProject(id);
        res.json({ success: true, diagnostics: diag });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Run Self-Healing
 * POST /api/builder/projects/:id/heal
 */
router.post('/projects/:id/heal', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await SelfHealingEngine.selfHeal(id);
        if (result.fixedErrors.length > 0) {
            PreviewServer.notifyProjectChange(id, { type: 'self_healed' });
        }
        res.json({ success: true, healingResult: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Deployment Abstraction
 * POST /api/builder/projects/:id/deploy
 */
router.post('/projects/:id/deploy', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { provider = 'static' } = req.body || {};
        const meta = await ProjectManager.getProject(id);
        const files = await ProjectManager.listFiles(id);

        if (provider === 'firebase') {
            // Firebase deployment config check
            return res.json({
                success: true,
                provider: 'firebase',
                status: 'CONFIGURED',
                message: 'Ready to deploy to Firebase Hosting. Public directory: builder_projects/' + id,
                publicDir: `builder_projects/${id}`
            });
        }

        if (provider === 'vercel' || provider === 'netlify' || provider === 'cloudflare') {
            return res.json({
                success: false,
                provider,
                status: 'NOT_CONFIGURED',
                message: `${provider} provider requires API token and project credentials. Please configure in settings.`
            });
        }

        // Default static deployment
        res.json({
            success: true,
            provider: 'static',
            status: 'READY',
            previewUrl: `/preview/${id}/index.html`,
            fileCount: files.length,
            meta
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Model Router Registry & Capability Discovery
 * GET /api/builder/models
 */
router.get('/models', (req, res) => {
    try {
        const allModels = (modelRegistry && typeof modelRegistry.getAllModels === 'function') 
            ? modelRegistry.getAllModels() 
            : [];

        const capabilities = [
            { id: 'auto', name: 'Auto Model (Orchestrator Recommended)', capabilities: ['CODE_GENERATION', 'REASONING', 'VISION', 'FAST_RESPONSE'] },
            { id: 'epic-think-4o', name: 'Epic Think 4o (Flagship Code & Vision)', capabilities: ['CODE_GENERATION', 'REASONING', 'VISION'] },
            { id: 'epic-think-o1', name: 'Epic Think o1 (Deep Architecture & Reasoning)', capabilities: ['REASONING', 'CODE_GENERATION', 'DEBUGGING'] },
            { id: 'epic-think-fast', name: 'Epic Think Fast (Instant UI Iteration)', capabilities: ['FAST_RESPONSE', 'CODE_GENERATION'] },
            { id: 'groq-llama33', name: 'Groq Llama 3.3 70B (High-Speed LPU)', capabilities: ['CODE_GENERATION', 'FAST_RESPONSE'] },
            { id: 'qwen-local', name: 'Qwen 2.5/3.8 Coder (Local GPU RTX 5050)', capabilities: ['CODE_GENERATION', 'DEBUGGING'] }
        ];

        res.json({
            success: true,
            models: allModels.length > 0 ? allModels : capabilities,
            default: 'auto'
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Multi-Page Management
 * GET /api/builder/projects/:id/pages
 */
router.get('/projects/:id/pages', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const pages = await MultiPageManager.listPages(id);
        res.json({ success: true, pages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Create a new HTML Page
 * POST /api/builder/projects/:id/pages
 */
router.post('/projects/:id/pages', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, title, description } = req.body || {};
        const result = await MultiPageManager.createPage(id, { name, title, description });
        PreviewServer.notifyProjectChange(id, { type: 'page_created', file: result.file });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Delete a page
 * DELETE /api/builder/projects/:id/pages/:page
 */
router.delete('/projects/:id/pages/:page', optionalAuth, async (req, res) => {
    try {
        const { id, page } = req.params;
        const result = await MultiPageManager.deletePage(id, page);
        PreviewServer.notifyProjectChange(id, { type: 'page_deleted', file: page });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Reusable Components Scanner
 * GET /api/builder/projects/:id/components
 */
router.get('/projects/:id/components', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const components = await MultiPageManager.listComponents(id);
        res.json({ success: true, components });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Connectors & Plugins Runtime Catalog
 * GET /api/builder/plugins
 */
router.get('/plugins', optionalAuth, async (req, res) => {
    try {
        const plugins = [
            { id: 'github', name: 'GitHub', icon: 'octicon', description: 'Repository sync, automatic commits & PR automation', connected: false, authType: 'oauth' },
            { id: 'gmail', name: 'Gmail', icon: 'mail', description: 'Contact form forwarding & newsletter dispatch', connected: false, authType: 'oauth' },
            { id: 'drive', name: 'Google Drive', icon: 'cloud', description: 'Automatic asset library backup & media sync', connected: false, authType: 'oauth' },
            { id: 'calendar', name: 'Google Calendar', icon: 'calendar', description: 'VIP booking & consultation scheduling widgets', connected: false, authType: 'oauth' },
            { id: 'notion', name: 'Notion', icon: 'book', description: 'CMS database syncing & product catalog management', connected: false, authType: 'oauth' },
            { id: 'serpapi', name: 'SerpAPI / Google Search', icon: 'search', description: 'Real-time search intelligence, competitor ranking & SERP audits', connected: !!process.env.SERPAPI_API_KEY, authType: 'apikey' },
            { id: 'telegram', name: 'Telegram', icon: 'send', description: 'Real-time order alerts & admin notifications bot', connected: false, authType: 'apikey' },
            { id: 'discord', name: 'Discord', icon: 'message-square', description: 'Community announcement webhooks & error alerts', connected: false, authType: 'webhook' },
            { id: 'whatsapp', name: 'WhatsApp Business', icon: 'phone', description: 'Live customer support chat widget & order updates', connected: false, authType: 'oauth' }
        ];
        res.json({ success: true, plugins });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Assets Listing
 * GET /api/builder/projects/:id/assets
 */
router.get('/projects/:id/assets', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const assets = await ImageGenerationService.listAssets(id);
        res.json({ success: true, assets });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * AI Image Generation
 * POST /api/builder/projects/:id/assets/image
 */
router.post('/projects/:id/assets/image', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { prompt, category = 'hero', aspectRatio = '16:9', style } = req.body || {};
        if (!prompt) return res.status(400).json({ success: false, error: 'prompt is required' });

        const result = await ImageGenerationService.generateImage({
            projectId: id,
            prompt,
            category,
            aspectRatio,
            style
        });

        PreviewServer.notifyProjectChange(id, { type: 'asset_generated', asset: result });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * AI Video Generation
 * POST /api/builder/projects/:id/assets/video
 */
router.post('/projects/:id/assets/video', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { prompt, type = 'hero_background', duration = 5, style } = req.body || {};
        if (!prompt) return res.status(400).json({ success: false, error: 'prompt is required' });

        const result = await VideoGenerationService.generateVideo({
            projectId: id,
            prompt,
            type,
            duration,
            style
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Automated Responsive Device Testing
 * POST /api/builder/projects/:id/test-responsive
 */
router.post('/projects/:id/test-responsive', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const audit = await ResponsiveAuditEngine.auditProject(id);
        res.json(audit);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Automated Responsive Fix
 * POST /api/builder/projects/:id/fix-responsive
 */
router.post('/projects/:id/fix-responsive', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ResponsiveAuditEngine.autoFix(id);
        PreviewServer.notifyProjectChange(id, { type: 'responsive_fixed' });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Technical SEO Audit
 * GET /api/builder/projects/:id/seo
 */
router.get('/projects/:id/seo', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const seoReport = await SeoAuditEngine.auditProject(id);
        res.json(seoReport);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Apply 1-Click SEO Optimization
 * POST /api/builder/projects/:id/seo/apply
 */
router.post('/projects/:id/seo/apply', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await SeoAuditEngine.autoFix(id);
        PreviewServer.notifyProjectChange(id, { type: 'seo_applied' });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Hindsight Project Semantic Memory Retrieval
 * GET /api/builder/projects/:id/memory
 */
router.get('/projects/:id/memory', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const bankId = `project_${id}`;
        let memory = null;
        try {
            memory = await recallMemory({
                bankId,
                query: 'project purpose architecture brand identity design decisions completed features pending tasks',
                limit: 5
            });
        } catch {
            memory = { memories: [] };
        }
        res.json({ success: true, memory });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Hindsight Project Semantic Memory Retain
 * POST /api/builder/projects/:id/memory
 */
router.post('/projects/:id/memory', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { content, context } = req.body || {};
        if (!content) return res.status(400).json({ success: false, error: 'content is required' });

        const bankId = `project_${id}`;
        try {
            await retainMemory({
                bankId,
                content: `Project Decision [${context || 'General'}]: ${content}`
            });
        } catch (e) {
            console.warn('[Hindsight] Project memory retain warning:', e.message);
        }

        res.json({ success: true, message: 'Project memory retained in Hindsight' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Targeted Element CSS Style Modification (Real-time Inspector Save)
 * POST /api/builder/projects/:id/style-element
 */
router.post('/projects/:id/style-element', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { selector, styles = {}, commit = true } = req.body || {};
        if (!selector || Object.keys(styles).length === 0) {
            return res.status(400).json({ success: false, error: 'selector and styles are required' });
        }

        let stylesCss = await ProjectManager.readFile(id, 'css/styles.css');
        const cssRules = Object.entries(styles)
            .map(([prop, val]) => `  ${prop}: ${val} !important;`)
            .join('\n');

        const block = `\n/* Visual Inspector Edit: ${selector} */\n${selector} {\n${cssRules}\n}\n`;
        stylesCss += block;

        await ProjectManager.saveFile(id, 'css/styles.css', stylesCss);

        if (commit) {
            await ProjectManager.createCheckpoint(id, `[Visual Inspector] Styled ${selector}`);
        }

        PreviewServer.notifyProjectChange(id, { type: 'style_updated', selector });

        res.json({ success: true, selector, styles });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
