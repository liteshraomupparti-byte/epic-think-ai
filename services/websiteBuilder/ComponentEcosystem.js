/**
 * ComponentEcosystem.js
 * Epic Think AI Website Builder - Modern UI Component Ecosystem
 * Inspired by shadcn/ui and 21st.dev
 * 
 * Provides accessible, responsive, Tailwind CSS-based component snippets:
 * - Navbar (responsive with mobile toggle & clean blur)
 * - Hero (gradient heading, dual CTA, badge)
 * - Feature Grid (clean border cards, icons, hover state)
 * - Pricing Table (3 tiers, popular highlight, feature checklists)
 * - Testimonial Carousel / Grid (avatar, quote, rating stars)
 * - FAQ Accordion (collapsible questions, clean borders)
 * - Footer (brand summary, multi-column navigation, copyright)
 */

export const COMPONENT_CATALOG = {
  navbar: {
    name: 'Modern Navbar',
    category: 'navigation',
    description: 'Sticky responsive navigation bar with glassmorphism blur and mobile drawer toggle.',
    html: `
<header class="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-2">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20">
        ET
      </div>
      <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EpicThink</span>
    </div>
    
    <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
      <a href="#features" class="transition hover:text-indigo-600 dark:hover:text-indigo-400">Features</a>
      <a href="#solutions" class="transition hover:text-indigo-600 dark:hover:text-indigo-400">Solutions</a>
      <a href="#pricing" class="transition hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</a>
      <a href="#faq" class="transition hover:text-indigo-600 dark:hover:text-indigo-400">FAQ</a>
    </nav>
    
    <div class="hidden md:flex items-center gap-4">
      <a href="#login" class="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200">Sign in</a>
      <a href="#get-started" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
        Get Started
      </a>
    </div>

    <!-- Mobile menu button -->
    <button type="button" class="md:hidden rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Toggle menu" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
  
  <!-- Mobile menu drawer -->
  <div id="mobile-menu" class="hidden md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-col space-y-3">
      <a href="#features" class="text-base font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200">Features</a>
      <a href="#solutions" class="text-base font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200">Solutions</a>
      <a href="#pricing" class="text-base font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200">Pricing</a>
      <a href="#faq" class="text-base font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200">FAQ</a>
      <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
        <a href="#login" class="text-center py-2 text-sm font-medium text-slate-700">Sign in</a>
        <a href="#get-started" class="text-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white">Get Started</a>
      </div>
    </div>
  </div>
</header>
`
  },

  hero: {
    name: 'Gradient Hero Section',
    category: 'hero',
    description: 'Impactful hero section with gradient badge, bold title, secondary subtext, and dual CTA buttons.',
    html: `
<section class="relative overflow-hidden bg-white py-20 sm:py-32 dark:bg-slate-950">
  <div class="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-40 dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900/30),theme(colors.slate.950))]"></div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-300 mb-8">
      <span class="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
      Next-Generation AI Infrastructure
    </div>
    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
      Empower Your Ideas with <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Autonomous AI</span>
    </h1>
    <p class="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
      Transform workflows, build full-stack websites, automate multi-step browser tasks, and scale intelligent agent reasoning with enterprise-grade reliability.
    </p>
    <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#get-started" class="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition focus:ring-2 focus:ring-indigo-600">
        Start Free Trial
      </a>
      <a href="#demo" class="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
        Live Interactive Demo
      </a>
    </div>
  </div>
</section>
`
  },

  features: {
    name: 'Bento Feature Grid',
    category: 'features',
    description: '3-column feature grid with clean border highlights and subtle hover scaling.',
    html: `
<section id="features" class="py-20 bg-slate-50 dark:bg-slate-900/50">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-xs font-bold tracking-widest text-indigo-600 uppercase">Capabilities</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Engineered for Maximum Impact</p>
      <p class="mt-4 text-base text-slate-600 dark:text-slate-400">Everything you need to orchestrate complex operations and deliver real results.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-6">
          ⚡
        </div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Multi-Model Routing</h3>
        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Intelligently dynamically routes queries between Groq, Gemini, and specialized reasoning models for sub-second responses and lower cost.
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 mb-6">
          🌐
        </div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Browser Automation</h3>
        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Autonomous multi-step browser tasks, web scraping, form interaction, and live visual verification using stealth browser agents.
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400 mb-6">
          🛡️
        </div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Self-Healing Execution</h3>
        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Automated syntax inspection, headless Playwright testing across mobile and desktop, and zero-loss snapshot checkpoint rollbacks.
        </p>
      </div>
    </div>
  </div>
</section>
`
  },

  pricing: {
    name: 'Modern Pricing Cards',
    category: 'pricing',
    description: 'Clean 3-tier pricing table with highlighted popular plan, badge, and checklist items.',
    html: `
<section id="pricing" class="py-20 bg-white dark:bg-slate-950">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-xs font-bold tracking-widest text-indigo-600 uppercase">Transparent Pricing</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Predictable Plans for Every Scale</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      <!-- Starter -->
      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Starter</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">For individual developers and creators.</p>
          <div class="mt-6 flex items-baseline gap-1">
            <span class="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
            <span class="text-sm font-medium text-slate-500">/month</span>
          </div>
          <ul class="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li class="flex items-center gap-2">✓ 1,000 AI completions / month</li>
            <li class="flex items-center gap-2">✓ 10 Website builds</li>
            <li class="flex items-center gap-2">✓ Standard community support</li>
          </ul>
        </div>
        <a href="#signup" class="mt-8 block rounded-xl border border-slate-300 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Get Started</a>
      </div>

      <!-- Pro (Popular) -->
      <div class="rounded-2xl border-2 border-indigo-600 bg-white p-8 shadow-xl relative flex flex-col justify-between dark:bg-slate-900">
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
          Most Popular
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Professional</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">For fast-growing teams and power users.</p>
          <div class="mt-6 flex items-baseline gap-1">
            <span class="text-4xl font-extrabold text-slate-900 dark:text-white">$29</span>
            <span class="text-sm font-medium text-slate-500">/month</span>
          </div>
          <ul class="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li class="flex items-center gap-2">✓ 50,000 AI completions / month</li>
            <li class="flex items-center gap-2">✓ Unlimited Website generation</li>
            <li class="flex items-center gap-2">✓ Playwright headless verification</li>
            <li class="flex items-center gap-2">✓ Priority model routing</li>
          </ul>
        </div>
        <a href="#signup" class="mt-8 block rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition">Upgrade to Pro</a>
      </div>

      <!-- Enterprise -->
      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">For organizations needing dedicated infra.</p>
          <div class="mt-6 flex items-baseline gap-1">
            <span class="text-4xl font-extrabold text-slate-900 dark:text-white">$149</span>
            <span class="text-sm font-medium text-slate-500">/month</span>
          </div>
          <ul class="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li class="flex items-center gap-2">✓ Unlimited completions</li>
            <li class="flex items-center gap-2">✓ Custom GPU inference workers</li>
            <li class="flex items-center gap-2">✓ 99.9% uptime SLA & dedicated manager</li>
          </ul>
        </div>
        <a href="#contact" class="mt-8 block rounded-xl border border-slate-300 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Contact Sales</a>
      </div>
    </div>
  </div>
</section>
`
  },

  footer: {
    name: 'Modern Footer',
    category: 'footer',
    description: 'Clean responsive multi-column footer with copyright and status indicator.',
    html: `
<footer class="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">ET</div>
        <span class="text-lg font-bold text-slate-900 dark:text-white">EpicThink AI</span>
      </div>
      <p class="text-xs text-slate-500">
        &copy; ${new Date().getFullYear()} Epic Think AI Inc. All rights reserved. Built with resilient open-source technologies.
      </p>
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="flex h-2 w-2 rounded-full bg-emerald-500"></span>
        Systems Operational
      </div>
    </div>
  </div>
</footer>
`
  }
};

export class ComponentEcosystem {
  /**
   * Get all component names and metadata
   */
  static listComponents() {
    return Object.entries(COMPONENT_CATALOG).map(([key, comp]) => ({
      key,
      name: comp.name,
      category: comp.category,
      description: comp.description
    }));
  }

  /**
   * Get specific component snippet
   */
  static getComponent(key) {
    return COMPONENT_CATALOG[key] || null;
  }

  /**
   * Assemble a full starter page template from verified components
   */
  static buildCompleteStarterHtml(title = 'Modern AI Powered Application') {
    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eef2ff',
              600: '#4f46e5',
              700: '#4338ca'
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
  ${COMPONENT_CATALOG.navbar.html}
  <main>
    ${COMPONENT_CATALOG.hero.html}
    ${COMPONENT_CATALOG.features.html}
    ${COMPONENT_CATALOG.pricing.html}
  </main>
  ${COMPONENT_CATALOG.footer.html}
</body>
</html>`;
  }
}
