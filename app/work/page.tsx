'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion'

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS — gradient palettes for card thumbnails
───────────────────────────────────────────────────────────────── */
type Palette = 'gold' | 'blue' | 'green' | 'rose' | 'purple' | 'teal'

const PALETTE_BG: Record<Palette, string> = {
  gold:   'linear-gradient(135deg,#1a1208 0%,#2d1f0a 60%,#181005 100%)',
  blue:   'linear-gradient(135deg,#080f1a 0%,#0a1a2d 60%,#04101a 100%)',
  green:  'linear-gradient(135deg,#0a1a0a 0%,#0d2d12 60%,#051005 100%)',
  rose:   'linear-gradient(135deg,#1a080d 0%,#2d0a14 60%,#120409 100%)',
  purple: 'linear-gradient(135deg,#120a1a 0%,#1e0a2d 60%,#0d0514 100%)',
  teal:   'linear-gradient(135deg,#081a18 0%,#0a2d28 60%,#041510 100%)',
}

const PALETTE_ACCENT: Record<Palette, string> = {
  gold:   'rgba(201,168,76,0.22)',
  blue:   'rgba(76,154,240,0.18)',
  green:  'rgba(76,200,120,0.18)',
  rose:   'rgba(240,76,110,0.18)',
  purple: 'rgba(180,76,240,0.18)',
  teal:   'rgba(76,220,200,0.18)',
}

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',     href: '/'         },
  { label: 'Services', href: '/services' },
  { label: 'Work',     href: '/work'     },
  { label: 'Blog',     href: '/blog'     },
  { label: 'Contact',  href: '/contact'  },
] as const

const MARQUEE_ITEMS = [
  'Real Estate', 'Google Ads', 'AI Automation', 'Shopify Growth',
  'Lead Generation', 'Web Design', 'Meta Ads', 'CRO', 'Local Services', 'eCommerce',
]

const HERO_STATS = [
  { val: '80', suffix: '+',  lbl: 'Projects delivered'      },
  { val: '5',  suffix: '★',  lbl: 'Star client reviews'     },
  { val: '12', suffix: '+',  lbl: 'Countries served'        },
  { val: '4',  suffix: 'yr', lbl: 'Freelance experience'    },
] as const

const CASE_STUDIES = [
  {
    id:       'real-estate-lead-funnel',
    palette:  'gold' as Palette,
    category: 'Real Estate · Lead Generation',
    num:      '01',
    title:    'Real Estate Lead Funnel System',
    desc:     'Built a full-stack lead acquisition system for a regional real estate team — Facebook ads, IDX landing pages, AI SMS follow-up, and CRM pipeline automation. Eliminated Zillow dependency entirely.',
    metrics:  [
      { val: '68',   suffix: '+',  lbl: 'Qualified leads/month' },
      { val: '3.2×', suffix: '',   lbl: 'Cost vs. portal leads'  },
      { val: '82',   suffix: '%',  lbl: 'Lead response rate'    },
    ],
    tags: ['Facebook Ads', 'CRM Automation', 'Landing Pages'],
  },
  {
    id:       'shopify-conversion-optimization',
    palette:  'blue' as Palette,
    category: 'eCommerce · Shopify',
    num:      '02',
    title:    'Shopify Conversion Rate Overhaul',
    desc:     'Redesigned product pages, checkout UX, and email flows for a Shopify brand averaging $80K/month. Data-driven CRO — heatmaps, session recordings, A/B tests — resulted in meaningful revenue uplift without increasing ad spend.',
    metrics:  [
      { val: '2.8×', suffix: '', lbl: 'Conversion rate increase' },
      { val: '41',   suffix: '%', lbl: 'Cart abandonment reduction' },
      { val: '$28K', suffix: '+', lbl: 'Additional monthly revenue' },
    ],
    tags: ['CRO', 'Shopify', 'Email Flows', 'UX Design'],
  },
  {
    id:       'google-ads-roofing',
    palette:  'green' as Palette,
    category: 'Local Services · Google Ads',
    num:      '03',
    title:    'Google Ads — Local Roofing Company',
    desc:     'Rebuilt a failing Google Ads account for a roofing contractor spending $4K/month with zero tracked conversions. Introduced a proper keyword architecture, dedicated service landing pages, and call/form conversion tracking.',
    metrics:  [
      { val: '63',   suffix: '%', lbl: 'CPL reduction'        },
      { val: '3×',   suffix: '',  lbl: 'Lead volume increase'  },
      { val: '14',   suffix: 'd', lbl: 'First leads arrived'   },
    ],
    tags: ['Google Ads', 'Landing Pages', 'Conversion Tracking'],
  },
  {
    id:       'ai-follow-up-automation',
    palette:  'purple' as Palette,
    category: 'AI Automation · CRM',
    num:      '04',
    title:    'AI Follow-Up Automation System',
    desc:     'Designed and deployed a GPT-powered lead qualification and follow-up system using Make.com and a CRM webhook stack. Leads receive instant SMS/email responses, automated qualification sequences, and calendar booking links — no manual input required.',
    metrics:  [
      { val: '5',    suffix: 'min', lbl: 'Avg. lead response time' },
      { val: '22',   suffix: 'hr', lbl: 'Saved per team/week'     },
      { val: '3.6×', suffix: '',   lbl: 'Pipeline throughput'     },
    ],
    tags: ['GPT API', 'Make.com', 'CRM Workflows', 'SMS Automation'],
  },
  {
    id:       'tiktok-ads-scaling',
    palette:  'rose' as Palette,
    category: 'eCommerce · Paid Social',
    num:      '05',
    title:    'TikTok Ads Scaling Campaign',
    desc:     'Managed a TikTok Ads account for a DTC beauty brand from $5K/month to $40K/month over 90 days. Built creative briefs, UGC frameworks, and a creative testing cadence that maintained ROAS through aggressive scaling.',
    metrics:  [
      { val: '8×',   suffix: '',  lbl: 'Ad spend scaled'         },
      { val: '4.1',  suffix: '×', lbl: 'ROAS maintained'         },
      { val: '60',   suffix: '+', lbl: 'Creatives tested'        },
    ],
    tags: ['TikTok Ads', 'DTC', 'Creative Strategy', 'UGC'],
  },
  {
    id:       'multi-channel-lead-gen',
    palette:  'teal' as Palette,
    category: 'Local Services · Lead Generation',
    num:      '06',
    title:    'Multi-Channel Lead Gen Dashboard',
    desc:     'Built a unified lead generation and attribution system for a multi-location HVAC business. Google Ads, Facebook Ads, and SEO data funneled into a single reporting dashboard with cost-per-lead tracking by channel, location, and service type.',
    metrics:  [
      { val: '4',    suffix: '+', lbl: 'Channels unified'         },
      { val: '47',   suffix: '%', lbl: 'Avg. CPL drop'           },
      { val: '110',  suffix: '+', lbl: 'Monthly leads at peak'   },
    ],
    tags: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics'],
  },
] as const

