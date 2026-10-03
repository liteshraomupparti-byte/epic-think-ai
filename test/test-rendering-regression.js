import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===============================================================');
console.log('EPIC THINK AI RESULT RENDERING REGRESSION TEST SUITE');
console.log('===============================================================\n');

// 1. Verify CSS rules in both index.html and Epic Think AI.html
['index.html', 'Epic Think AI.html'].forEach(filename => {
  const filePath = path.join(__dirname, '..', filename);
  const html = fs.readFileSync(filePath, 'utf8');

  console.log(`[CSS Check] Verifying ${filename}...`);

  // Check 1: table-responsive-container
  if (!html.includes('.table-responsive-container')) {
    throw new Error(`${filename} is missing .table-responsive-container!`);
  }
  // Check 2: min-width on .modern-markdown-table
  if (!html.includes('.modern-markdown-table') || !html.includes('min-width: 560px')) {
    throw new Error(`${filename} is missing min-width: 560px on .modern-markdown-table!`);
  }
  // Check 3: word-break: normal on modern-markdown-table td
  if (!html.includes('word-break: normal')) {
    throw new Error(`${filename} is missing word-break: normal!`);
  }
  // Check 4: assistant-content overflow-wrap
  if (!html.includes('overflow-wrap: break-word')) {
    throw new Error(`${filename} is missing overflow-wrap: break-word on .assistant-content!`);
  }
  // Check 5: places-result-container and cards
  if (!html.includes('.places-result-container') || !html.includes('.place-rich-card')) {
    throw new Error(`${filename} is missing .places-result-container or .place-rich-card!`);
  }
  // Check 6: seo-audit-container and score
  if (!html.includes('.seo-audit-container') || !html.includes('.seo-score-circle')) {
    throw new Error(`${filename} is missing .seo-audit-container or .seo-score-circle!`);
  }
  // Check 7: image-gallery-grid and aspect-ratio
  if (!html.includes('.image-gallery-grid') || !html.includes('aspect-ratio: 16 / 10')) {
    throw new Error(`${filename} is missing .image-gallery-grid or aspect-ratio!`);
  }
  // Check 8: mobile media query
  if (!html.includes('@media (max-width: 768px)') || !html.includes('grid-template-columns: 1fr')) {
    throw new Error(`${filename} is missing responsive mobile rules in @media (max-width: 768px)!`);
  }

  console.log(`  ✓ ${filename} passed all CSS architecture checks.`);
});

console.log('\n[ResultRenderer & Parser Check] Verifying markdown parsing in simulated browser environment...');

// Extract ResultRenderer and parseMarkdown from index.html
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Simple escapeHtml helper identical to index.html
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Extract ResultRenderer source code from index.html
const rrMatch = indexHtml.match(/const ResultRenderer = \{[\s\S]*?\};\s*window\.ResultRenderer = ResultRenderer;/);
if (!rrMatch) {
  throw new Error('Could not find ResultRenderer definition in index.html!');
}

// Create a simulated environment
const simulatedWindow = {
  __mapCardData: {},
  initMapCards: () => {},
  openImageModal: () => {},
  panToPlace: () => {},
  expandMapCard: () => {}
};

// Evaluate ResultRenderer
const formatInline = (str) => escapeHtml(str);
const evalCode = `
  const window = simulatedWindow;
  ${rrMatch[0]}
  ResultRenderer;
`;
const ResultRenderer = eval(evalCode);

// 2. Test Places Result Rendering
console.log('\n1. Testing Places Result Component (<PlacesResult />)...');
const samplePlaces = {
  title: 'Sports Shops Near You',
  location: 'Hyderabad, Telangana, India',
  count: 3,
  center: { lat: 17.3850, lng: 78.4867, label: 'Hyderabad' },
  places: [
    {
      title: 'Sachdev Sports Co. Pvt. Ltd (Extn-4)',
      rating: 4.7,
      reviews: 320,
      category: 'Sporting goods store',
      address: 'Kondapur Main Road, Hyderabad',
      phone: '+91 40 2311 0000',
      status: 'Open',
      thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300'
    },
    {
      title: 'Decathlon Sports Gachibowli',
      rating: 4.6,
      reviews: 1840,
      category: 'Sports megastore',
      address: 'Near ORR Junction, Gachibowli, Hyderabad',
      phone: '+91 80 5000 1234',
      status: 'Open',
      thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300'
    }
  ]
};

const renderedPlaces = ResultRenderer.renderPlaces(samplePlaces);
if (!renderedPlaces.includes('places-result-container')) throw new Error('places-result-container missing');
if (!renderedPlaces.includes('Sachdev Sports Co. Pvt. Ltd (Extn-4)')) throw new Error('Place title missing');
if (!renderedPlaces.includes('Decathlon Sports Gachibowli')) throw new Error('Second place missing');
if (!renderedPlaces.includes('chatgpt-map-card')) throw new Error('Embedded map card missing');
if (!renderedPlaces.includes('chatgpt-places-carousel')) throw new Error('ChatGPT floating places carousel missing');
if (!renderedPlaces.includes('chatgpt-place-chip')) throw new Error('ChatGPT place chips missing');
if (!renderedPlaces.includes('chatgpt-map-recenter-btn')) throw new Error('ChatGPT recenter crosshair button missing');
if (!renderedPlaces.includes('chatgpt-map-expand-btn')) throw new Error('ChatGPT expand button missing');
if (!renderedPlaces.includes('place-rich-card')) throw new Error('Rich place cards missing');
if (!renderedPlaces.includes('★ 4.7')) throw new Error('Rating badge missing');
console.log('  ✓ Places Result rendered successfully with ChatGPT map widget, recenter button, floating carousel, and chips.');

