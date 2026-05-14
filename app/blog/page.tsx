'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ─────────────────────────────────────────────────────────────────
   TYPES
   Structured so the POSTS array below can be replaced by a
   fetch() from any headless CMS (Sanity, Contentful, Payload)
   or a local Markdown glob — just keep the BlogPost shape.
───────────────────────────────────────────────────────────────── */
export interface BlogPost {
  slug:     string
  category: string
  date:     string
  title:    string
  excerpt:  string
  readTime: string
  featured: boolean
  gradient: 'gold' | 'blue' | 'green' | 'purple' | 'rose' | 'teal'
}

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  'All', 'AI Tools', 'Google Ads', 'Local Services',
  'Real Estate', 'SEO', 'Web Design', 'Automation',
] as const
type Category = (typeof CATEGORIES)[number]

const POSTS_PER_PAGE = 9

const NAV_LINKS = [
  { label: 'Home',     href: '/'         },
  { label: 'Services', href: '/services' },
  { label: 'Blog',     href: '/blog'     },
  { label: 'Contact',  href: '/#contact' },
] as const

const MARQUEE_ITEMS = [
  'Google Ads', 'AI Tools', 'Meta Ads', 'Local SEO', 'Automation',
  'Web Design', 'CRO', 'Real Estate', 'Lead Generation', 'eCommerce',
]

/* ─────────────────────────────────────────────────────────────────
   GRADIENT MAPS
───────────────────────────────────────────────────────────────── */
const GRADIENT_BG: Record<BlogPost['gradient'], string> = {
  gold:   'linear-gradient(135deg,#1a1208 0%,#2d1f0a 50%,#181005 100%)',
  blue:   'linear-gradient(135deg,#080f1a 0%,#0a1a2d 50%,#04101a 100%)',
  green:  'linear-gradient(135deg,#0d1a0a 0%,#0a2d12 50%,#051005 100%)',
  purple: 'linear-gradient(135deg,#120a1a 0%,#1e0a2d 50%,#0d0510 100%)',
  rose:   'linear-gradient(135deg,#1a080d 0%,#2d0a14 50%,#1a0509 100%)',
  teal:   'linear-gradient(135deg,#081a18 0%,#0a2d28 50%,#041a18 100%)',
}

const GRADIENT_ACCENT: Record<BlogPost['gradient'], string> = {
  gold:   'rgba(201,168,76,0.18)',
  blue:   'rgba(76,154,240,0.15)',
  green:  'rgba(76,175,125,0.15)',
  purple: 'rgba(160,76,220,0.15)',
  rose:   'rgba(220,76,100,0.15)',
  teal:   'rgba(76,210,200,0.15)',
}