const TESTIMONIALS = [
  {
    initials: 'MR',
    name:     'Michael R.',
    role:     'Real Estate Team Lead',
    category: 'Lead Generation',
    rating:   5,
    text:     'Towhid is a hard worker, diligent, thorough, precise, polite and easy to communicate with. I absolutely recommend him. The systems he built for us replaced three separate vendors — and performed better than all of them combined.',
    palette:  'gold' as Palette,
  },
  {
    initials: 'SL',
    name:     'Sophie L.',
    role:     'eCommerce Brand Owner',
    category: 'Shopify & Meta Ads',
    rating:   5,
    text:     'Easy to work with and eager to get results. He took our Shopify store from stagnant to scaling in under 60 days. The attention to detail on the CRO work was impressive — every decision was backed by real data.',
    palette:  'blue' as Palette,
  },
  {
    initials: 'JW',
    name:     'James W.',
    role:     'Roofing Company Director',
    category: 'Google Ads',
    rating:   5,
    text:     'Great work ethic. Our Google Ads were bleeding money before Towhid rebuilt the account. Within 3 weeks we had our first properly attributed leads. Cost per lead dropped by more than half. Would not hesitate to recommend.',
    palette:  'green' as Palette,
  },
  {
    initials: 'AR',
    name:     'Amir R.',
    role:     'Agency Founder',
    category: 'AI Automation',
    rating:   5,
    text:     'Towhid has an excellent work ethic and is very motivated. The automation workflows he built are genuinely game-changing — our team saves 20+ hours per week. What would have taken us months to build internally was delivered in 2 weeks.',
    palette:  'purple' as Palette,
  },
  {
    initials: 'CT',
    name:     'Clara T.',
    role:     'Marketing Director',
    category: 'Lead Generation',
    rating:   5,
    text:     'Completed the task successfully. Very proactive — I appreciate the effort. He flagged issues I hadn\'t even considered, fixed them proactively, and delivered more than the brief asked for. The kind of freelancer you want on long-term retainer.',
    palette:  'teal' as Palette,
  },
] as const

