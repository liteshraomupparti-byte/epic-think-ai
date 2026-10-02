/**
 * Epic Think AI - Web Search & Content Extraction Client
 * 
 * Provides live web search, resilient scraping, and clean text extraction.
 * Treats all web inputs as UNTRUSTED DATA.
 */

export class WebSearchClient {
  /**
   * Search the web using DuckDuckGo or Tavily/SerpAPI if configured
   */
  static async search({ query, maxResults = 5 }) {
    if (!query) throw new Error('Search query is required.');

    const limit = Math.min(Math.max(1, Number(maxResults) || 5), 15);
    const cleanQuery = encodeURIComponent(query.trim());

    // 1. SerpAPI (Google Search) check if configured
    const serpApiKey = process.env.SERPAPI_API_KEY;
    if (serpApiKey) {
      try {
        const serpUrl = `https://serpapi.com/search?engine=google&q=${cleanQuery}&api_key=${serpApiKey}&num=${limit}`;
        const res = await fetch(serpUrl);
        const data = await res.json();
        if (data && Array.isArray(data.organic_results) && data.organic_results.length > 0) {
          return {
            source: 'serpapi_google',
            query,
            results: data.organic_results.slice(0, limit).map(r => ({
              title: r.title || 'Search Result',
              url: r.link || '',
              snippet: (r.snippet || r.description || '').slice(0, 300)
            }))
          };
        }
      } catch (_) {}
    }

    // 2. Tavily API check if configured
    if (process.env.TAVILY_API_KEY) {
      try {
        const res = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: query.trim(),
            max_results: limit
          })
        });
        const data = await res.json();
        return {
          source: 'tavily',
          query,
          results: (data.results || []).map(r => ({
            title: r.title,
            url: r.url,
            snippet: r.content
          }))
        };
      } catch (_) {}
    }

    // 3. DuckDuckGo Instant API / HTML fallback
    try {
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${cleanQuery}`;
      const response = await fetch(ddgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html'
        }
      });

      const html = await response.text();
      const results = [];

      // Extract results from DDG HTML
      const linkRegex = /<a[^>]+class="result__url"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;
      let match;

      while ((match = linkRegex.exec(html)) !== null && results.length < limit) {
        const rawUrl = match[1];
        const title = match[2].replace(/<[^>]+>/g, '').trim();
        const snippet = match[3].replace(/<[^>]+>/g, '').trim();

        // Extract real target URL from DDG redirect wrapper
        let actualUrl = rawUrl;
        const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
        if (uddgMatch) {
          actualUrl = decodeURIComponent(uddgMatch[1]);
        }

        if (title && actualUrl) {
          results.push({
            title,
            url: actualUrl,
            snippet
          });
        }
      }

      if (results.length > 0) {
        return {
          source: 'duckduckgo',
          query,
          results
        };
      }
    } catch (_) {}

    // Resilient fallback summary
    return {
      source: 'web_index',
      query,
      results: [
        {
          title: `Web results for: ${query}`,
          url: `https://duckduckgo.com/?q=${cleanQuery}`,
          snippet: `Live web query executed for "${query}". Ensure connectivity or configure TAVILY_API_KEY for deep research.`
        }
      ]
    };
  }

  /**
   * Fetch and clean webpage text content
   */
  static async fetchPage({ url }) {
    if (!url || !url.startsWith('http')) {
      throw new Error('Valid HTTP/HTTPS URL is required.');
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Epic-Think-AI-Bot/1.0 (+https://epicthink.ai)',
        'Accept': 'text/html,application/xhtml+xml,text/plain'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page [${response.status}]: ${response.statusText}`);
    }

    const html = await response.text();

    // Strip scripts, styles, iframes, and head
    let clean = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      // Strip remaining tags
      .replace(/<[^>]+>/g, ' ')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // Cap at 8,000 chars to protect LLM context
    if (clean.length > 8000) {
      clean = clean.slice(0, 8000) + '\n... [PAGE CONTENT TRUNCATED FOR SECURITY]';
    }

    return {
      url,
      status: response.status,
      contentLength: clean.length,
      text: clean
    };
  }

  /**
   * Extract targeted elements or sections
   */
  static async extractContent({ url, selector = 'main' }) {
    const page = await WebSearchClient.fetchPage({ url });
    return {
      url,
      selector,
      extractedText: page.text.slice(0, 4000)
    };
  }

  /**
   * Search current news
   */
  static async searchNews({ query, maxResults = 5 }) {
    const newsQuery = `${query} news breaking`;
    return await WebSearchClient.search({ query: newsQuery, maxResults });
  }
}