/* ─────────────────────────────────────────────────────────────────
   POSTS DATA
   CMS-ready: replace with `await fetch('/api/posts')` later.
───────────────────────────────────────────────────────────────── */
const POSTS: BlogPost[] = [
  {
    slug:     'google-ads-local-service-businesses-2025',
    category: 'Google Ads',
    date:     'Jun 10, 2025',
    title:    'The Google Ads Playbook Every Local Service Business Needs in 2025',
    excerpt:  'Broad match keywords, weak landing pages, and zero conversion tracking are quietly draining local ad budgets. Here is the exact account structure that cuts cost-per-lead by 60% and triples inbound call volume.',
    readTime: '11 min read',
    featured: true,
    gradient: 'gold',
  },
  {
    slug:     'ai-crm-automation-lead-follow-up',
    category: 'Automation',
    date:     'Jun 4, 2025',
    title:    'How to Build an AI Follow-Up System That Books Appointments While You Sleep',
    excerpt:  'Most leads go cold because the follow-up is slow and manual. This is the exact GPT + Make.com workflow we deploy for service businesses to cut response time to under 5 minutes — automatically.',
    readTime: '9 min read',
    featured: false,
    gradient: 'blue',
  },
  {
    slug:     'real-estate-facebook-ads-strategy',
    category: 'Real Estate',
    date:     'May 28, 2025',
    title:    'Why Real Estate Facebook Ads Fail — And the Audience Architecture That Actually Converts',
    excerpt:  'Boosting posts and targeting "homeowners aged 25–65" is not a strategy. This breakdown covers intent-layered audience stacks, creative angles, and the landing page structure that generates qualified seller leads.',
    readTime: '8 min read',
    featured: false,
    gradient: 'rose',
  },
  {
    slug:     'local-seo-technical-foundation',
    category: 'SEO',
    date:     'May 20, 2025',
    title:    'Local SEO in 2025: The Technical Foundation That Puts You on Page One',
    excerpt:  'Google Business Profile optimisation, citation consistency, E-E-A-T signals, and schema markup — the four pillars that move local service businesses from invisible to dominant in organic search.',
    readTime: '10 min read',
    featured: false,
    gradient: 'green',
  },
  {
    slug:     'landing-page-cro-design-decisions',
    category: 'Web Design',
    date:     'May 14, 2025',
    title:    'Landing Page CRO: The 8 Design Decisions That Are Killing Your Conversion Rate',
    excerpt:  'Weak headlines, buried CTAs, stock photography, and no social proof. Most landing pages lose 70% of their traffic before a single form is submitted. Here is what to fix first.',
    readTime: '7 min read',
    featured: false,
    gradient: 'purple',
  },
  {
    slug:     'ai-stack-replaces-agency-software',
    category: 'AI Tools',
    date:     'May 7, 2025',
    title:    'The AI Stack That Replaces $40,000 Per Year in Agency Software',
    excerpt:  'GPT-4o for content, Perplexity for research, Make for automation, ElevenLabs for voice — the exact tools and workflows we use internally to run faster, leaner, and smarter than traditional agencies.',
    readTime: '12 min read',
    featured: false,
    gradient: 'teal',
  },
  {
    slug:     'google-ads-quality-score-guide',
    category: 'Google Ads',
    date:     'Apr 29, 2025',
    title:    'Quality Score Explained: How to Lower Your CPC Without Touching Your Bid',
    excerpt:  'Quality Score is the lever most advertisers ignore. Improve ad relevance, expected CTR, and landing page experience and Google literally charges you less per click. Here is how it works in practice.',
    readTime: '8 min read',
    featured: false,
    gradient: 'gold',
  },
  {
    slug:     'hvac-roofing-lead-generation-system',
    category: 'Local Services',
    date:     'Apr 21, 2025',
    title:    'The Lead System Built for Roofers, HVAC Companies, and Plumbers',
    excerpt:  'Seasonal demand, high ticket value, local radius. Home service businesses have a unique growth profile. This is the three-channel system that generates 40–80 qualified leads per month, predictably.',
    readTime: '9 min read',
    featured: false,
    gradient: 'blue',
  },
  {
    slug:     'nextjs-vs-wordpress-service-businesses',
    category: 'Web Design',
    date:     'Apr 15, 2025',
    title:    'Why Your Business Website Should Be Built in Next.js — Not WordPress',
    excerpt:  'Speed, Core Web Vitals, SEO architecture, and conversion engineering — Next.js gives service businesses a measurable competitive edge in organic search and ad performance. Here is the full case for switching.',
    readTime: '7 min read',
    featured: false,
    gradient: 'green',
  },
  {
    slug:     'real-estate-seo-content-strategy',
    category: 'Real Estate',
    date:     'Apr 8, 2025',
    title:    'The Content Strategy That Puts Real Estate Agents on Page One Without Paid Ads',
    excerpt:  'Neighbourhood guides, market reports, and schema-tagged listings — the organic content architecture that compounds over 12 months and reduces dependence on expensive portal lead purchases.',
    readTime: '10 min read',
    featured: false,
    gradient: 'rose',
  },
  {
    slug:     'ai-proposal-automation-agencies',
    category: 'Automation',
    date:     'Apr 1, 2025',
    title:    'From Intake Form to Signed Proposal in 12 Minutes — The AI Workflow Behind It',
    excerpt:  'How we automated the entire proposal pipeline for a consulting firm: Tally intake → GPT scope generation → PDF creation → CRM update → follow-up sequence. Every step documented.',
    readTime: '11 min read',
    featured: false,
    gradient: 'purple',
  },
  {
    slug:     'ecommerce-meta-ads-scaling',
    category: 'AI Tools',
    date:     'Mar 25, 2025',
    title:    'Scaling eCommerce Meta Ads Past $50K/Month Without Audience Fatigue',
    excerpt:  'Creative velocity, broad audience expansion, and value-based lookalikes — the framework for scaling Meta spend while keeping ROAS stable and preventing the burnout that kills most scaling attempts.',
    readTime: '9 min read',
    featured: false,
    gradient: 'teal',
  },
]

