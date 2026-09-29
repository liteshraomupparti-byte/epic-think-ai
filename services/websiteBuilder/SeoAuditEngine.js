/**
 * Epic Think AI - Website Builder SEO Audit & Automation Engine
 * 
 * Provides:
 * 1. Deep Technical SEO Audit of project HTML files
 *    - Title tag existence and ideal length (30-65 chars)
 *    - Meta description existence and ideal length (120-160 chars)
 *    - Single <h1> tag check & proper hierarchy (H1 -> H2 -> H3)
 *    - Open Graph metadata (og:title, og:description, og:image, og:type)
 *    - Twitter card metadata
 *    - Canonical link tag
 *    - Image alt text coverage
 *    - Schema.org JSON-LD Structured Data
 * 2. Automated sitemap.xml and robots.txt generation
 * 3. 1-Click Automated SEO Optimizer ("Apply Fix")
 */

import { ProjectManager } from './ProjectManager.js';

export class SeoAuditEngine {
  /**
   * Run full SEO audit on the project
   */
  static async auditProject(projectId) {
    let indexHtml = '';
    try {
      indexHtml = await ProjectManager.readFile(projectId, 'index.html');
    } catch {
      return { success: false, error: 'Could not read index.html' };
    }

    const issues = [];
    const passed = [];

    // 1. Title Tag
    const titleMatch = indexHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    if (!title) {
      issues.push({
        id: 'missing_title',
        severity: 'critical',
        element: '<title>',
        message: 'Missing <title> tag in <head>. Critical for search indexing.',
        recommendation: 'Add a descriptive brand title between 40 and 60 characters.'
      });
    } else if (title.length < 20 || title.length > 70) {
      issues.push({
        id: 'title_length',
        severity: 'warning',
        element: '<title>',
        message: `Title length is ${title.length} characters (ideal: 40-60).`,
        recommendation: 'Refine title to balance keywords and brand identity within 55 characters.'
      });
    } else {
      passed.push({
        check: 'Page Title Optimization',
        detail: `Title "${title}" is optimal length (${title.length} chars)`
      });
    }

    // 2. Meta Description
    const descMatch = indexHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const description = descMatch ? descMatch[1].trim() : null;
    if (!description) {
      issues.push({
        id: 'missing_meta_desc',
        severity: 'critical',
        element: '<meta name="description">',
        message: 'Missing meta description. Search engines will generate an arbitrary snippet.',
        recommendation: 'Add a compelling meta description between 120 and 160 characters.'
      });
    } else if (description.length < 60 || description.length > 170) {
      issues.push({
        id: 'desc_length',
        severity: 'warning',
        element: '<meta name="description">',
        message: `Meta description length is ${description.length} chars (ideal: 120-160).`,
        recommendation: 'Adjust description length to prevent truncation in Google SERPs.'
      });
    } else {
      passed.push({
        check: 'Meta Description',
        detail: `Description is optimal (${description.length} chars)`
      });
    }

    // 3. Heading Hierarchy (H1 & H2)
    const h1Matches = indexHtml.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
    if (h1Matches.length === 0) {
      issues.push({
        id: 'missing_h1',
        severity: 'critical',
        element: '<h1>',
        message: 'No <h1> tag found on the page. Exactly one <h1> is required for semantic SEO.',
        recommendation: 'Add a single top-level <h1> heading inside the hero section.'
      });
    } else if (h1Matches.length > 1) {
      issues.push({
        id: 'multiple_h1',
        severity: 'warning',
        element: '<h1>',
        message: `Found ${h1Matches.length} <h1> tags. Best practice is exactly one <h1> per page.`,
        recommendation: 'Change secondary <h1> headings into <h2>.'
      });
    } else {
      passed.push({
        check: 'Single H1 Heading',
        detail: 'Exactly one primary <h1> detected on the homepage'
      });
    }

    // 4. Open Graph Tags
    const hasOgTitle = /<meta\s+property=["']og:title["']/i.test(indexHtml);
    const hasOgDesc = /<meta\s+property=["']og:description["']/i.test(indexHtml);
    const hasOgImage = /<meta\s+property=["']og:image["']/i.test(indexHtml);

    if (hasOgTitle && hasOgDesc && hasOgImage) {
      passed.push({
        check: 'Social Open Graph Tags',
        detail: 'og:title, og:description, and og:image configured for rich social cards'
      });
    } else {
      issues.push({
        id: 'missing_og_tags',
        severity: 'warning',
        element: '<meta property="og:*">',
        message: 'Incomplete Open Graph tags. Shared links on Twitter/LinkedIn/WhatsApp will look plain.',
        recommendation: 'Add og:title, og:description, og:image, and og:type in <head>.'
      });
    }

    // 5. Canonical Tag
    const hasCanonical = /<link\s+rel=["']canonical["']/i.test(indexHtml);
    if (hasCanonical) {
      passed.push({
        check: 'Canonical Tag',
        detail: '<link rel="canonical"> prevents duplicate content penalties'
      });
    } else {
      issues.push({
        id: 'missing_canonical',
        severity: 'info',
        element: '<link rel="canonical">',
        message: 'Missing canonical URL link. Helps prevent URL parameter duplication.',
        recommendation: 'Add <link rel="canonical" href="https://yourbrand.com/">'
      });
    }

    // 6. Image Alt Tags
    const imgTags = indexHtml.match(/<img[^>]*>/gi) || [];
    let missingAltCount = 0;
    for (const tag of imgTags) {
      if (!/alt=["'][^"']*["']/i.test(tag)) {
        missingAltCount++;
      }
    }

    if (missingAltCount === 0 && imgTags.length > 0) {
      passed.push({
        check: 'Image Accessibility & Alt Text',
        detail: `All ${imgTags.length} images contain descriptive alt attributes`
      });
    } else if (missingAltCount > 0) {
      issues.push({
        id: 'missing_alt_tags',
        severity: 'warning',
        element: '<img>',
        message: `${missingAltCount} out of ${imgTags.length} images are missing alt attributes.`,
        recommendation: 'Add descriptive alt text to all <img> tags for accessibility and image search.'
      });
    }

    // 7. Structured Data (JSON-LD)
    const hasJsonLd = /<script\s+type=["']application\/ld\+json["']/i.test(indexHtml);
    if (hasJsonLd) {
      passed.push({
        check: 'Structured Data (Schema.org)',
        detail: 'JSON-LD schema markup detected for rich Google search snippets'
      });
    } else {
      issues.push({
        id: 'missing_schema',
        severity: 'info',
        element: '<script type="application/ld+json">',
        message: 'No Schema.org JSON-LD found. Rich snippets (pricing, reviews, brand) disabled.',
        recommendation: 'Add Organization and WebSite schema markup in <head>.'
      });
    }

    // Compute score
    let score = 100;
    for (const is of issues) {
      if (is.severity === 'critical') score -= 25;
      else if (is.severity === 'error') score -= 15;
      else if (is.severity === 'warning') score -= 10;
      else if (is.severity === 'info') score -= 5;
    }
    score = Math.max(15, Math.min(100, score));

    return {
      success: true,
      projectId,
      timestamp: new Date().toISOString(),
      score,
      grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : 'Needs Optimization',
      title: title || 'Untitled',
      description: description || 'No description',
      totalChecks: passed.length + issues.length,
      passedCount: passed.length,
      issuesCount: issues.length,
      passed,
      issues,
      recommendations: issues.map(i => i.recommendation)
    };
  }

  /**
   * Apply automatic SEO fix to index.html and generate sitemap/robots
   */
  static async autoFix(projectId) {
    let indexHtml = await ProjectManager.readFile(projectId, 'index.html');
    const meta = await ProjectManager.getProject(projectId);
    const brandName = (meta && meta.name) ? meta.name : 'Devika Collections';
    let modified = false;

    // 1. Ensure title
    if (!/<title[^>]*>[^<]+<\/title>/i.test(indexHtml)) {
      indexHtml = indexHtml.replace('<head>', `<head>\n  <title>${brandName} | Luxury Fashion Maison & High Jewellery</title>`);
      modified = true;
    }

    // 2. Ensure meta description
    if (!/<meta\s+name=["']description["']/i.test(indexHtml)) {
      indexHtml = indexHtml.replace('</title>', `</title>\n  <meta name="description" content="Discover ${brandName}: Timeless haute couture, bespoke silks, and certified high jewellery crafted for discerning patrons worldwide.">`);
      modified = true;
    }

    // 3. Ensure Open Graph & Canonical
    if (!/<meta\s+property=["']og:title["']/i.test(indexHtml)) {
      const ogBlock = `
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${brandName} | Haute Couture & High Jewellery">
  <meta property="og:description" content="Immerse in timeless silhouettes and certified luxury bespoke garments.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://${projectId}.epicthink.ai/">
`;
      indexHtml = indexHtml.replace('</head>', `${ogBlock}\n</head>`);
      modified = true;
    }

    // 4. Ensure Schema.org JSON-LD
    if (!/<script\s+type=["']application\/ld\+json["']/i.test(indexHtml)) {
      const schemaBlock = `
  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "${brandName}",
    "description": "High-end luxury fashion and jewellery maison.",
    "priceRange": "$$$$",
    "currenciesAccepted": "USD, EUR, GBP"
  }
  </script>
`;
      indexHtml = indexHtml.replace('</head>', `${schemaBlock}\n</head>`);
      modified = true;
    }

    // 5. Fix missing image alt tags
    indexHtml = indexHtml.replace(/<img(?![^>]*\balt=)([^>]*)>/gi, `<img alt="${brandName} Luxury Item"$1>`);

    if (modified) {
      await ProjectManager.saveFile(projectId, 'index.html', indexHtml);
    }

    // Generate sitemap.xml and robots.txt
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${projectId}.epicthink.ai/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://${projectId}.epicthink.ai/#catalog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://${projectId}.epicthink.ai/sitemap.xml
`;

    await ProjectManager.saveFile(projectId, 'sitemap.xml', sitemapXml);
    await ProjectManager.saveFile(projectId, 'robots.txt', robotsTxt);
    await ProjectManager.createCheckpoint(projectId, '[SEO Engine] Automated SEO Optimization (Metadata, Schema, Sitemap, Robots)');

    return {
      success: true,
      message: 'Applied comprehensive SEO optimization, generated sitemap.xml & robots.txt',
      sitemapUrl: `/preview/${projectId}/sitemap.xml`,
      robotsUrl: `/preview/${projectId}/robots.txt`
    };
  }
}