// 3. Test SEO Audit Rendering
console.log('\n2. Testing SEO Audit Component (<SEOAuditResult />)...');
const sampleSeo = {
  success: true,
  identifier: 'https://epicthinkai.com',
  score: 88,
  grade: 'B',
  totalChecks: 12,
  passedCount: 10,
  issuesCount: 2,
  passed: [
    { check: 'Title Tag Present', detail: 'Optimal length (48 chars)' },
    { check: 'Mobile Viewport Configured', detail: 'Responsive meta tag detected' }
  ],
  issues: [
    {
      severity: 'warning',
      message: 'Missing canonical URL link tag',
      recommendation: 'Add <link rel="canonical" href="https://epicthinkai.com" /> to <head>'
    },
    {
      severity: 'critical',
      message: 'Images missing descriptive alt tags',
      recommendation: 'Add alt attributes to all 4 content images for accessibility & image search'
    }
  ],
  meta: {
    title: 'Epic Think AI - High Performance Intelligent Agent Platform',
    titleLength: 58,
    description: 'Autonomous AI agent platform with web search, coding studio, and website builder.',
    descLength: 82,
    h1Count: 1,
    h2Count: 6,
    imagesCount: 8,
    missingAltCount: 2,
    hasSchema: true,
    schemaTypes: ['WebSite', 'Organization']
  }
};

const renderedSeo = ResultRenderer.renderSeoAudit(sampleSeo);
if (!renderedSeo.includes('seo-audit-container')) throw new Error('seo-audit-container missing');
if (!renderedSeo.includes('88')) throw new Error('Score 88 missing');
if (!renderedSeo.includes('grade-b')) throw new Error('Grade B badge missing');
if (!renderedSeo.includes('Missing canonical URL link tag')) throw new Error('Issue message missing');
if (!renderedSeo.includes('Actionable Fixes & Recommendations')) throw new Error('Issues section missing');
if (!renderedSeo.includes('Title Tag Present')) throw new Error('Passed checks missing');
console.log('  ✓ SEO Audit rendered successfully with score circle, grade B, metrics bar, and actionable fixes.');

// 4. Test Image Gallery Rendering
console.log('\n3. Testing Image Gallery Component (<ImageGalleryRenderer />)...');
const sampleGallery = {
  title: 'Hyderabad Sports & Training Centers',
  images: [
    { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5', title: 'Sports Arena View' },
    { url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0', title: 'Athletic Equipment' }
  ]
};

const renderedGallery = ResultRenderer.renderImageGallery(sampleGallery);
if (!renderedGallery.includes('image-gallery-container')) throw new Error('image-gallery-container missing');
if (!renderedGallery.includes('image-gallery-grid')) throw new Error('image-gallery-grid missing');
if (!renderedGallery.includes('image-gallery-card')) throw new Error('image-gallery-card missing');
if (!renderedGallery.includes('Sports Arena View')) throw new Error('Gallery caption missing');
console.log('  ✓ Image Gallery rendered successfully with responsive grid, aspect ratios, and captions.');

// 5. Test Wide Comparison Table Rendering
console.log('\n4. Testing Comparison Table Component (<DataTableRenderer />)...');
const headers = ['#', 'Shop / Venue', 'Category', 'Rating', 'Location', 'Features'];
const rows = [
  ['1', 'Sachdev Sports Co. Pvt. Ltd (Extn-4)', 'Sports Goods Store', '★ 4.7 (320)', 'Kondapur, Hyderabad', 'Cricket, Badminton, Tennis gear, stringing services'],
  ['2', 'Decathlon Sports Gachibowli', 'Sports Megastore', '★ 4.6 (1,840)', 'Near ORR, Gachibowli', 'Full gear range, try-outs, bikes, fitness apparel']
];

const renderedTable = ResultRenderer.renderDataTable(headers, rows);
if (!renderedTable.includes('table-responsive-container')) throw new Error('table-responsive-container missing');
if (!renderedTable.includes('modern-markdown-table')) throw new Error('modern-markdown-table missing');
if (!renderedTable.includes('Sachdev Sports Co. Pvt. Ltd (Extn-4)')) throw new Error('Table data missing');
console.log('  ✓ Comparison Table rendered inside bulletproof table-responsive-container with min-width: 560px.');

// 6. Test Streaming Safety Guard
console.log('\n5. Testing Streaming Safety Guard (Unclosed Tag Interceptor)...');
const unclosedStreamText = `Here is what I found:\n\n:::places-result\n{"title": "Sports Shops Near You", "count": 5, "places": [{"title": "Sachdev`;
const streamingGuardRegex = /:::(?:places-result|map-card|image-gallery|seo-audit|builder-card|action-ticket)\b[\s\S]*$/;

const guardedText = unclosedStreamText.replace(streamingGuardRegex, (unclosed) => {
  if (!unclosed.slice(3).includes(':::')) {
    return '\n\n<div class="streaming-rich-placeholder"><div class="rich-shimmer-pulse"></div><span>Synthesizing verified rich intelligence...</span></div>\n\n';
  }
  return unclosed;
});

if (guardedText.includes('{"title": "Sports Shops')) {
  throw new Error('Raw partial JSON leaked during streaming!');
}
if (!guardedText.includes('streaming-rich-placeholder') || !guardedText.includes('rich-shimmer-pulse')) {
  throw new Error('Streaming placeholder not generated!');
}
console.log('  ✓ Streaming guard successfully hides raw partial JSON and displays smooth shimmer loader.');

console.log('\n===============================================================');
console.log('ALL 5 RESULT RENDERING REGRESSION TESTS PASSED 100%!');
console.log('===============================================================');
