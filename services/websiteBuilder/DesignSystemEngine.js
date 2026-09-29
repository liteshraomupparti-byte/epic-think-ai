/**
 * Epic Think AI - Design System Engine
 * 
 * Manages reusable design token systems:
 * - Color palettes (Primary, Secondary, Accent, Backgrounds, Borders, Luxury Shimmers)
 * - Typography (Font families, scales, weights, line-heights)
 * - Spatial metrics (Padding, margins, gap scales)
 * - Elevation & Shadows (Layered ambient, glow, luxury gold reflections)
 * - Responsive breakpoints (Mobile, Tablet, Desktop, Wide)
 * - Micro-interaction animation tokens
 */

export const THEME_PRESETS = {
  luxury_gold: {
    id: 'luxury_gold',
    name: 'Luxury Black & Gold',
    description: 'High-end luxury aesthetic with deep obsidian blacks, champagne gold accents, and subtle metallic shimmers.',
    tokens: {
      colors: {
        bgMain: '#0a0a0c',
        bgSecondary: '#121216',
        bgCard: 'rgba(24, 24, 30, 0.75)',
        bgCardHover: 'rgba(34, 34, 42, 0.85)',
        bgGlass: 'rgba(18, 18, 22, 0.65)',
        borderMain: '#262420',
        borderGold: '#c5a059',
        borderSubtle: 'rgba(197, 160, 89, 0.2)',
        textMain: '#f5f5f7',
        textSecondary: '#a1a1aa',
        textMuted: '#71717a',
        goldPrimary: '#c5a059',
        goldLight: '#e5c98a',
        goldDark: '#937435',
        goldGradient: 'linear-gradient(135deg, #c5a059 0%, #e5c98a 50%, #937435 100%)',
        darkGradient: 'linear-gradient(180deg, #0a0a0c 0%, #141418 100%)',
        accentGlow: 'rgba(197, 160, 89, 0.25)',
        danger: '#ef4444',
        success: '#10b981'
      },
      typography: {
        fontFamilyHeadings: "'Playfair Display', 'Cinzel', serif",
        fontFamilyBody: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontFamilyMono: "'JetBrains Mono', monospace",
        h1: 'clamp(2.5rem, 5vw, 4.2rem)',
        h2: 'clamp(2rem, 3.5vw, 3rem)',
        h3: 'clamp(1.5rem, 2.5vw, 2.2rem)',
        h4: '1.4rem',
        bodyLarge: '1.15rem',
        bodyRegular: '1rem',
        bodySmall: '0.875rem',
        caption: '0.75rem',
        letterSpacingWide: '0.08em',
        letterSpacingUltra: '0.18em'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '36px',
        xxl: '64px',
        section: '100px'
      },
      radius: {
        sm: '4px',
        md: '8px',
        lg: '14px',
        pill: '9999px'
      },
      shadows: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
        md: '0 8px 24px rgba(0, 0, 0, 0.6)',
        lg: '0 16px 40px rgba(0, 0, 0, 0.8)',
        goldGlow: '0 0 25px rgba(197, 160, 89, 0.25)',
        goldBorder: 'inset 0 0 0 1px rgba(197, 160, 89, 0.35)'
      }
    }
  },
  modern_saas: {
    id: 'modern_saas',
    name: 'Modern SaaS (Deep Tech)',
    description: 'Clean dark mode SaaS theme with indigo accents, crisp contrast, and glassmorphic cards.',
    tokens: {
      colors: {
        bgMain: '#090d16',
        bgSecondary: '#0f172a',
        bgCard: 'rgba(30, 41, 59, 0.7)',
        bgCardHover: 'rgba(51, 65, 85, 0.8)',
        bgGlass: 'rgba(15, 23, 42, 0.65)',
        borderMain: '#1e293b',
        borderGold: '#6366f1',
        borderSubtle: 'rgba(99, 102, 241, 0.2)',
        textMain: '#f8fafc',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
        goldPrimary: '#6366f1',
        goldLight: '#818cf8',
        goldDark: '#4f46e5',
        goldGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        darkGradient: 'linear-gradient(180deg, #090d16 0%, #0f172a 100%)',
        accentGlow: 'rgba(99, 102, 241, 0.25)',
        danger: '#ef4444',
        success: '#10b981'
      },
      typography: {
        fontFamilyHeadings: "'Inter', sans-serif",
        fontFamilyBody: "'Inter', sans-serif",
        fontFamilyMono: "'JetBrains Mono', monospace",
        h1: 'clamp(2.5rem, 5vw, 4rem)',
        h2: 'clamp(1.8rem, 3.2vw, 2.6rem)',
        h3: 'clamp(1.4rem, 2vw, 1.8rem)',
        h4: '1.25rem',
        bodyLarge: '1.1rem',
        bodyRegular: '0.95rem',
        bodySmall: '0.85rem',
        caption: '0.75rem',
        letterSpacingWide: '0.02em',
        letterSpacingUltra: '0.05em'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '56px',
        section: '80px'
      },
      radius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        pill: '9999px'
      },
      shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
        md: '0 4px 16px rgba(0, 0, 0, 0.4)',
        lg: '0 12px 32px rgba(0, 0, 0, 0.6)',
        goldGlow: '0 0 20px rgba(99, 102, 241, 0.3)',
        goldBorder: 'inset 0 0 0 1px rgba(99, 102, 241, 0.3)'
      }
    }
  }
};

