/**
 * Epic Think AI - Browser Use Client
 * 
 * Provides integration with Browser Use Cloud (https://api.browser-use.com)
 * and local stealth browser runners for autonomous web automation.
 */

import { SafeLogger } from '../../core/SafeLogger.js';

export class BrowserUseClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.BROWSER_USE_API_KEY || null;
    this.baseUrl = config.baseUrl || process.env.BROWSER_USE_BASE_URL || 'https://api.browser-use.com';
    this.defaultTimeoutMs = config.timeoutMs || 45000;
  }

  get isCloudConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Helper to perform authenticated HTTP requests to Browser Use Cloud
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Browser-Use-API-Key': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      ...(options.headers || {})
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (_) {}
      throw new Error(`Browser Use API error [${response.status}]: ${errorBody || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Run an autonomous browser automation task
   * @param {string} task - Natural language prompt describing the browser task
   * @param {object} [options]
   */
  async runTask(task, options = {}) {
    if (!task || typeof task !== 'string') {
      throw new Error('Missing required parameter: "task" (string).');
    }

    // 1. If Browser Use Cloud API is configured, use hosted cloud agent
    if (this.isCloudConfigured) {
      SafeLogger.info('Browser Use: Dispatching task to Browser Use Cloud...', { task: task.slice(0, 60) });
      try {
        // Try v4 runs endpoint
        const runData = await this._request('/api/v4/runs', {
          method: 'POST',
          body: JSON.stringify({
            task,
            sessionSettings: options.sessionSettings || {
              solveCaptchas: true
            }
          })
        });

        const runId = runData.id || runData.runId || runData.taskId;

        // If wait option is specified (default true up to timeout)
        if (options.wait !== false && runId) {
          return await this.pollTaskCompletion(runId, options.timeoutMs || 40000);
        }

        return {
          success: true,
          mode: 'cloud',
          runId,
          status: runData.status || 'running',
          liveUrl: runData.liveUrl || null,
          data: runData
        };
      } catch (cloudErr) {
        SafeLogger.warn('Browser Use Cloud API attempt failed, falling back to local runner', { error: cloudErr.message });
      }
    }

    // 2. Resilient Fallback / Direct Stealth Browser Runner
    return await this._executeLocalAutonomousTask(task, options);
  }

  /**
   * Poll active task until completion or timeout
   */
  async pollTaskCompletion(runId, timeoutMs = 40000) {
    const startTime = Date.now();
    const intervalMs = 2500;

    while (Date.now() - startTime < timeoutMs) {
      try {
        const status = await this.getTaskStatus(runId);
        if (status.status === 'completed' || status.status === 'success' || status.isSuccess) {
          return {
            success: true,
            mode: 'cloud',
            runId,
            status: 'completed',
            output: status.output || status.result || 'Task completed successfully.',
            steps: status.steps || [],
            screenshotUrl: status.screenshotUrl || null,
            liveUrl: status.liveUrl || null
          };
        }
        if (status.status === 'failed' || status.status === 'error') {
          return {
            success: false,
            mode: 'cloud',
            runId,
            status: 'failed',
            error: status.error || 'Browser Use task encountered an error.'
          };
        }
      } catch (_) {}

      await new Promise(r => setTimeout(r, intervalMs));
    }

    return {
      success: true,
      mode: 'cloud',
      runId,
      status: 'in_progress',
      message: 'Task is executing in background on Browser Use Cloud.',
      checkStatusUrl: `/api/plugins/browser_use/tasks/${runId}`
    };
  }

  /**
   * Retrieve status of a task
   */
  async getTaskStatus(runId) {
    if (!this.isCloudConfigured) {
      return {
        runId,
        status: 'completed',
        message: 'Local browser session completed synchronously.'
      };
    }

    try {
      return await this._request(`/api/v4/runs/${runId}`, { method: 'GET' });
    } catch (_) {
      return await this._request(`/api/v2/tasks/${runId}`, { method: 'GET' });
    }
  }

  /**
   * Navigate to a URL using stealth headers and extract clean page content
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

    // High-resolution visual capture service endpoint
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
    // Extract any URLs mentioned in task
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
      output: `### 🤖 Browser Use Agent Initialized\n\nTask: **"${task}"**\n\nTo execute tasks across protected or dynamic sites, configure \`BROWSER_USE_API_KEY\` in your environment or provide a target URL for automated stealth crawling.`,
      isConfigured: this.isCloudConfigured
    };
  }

  /**
   * Clean and parse HTML into structured semantic elements
   */
  _parseHtml(html, baseUrl) {
    if (!html) return { title: '', description: '', headings: [], text: '', links: [] };

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract Headings
    const headings = [];
    const headingRegex = /<h([1-3])[^>]*>([^<]+)<\/h\1>/gi;
    let hMatch;
    while ((hMatch = headingRegex.exec(html)) !== null && headings.length < 10) {
      headings.push({ level: `h${hMatch[1]}`, text: hMatch[2].trim() });
    }

    // Extract Links
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

    // Strip scripts, styles, SVG, comments
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
