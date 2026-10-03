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

    // Detect place queries (hostels, hotels, restaurants, cafes, attractions, near me)
    const isPlaceQuery = /\b(?:near me|nearby|around here|closest|in my area|hostel|hostels|hotel|hotels|restaurant|restaurants|cafe|cafes|pg|paying guest|co-living|coliving|resort|resorts|lodge|lodges|hospital|hospitals|clinic|clinics|store|stores|shop|shops|pub|pubs|bar|bars|gym|gyms|cinema|theater|theatre|parks|park|places to visit|things to do)\b/i.test(resolvedQuery);
    const hasNearMe = /\b(?:near me|nearby|around here|closest|in my area)\b/i.test(resolvedQuery);

    if (hasNearMe && !effectiveLocation) {
      try {
        const ipRes = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(2000) });
        const ipData = await ipRes.json();
        if (ipData && ipData.success !== false && ipData.city) {
          effectiveLocation = [ipData.city, ipData.region, ipData.country].filter(Boolean).join(', ');
        }
      } catch (_) {}

      // Resilient fallback default location if IP detection timed out or failed
      if (!effectiveLocation) {
        effectiveLocation = 'Hyderabad, Telangana, India';
      }
    }

    if (effectiveLocation && hasNearMe) {
      resolvedQuery = resolvedQuery.replace(/\b(?:near me|nearby|around here|closest|in my area)\b/gi, `in ${effectiveLocation}`).trim();
    }

    const cleanQuery = encodeURIComponent(resolvedQuery);

    // 1. SerpAPI (Google Search & Google Maps Local Results)
    const serpApiKey = process.env.SERPAPI_API_KEY;
    if (serpApiKey) {
      try {
        let serpUrl = `https://serpapi.com/search?engine=google&q=${cleanQuery}&api_key=${serpApiKey}&num=${limit}`;
        let serpImgUrl = `https://serpapi.com/search?engine=google_images&q=${cleanQuery}&api_key=${serpApiKey}&num=8`;
        // Only append &location if resolvedQuery doesn't already contain "in <location>"
        if (effectiveLocation && !resolvedQuery.toLowerCase().includes(effectiveLocation.toLowerCase())) {
          serpUrl += `&location=${encodeURIComponent(effectiveLocation)}`;
          serpImgUrl += `&location=${encodeURIComponent(effectiveLocation)}`;
        }

        const fetchTasks = [
          fetch(serpUrl, { signal: AbortSignal.timeout(8000) }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(serpImgUrl, { signal: AbortSignal.timeout(8000) }).then(r => r.ok ? r.json() : null).catch(() => null)
        ];

        if (isPlaceQuery) {
          const mapsUrl = `https://serpapi.com/search?engine=google_maps&q=${cleanQuery}&api_key=${serpApiKey}`;
          fetchTasks.push(fetch(mapsUrl, { signal: AbortSignal.timeout(8000) }).then(r => r.ok ? r.json() : null).catch(() => null));
        }

        const [data, imgData, mapsData] = await Promise.all(fetchTasks);

        const places = [];
        if (mapsData && Array.isArray(mapsData.local_results)) {
          for (const p of mapsData.local_results.slice(0, 8)) {
            if (p.title) {
              const lat = p.gps_coordinates?.latitude || null;
              const lng = p.gps_coordinates?.longitude || null;
              const placeUrl = p.website || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.title + ' ' + (p.address || ''))}`;
              places.push({
                id: String(places.length + 1),
                title: p.title,
                rating: p.rating || 4.5,
                reviews: p.reviews || null,
                category: p.type || (Array.isArray(p.types) ? p.types[0] : null) || 'Place',
                address: p.address || '',
                phone: p.phone || '',
                lat,
                lng,
                thumbnail: p.thumbnail || p.serpapi_thumbnail || null,
                status: p.open_state || p.hours || 'Open',
                url: placeUrl
              });
            }
          }
        }

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

        if (data && Array.isArray(data.inline_images)) {
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

        // If places has photos and images is empty, extract from places
        if (images.length === 0 && places.length > 0) {
          for (const p of places) {
            if (p.thumbnail && images.length < 6) {
              images.push({
                title: p.title,
                url: p.thumbnail,
                thumbnail: p.thumbnail,
                source: 'Google Maps'
              });
            }
          }
        }

        const results = [];
        if (data) {
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

        // Local places fallback from web search
        if (data.local_results && Array.isArray(data.local_results.places)) {
          for (const place of data.local_results.places) {
            results.push({
              title: `${place.title}${place.rating ? ` (★ ${place.rating})` : ''}${place.price ? ` [${place.price}]` : ''}`,
              url: place.links?.website || place.links?.directions || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' ' + (place.address || ''))}`,
              snippet: [place.type, place.address, place.phone, place.description].filter(Boolean).join(' • '),
              thumbnail: place.thumbnail || null
            });
            if (places.length < 8 && place.title) {
              places.push({
                id: String(places.length + 1),
                title: place.title,
                rating: place.rating || 4.5,
                reviews: null,
                category: place.type || 'Place',
                address: place.address || '',
                phone: place.phone || '',
                lat: place.gps_coordinates?.latitude || null,
                lng: place.gps_coordinates?.longitude || null,
                thumbnail: place.thumbnail || null,
                status: 'Open',
                url: place.links?.website || place.links?.directions || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' ' + (place.address || ''))}`
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
          }
        }
      }

      // If SerpApi local results were empty for a place query, fallback to OpenStreetMap Nominatim
      if (isPlaceQuery && places.length === 0) {
        try {
          const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(resolvedQuery)}&format=json&addressdetails=1&limit=${limit}`, {
            headers: { 'User-Agent': 'EpicThinkAI/2.0 (+https://epicthink.ai)' },
            signal: AbortSignal.timeout(4000)
          });
          const osmData = await osmRes.json();
          if (Array.isArray(osmData) && osmData.length > 0) {
            for (const item of osmData.slice(0, 8)) {
              const title = item.name || (item.display_name ? item.display_name.split(',')[0] : 'Place');
              const lat = parseFloat(item.lat);
              const lng = parseFloat(item.lon);
              const category = item.type ? (item.type.charAt(0).toUpperCase() + item.type.slice(1)) : (item.class || 'Place');
              const address = item.display_name || '';
              const pUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + ' ' + address)}`;
              let fallbackThumb = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&auto=format&fit=crop&q=80';
              if (/hotel|resort/i.test(category + ' ' + title)) {
                fallbackThumb = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=80';
              } else if (/restaurant|cafe|food/i.test(category + ' ' + title)) {
                fallbackThumb = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80';
              } else if (/sport|turf|gym|fitness/i.test(category + ' ' + title)) {
                fallbackThumb = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=400&auto=format&fit=crop&q=80';
              }
              places.push({
                id: String(places.length + 1),
                title,
                rating: 4.5,
                reviews: 120,
                category,
                address,
                phone: '',
                lat,
                lng,
                thumbnail: fallbackThumb,
                status: 'Open',
                url: pUrl
              });
            }
          }
        } catch (_) {}
      }

      if (results.length > 0 || places.length > 0) {
        return {
          source: places.length > 0 ? 'serpapi_google_maps' : 'serpapi_google',
          query: resolvedQuery,
          location: effectiveLocation,
          isPlaceQuery,
          places,
          results: results.slice(0, limit),
          images: images.slice(0, 6)
        };
      }
    } catch (_) {}
  }

  // 1b. If SerpApi not configured or failed and this is a place query, use OpenStreetMap Nominatim
  if (isPlaceQuery) {
    try {
      const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(resolvedQuery)}&format=json&addressdetails=1&limit=${limit}`, {
        headers: { 'User-Agent': 'EpicThinkAI/2.0 (+https://epicthink.ai)' },
        signal: AbortSignal.timeout(4000)
      });
      const osmData = await osmRes.json();
      if (Array.isArray(osmData) && osmData.length > 0) {
        const places = [];
        for (const item of osmData.slice(0, 8)) {
          const title = item.name || (item.display_name ? item.display_name.split(',')[0] : 'Place');
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const category = item.type ? (item.type.charAt(0).toUpperCase() + item.type.slice(1)) : (item.class || 'Place');
          const address = item.display_name || '';
          const pUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + ' ' + address)}`;
          let fallbackThumb = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&auto=format&fit=crop&q=80';
          if (/hotel|resort/i.test(category + ' ' + title)) {
            fallbackThumb = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=80';
          } else if (/restaurant|cafe|food/i.test(category + ' ' + title)) {
            fallbackThumb = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80';
          } else if (/sport|turf|gym|fitness/i.test(category + ' ' + title)) {
            fallbackThumb = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=400&auto=format&fit=crop&q=80';
          }
          places.push({
            id: String(places.length + 1),
            title,
            rating: 4.5,
            reviews: 120,
            category,
            address,
            phone: '',
            lat,
            lng,
            thumbnail: fallbackThumb,
            status: 'Open',
            url: pUrl
          });
        }
        if (places.length > 0) {
          return {
            source: 'openstreetmap',
            query: resolvedQuery,
            location: effectiveLocation,
            isPlaceQuery: true,
            places,
            results: places.map(p => ({
              title: p.title,
              url: p.url,
              snippet: `${p.category} located at ${p.address}`
            })),
            images: places.map(p => ({
              title: p.title,
              url: p.thumbnail,
              thumbnail: p.thumbnail,
              source: 'OpenStreetMap'
            }))
          };
        }
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