export class DesignSystemEngine {
  constructor(activePresetId = 'luxury_gold') {
    this.preset = THEME_PRESETS[activePresetId] || THEME_PRESETS.luxury_gold;
    this.customTokens = {};
  }

  /**
   * Set theme preset
   */
  setPreset(presetId) {
    if (THEME_PRESETS[presetId]) {
      this.preset = THEME_PRESETS[presetId];
    }
  }

  /**
   * Update individual token values
   */
  updateToken(category, key, value) {
    if (!this.customTokens[category]) {
      this.customTokens[category] = {};
    }
    this.customTokens[category][key] = value;
  }

  /**
   * Get merged effective tokens
   */
  getTokens() {
    const base = JSON.parse(JSON.stringify(this.preset.tokens));
    for (const [cat, tokens] of Object.entries(this.customTokens)) {
      if (base[cat]) {
        Object.assign(base[cat], tokens);
      }
    }
    return base;
  }

  /**
   * Generate standard CSS variables stylesheet
   */
  generateCssVariables() {
    const tokens = this.getTokens();
    const c = tokens.colors;
    const t = tokens.typography;
    const s = tokens.spacing;
    const r = tokens.radius;
    const sh = tokens.shadows;

    return `/* ==============================================================================
 * Epic Think AI - Design System Variables
 * Theme: ${this.preset.name}
 * ============================================================================== */

:root {
  /* Colors */
  --bg-main: ${c.bgMain};
  --bg-secondary: ${c.bgSecondary};
  --bg-card: ${c.bgCard};
  --bg-card-hover: ${c.bgCardHover};
  --bg-glass: ${c.bgGlass};
  --border-main: ${c.borderMain};
  --border-accent: ${c.borderGold};
  --border-subtle: ${c.borderSubtle};
  --text-main: ${c.textMain};
  --text-secondary: ${c.textSecondary};
  --text-muted: ${c.textMuted};
  --accent-primary: ${c.goldPrimary};
  --accent-light: ${c.goldLight};
  --accent-dark: ${c.goldDark};
  --accent-gradient: ${c.goldGradient};
  --dark-gradient: ${c.darkGradient};
  --accent-glow: ${c.accentGlow};
  --color-danger: ${c.danger};
  --color-success: ${c.success};

  /* Typography */
  --font-headings: ${t.fontFamilyHeadings};
  --font-body: ${t.fontFamilyBody};
  --font-mono: ${t.fontFamilyMono};
  --font-size-h1: ${t.h1};
  --font-size-h2: ${t.h2};
  --font-size-h3: ${t.h3};
  --font-size-h4: ${t.h4};
  --font-size-lg: ${t.bodyLarge};
  --font-size-base: ${t.bodyRegular};
  --font-size-sm: ${t.bodySmall};
  --font-size-xs: ${t.caption};
  --letter-spacing-wide: ${t.letterSpacingWide};
  --letter-spacing-ultra: ${t.letterSpacingUltra};

  /* Spacing Scale */
  --space-xs: ${s.xs};
  --space-sm: ${s.sm};
  --space-md: ${s.md};
  --space-lg: ${s.lg};
  --space-xl: ${s.xl};
  --space-xxl: ${s.xxl};
  --space-section: ${s.section};

  /* Border Radii */
  --radius-sm: ${r.sm};
  --radius-md: ${r.md};
  --radius-lg: ${r.lg};
  --radius-pill: ${r.pill};

  /* Shadows & Elevations */
  --shadow-sm: ${sh.sm};
  --shadow-md: ${sh.md};
  --shadow-lg: ${sh.lg};
  --shadow-accent-glow: ${sh.goldGlow};
  --shadow-accent-border: ${sh.goldBorder};

  /* Transitions */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Base Body Application */
body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-main);
  color: var(--text-main);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-headings);
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-main);
  letter-spacing: var(--letter-spacing-wide);
}

.gold-gradient-text {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.luxury-card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  transition: all var(--transition-smooth);
}

.luxury-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-accent);
  box-shadow: var(--shadow-accent-glow);
  transform: translateY(-2px);
}

.luxury-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--accent-gradient);
  color: #0a0a0c;
  font-family: var(--font-headings);
  font-weight: 700;
  font-size: 13.5px;
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-smooth);
  text-decoration: none;
}

.luxury-btn:hover {
  filter: brightness(1.15);
  box-shadow: var(--shadow-accent-glow);
  transform: translateY(-1px);
}

.luxury-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 26px;
  background: transparent;
  color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
  font-family: var(--font-headings);
  font-weight: 600;
  font-size: 13.5px;
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-smooth);
  text-decoration: none;
}

.luxury-btn-secondary:hover {
  background: rgba(197, 160, 89, 0.12);
  border-color: var(--accent-light);
  color: var(--accent-light);
}
`;
  }
}

export const designSystem = new DesignSystemEngine('luxury_gold');
