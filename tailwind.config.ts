import type { Config } from 'tailwindcss'

// ─────────────────────────────────────────────────────────────────────────────
// ARIA VOSS PORTFOLIO — tailwind.config.ts
//
// Every token in this file is consumed by app/page.tsx or app/globals.css.
// Nothing is speculative — each entry is cross-referenced to an actual class.
// ─────────────────────────────────────────────────────────────────────────────

const config: Config = {
  // ---------------------------------------------------------------------------
  // CONTENT — tell Tailwind where to look for class names so unused styles
  // are tree-shaken in production. Include all App Router source files.
  // ---------------------------------------------------------------------------
  content: [
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './lib/**/*.{ts,tsx}',
  ],

  // ---------------------------------------------------------------------------
  // THEME
  // ---------------------------------------------------------------------------
  theme: {
    extend: {

      // ───────────────────────────────────────────────────────────────────────
      // COLORS
      //
      // Used as: text-*, bg-*, border-*, fill-*, stroke-*, placeholder-*,
      //          ring-*, decoration-*, divide-*, accent-*
      //
      // All brand colours, plus Tailwind's full default palette, remain
      // available. These extend — they do NOT replace — the defaults.
      // ───────────────────────────────────────────────────────────────────────
      colors: {

        // ── Background layers (darkest → lightest) ───────────────────────────
        //
        // bg      → page root, footer, hero section, CTA section
        //           e.g. className="bg-bg"
        //
        // bg2     → alternating sections: services, process, testimonials,
        //           contact  e.g. className="bg-bg2"
        //
        // bg3     → card interiors: case-study cards, testimonial cards,
        //           form inputs  e.g. className="bg-bg3"
        //
        // surface → service card :hover fill (applied in globals.css),
        //           testimonial avatar background
        //           e.g. className="bg-surface"
        bg:      '#0a0a09',
        bg2:     '#111110',
        bg3:     '#181816',
        surface: '#1e1e1b',

        // ── Brand accent: amber-gold ─────────────────────────────────────────
        //
        // gold   → primary accent; text, borders, button fills, icon strokes,
        //          scrollbar thumb, marquee background, label lines
        //          e.g. className="text-gold bg-gold border-gold"
        //          Also used with opacity modifiers:
        //            border-gold/30  → card hover border
        //            border-gold/25  → cursor trail ring
        //            border-gold/[0.07] → CTA ring
        //            text-gold/30    → testimonial opening quote
        //            text-gold/[0.08] / text-gold/20 → process ghost numbers
        //
        // gold2  → button hover state only
        //          e.g. className="hover:bg-gold2"
        gold:  '#c9a84c',
        gold2: '#f0cc78',

        // ── Warm amber ───────────────────────────────────────────────────────
        // Used only inside the hero-glow backgroundImage gradient (not as a
        // standalone utility class), but defined here so it's accessible if
        // needed in future components.
        amber: '#e8a020',

        // ── Primary text colour ──────────────────────────────────────────────
        //
        // brand  → all headings, body text, links, footer logo
        //          e.g. className="text-brand"
        //          Also used with opacity modifier:
        //            text-brand/85 → testimonial quote text (slightly dimmed)
        brand: '#f0ede6',

        // ── Secondary / supporting text ──────────────────────────────────────
        //
        // muted  → body copy, nav links default state, stat labels,
        //          service descriptions, case study descriptions, form labels,
        //          contact link sub-labels, ghost button colour
        //          e.g. className="text-muted"
        muted: '#8a8780',

        // ── Tertiary / disabled text ─────────────────────────────────────────
        //
        // dim    → blog post dates, service tag default colour,
        //          footer copyright text, placeholder text in form inputs,
        //          ghost button border default  (border-dim)
        //          e.g. className="text-dim border-dim placeholder:text-dim"
        dim: '#4a4844',

        // ── Availability / success green ─────────────────────────────────────
        //
        // green  → availability badge text + pulsing dot fill
        //          form submit button background when message is sent
        //          e.g. className="text-green bg-green border-green/25"
        green: '#4caf7d',

        // ── Semantic border token ────────────────────────────────────────────
        //
        // border → default card borders, input borders, section dividers,
        //          process step gap fill, services grid gap fill
        //          e.g. className="border-border bg-border"
        //          Must match the CSS custom property --border exactly.
        border: 'rgba(255,255,255,0.07)',
      },

      // ───────────────────────────────────────────────────────────────────────
      // FONT FAMILIES
      //
      // All three fonts are loaded via Google Fonts @import in globals.css.
      // Used as: font-cormorant  /  font-mono  /  font-cabinet
      //
      // NOTE: 'mono' overrides Tailwind's built-in font-mono (system stack).
      // If you need the system monospace stack alongside DM Mono, rename this
      // to 'dm-mono' and update every font-mono class in page.tsx.
      // ───────────────────────────────────────────────────────────────────────
      fontFamily: {
        // Cormorant Garamond — elegant serif for all display text
        // Weights used: 300 (light), 400 (normal), 600 (semibold/logo)
        // Styles used: normal, italic (em tags inside headings)
        // Applied to: h1, h2, h3, stat numbers, testi quotes, avatar text,
        //             footer logo, case metric values
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],

        // DM Mono — technical monospace for micro-labels and UI text
        // Weights used: 300, 400, 500
        // Applied to: nav links, section labels, service numbers, tags,
        //             eyebrow text, blog dates, form labels, button text,
        //             availability badge, footer links, case/metric labels
        mono: ['"DM Mono"', '"Courier New"', 'monospace'],

        // Cabinet Grotesk — clean geometric sans for body and form inputs
        // Weights used: 400, 500, 700, 800
        // Applied to: body (via layout.tsx), form inputs and textarea
        //             (explicit font-cabinet on those elements)
        cabinet: ['"Cabinet Grotesk"', 'system-ui', 'sans-serif'],
      },

      // ───────────────────────────────────────────────────────────────────────
      // FONT SIZES
      //
      // Three semantic tokens for the clamp()-based responsive display sizes.
      // All three carry lineHeight, letterSpacing, and fontWeight defaults
      // so you only need the single class name at the call site.
      //
      // Used as: text-hero  /  text-section  /  text-cta
      // ───────────────────────────────────────────────────────────────────────
      fontSize: {
        // Hero h1 — "Digital / Strategy / Re-imagined."
        // Fluid between 4rem (mobile) and 9rem (widescreen)
        // className="font-cormorant font-light text-hero text-brand"
        hero: [
          'clamp(4rem, 8vw, 9rem)',
          {
            lineHeight:    '0.95',
            letterSpacing: '-0.02em',
            fontWeight:    '300',
          },
        ],

        // Section h2 — used in Services, Work, Process, Blog, Testi, Contact
        // Fluid between 2.5rem and 4.5rem
        // className="font-cormorant font-light text-section"
        section: [
          'clamp(2.5rem, 5vw, 4.5rem)',
          {
            lineHeight:    '1.05',
            letterSpacing: '-0.02em',
            fontWeight:    '300',
          },
        ],

        // CTA h2 — "Let's build something remarkable together"
        // Slightly larger than section to command the centred layout
        // className="font-cormorant font-light text-cta"
        cta: [
          'clamp(3rem, 6vw, 6rem)',
          {
            lineHeight: '1.05',
            fontWeight: '300',
          },
        ],
      },

      // ───────────────────────────────────────────────────────────────────────
      // BACKGROUND IMAGES
      //
      // Generates bg-{key} utility classes. Applied directly as classNames in
      // page.tsx wherever a complex gradient is needed.
      // ───────────────────────────────────────────────────────────────────────
      backgroundImage: {
        // ── Case study mock-browser backgrounds ──────────────────────────────
        //
        // case-v1 → Luminary Co. featured card (warm amber-brown tones)
        //           className="bg-case-v1"
        'case-v1': 'linear-gradient(135deg, #1a1208 0%, #2d1f0a 50%, #1a0e04 100%)',

        // case-v2 → SaaSify card (cool dark blue tones)
        //           className="bg-case-v2"
        'case-v2': 'linear-gradient(135deg, #080f1a 0%, #0a1a2d 50%, #04101a 100%)',

        // case-v3 → VerdeAgency card (dark green tones)
        //           className="bg-case-v3"
        'case-v3': 'linear-gradient(135deg, #0d1a0a 0%, #0a2d12 50%, #041a0a 100%)',

        // ── Blog card thumbnail backgrounds ──────────────────────────────────
        //
        // blog-b1 → AI & Automation post (warm dark gold)
        //           className="bg-blog-b1"
        'blog-b1': 'linear-gradient(135deg, #111005 0%, #1e1a08 50%, #0d0a03 100%)',

        // blog-b2 → Web Design post (dark cool blue-black)
        //           className="bg-blog-b2"
        'blog-b2': 'linear-gradient(135deg, #050810 0%, #080d1a 50%, #030510 100%)',

        // blog-b3 → Growth post (dark forest green-black)
        //           className="bg-blog-b3"
        'blog-b3': 'linear-gradient(135deg, #080f08 0%, #0d180d 50%, #050c05 100%)',

        // ── Hero atmospheric glow ─────────────────────────────────────────────
        //
        // Two overlapping radial ellipses stacked as a multi-value gradient:
        //   • Gold ellipse at top-right (80% 20%)
        //   • Amber ellipse at bottom-left (10% 80%)
        // Applied to an absolute-positioned overlay div above the bg-bg base.
        // className="bg-hero-glow bg-bg"  (bg-bg sets the solid fallback)
        'hero-glow': [
          'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 60%)',
          'radial-gradient(ellipse 40% 60% at 10% 80%, rgba(232,160,32,0.05) 0%, transparent 50%)',
        ].join(', '),

        // ── CTA section radial glow ───────────────────────────────────────────
        //
        // Single centred gold radial behind the pulsing rings.
        // Applied to an absolute overlay with bg-bg as fallback.
        // className="bg-cta-glow bg-bg"
        'cta-glow':
          'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)',
      },

      // ───────────────────────────────────────────────────────────────────────
      // GRID TEMPLATE COLUMNS
      //
      // Tailwind's built-in grid-cols-1 through grid-cols-12 cover most grids.
      // The blog layout uses a non-standard 1.6fr 1fr 1fr split that can't be
      // expressed without either this token or an arbitrary value.
      // Used as: grid-cols-blog  (or grid-cols-[1.6fr_1fr_1fr] inline)
      // ───────────────────────────────────────────────────────────────────────
      gridTemplateColumns: {
        // Blog section: featured post wider than the two secondary posts
        // className="grid md:grid-cols-blog"
        blog: '1.6fr 1fr 1fr',
      },

      // ───────────────────────────────────────────────────────────────────────
      // MAX WIDTH
      //
      // 1280px container used inside every section via a centering div.
      // In page.tsx this appears as max-w-[1280px] (arbitrary value).
      // Named here so it can be written as max-w-content in any component.
      // ───────────────────────────────────────────────────────────────────────
      maxWidth: {
        // className="max-w-content mx-auto"
        content: '1280px',
      },

      // ───────────────────────────────────────────────────────────────────────
      // Z-INDEX
      //
      // Values that exceed Tailwind's default scale (0/10/20/30/40/50).
      // In page.tsx, z-[100], z-[9998], z-[9999] are used as arbitrary values.
      // Naming them here enables the cleaner z-nav / z-cursor / z-trail syntax.
      // ───────────────────────────────────────────────────────────────────────
      zIndex: {
        nav:         '100',   // fixed navigation bar
        trail:       '9998',  // custom cursor trailing ring
        cursor:      '9999',  // custom cursor dot (topmost)
      },

      // ───────────────────────────────────────────────────────────────────────
      // TRANSITION TIMING FUNCTION
      //
      // The "sharp" cubic-bezier is used in globals.css for:
      //   • Service card gold underline sweep (::before scaleX)
      //   • btn-primary white shimmer (::after translateX)
      // Registered here as ease-sharp for potential use in inline Tailwind
      // transition utilities.
      // ───────────────────────────────────────────────────────────────────────
      transitionTimingFunction: {
        // className="ease-sharp"  (or used in CSS as transition-timing-function)
        sharp: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },

      // ───────────────────────────────────────────────────────────────────────
      // KEYFRAMES
      //
      // All @keyframes consumed by the animation tokens below.
      // Tailwind injects these into the stylesheet so no separate CSS is needed
      // for animation behaviour (though globals.css handles the scroll-reveal
      // transition separately, as it's driven by JS class toggling).
      // ───────────────────────────────────────────────────────────────────────
      keyframes: {

        // Entrance animation — used for all four hero elements
        // Elements start 24px below their resting position, opacity 0
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },

        // Infinite horizontal ticker — the marquee track div is doubled in
        // length (items rendered twice) so translateX(-50%) creates a seamless
        // loop with no visible jump
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },

        // Availability badge dot — alternates between full opacity and 30%
        // to simulate a live "active" indicator
        pulseDot: {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.3' },
        },

        // CTA concentric rings — scale slightly while fading to create a
        // slow breathing/sonar effect. translate(-50%,-50%) is included in
        // every keyframe to keep the ring centred on its absolute position.
        ringPulse: {
          '0%, 100%': {
            opacity:   '0.5',
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '50%': {
            opacity:   '0.2',
            transform: 'translate(-50%, -50%) scale(1.03)',
          },
        },
      },

      // ───────────────────────────────────────────────────────────────────────
      // ANIMATIONS
      //
      // Maps keyframes to utility class names with their full timing strings.
      // 'both' fill-mode means the animation applies its start state before
      // it begins (prevents flash of unstyled content on the hero text).
      // ───────────────────────────────────────────────────────────────────────
      animation: {

        // ── Hero entrance: four staggered waves ──────────────────────────────
        //
        // animate-fade-up-1 → hero eyebrow paragraph        (delay 0.2s)
        // animate-fade-up-2 → hero h1                       (delay 0.4s)
        // animate-fade-up-3 → hero description + actions    (delay 0.6s)
        // animate-fade-up-4 → hero stats row                (delay 0.8s)
        //
        // Uses ease-sharp (cubic-bezier) for a confident deceleration.
        'fade-up-1': 'fadeUp 0.8s 0.2s cubic-bezier(0.23,1,0.32,1) both',
        'fade-up-2': 'fadeUp 0.9s 0.4s cubic-bezier(0.23,1,0.32,1) both',
        'fade-up-3': 'fadeUp 0.9s 0.6s cubic-bezier(0.23,1,0.32,1) both',
        'fade-up-4': 'fadeUp 0.9s 0.8s cubic-bezier(0.23,1,0.32,1) both',

        // ── Marquee strip ─────────────────────────────────────────────────────
        //
        // animate-marquee → applied to the inner flex track div
        // 20s at linear easing so the scroll speed is perfectly constant.
        marquee: 'marquee 20s linear infinite',

        // ── Availability dot pulse ────────────────────────────────────────────
        //
        // animate-pulse-dot → the small green dot inside the badge
        // 2s period, ease-in-out for a smooth breath-like effect
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',

        // ── CTA rings ─────────────────────────────────────────────────────────
        //
        // animate-ring   → inner ring (600×600px)   — no delay
        // animate-ring-2 → outer ring (900×900px)   — 1.5s delay
        // Staggering the delay keeps the two rings visually out of phase,
        // creating a continuous outward-ripple / sonar effect.
        'ring':   'ringPulse 4s ease-in-out infinite',
        'ring-2': 'ringPulse 4s ease-in-out 1.5s infinite',
      },

    }, // end theme.extend
  },   // end theme

  // ---------------------------------------------------------------------------
  // PLUGINS
  //
  // No third-party Tailwind plugins are required. All custom component styles
  // (::before/::after pseudo-elements, scrollbar overrides, scroll-reveal
  // transitions, Google Fonts import, .section-label, .hero-grid-overlay,
  // .blog-thumb-pattern, .process-step dividers, .btn-primary shimmer) live
  // in app/globals.css using standard @layer base / @layer components.
  // ---------------------------------------------------------------------------
  plugins: [],
}

export default config