const PROCESS_STEPS = [
  {
    num:   '01',
    word:  'Strategy',
    desc:  'Revenue audit, channel analysis, competitor intelligence. We identify exactly where the growth levers are before writing a single ad or touching your code.',
    accent: 'Clarity before action.',
  },
  {
    num:   '02',
    word:  'Build',
    desc:  'Campaigns launched, websites deployed, automations activated. Most clients are live within 14–18 days of onboarding — fast without cutting corners.',
    accent: 'Speed without shortcuts.',
  },
  {
    num:   '03',
    word:  'Automate',
    desc:  'AI-powered follow-up, CRM workflows, reporting pipelines. Every manual touchpoint that slows down revenue gets systematised and accelerated.',
    accent: 'Systems that scale with you.',
  },
  {
    num:   '04',
    word:  'Scale',
    desc:  'Weekly iteration cycles, A/B testing, budget reallocation based on real attribution data. Performance compounds — month after month.',
    accent: 'Compounding returns.',
  },
] as const

/* ─────────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay, ease: [0.23, 1, 0.32, 1] },
  }),
}

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay },
  }),
}

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const cardReveal = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
  },
}

/* ─────────────────────────────────────────────────────────────────
   SHARED UI COMPONENTS — exact signatures as all other Nexyra pages
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

/* ── Gradient thumbnail with diagonal pattern ── */
function CardThumb({
  palette,
  height = 'h-56',
  children,
}: {
  palette: Palette
  height?: string
  children?: React.ReactNode
}) {
  const accent = PALETTE_ACCENT[palette]
  return (
    <div className={`relative overflow-hidden ${height} flex-shrink-0`}>
      <motion.div
        className="absolute inset-0"
        style={{ background: PALETTE_BG[palette] }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      />
      {/* diagonal rule */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,transparent,transparent 24px,
            ${accent} 24px,${accent} 25px
          )`,
        }}
      />
      {/* corner glow */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-40"
        style={{ background: `radial-gradient(circle,${accent} 0%,transparent 70%)` }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle,${accent} 0%,transparent 70%)` }}
      />
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────────── */
function AnimatedStat({ val, suffix, lbl }: { val: string; suffix: string; lbl: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const numericVal = parseInt(val.replace(/\D/g, ''), 10)
  const isNumeric  = !isNaN(numericVal) && val.match(/^\d/)

  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || !isNumeric) return
    const duration = 1400
    const start    = performance.now()
    const end      = numericVal
    const raf = (ts: number) => {
      const progress = Math.min((ts - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [inView, isNumeric, numericVal])

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={0}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <div className="font-cormorant font-light text-[2.8rem] text-brand leading-none mb-1">
        {isNumeric ? count : val}
        <span className="text-gold">{suffix}</span>
      </div>
      <div className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-muted">{lbl}</div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────── */
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
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current) }
  }, [onMove])

  return { cursorRef, trailRef }
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function WorkPage() {
  const { cursorRef, trailRef } = useCursor()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* parallax ref for hero */
  const heroRef  = useRef<HTMLElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '20%'])

  return (
    <>
      {/* ── Custom cursor ── */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full border border-gold mix-blend-difference"
      />
      <div
        ref={trailRef}
        className="fixed pointer-events-none z-[9998] w-10 h-10 rounded-full border border-gold/25"
        style={{ transition: 'opacity 0.3s' }}
      />

      {/* ══════════════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
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
                  l.href === '/work' ? 'text-gold' : 'text-muted hover:text-gold'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/contact"
          className="font-mono text-[0.72rem] tracking-[0.1em] uppercase text-bg bg-gold px-6 py-2.5 no-underline hover:bg-gold2 transition-all hover:-translate-y-px"
        >
          Book a Call
        </a>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden px-8 md:px-16 pt-40 pb-24 min-h-[90vh] flex flex-col justify-end">
        {/* parallax atmospheric background */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: heroY,
            background: [
              'radial-gradient(ellipse 60% 60% at 72% 18%,rgba(201,168,76,0.11) 0%,transparent 60%)',
              'radial-gradient(ellipse 40% 45% at 15% 82%,rgba(201,168,76,0.05) 0%,transparent 55%)',
              'radial-gradient(ellipse 30% 30% at 50% 50%,rgba(201,168,76,0.03) 0%,transparent 70%)',
              '#0a0a09',
            ].join(', '),
          }}
        />
        {/* subtle grid */}
        <div className="hero-grid-overlay absolute inset-0" style={{ opacity: 0.45 }} />

        <div className="relative z-10 max-w-[1280px] mx-auto w-full">
          {/* eyebrow */}
          <motion.p
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="hero-eyebrow flex items-center gap-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-gold mb-6"
          >
            Selected work — 2021–2025
          </motion.p>

          {/* headline */}
          <motion.h1
            variants={fadeUp}
            custom={0.15}
            initial="hidden"
            animate="visible"
            className="font-cormorant font-light text-hero text-brand leading-[0.93] tracking-tight mb-8 max-w-5xl"
          >
            Growth systems built<br />
            for <em className="italic text-gold">modern brands.</em>
          </motion.h1>

          {/* description + chips */}
          <motion.div
            variants={fadeUp}
            custom={0.3}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10"
          >
            <p className="max-w-[500px] text-muted leading-[1.8] text-[1rem]">
              Real client results across AI automation, digital marketing execution, Shopify growth,
              lead generation, performance advertising, and conversion-focused systems — for
              international businesses that compete on outcomes, not activity.
            </p>
            <div className="flex flex-col gap-3 items-start md:items-end flex-shrink-0">
              {[
                'AI automation · digital marketing',
                'Real estate · local services · eCommerce',
                'Upwork Top Rated · 5-Star reviews',
              ].map(chip => (
                <div
                  key={chip}
                  className="inline-flex items-center gap-3 font-mono text-[0.62rem] tracking-[0.12em] uppercase border border-border px-4 py-2 text-muted"
                >
                  <span className="text-gold text-[0.5rem]">◆</span>
                  {chip}
                </div>
              ))}
            </div>
          </motion.div>

          {/* animated stats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-12 md:gap-20 mt-16 pt-10 border-t border-white/[0.07]"
          >
            {HERO_STATS.map(({ val, suffix, lbl }) => (
              <AnimatedStat key={lbl} val={val} suffix={suffix} lbl={lbl} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* marquee */}
      <div className="bg-gold py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item font-mono text-[0.7rem] tracking-[0.12em] uppercase text-bg px-12 flex items-center">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CASE STUDIES GRID
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          {/* header */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8"
          >
            <div>
              <SectionLabel>Featured Case Studies</SectionLabel>
              <SectionTitle>
                Six projects.<br />
                <em className="italic text-gold">Real results.</em>
              </SectionTitle>
            </div>
            <p className="text-muted text-[0.88rem] leading-[1.75] max-w-xs self-end">
              Each engagement is approached as a growth infrastructure project — not a one-off task.
              Strategy, execution, and iteration in every case.
            </p>
          </motion.div>

          {/* grid — alternating featured / 2-col layouts */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-px bg-border"
          >
            {/* ROW 1: featured wide card */}
            <motion.div variants={cardReveal} className="grid md:grid-cols-[1fr_420px] bg-bg3 group cursor-pointer hover:border-gold/20 border border-transparent transition-colors duration-500 overflow-hidden">
              <CardThumb palette={CASE_STUDIES[0].palette} height="min-h-[360px] h-full">
                {/* num overlay */}
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-muted border border-white/[0.15] px-3 py-1.5 bg-bg/60 backdrop-blur-sm">
                    {CASE_STUDIES[0].num} / 06
                  </span>
                </div>
                <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
                  {CASE_STUDIES[0].tags.map(t => (
                    <span key={t} className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted border border-white/[0.15] px-2.5 py-1 bg-bg/60 backdrop-blur-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </CardThumb>

              <div className="p-10 md:p-14 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border">
                <div>
                  <p className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-gold mb-5">
                    {CASE_STUDIES[0].category}
                  </p>
                  <h3 className="font-cormorant text-[2rem] font-normal leading-[1.1] text-brand mb-5 group-hover:text-gold transition-colors duration-300">
                    {CASE_STUDIES[0].title}
                  </h3>
                  <p className="text-muted text-[0.88rem] leading-[1.78] mb-8">
                    {CASE_STUDIES[0].desc}
                  </p>
                </div>
                <div>
                  <div className="flex gap-7 mb-8 flex-wrap">
                    {CASE_STUDIES[0].metrics.map(m => (
                      <div key={m.lbl}>
                        <div className="font-cormorant text-[1.9rem] font-light text-gold leading-none">
                          {m.val}{m.suffix}
                        </div>
                        <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted mt-1">{m.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <motion.a
                    href={`/work/${CASE_STUDIES[0].id}`}
                    whileHover={{ gap: '20px' }}
                    className="inline-flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.12em] uppercase text-gold no-underline transition-all"
                  >
                    View case study →
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* ROW 2: 2-col cards */}
            <div className="grid md:grid-cols-2 gap-px bg-border">
              {CASE_STUDIES.slice(1, 3).map((cs) => (
                <motion.div
                  key={cs.id}
                  variants={cardReveal}
                  className="bg-bg3 group cursor-pointer flex flex-col overflow-hidden border border-transparent hover:border-gold/20 transition-colors duration-500"
                >
                  <CardThumb palette={cs.palette} height="h-52">
                    <div className="absolute top-5 left-5 z-10 flex flex-wrap gap-2">
                      {cs.tags.slice(0, 2).map(t => (
                        <span key={t} className="font-mono text-[0.57rem] tracking-[0.1em] uppercase text-muted border border-white/[0.15] px-2.5 py-1 bg-bg/60 backdrop-blur-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="absolute bottom-5 right-5 font-mono text-[0.57rem] tracking-[0.16em] text-muted z-10">
                      {cs.num} / 06
                    </div>
                  </CardThumb>

                  <div className="p-8 md:p-10 flex flex-col flex-1">
                    <p className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-gold mb-4">{cs.category}</p>
                    <h3 className="font-cormorant text-[1.55rem] font-normal leading-tight text-brand mb-4 group-hover:text-gold transition-colors duration-300">
                      {cs.title}
                    </h3>
                    <p className="text-muted text-[0.84rem] leading-[1.75] mb-7 flex-1">{cs.desc}</p>

                    <div className="pt-6 border-t border-white/[0.06]">
                      <div className="flex gap-5 mb-6 flex-wrap">
                        {cs.metrics.map(m => (
                          <div key={m.lbl}>
                            <div className="font-cormorant text-[1.55rem] font-light text-gold leading-none">{m.val}{m.suffix}</div>
                            <div className="font-mono text-[0.56rem] tracking-[0.1em] uppercase text-muted mt-0.5">{m.lbl}</div>
                          </div>
                        ))}
                      </div>
                      <a href={`/work/${cs.id}`} className="inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors no-underline group-hover:text-gold">
                        View case study →
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ROW 3: reversed — content left, thumb right */}
            <motion.div variants={cardReveal} className="grid md:grid-cols-[420px_1fr] bg-bg3 group cursor-pointer border border-transparent hover:border-gold/20 transition-colors duration-500 overflow-hidden">
              <div className="p-10 md:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border order-2 md:order-1">
                <div>
                  <p className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-gold mb-5">{CASE_STUDIES[3].category}</p>
                  <h3 className="font-cormorant text-[2rem] font-normal leading-[1.1] text-brand mb-5 group-hover:text-gold transition-colors duration-300">
                    {CASE_STUDIES[3].title}
                  </h3>
                  <p className="text-muted text-[0.88rem] leading-[1.78] mb-8">{CASE_STUDIES[3].desc}</p>
                </div>
                <div>
                  <div className="flex gap-7 mb-8 flex-wrap">
                    {CASE_STUDIES[3].metrics.map(m => (
                      <div key={m.lbl}>
                        <div className="font-cormorant text-[1.9rem] font-light text-gold leading-none">{m.val}{m.suffix}</div>
                        <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted mt-1">{m.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <a href={`/work/${CASE_STUDIES[3].id}`} className="inline-flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.12em] uppercase text-gold no-underline hover:gap-5 transition-all">
                    View case study →
                  </a>
                </div>
              </div>

              <CardThumb palette={CASE_STUDIES[3].palette} height="min-h-[360px] h-full order-1 md:order-2">
                <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
                  {CASE_STUDIES[3].tags.map(t => (
                    <span key={t} className="font-mono text-[0.57rem] tracking-[0.1em] uppercase text-muted border border-white/[0.15] px-2.5 py-1 bg-bg/60 backdrop-blur-sm">{t}</span>
                  ))}
                </div>
                <div className="absolute bottom-6 right-6 font-mono text-[0.57rem] tracking-[0.16em] text-muted z-10">{CASE_STUDIES[3].num} / 06</div>
              </CardThumb>
            </motion.div>

            {/* ROW 4: 2-col cards */}
            <div className="grid md:grid-cols-2 gap-px bg-border">
              {CASE_STUDIES.slice(4, 6).map((cs) => (
                <motion.div
                  key={cs.id}
                  variants={cardReveal}
                  className="bg-bg3 group cursor-pointer flex flex-col overflow-hidden border border-transparent hover:border-gold/20 transition-colors duration-500"
                >
                  <CardThumb palette={cs.palette} height="h-52">
                    <div className="absolute top-5 left-5 z-10 flex flex-wrap gap-2">
                      {cs.tags.slice(0, 2).map(t => (
                        <span key={t} className="font-mono text-[0.57rem] tracking-[0.1em] uppercase text-muted border border-white/[0.15] px-2.5 py-1 bg-bg/60 backdrop-blur-sm">{t}</span>
                      ))}
                    </div>
                    <div className="absolute bottom-5 right-5 font-mono text-[0.57rem] tracking-[0.16em] text-muted z-10">{cs.num} / 06</div>
                  </CardThumb>
                  <div className="p-8 md:p-10 flex flex-col flex-1">
                    <p className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-gold mb-4">{cs.category}</p>
                    <h3 className="font-cormorant text-[1.55rem] font-normal leading-tight text-brand mb-4 group-hover:text-gold transition-colors duration-300">{cs.title}</h3>
                    <p className="text-muted text-[0.84rem] leading-[1.75] mb-7 flex-1">{cs.desc}</p>
                    <div className="pt-6 border-t border-white/[0.06]">
                      <div className="flex gap-5 mb-6 flex-wrap">
                        {cs.metrics.map(m => (
                          <div key={m.lbl}>
                            <div className="font-cormorant text-[1.55rem] font-light text-gold leading-none">{m.val}{m.suffix}</div>
                            <div className="font-mono text-[0.56rem] tracking-[0.1em] uppercase text-muted mt-0.5">{m.lbl}</div>
                          </div>
                        ))}
                      </div>
                      <a href={`/work/${cs.id}`} className="inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors no-underline group-hover:text-gold">
                        View case study →
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          UPWORK SHOWCASE
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mb-16"
          >
            <SectionLabel>Freelance Platform</SectionLabel>
            <SectionTitle>
              Verified on Upwork.<br />
              <em className="italic text-gold">Trusted internationally.</em>
            </SectionTitle>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-[1fr_360px] gap-px bg-border overflow-hidden"
          >
            {/* Left: platform card */}
            <div className="bg-bg3 p-10 md:p-14 relative overflow-hidden">
              {/* subtle gold glow behind content */}
              <div
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(201,168,76,1) 0%,transparent 70%)' }}
              />

              <div className="relative z-10">
                {/* platform header */}
                <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-gold border border-gold/30 px-3 py-1.5">
                        Top Rated Freelancer
                      </span>
                      <span className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-green border border-green/25 px-3 py-1.5">
                        Available
                      </span>
                    </div>
                    <h3 className="font-cormorant text-[1.9rem] font-normal text-brand mt-3">
                      Towhid — Digital Growth & AI Systems
                    </h3>
                    <p className="text-muted text-[0.88rem] mt-2">
                      Upwork · upwork.com/freelancers/towhid
                    </p>
                  </div>
                </div>

                {/* metric grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border mb-10">
                  {[
                    { val: '100',  suffix: '%', lbl: 'Job Success',       sub: 'Verified score'        },
                    { val: '5.0',  suffix: '★', lbl: 'Client Rating',     sub: 'All engagements'       },
                    { val: '$10K', suffix: '+',  lbl: 'Total Earned',      sub: 'Platform verified'     },
                    { val: '4',    suffix: 'yr', lbl: 'On Platform',       sub: 'Since 2021'            },
                  ].map(m => (
                    <div key={m.lbl} className="bg-bg2 p-6 flex flex-col gap-1">
                      <div className="font-cormorant text-[1.8rem] font-light leading-none text-brand">
                        {m.val}<span className="text-gold">{m.suffix}</span>
                      </div>
                      <div className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted">{m.lbl}</div>
                      <div className="font-mono text-[0.55rem] tracking-[0.08em] uppercase text-dim">{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* what clients hire for */}
                <div className="mb-10">
                  <p className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted mb-5">
                    Hired for
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Google Ads', 'Meta Ads', 'AI Automation', 'Web Design',
                      'Lead Generation', 'Shopify CRO', 'Email Flows', 'CRM Setup',
                    ].map(tag => (
                      <span
                        key={tag}
                        className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-dim border border-border px-3 py-1.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* highlights */}
                <div className="flex flex-col gap-3 mb-10">
                  {[
                    'Long-term clients across real estate, eCommerce, and local services',
                    'Repeat contracts — most clients extend or return for new projects',
                    'International engagements across 12+ countries',
                    'All work strategy-led — not just task execution',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-4">
                      <span className="text-gold text-[0.6rem] mt-0.5 flex-shrink-0">◆</span>
                      <span className="text-muted text-[0.86rem] leading-[1.65]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <BtnPrimary href="https://www.upwork.com/freelancers/towhid">
                    View Upwork Profile →
                  </BtnPrimary>
                  <BtnGhost href="/contact">Start a project</BtnGhost>
                </div>
              </div>
            </div>

            {/* Right: score/trust sidebar */}
            <div className="bg-bg2 flex flex-col divide-y divide-border">
              <div className="p-8 md:p-10">
                <p className="section-label mb-6">Platform standing</p>
                <div className="flex flex-col gap-6">
                  {[
                    { icon: '⭐', label: 'Top Rated Badge',     desc: 'Awarded to top 10% of Upwork freelancers'     },
                    { icon: '✓',  label: 'Identity Verified',   desc: 'Government ID verified by Upwork'             },
                    { icon: '🔒', label: 'Payment Protected',   desc: 'All contracts under Upwork payment protection' },
                    { icon: '↺',  label: 'Repeat Client Rate',  desc: 'Majority of clients return for new projects'  },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-4">
                      <span className="text-[1rem] flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <p className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-brand mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-dim text-[0.78rem] leading-[1.5]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <p className="section-label mb-4">Response time</p>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-green animate-pulse-dot flex-shrink-0" />
                    <span className="font-cormorant text-[1.3rem] font-normal text-brand">Within a few hours</span>
                  </div>
                  <p className="text-muted text-[0.83rem] leading-[1.7]">
                    Active Monday through Saturday. International time zones accommodated — clients from
                    North America, Europe, the Middle East, and Australia.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-dim mb-2">
                    Prefer to work outside Upwork?
                  </p>
                  <a
                    href="/contact"
                    className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-gold no-underline hover:text-gold2 transition-colors"
                  >
                    Contact directly →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8"
          >
            <div>
              <SectionLabel>Client Voices</SectionLabel>
              <SectionTitle>
                5-star feedback<br />
                <em className="italic text-gold">from real clients.</em>
              </SectionTitle>
            </div>
            <div className="flex items-center gap-4 self-end">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 12 12" fill="currentColor" className="w-3.5 h-3.5 text-gold">
                    <path d="M6 0l1.5 4.5H12L8.25 7.25l1.5 4.5L6 9l-3.75 2.75 1.5-4.5L0 4.5h4.5z" />
                  </svg>
                ))}
              </div>
              <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted">
                All verified Upwork reviews
              </span>
            </div>
          </motion.div>

          {/* testimonial cards — editorial style */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
          >
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.initials}
                variants={cardReveal}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-bg3 p-8 md:p-10 flex flex-col justify-between border border-transparent hover:border-gold/15 transition-colors duration-400"
              >
                <div>
                  {/* open quote */}
                  <div className="font-cormorant text-[4.5rem] font-light leading-[0.55] text-gold/25 mb-6 select-none">
                    &ldquo;
                  </div>

                  {/* star row */}
                  <div className="flex items-center gap-1.5 mb-5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <svg key={i} viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-gold">
                        <path d="M6 0l1.5 4.5H12L8.25 7.25l1.5 4.5L6 9l-3.75 2.75 1.5-4.5L0 4.5h4.5z" />
                      </svg>
                    ))}
                    <span className="font-mono text-[0.55rem] tracking-[0.12em] uppercase text-dim ml-2">
                      Upwork
                    </span>
                  </div>

                  {/* category */}
                  <p className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-gold mb-5">
                    {t.category}
                  </p>

                  {/* text */}
                  <p className="font-cormorant italic text-[1.08rem] text-brand/88 leading-[1.72] mb-8">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                {/* author */}
                <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06]">
                  {/* avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-cormorant text-[1.15rem] text-gold border border-border flex-shrink-0"
                    style={{ background: PALETTE_BG[t.palette] }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-cabinet font-bold text-[0.9rem] text-brand">{t.name}</p>
                    <p className="font-mono text-[0.6rem] tracking-[0.08em] uppercase text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROCESS — cinematic large type version
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg px-8 md:px-16 py-32 overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid md:grid-cols-2 gap-12 items-end mb-24"
          >
            <div>
              <SectionLabel>How We Work</SectionLabel>
              <SectionTitle>
                Strategy, build,<br />
                <em className="italic text-gold">automate, scale.</em>
              </SectionTitle>
            </div>
            <p className="text-muted leading-[1.8] text-[0.95rem] self-end">
              Every engagement follows the same four-phase system. The output varies by client —
              the methodology doesn&apos;t.
            </p>
          </motion.div>

          {/* Cinematic process list */}
          <div className="flex flex-col gap-px bg-border">
            {PROCESS_STEPS.map((step, idx) => {
              const ref = useRef<HTMLDivElement>(null)
              const inView = useInView(ref, { once: true, margin: '-80px' })
              return (
                <motion.div
                  key={step.num}
                  ref={ref}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                  className="bg-bg3 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-0 overflow-hidden">
                    {/* large num */}
                    <div className="px-8 md:px-12 py-8 md:py-10 border-b md:border-b-0 md:border-r border-border flex-shrink-0 md:w-40 text-center md:text-left">
                      <span className="font-cormorant text-[4.5rem] font-light leading-none text-gold/[0.12] group-hover:text-gold/25 transition-colors duration-500">
                        {step.num}
                      </span>
                    </div>

                    {/* word — cinematic */}
                    <div className="px-8 md:px-12 py-8 md:py-10 border-b md:border-b-0 md:border-r border-border flex-shrink-0 md:w-60">
                      <span className="font-cormorant text-[2.2rem] font-normal text-brand group-hover:text-gold transition-colors duration-400">
                        {step.word}
                      </span>
                    </div>

                    {/* desc */}
                    <div className="px-8 md:px-12 py-8 md:py-10 border-b md:border-b-0 md:border-r border-border flex-1">
                      <p className="text-muted text-[0.9rem] leading-[1.75]">{step.desc}</p>
                    </div>

                    {/* accent */}
                    <div className="px-8 md:px-12 py-8 md:py-10 flex-shrink-0 md:w-56">
                      <p className="font-cormorant italic text-[1.05rem] text-gold/70 leading-[1.4]">
                        {step.accent}
                      </p>
                    </div>
                  </div>

                  {/* animated underline */}
                  <motion.div
                    className="h-px bg-gold/30"
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 1.2, delay: idx * 0.1 + 0.3, ease: [0.23, 1, 0.32, 1] }}
                    style={{ transformOrigin: 'left' }}
                  />
                </motion.div>
              )
            })}
          </div>

          {/* timeline accent strip */}
          <motion.div
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 pt-10 border-t border-white/[0.05] flex flex-wrap gap-10 md:gap-20 items-center"
          >
            {[
              { val: '14–18', suffix: 'd', lbl: 'Avg. go-live'      },
              { val: 'Weekly', suffix: '.', lbl: 'Performance reports' },
              { val: 'No',     suffix: ' lock-in', lbl: 'Rolling contracts' },
            ].map(({ val, suffix, lbl }) => (
              <div key={lbl}>
                <span className="font-cormorant text-[2rem] font-light text-brand leading-none">
                  {val}<span className="text-gold">{suffix}</span>
                </span>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted mt-1">{lbl}</p>
              </div>
            ))}
            <div className="md:ml-auto">
              <BtnGhost href="/services">See all services</BtnGhost>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA — large cinematic
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 relative overflow-hidden px-8 md:px-16 py-44 text-center">
        {/* layered glow effects */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(201,168,76,0.08) 0%,transparent 65%),#111110',
              'radial-gradient(ellipse 80% 70% at 50% 50%,rgba(201,168,76,0.11) 0%,transparent 65%),#111110',
              'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(201,168,76,0.08) 0%,transparent 65%),#111110',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* pulsing rings */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full border border-gold/[0.06] animate-ring pointer-events-none"
          style={{ top: '50%', left: '50%' }}
        />
        <div
          className="absolute w-[1000px] h-[1000px] rounded-full border border-gold/[0.04] animate-ring-2 pointer-events-none"
          style={{ top: '50%', left: '50%' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full border border-gold/[0.08] animate-ring pointer-events-none"
          style={{ top: '50%', left: '50%', animationDelay: '1s' }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <SectionLabel className="justify-center">Ready to grow?</SectionLabel>

            <h2 className="font-cormorant font-light text-cta text-brand mb-6 max-w-4xl mx-auto leading-[0.95]">
              Let&apos;s build your<br />
              <em className="italic text-gold">growth infrastructure.</em>
            </h2>

            <p className="text-muted max-w-[520px] mx-auto mb-4 leading-[1.8] text-[1rem]">
              Google Ads. High-converting websites. AI automation systems. Lead generation funnels.
              All under one roof — strategy-led, data-backed, built to compound. International
              clients welcome.
            </p>

            <p className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-gold/60 mb-14">
              Strategy call is free · No pitch · No pressure · Just honest growth advice
            </p>

            <div className="flex justify-center gap-6 flex-wrap mb-24">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <BtnPrimary href="/contact">Book a Strategy Call →</BtnPrimary>
              </motion.div>
              <BtnGhost href="/contact">Discuss your project</BtnGhost>
            </div>

            {/* final micro trust strip */}
            <div className="pt-12 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { val: 'Top Rated',      sub: 'Upwork verified'          },
                { val: '5.0 ★',         sub: 'Across all engagements'   },
                { val: '12+ countries', sub: 'International experience'  },
                { val: 'No lock-in',    sub: 'Rolling monthly contracts' },
              ].map(({ val, sub }) => (
                <div key={val} className="text-center">
                  <p className="font-cormorant text-[1.05rem] font-normal text-brand mb-1">{val}</p>
                  <p className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
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
          {['LinkedIn', 'Instagram', 'Upwork', 'Contact'].map(s => (
            <a
              key={s}
              href={s === 'Upwork' ? 'https://www.upwork.com/freelancers/towhid' : s === 'Contact' ? '/contact' : '#'}
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
