/**
 * FirecrawlClient.js
 * Epic Think AI - Firecrawl API Client & Resilient Web Extractor
 * 
 * Supports:
 * - Direct Firecrawl API (v1 /scrape, /crawl, /map) when FIRECRAWL_API_KEY is configured
 * - Resilient native fallback with semantic HTML-to-Markdown extraction
 */

export class FirecrawlClient {
  constructor(apiKey = null) {
    this.apiKey = apiKey || process.env.FIRECRAWL_API_KEY || null;
    this.baseUrl = 'https://api.firecrawl.dev/v1';
  }

  /**
   * Scrape a URL and return clean Markdown
   */
  async scrapeUrl(url, options = {}) {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      throw new Error(`Invalid URL provided: "${url}"`);
    }

    if (this.apiKey) {
      try {
        const res = await fetch(`${this.baseUrl}/scrape`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            url,
            formats: ['markdown', 'html'],
            onlyMainContent: options.onlyMainContent !== false,
            waitFor: options.waitFor || 0
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            return {
              url,
              markdown: json.data.markdown || '',
              title: json.data.metadata?.title || '',
              description: json.data.metadata?.description || '',
              statusCode: json.data.metadata?.statusCode || 200,
              provider: 'firecrawl_cloud'
            };
          }
        }
      } catch (err) {
        console.warn('[FIRECRAWL] Cloud scrape failed, engaging native extractor:', err.message);
      }
    }

    // Resilient native fallback extractor
    return await this.nativeFallbackScrape(url);
  }

  /**
   * Map/enumerate links on a domain
   */
  async mapDomain(url, options = {}) {
    if (!url || !url.startsWith('http')) {
      throw new Error(`Invalid domain URL: "${url}"`);
    }

    if (this.apiKey) {
      try {
        const res = await fetch(`${this.baseUrl}/map`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            url,
            limit: options.limit || 50
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            return {
              url,
              links: json.data.links || [],
              count: (json.data.links || []).length,
              provider: 'firecrawl_cloud'
            };
          }
        }
      } catch (err) {
        console.warn('[FIRECRAWL] Cloud map failed, using native link extractor:', err.message);
      }
    }

    // Native link extractor fallback
    return await this.nativeFallbackMap(url, options.limit || 30);
  }

  /**
   * Crawl a domain up to a limit
   */
  async crawlDomain(url, options = {}) {
    const limit = Math.min(options.limit || 5, 10);
    const mapRes = await this.mapDomain(url, { limit });
    const links = (mapRes.links || []).slice(0, limit);

    const pages = [];
    for (const link of links) {
      try {
        const scrapeRes = await this.scrapeUrl(link);
        pages.push(scrapeRes);
      } catch (e) {
        pages.push({ url: link, error: e.message });
      }
    }

    return {
      domain: url,
      totalPagesScraped: pages.length,
      pages,
      provider: mapRes.provider
    };
  }

  /**
   * Native HTML-to-Markdown fallback extractor
   */
  async nativeFallbackScrape(url) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) EpicThink/1.0 WebScraper'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`HTTP fetch failed with status ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Convert HTML to clean markdown text
    let text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n')
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n')
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n')
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n* $1')
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n')
      .replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      url,
      markdown: text.slice(0, 15000), // Cap at 15k chars for clean context
      title,
      description,
      statusCode: response.status,
      provider: 'native_fallback_extractor'
    };
  }

  /**
   * Native link extractor
   */
  async nativeFallbackMap(url, limit = 30) {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 EpicThink/1.0' },
      signal: AbortSignal.timeout(8000)
    });
    const html = await response.text();
    const urlObj = new URL(url);
    const origin = urlObj.origin;

    const linkRegex = /href=["']([^"'#\s>]+)["']/gi;
    const links = new Set();
    links.add(url);

    let match;
    while ((match = linkRegex.exec(html)) !== null && links.size < limit) {
      let rawLink = match[1];
      if (rawLink.startsWith('/')) {
        links.add(`${origin}${rawLink}`);
      } else if (rawLink.startsWith(origin)) {
        links.add(rawLink);
      }
    }

    return {
      url,
      links: Array.from(links),
      count: links.size,
      provider: 'native_link_extractor'
    };
  }
}