/* ─────────────────────────────────────────────────────────────────
   SHARED UI COMPONENTS — exact signatures as homepage & services
───────────────────────────────────────────────────────────────── */
function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`section-label ${className}`}>{children}</p>
}

function SectionTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-cormorant font-light text-section text-brand leading-tight tracking-tight ${className}`}>
      {children}
    </h2>
  )
}

function BtnPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="btn-primary inline-flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.12em] uppercase text-bg bg-gold px-10 py-4 no-underline transition-transform hover:-translate-y-0.5"
    >
      {children}
    </a>
  )
}

function BtnGhost({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.12em] uppercase text-muted border-b border-dim pb-px no-underline transition-colors hover:text-gold hover:border-gold"
    >
      {children}
    </a>
  )
}

/* ─────────────────────────────────────────────────────────────────
   CARD THUMBNAIL — gradient placeholder with diagonal rule pattern
───────────────────────────────────────────────────────────────── */
function CardThumb({
  gradient,
  category,
  height = 'h-52',
  showFeaturedBadge = false,
}: {
  gradient: BlogPost['gradient']
  category: string
  height?: string
  showFeaturedBadge?: boolean
}) {
  const accent = GRADIENT_ACCENT[gradient]
  return (
    <div className={`relative overflow-hidden ${height} flex-shrink-0`}>
      {/* base gradient */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ background: GRADIENT_BG[gradient] }}
      />
      {/* diagonal rule pattern */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent, transparent 22px,
            ${accent} 22px, ${accent} 23px
          )`,
        }}
      />
      {/* corner radial glow */}
      <div
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-35"
        style={{ background: `radial-gradient(circle,${accent} 0%,transparent 70%)` }}
      />
      {/* badges */}
      <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
        {showFeaturedBadge && (
          <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-bg bg-gold px-3 py-1.5 leading-none">
            Featured
          </span>
        )}
        <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted border border-white/[0.15] px-3 py-1.5 bg-bg/60 backdrop-blur-sm leading-none">
          {category}
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef  = useRef<HTMLDivElement>(null)
  const pos       = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 })
  const raf       = useRef<number>(0)

  const onMove = useCallback((e: MouseEvent) => {
    pos.current.tx = e.clientX
    pos.current.ty = e.clientY
    if (cursorRef.current)
      cursorRef.current.style.transform = `translate(${e.clientX - 6}px,${e.clientY - 6}px)`
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', onMove)
    const tick = () => {
      const p = pos.current
      p.cx += (p.tx - p.cx) * 0.1
      p.cy += (p.ty - p.cy) * 0.1
      if (trailRef.current)
        trailRef.current.style.transform = `translate(${p.cx - 20}px,${p.cy - 20}px)`
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [onMove])

  return { cursorRef, trailRef }
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function BlogPage() {
  useScrollReveal()
  const { cursorRef, trailRef } = useCursor()

  const [scrolled,       setScrolled]       = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [currentPage,    setCurrentPage]    = useState(1)
  const [email,          setEmail]          = useState('')
  const [subscribed,     setSubscribed]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // reset page on filter change
  useEffect(() => { setCurrentPage(1) }, [activeCategory])

  /* ── derived ── */
  const featuredPost = POSTS.find(p => p.featured)!

  const gridPosts = POSTS.filter(p => {
    if (p.featured) return false
    if (activeCategory === 'All') return true
    return p.category === activeCategory
  })

  const totalPages = Math.ceil(gridPosts.length / POSTS_PER_PAGE)
  const pagedPosts = gridPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  )

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) { setSubscribed(true); setEmail('') }
  }

  /* ── scroll to grid top when page changes ── */
  function changePage(n: number) {
    setCurrentPage(n)
    document.getElementById('blog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* ── Custom cursor ── */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full border border-gold mix-blend-difference"
        style={{ transition: 'opacity 0.2s' }}
      />
      <div
        ref={trailRef}
        className="fixed pointer-events-none z-[9998] w-10 h-10 rounded-full border border-gold/25"
        style={{ transition: 'opacity 0.3s' }}
      />

      {/* ══════════════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-8 md:px-16 py-6 backdrop-blur-xl transition-colors duration-300 ${
          scrolled ? 'border-b border-white/10' : 'border-b border-white/[0.07]'
        }`}
        style={{ background: 'linear-gradient(180deg,rgba(10,10,9,0.97) 0%,transparent 100%)' }}
      >
        <a href="/" className="font-cormorant text-[1.4rem] font-semibold tracking-[0.02em] text-brand no-underline">
          Nexyra<span className="text-gold">.</span>
        </a>

        <ul className="hidden md:flex gap-10 list-none">
          {NAV_LINKS.map(l => (
            <li key={l.label}>
              <a
                href={l.href}
                className={`font-mono text-[0.72rem] tracking-[0.12em] uppercase no-underline transition-colors ${
                  l.href === '/blog' ? 'text-gold' : 'text-muted hover:text-gold'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/#contact"
          className="font-mono text-[0.72rem] tracking-[0.1em] uppercase text-bg bg-gold px-6 py-2.5 no-underline hover:bg-gold2 transition-all hover:-translate-y-px"
        >
          Book a Call
        </a>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-8 md:px-16 pt-40 pb-24">
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 55% 60% at 72% 18%,rgba(201,168,76,0.09) 0%,transparent 60%)',
              'radial-gradient(ellipse 40% 40% at 18% 82%,rgba(201,168,76,0.04) 0%,transparent 55%)',
              '#0a0a09',
            ].join(', '),
          }}
        />
        <div className="hero-grid-overlay absolute inset-0" style={{ opacity: 0.5 }} />

        <div className="relative z-10 max-w-[1280px] mx-auto">
          {/* eyebrow */}
          <p className="hero-eyebrow flex items-center gap-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-gold mb-6 animate-fade-up-1">
            Intelligence Briefings from Nexyra
          </p>

          {/* headline */}
          <h1 className="font-cormorant font-light text-hero text-brand leading-[0.95] tracking-tight mb-8 animate-fade-up-2 max-w-5xl">
            Growth Notes, AI Systems<br />
            &amp; Marketing <em className="italic text-gold">Intelligence.</em>
          </h1>

          {/* description + positioning row */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 animate-fade-up-3">
            <p className="max-w-[500px] text-muted leading-[1.8] text-[1rem]">
              Practical breakdowns for business owners who want to understand how ads, websites,
              AI tools, and growth systems actually work — written by the team that builds them
              for international clients every day.
            </p>
            <div className="flex flex-col gap-3 items-start md:items-end flex-shrink-0">
              {[
                { dot: true,  text: 'Published weekly — no filler'              },
                { dot: false, text: 'Written by practitioners, not content mills' },
                { dot: false, text: 'Backed by real campaign data'               },
              ].map(({ dot, text }) => (
                <div
                  key={text}
                  className="inline-flex items-center gap-2.5 font-mono text-[0.63rem] tracking-[0.12em] uppercase border border-border px-4 py-2 text-muted"
                >
                  {dot && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" />}
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* stat strip */}
          <div className="flex flex-wrap gap-12 md:gap-20 mt-14 pt-10 border-t border-white/[0.07] animate-fade-up-4">
            {[
              { val: '60',     suffix: '+',  lbl: 'Articles published'   },
              { val: 'Weekly', suffix: '.',  lbl: 'Publishing cadence'   },
              { val: '8',      suffix: '.',  lbl: 'Topic categories'     },
              { val: '100',    suffix: '%',  lbl: 'Practitioner-written' },
            ].map(({ val, suffix, lbl }) => (
              <div key={lbl}>
                <div className="font-cormorant font-light text-[2.4rem] text-brand leading-none mb-1">
                  {val}<span className="text-gold">{suffix}</span>
                </div>
                <div className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-muted">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-gold py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="marquee-item font-mono text-[0.7rem] tracking-[0.12em] uppercase text-bg px-12 flex items-center"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FEATURED ARTICLE
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 px-8 md:px-16 py-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal flex items-center justify-between mb-12">
            <SectionLabel>Featured Article</SectionLabel>
            <BtnGhost href="/blog">View all articles →</BtnGhost>
          </div>

          <a
            href={`/blog/${featuredPost.slug}`}
            className="reveal group grid md:grid-cols-[1fr_440px] lg:grid-cols-[1fr_500px] border border-border hover:border-gold/30 transition-colors duration-300 overflow-hidden bg-bg3 no-underline block"
          >
            {/* visual */}
            <div className="relative overflow-hidden min-h-[300px] md:min-h-0">
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ background: GRADIENT_BG[featuredPost.gradient] }}
              />
              {/* pattern */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,transparent 28px,
                    ${GRADIENT_ACCENT[featuredPost.gradient]} 28px,${GRADIENT_ACCENT[featuredPost.gradient]} 29px
                  )`,
                }}
              />
              {/* corner glow */}
              <div
                className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-25"
                style={{ background: `radial-gradient(circle,${GRADIENT_ACCENT[featuredPost.gradient]} 0%,transparent 70%)` }}
              />
              {/* badges */}
              <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-bg bg-gold px-3 py-1.5 leading-none">
                  Featured
                </span>
                <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted border border-white/[0.15] px-3 py-1.5 bg-bg/60 backdrop-blur-sm leading-none">
                  {featuredPost.category}
                </span>
              </div>
              {/* read time */}
              <div className="absolute bottom-6 left-6 z-10">
                <span className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-muted border border-white/[0.15] px-3 py-1.5 bg-bg/60 backdrop-blur-sm">
                  {featuredPost.readTime}
                </span>
              </div>
            </div>

            {/* content */}
            <div className="p-10 md:p-14 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border">
              <div>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-dim mb-6">
                  {featuredPost.date}
                </p>
                <h2 className="font-cormorant font-normal text-[1.9rem] md:text-[2.1rem] leading-[1.12] text-brand mb-6 group-hover:text-gold transition-colors duration-300">
                  {featuredPost.title}
                </h2>
                <p className="text-muted text-[0.92rem] leading-[1.8] mb-8">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
                <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.12em] uppercase text-gold group-hover:gap-5 transition-all duration-300">
                  Read article →
                </span>
                <div className="w-8 h-8 border border-border flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-muted group-hover:text-gold transition-colors">
                    <path d="M2 10 L10 2 M4 2 h6 v6" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CATEGORY FILTER BAR — sticky below nav
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-bg sticky top-[73px] z-50 border-y border-border">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="flex items-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {/* count */}
            <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-dim pr-6 border-r border-border flex-shrink-0 py-5 mr-0">
              {gridPosts.length} {activeCategory === 'All' ? 'articles' : `in ${activeCategory}`}
            </span>

            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 font-mono text-[0.68rem] tracking-[0.12em] uppercase px-6 py-5 border-r border-border transition-all duration-200 cursor-pointer bg-transparent outline-none border-t-0 border-b-0 border-l-0 ${
                  activeCategory === cat
                    ? 'text-gold bg-gold/[0.06]'
                    : 'text-muted hover:text-brand'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="ml-2 text-[0.5rem]">◆</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          BLOG GRID
      ══════════════════════════════════════════════════════════ */}
      <section id="blog-grid" className="bg-bg px-8 md:px-16 py-20">
        <div className="max-w-[1280px] mx-auto">

          {pagedPosts.length === 0 ? (
            <div className="py-32 text-center border border-border bg-bg3">
              <p className="font-cormorant text-[1.5rem] font-light text-muted mb-3">
                No articles in this category yet.
              </p>
              <p className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-dim mb-8">
                We publish weekly — check back soon.
              </p>
              <button
                onClick={() => setActiveCategory('All')}
                className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-gold border-b border-gold pb-px bg-transparent cursor-pointer outline-none"
              >
                View all articles →
              </button>
            </div>
          ) : (
            <>
              {/* count + clear */}
              <div className="flex items-center justify-between mb-10 reveal">
                <p className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-dim">
                  Showing&nbsp;
                  {(currentPage - 1) * POSTS_PER_PAGE + 1}–
                  {Math.min(currentPage * POSTS_PER_PAGE, gridPosts.length)}
                  &nbsp;of {gridPosts.length}
                </p>
                {activeCategory !== 'All' && (
                  <button
                    onClick={() => setActiveCategory('All')}
                    className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-muted hover:text-gold transition-colors border-b border-dim hover:border-gold pb-px cursor-pointer bg-transparent outline-none"
                  >
                    Clear filter ×
                  </button>
                )}
              </div>

              {/* 3-col card grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
                {pagedPosts.map((post, idx) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className={`group flex flex-col bg-bg3 hover:bg-surface transition-colors duration-300 no-underline overflow-hidden reveal reveal-d${Math.min(idx % 3, 3) as 0|1|2|3}`}
                  >
                    {/* thumb */}
                    <CardThumb gradient={post.gradient} category={post.category} />

                    {/* body */}
                    <div className="flex flex-col flex-1 p-8">
                      <div className="flex items-center justify-between mb-5">
                        <p className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-dim">
                          {post.date}
                        </p>
                        <p className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-dim">
                          {post.readTime}
                        </p>
                      </div>

                      <h3 className="font-cormorant font-normal text-[1.25rem] leading-[1.25] text-brand mb-4 group-hover:text-gold transition-colors duration-300 flex-1">
                        {post.title}
                      </h3>

                      <p className="text-muted text-[0.83rem] leading-[1.72] mb-7 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted group-hover:text-gold transition-colors duration-200">
                          Read article
                        </span>
                        <span className="text-muted group-hover:text-gold group-hover:translate-x-1 transition-all duration-200 text-sm">
                          →
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* ── PAGINATION ── */}
              {totalPages > 1 && (
                <div className="reveal mt-px flex items-stretch border border-border border-t-0">
                  {/* Prev */}
                  <button
                    onClick={() => changePage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`font-mono text-[0.65rem] tracking-[0.12em] uppercase px-8 py-5 border-r border-border bg-bg3 cursor-pointer outline-none transition-all ${
                      currentPage === 1
                        ? 'text-dim cursor-not-allowed'
                        : 'text-muted hover:text-gold hover:bg-surface'
                    }`}
                  >
                    ← Prev
                  </button>

                  {/* page numbers */}
                  <div className="flex items-stretch flex-1 justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`font-mono text-[0.65rem] tracking-[0.12em] uppercase flex-1 max-w-[56px] py-5 border-r border-border cursor-pointer outline-none transition-all ${
                          currentPage === page
                            ? 'bg-gold text-bg'
                            : 'bg-bg3 text-muted hover:text-gold hover:bg-surface'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`font-mono text-[0.65rem] tracking-[0.12em] uppercase px-8 py-5 bg-bg3 cursor-pointer outline-none transition-all ${
                      currentPage === totalPages
                        ? 'text-dim cursor-not-allowed'
                        : 'text-muted hover:text-gold hover:bg-surface'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          NEWSLETTER / LEAD MAGNET
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal grid md:grid-cols-[1fr_460px] gap-0 border border-border overflow-hidden">
            {/* Left */}
            <div className="p-10 md:p-16 border-b md:border-b-0 md:border-r border-border">
              <SectionLabel>Weekly Briefing</SectionLabel>
              <SectionTitle className="mb-6">
                Get Growth Notes<br />
                <em className="italic text-gold">in your inbox.</em>
              </SectionTitle>
              <p className="text-muted leading-[1.8] text-[0.95rem] mb-10 max-w-md">
                Every week: one AI tool breakdown, one paid ads insight, and one growth lever
                from our active client campaigns. No filler. No sponsored posts. Just the
                intelligence that actually drives results.
              </p>

              {/* what you get */}
              <div className="flex flex-col gap-4">
                <p className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted">
                  Each issue includes
                </p>
                {[
                  'One AI tool or workflow you can use this week',
                  'One paid ads insight from a live client campaign',
                  'One growth lever or CRO test worth running',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-gold text-[0.65rem] mt-0.5 flex-shrink-0">◆</span>
                    <span className="text-muted text-[0.88rem] leading-[1.7]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="p-10 md:p-16 bg-bg3 flex flex-col justify-center gap-8">
              {subscribed ? (
                <div className="text-center py-8">
                  <div className="font-cormorant text-[2rem] font-light text-brand mb-3">
                    You&apos;re in<span className="text-gold">.</span>
                  </div>
                  <p className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-green mb-6">
                    First issue arrives next week.
                  </p>
                  <p className="text-muted text-[0.85rem]">
                    In the meantime — explore more articles below.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-5">
                  <div>
                    <p className="font-cormorant text-[1.5rem] font-normal text-brand mb-2">
                      Join 1,200+ founders & operators
                    </p>
                    <p className="text-muted text-[0.85rem] leading-[1.7]">
                      International marketers, agency owners, and SMB founders read Growth Notes every week.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
                      Your email address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="bg-bg border border-border text-brand px-5 py-4 font-mono text-[0.85rem] outline-none focus:border-gold transition-colors placeholder:text-dim w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
                      First name <span className="text-dim normal-case tracking-normal font-cabinet">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Alex"
                      className="bg-bg border border-border text-brand px-5 py-4 font-mono text-[0.85rem] outline-none focus:border-gold transition-colors placeholder:text-dim w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-3 font-mono text-[0.75rem] tracking-[0.12em] uppercase text-bg bg-gold py-4 cursor-pointer border-0 outline-none hover:bg-gold2 transition-colors"
                  >
                    Get Growth Notes →
                  </button>

                  {/* promise row */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {['One email per week', 'No spam', 'Unsubscribe anytime'].map(p => (
                      <span key={p} className="font-mono text-[0.57rem] tracking-[0.1em] uppercase text-dim border border-border px-3 py-1.5">
                        {p}
                      </span>
                    ))}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg relative overflow-hidden px-8 md:px-16 py-40 text-center">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(201,168,76,0.07) 0%,transparent 70%),#0a0a09',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full border border-gold/[0.07] animate-ring"
          style={{ top: '50%', left: '50%' }}
        />
        <div
          className="absolute w-[900px] h-[900px] rounded-full border border-gold/[0.07] animate-ring-2"
          style={{ top: '50%', left: '50%' }}
        />

        <div className="relative z-10 reveal max-w-[1280px] mx-auto">
          <SectionLabel className="justify-center">Ready to implement?</SectionLabel>

          <h2 className="font-cormorant font-light text-cta text-brand mb-6 max-w-3xl mx-auto">
            Reading about growth is one thing.<br />
            <em className="italic text-gold">Building it is another.</em>
          </h2>

          <p className="text-muted max-w-[500px] mx-auto mb-4 leading-[1.8] text-[1rem]">
            If you want a team that has already built the systems you&apos;ve been reading about —
            Google Ads, AI automation, high-converting websites, real estate lead gen — book a
            call. No pitch. No pressure. Just an honest conversation about your growth.
          </p>

          <p className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-gold/60 mb-12">
            International clients welcome · Strategy call is always free
          </p>

          <div className="flex justify-center gap-6 flex-wrap mb-20">
            <BtnPrimary href="/#contact">Book a Strategy Call →</BtnPrimary>
            <BtnGhost href="/services">See what we build</BtnGhost>
          </div>

          {/* trust strip */}
          <div className="pt-12 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: 'No pitch calls',       sub: 'Honest strategy first'      },
              { val: 'Live in 14 days',       sub: 'Campaigns go live fast'     },
              { val: '12+ countries',         sub: 'International experience'   },
              { val: 'Full attribution',      sub: 'Know exactly what works'    },
            ].map(({ val, sub }) => (
              <div key={val} className="text-center">
                <p className="font-cormorant text-[1rem] font-normal text-brand mb-1">{val}</p>
                <p className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="bg-bg border-t border-border px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-cormorant text-[1.2rem] font-normal text-brand">
          Nexyra<span className="text-gold">.</span>
        </p>
        <p className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-dim">
          © 2025 Nexyra. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['LinkedIn', 'Instagram', 'Twitter', 'Contact'].map(s => (
            <a
              key={s}
              href="#"
              className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted no-underline hover:text-gold transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      </footer>
    </>
  )
}
