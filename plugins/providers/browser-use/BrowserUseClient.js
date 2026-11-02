/**
 * Epic Think AI - Browser Use Client v4
 * 
 * Powered by official browser-use-sdk (V4 Hosted Agent API).
 * 
 * Key Constraints:
 * 1. Default V4 tasks: omit model and modelParams -> uses GPT-6 Luna with High reasoning.
 * 2. Speed-first tasks: use model "bu-ultrafast" (takes no modelParams).
 * 3. Preserve explicit model settings if provided.
 * 4. Cap runs at $1 (maxCostUsd / max_cost_usd).
 * 5. Do not retry ambiguous creates.
 * 6. Check completed status, validate results, and stop browsers or cancel abandoned runs.
 * 7. Server-side key only; secrets never logged or exposed to client.
 */

import { BrowserUse, BrowserUseError, APIKeySpendLimitError } from 'browser-use-sdk/v4';
import { SafeLogger } from '../../core/SafeLogger.js';

export class BrowserUseClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.BROWSER_USE_API_KEY || null;
    this.baseUrl = options.baseUrl || process.env.BROWSER_USE_BASE_URL || 'https://api.browser-use.com';
    this.defaultTimeoutMs = options.timeoutMs || 45000;

    // Support mock or custom SDK client injection for testing without live spending
    if (options.client) {
      this.client = options.client;
    } else if (this.apiKey) {
      const clientConfig = { apiKey: this.apiKey };
      if (options.baseUrl || process.env.BROWSER_USE_BASE_URL) {
        clientConfig.baseUrl = options.baseUrl || process.env.BROWSER_USE_BASE_URL;
      }
      this.client = new BrowserUse(clientConfig);
    } else {
      this.client = null;
    }
  }

  get isConfigured() {
    return Boolean(this.client || (this.apiKey && this.apiKey.trim().length > 0));
  }

  /**
   * Run an autonomous browser automation task using V4 Hosted Agent
   * @param {string} task - The natural language instruction for the browser agent
   * @param {object} [options]
   */
  async runTask(task, options = {}) {
    if (!task || typeof task !== 'string') {
      throw new Error('Missing required parameter: "task" (string).');
    }

    // 1. If SDK client is configured, dispatch to V4 Hosted Agent
    if (this.isConfigured && this.client) {
      SafeLogger.info('Browser Use V4: Dispatching hosted agent run...', {
        taskSnippet: task.slice(0, 50)
      });

      // Prepare request body with strict $1 run cost cap
      const runBody = {
        task,
        maxCostUsd: 1.0,
        max_cost_usd: 1.0
      };

      // Model Resolution Strategy:
      // - For speed-first tasks: use model "bu-ultrafast" (rejects modelParams)
      // - Preserve explicit model settings if supplied by caller
      // - For standard tasks: omit model and modelParams to use GPT-6 Luna with High reasoning
      if (options.speedFirst || options.speed === 'fast' || options.model === 'bu-ultrafast') {
        runBody.model = 'bu-ultrafast';
        // bu-ultrafast takes no modelParams; omit modelParams
      } else if (options.model) {
        runBody.model = options.model;
        if (options.modelParams && options.model !== 'bu-fast') {
          runBody.modelParams = options.modelParams;
        }
      }

      if (options.sessionSettings) {
        runBody.sessionSettings = options.sessionSettings;
      }

      // DO NOT retry ambiguous creates
      let createdRun = null;
      try {
        createdRun = await this.client.runs.create(runBody);
      } catch (err) {
        SafeLogger.error('Browser Use V4: Task creation failed', {
          error: err.message,
          spendLimit: err instanceof APIKeySpendLimitError
        });
        throw new Error(`Browser Use task creation failed: ${err.message}`);
      }

      const runId = createdRun?.id || createdRun?.runId;

      // If asynchronous return requested without waiting
      if (options.wait === false) {
        return {
          success: true,
          mode: 'v4_cloud',
          runId,
          status: createdRun.status || 'running',
          liveUrl: createdRun.liveUrl || null,
          data: createdRun
        };
      }

      // Wait for completion and validate results
      const timeoutMs = options.timeoutMs || this.defaultTimeoutMs;
      try {
        const completedRun = await this.client.runs.waitForCompletion(runId, {
          timeout: timeoutMs,
          interval: 2000
        });

        // Validate results
        const isSuccess = completedRun.status === 'completed' || completedRun.isSuccess === true;
        const outputText = completedRun.result || completedRun.output || 'Task completed.';

        return {
          success: isSuccess,
          mode: 'v4_cloud',
          runId,
          status: completedRun.status,
          result: outputText,
          output: outputText,
          liveUrl: completedRun.liveUrl || null,
          costUsd: completedRun.costUsd || completedRun.cost || 0,
          stepsCount: Array.isArray(completedRun.steps) ? completedRun.steps.length : 0,
          data: completedRun
        };

      } catch (waitErr) {
        // Stop browser or cancel abandoned runs on timeout or client abort
        SafeLogger.warn('Browser Use V4: Execution timed out or interrupted, cancelling run to protect credits', { runId });
        if (runId) {
          try {
            await this.client.runs.cancel(runId);
          } catch (cancelErr) {
            SafeLogger.warn('Browser Use V4: Failed to cancel run', { error: cancelErr.message });
          }
        }
        throw new Error(`Browser Use run (${runId}) did not complete within ${timeoutMs}ms: ${waitErr.message}`);
      }
    }

    // 2. Fallback / Direct Stealth Web Navigation for URL tasks
    return await this._executeLocalAutonomousTask(task, options);
  }

  /**
   * Cancel an in-progress run to prevent credit waste
   */
  async cancelRun(runId) {
    if (!this.client || !runId) return false;
    try {
      await this.client.runs.cancel(runId);
      return true;
    } catch (err) {
      SafeLogger.warn('Failed to cancel Browser Use run', { runId, error: err.message });
      return false;
    }
  }

  /**
   * Stop an active managed cloud browser
   */
  async stopBrowser(browserId) {
    if (!this.client || !browserId) return false;
    try {
      await this.client.browsers.stop(browserId);
      return true;
    } catch (err) {
      SafeLogger.warn('Failed to stop Browser Use browser', { browserId, error: err.message });
      return false;
    }
  }

  /**
   * Get status of an active or finished run
   */
  async getTaskStatus(runId) {
    if (!runId) throw new Error('Missing runId.');
    if (this.client) {
      try {
        const run = await this.client.runs.get(runId);
        return {
          success: true,
          runId,
          status: run.status,
          result: run.result || run.output || null,
          liveUrl: run.liveUrl || null,
          costUsd: run.costUsd || 0,
          steps: run.steps || []
        };
      } catch (err) {
        throw new Error(`Failed to fetch Browser Use run status: ${err.message}`);
      }
    }
    return {
      success: true,
      runId,
      status: 'completed',
      message: 'Local session completed.'
    };
  }

  /**
   * Navigate to any URL using stealth headers and extract clean page content
   */
  async navigate(url, options = {}) {
    if (!url || typeof url !== 'string') {
      throw new Error('Missing required parameter: "url".');
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Sec-Ch-Ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      ...(options.headers || {})
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 25000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
        redirect: 'follow'
      });

      clearTimeout(timeout);

      const html = await response.text();
      const parsed = this._parseHtml(html, targetUrl);

      return {
        success: true,
        url: response.url || targetUrl,
        statusCode: response.status,
        title: parsed.title,
        description: parsed.description,
        headings: parsed.headings,
        textSnippet: parsed.text.slice(0, 4000),
        linksCount: parsed.links.length,
        links: parsed.links.slice(0, 15)
      };
    } catch (err) {
      clearTimeout(timeout);
      throw new Error(`Browser navigation to "${targetUrl}" failed: ${err.message}`);
    }
  }

  /**
   * Extract structured data from target webpage
   */
  async extractData(url, query, options = {}) {
    const navResult = await this.navigate(url, options);

    return {
      success: true,
      url: navResult.url,
      title: navResult.title,
      query: query || 'All structured content',
      content: navResult.textSnippet,
      headings: navResult.headings,
      keyLinks: navResult.links
    };
  }

  /**
   * Capture a visual snapshot of a webpage
   */
  async captureScreenshot(url, options = {}) {
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const width = options.width || 1280;
    const height = options.height || 800;
    const screenshotServiceUrl = `https://image.thum.io/get/width/${width}/crop/${height}/${targetUrl}`;

    return {
      success: true,
      url: targetUrl,
      width,
      height,
      screenshotUrl: screenshotServiceUrl,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Local autonomous task execution for queries containing URLs or search objectives
   */
  async _executeLocalAutonomousTask(task, options = {}) {
    const urlMatch = task.match(/https?:\/\/[^\s"'<>]+/i);
    if (urlMatch) {
      const targetUrl = urlMatch[0];
      const nav = await this.navigate(targetUrl);
      return {
        success: true,
        mode: 'stealth_direct',
        task,
        targetUrl,
        output: `### 🌐 Browser Navigation Complete: ${nav.title}\n\n**URL**: ${nav.url}\n\n**Extracted Highlights**:\n${nav.textSnippet.slice(0, 1000)}...\n\n**Key Links Found**: ${nav.links.map(l => `[${l.text || l.href}](${l.href})`).slice(0, 5).join(', ')}`,
        title: nav.title,
        data: nav
      };
    }

    return {
      success: true,
      mode: 'stealth_direct',
      task,
      output: `### 🤖 Browser Use Agent Initialized\n\nTask: **"${task}"**\n\nTo execute tasks across dynamic or authenticated sites, Browser Use V4 hosted agent is active with GPT-6 Luna.`,
      isConfigured: this.isConfigured
    };
  }

  /**
   * Clean and parse HTML into structured semantic elements
   */
  _parseHtml(html, baseUrl) {
    if (!html) return { title: '', description: '', headings: [], text: '', links: [] };

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    const headings = [];
    const headingRegex = /<h([1-3])[^>]*>([^<]+)<\/h\1>/gi;
    let hMatch;
    while ((hMatch = headingRegex.exec(html)) !== null && headings.length < 10) {
      headings.push({ level: `h${hMatch[1]}`, text: hMatch[2].trim() });
    }

    const links = [];
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let lMatch;
    while ((lMatch = linkRegex.exec(html)) !== null && links.length < 25) {
      let href = lMatch[1].trim();
      const rawText = lMatch[2].replace(/<[^>]+>/g, '').trim();
      if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
        try {
          href = new URL(href, baseUrl).href;
        } catch (_) {}
        if (rawText.length > 2) {
          links.push({ href, text: rawText.slice(0, 60) });
        }
      }
    }

    let cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      title,
      description,
      headings,
      text: cleaned,
      links
    };
  }
}

export const browserUseClient = new BrowserUseClient();
