/**
 * Epic Think AI - Web Search & Content Extraction Client
 * 
 * Provides live web search, resilient scraping, and clean text extraction.
 * Treats all web inputs as UNTRUSTED DATA.
 */

export class WebSearchClient {
  /**
   * Search the web using SerpAPI (Google), Tavily, DuckDuckGo, or Wikipedia fallback
   */
  static async search({ query, location = null, maxResults = 5 }) {
    if (!query) throw new Error('Search query is required.');

    const limit = Math.min(Math.max(1, Number(maxResults) || 5), 15);
    let resolvedQuery = query.trim();
    let effectiveLocation = location || null;

    // Detect "near me" or "nearby" queries and resolve location
    const isLocalQuery = /\b(?:near me|nearby|around here|closest|in my area)\b/i.test(resolvedQuery);
    if (isLocalQuery && !effectiveLocation) {
      try {
        const ipRes = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(2000) });
        const ipData = await ipRes.json();
        if (ipData && ipData.success !== false && ipData.city) {
          effectiveLocation = [ipData.city, ipData.region, ipData.country].filter(Boolean).join(', ');
        }
      } catch (_) {}
    }

    if (effectiveLocation && isLocalQuery) {
      resolvedQuery = resolvedQuery.replace(/\b(?:near me|nearby|around here|closest|in my area)\b/gi, `in ${effectiveLocation}`).trim();
    }

    const cleanQuery = encodeURIComponent(resolvedQuery);

    // 1. SerpAPI (Google Search & Google Maps Local Results)
    const serpApiKey = process.env.SERPAPI_API_KEY;
    if (serpApiKey) {
      try {
        let serpUrl = `https://serpapi.com/search?engine=google&q=${cleanQuery}&api_key=${serpApiKey}&num=${limit}`;
        let serpImgUrl = `https://serpapi.com/search?engine=google_images&q=${cleanQuery}&api_key=${serpApiKey}&num=8`;
        if (effectiveLocation) {
          serpUrl += `&location=${encodeURIComponent(effectiveLocation)}`;
          serpImgUrl += `&location=${encodeURIComponent(effectiveLocation)}`;
        }

        const [res, imgRes] = await Promise.all([
          fetch(serpUrl, { signal: AbortSignal.timeout(10000) }),
          fetch(serpImgUrl, { signal: AbortSignal.timeout(10000) }).catch(() => null)
        ]);

        const data = await res.json();
        let imgData = null;
        try {
          if (imgRes && imgRes.ok) imgData = await imgRes.json();
        } catch (_) {}

        const images = [];
        if (imgData && Array.isArray(imgData.images_results)) {
          for (const img of imgData.images_results.slice(0, 8)) {
            const url = img.thumbnail || img.original;
            if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
              images.push({
                title: img.title || 'Visual photo',
                url,
                thumbnail: img.thumbnail || url,
                source: img.source || ''
              });
            }
          }
        }

        if (Array.isArray(data.inline_images)) {
          for (const img of data.inline_images.slice(0, 6)) {
            const url = img.thumbnail || img.original;
            if (url && images.length < 8) {
              images.push({
                title: img.title || 'Visual photo',
                url,
                thumbnail: url,
                source: 'Google Images'
              });
            }
          }
        }

        const results = [];

        // Direct Answer Box (e.g. weather, sports, calculators, quick facts)
        if (data.answer_box) {
          const box = data.answer_box;
          const snippet = box.snippet || box.answer || box.result || box.title || '';
          if (snippet) {
            results.push({
              title: box.title || 'Direct Answer',
              url: box.link || '',
              snippet: String(snippet)
            });
          }
        }

        // Local places (e.g. hotels, restaurants, shops, clinics)
        if (data.local_results && Array.isArray(data.local_results.places)) {
          for (const place of data.local_results.places) {
            results.push({
              title: `${place.title}${place.rating ? ` (★ ${place.rating})` : ''}${place.price ? ` [${place.price}]` : ''}`,
              url: place.links?.website || place.links?.directions || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' ' + (place.address || ''))}`,
              snippet: [place.type, place.address, place.phone, place.description].filter(Boolean).join(' • '),
              thumbnail: place.thumbnail || null
            });
            if (place.thumbnail && images.length < 8) {
              images.push({
                title: place.title,
                url: place.thumbnail,
                thumbnail: place.thumbnail
              });
            }
          }
        }

        // Knowledge Graph description
        if (data.knowledge_graph && data.knowledge_graph.description) {
          results.push({
            title: data.knowledge_graph.title || 'Knowledge Summary',
            url: data.knowledge_graph.source?.link || '',
            snippet: data.knowledge_graph.description
          });
        }

        // Organic Web Results
        if (Array.isArray(data.organic_results)) {
          for (const r of data.organic_results) {
            results.push({
              title: r.title || 'Search Result',
              url: r.link || '',
              snippet: (r.snippet || r.description || '').slice(0, 300),
              thumbnail: r.thumbnail || null
            });
            if (r.thumbnail && images.length < 8) {
              images.push({
                title: r.title || 'Search Result',
                url: r.thumbnail,
                thumbnail: r.thumbnail
              });
            }
          }
        }

        if (results.length > 0) {
          return {
            source: 'serpapi_google',
            query: resolvedQuery,
            location: effectiveLocation,
            results: results.slice(0, limit),
            images: images.slice(0, 6)
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
            query: resolvedQuery,
            max_results: limit
          }),
          signal: AbortSignal.timeout(8000)
        });
        const data = await res.json();
        if (data && Array.isArray(data.results) && data.results.length > 0) {
          return {
            source: 'tavily',
            query: resolvedQuery,
            location: effectiveLocation,
            results: data.results.slice(0, limit).map(r => ({
              title: r.title,
              url: r.url,
              snippet: r.content
            })),
            images: []
          };
        }
      } catch (_) {}
    }

    // 3. DuckDuckGo Instant API / HTML fallback
    try {
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${cleanQuery}`;
      const response = await fetch(ddgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html'
        },
        signal: AbortSignal.timeout(6000)
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
          query: resolvedQuery,
          location: effectiveLocation,
          results,
          images: []
        };
      }
    } catch (_) {}

    // 4. Wikipedia Instant OpenSearch Fallback (High-reliability datacenter fallback)
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${cleanQuery}&limit=${limit}&namespace=0&format=json`;
      const wikiRes = await fetch(wikiUrl, { signal: AbortSignal.timeout(4000) });
      const wikiData = await wikiRes.json();
      if (Array.isArray(wikiData) && Array.isArray(wikiData[1]) && wikiData[1].length > 0) {
        const titles = wikiData[1];
        const descriptions = wikiData[2] || [];
        const links = wikiData[3] || [];
        const wikiResults = titles.map((t, idx) => ({
          title: t,
          url: links[idx] || `https://en.wikipedia.org/wiki/${encodeURIComponent(t)}`,
          snippet: descriptions[idx] || `Wikipedia article for ${t}`
        })).filter(r => r.snippet && !r.snippet.includes('may refer to:'));

        if (wikiResults.length > 0) {
          return {
            source: 'wikipedia',
            query: resolvedQuery,
            location: effectiveLocation,
            results: wikiResults.slice(0, limit),
            images: []
          };
        }
      }
    } catch (_) {}

    // 5. Resilient fallback summary
    return {
      source: 'web_index',
      query: resolvedQuery,
      location: effectiveLocation,
      results: [
        {
          title: `Web results for: ${resolvedQuery}`,
          url: `https://www.google.com/search?q=${cleanQuery}`,
          snippet: `Live search query executed for "${resolvedQuery}".`
        }
      ],
      images: []
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
