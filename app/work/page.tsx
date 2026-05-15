'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  stagger,
  useAnimate,
} from 'framer-motion'

/* ─────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────── */
interface CaseStudy {
  slug:     string
  num:      string
  category: string
  title:    string
  client:   string
  industry: string
  desc:     string
  results:  { val: string; lbl: string }[]
  tags:     string[]
  gradient: 'gold' | 'blue' | 'green' | 'purple' | 'rose' | 'teal'
  featured: boolean
}

interface Testimonial {
  initials:  string
  name:      string
  role:      string
  category:  string
  quote:     string
  stars:     number
}

/* ─────────────────────────────────────────────────────────────────
   GRADIENT TOKENS — matching blog/services visual language
───────────────────────────────────────────────────────────────── */
const GRAD_BG: Record<CaseStudy['gradient'], string> = {
  gold:   'linear-gradient(135deg,#1a1208 0%,#2d1f0a 50%,#181005 100%)',
  blue:   'linear-gradient(135deg,#080f1a 0%,#0a1a2d 50%,#04101a 100%)',
  green:  'linear-gradient(135deg,#0d1a0a 0%,#0a2d12 50%,#051005 100%)',
  purple: 'linear-gradient(135deg,#120a1a 0%,#1e0a2d 50%,#0d0510 100%)',
  rose:   'linear-gradient(135deg,#1a080d 0%,#2d0a14 50%,#1a0509 100%)',
  teal:   'linear-gradient(135deg,#081a18 0%,#0a2d28 50%,#041a18 100%)',
}
const GRAD_ACCENT: Record<CaseStudy['gradient'], string> = {
  gold:   'rgba(201,168,76,0.22)',
  blue:   'rgba(76,154,240,0.18)',
  green:  'rgba(76,175,125,0.18)',
  purple: 'rgba(160,76,220,0.18)',
  rose:   'rgba(220,76,100,0.18)',
  teal:   'rgba(76,210,200,0.18)',
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
  { val: '80',   suffix: '+', lbl: 'Projects delivered'        },
  { val: '5',    suffix: '★', lbl: 'Average client rating'     },
  { val: '12',   suffix: '+', lbl: 'Countries served'          },
  { val: '4',    suffix: '+', lbl: 'Years of execution'        },
] as const

const CASE_STUDIES: CaseStudy[] = [
  {
    slug:     'real-estate-lead-funnel',
    num:      '01',
    category: 'Lead Generation',
    title:    'Real Estate Lead Funnel System',
    client:   'Regional Property Group',
    industry: 'Real Estate',
    desc:     'Built a full-funnel Facebook & Instagram lead acquisition system for a regional real estate team. Replaced expensive Zillow dependency with an owned pipeline delivering 50–70 qualified buyer and seller leads per month.',
    results:  [
      { val: '62',    lbl: 'Qualified leads/month' },
      { val: '3.1×',  lbl: 'Cost vs. portal leads' },
      { val: '78%',   lbl: 'Lead response rate'    },
    ],
    tags:     ['Meta Ads', 'Funnel Design', 'CRM Automation', 'Landing Pages'],
    gradient: 'gold',
    featured: true,
  },
  {
    slug:     'shopify-conversion-optimization',
    num:      '02',
    category: 'eCommerce Growth',
    title:    'Shopify Conversion Optimization',
    client:   'DTC Lifestyle Brand',
    industry: 'eCommerce',
    desc:     'Audited a Shopify store generating $80K/month with a 1.2% conversion rate. Rebuilt product pages, checkout flow, and mobile UX. Implemented post-purchase upsell sequences and abandoned cart automation.',
    results:  [
      { val: '2.8%',  lbl: 'Conversion rate (was 1.2%)' },
      { val: '+$42K', lbl: 'Monthly revenue lift'       },
      { val: '31%',   lbl: 'Cart abandonment reduction' },
    ],
    tags:     ['Shopify CRO', 'UX Audit', 'Email Flows', 'A/B Testing'],
    gradient: 'blue',
    featured: true,
  },
  {
    slug:     'google-ads-local-roofing',
    num:      '03',
    category: 'Google Ads',
    title:    'Google Ads for Local Roofing Company',
    client:   'Metro Roofing Solutions',
    industry: 'Home Services',
    desc:     'Rebuilt a Google Ads account burning $8K/month with no call tracking and broad match keywords everywhere. Restructured campaign architecture, added negative keyword discipline, and launched dedicated landing pages per service area.',
    results:  [
      { val: '65%',  lbl: 'Cost-per-lead reduction' },
      { val: '2.9×', lbl: 'Lead volume increase'    },
      { val: '14d',  lbl: 'Time to first results'   },
    ],
    tags:     ['Google Ads', 'Landing Pages', 'Call Tracking', 'Local SEO'],
    gradient: 'rose',
    featured: true,
  },
  {
    slug:     'ai-follow-up-automation',
    num:      '04',
    category: 'AI Automation',
    title:    'AI Follow-Up Automation System',
    client:   'Consulting & Coaching Firm',
    industry: 'Professional Services',
    desc:     'Designed and deployed a GPT-powered lead follow-up system using Make.com and Go High Level. Intake forms trigger qualification sequences via email, SMS, and WhatsApp — all without manual input from the sales team.',
    results:  [
      { val: '5min',  lbl: 'Avg. lead response time'  },
      { val: '22hrs', lbl: 'Saved per team per week'  },
      { val: '3.6×',  lbl: 'Pipeline throughput lift' },
    ],
    tags:     ['GPT API', 'Make.com', 'GHL CRM', 'SMS / WhatsApp'],
    gradient: 'purple',
    featured: false,
  },
  {
    slug:     'tiktok-ads-scaling',
    num:      '05',
    category: 'Paid Social',
    title:    'TikTok Ads Scaling Campaign',
    client:   'Beauty & Wellness Brand',
    industry: 'eCommerce',
    desc:     'Scaled a TikTok Ads account from $1,500/month to $18,000/month over 90 days. Built a creative testing framework — 3 new videos per week — and layered in Spark Ads with high-performing organic content to keep CPM low.',
    results:  [
      { val: '12×',   lbl: 'Ad spend scaled'          },
      { val: '4.2×',  lbl: 'Blended ROAS maintained'  },
      { val: '38%',   lbl: 'CPM reduction vs. cold'   },
    ],
    tags:     ['TikTok Ads', 'Creative Strategy', 'Spark Ads', 'Scaling'],
    gradient: 'teal',
    featured: false,
  },
  {
    slug:     'multi-channel-lead-gen-dashboard',
    num:      '06',
    category: 'Lead Generation',
    title:    'Multi-Channel Lead Gen Dashboard',
    client:   'HVAC & Plumbing Group',
    industry: 'Home Services',
    desc:     'Built a unified lead generation system across Google Ads, Facebook Ads, and Local SEO for a multi-location home services group. All leads flow into a central CRM with source attribution, quality scoring, and automated dispatcher routing.',
    results:  [
      { val: '140+',  lbl: 'Leads per month'          },
      { val: '48%',   lbl: 'Lower cost-per-booking'   },
      { val: '100%',  lbl: 'Attribution coverage'     },
    ],
    tags:     ['Google Ads', 'Meta Ads', 'Local SEO', 'CRM Integration'],
    gradient: 'green',
    featured: false,
  },
]

const TESTIMONIALS: Testimonial[] = [
  {
    initials: 'MR',
    name:     'Michael R.',
    role:     'Property Investment Director',
    category: 'Real Estate Lead Generation',
    quote:    'Towhid is a hard worker, diligent, thorough, precise, polite and easy to communicate with. I absolutely recommend him.',
    stars:    5,
  },
  {
    initials: 'SL',
    name:     'Sophie L.',
    role:     'eCommerce Brand Founder',
    category: 'Shopify Growth & Meta Ads',
    quote:    'Completed the task successfully. Very proactive, appreciate the effort. The results came faster than I expected.',
    stars:    5,
  },
  {
    initials: 'JT',
    name:     'James T.',
    role:     'Roofing Company Owner',
    category: 'Google Ads Management',
    quote:    'Towhid has an excellent work ethic and is very motivated. Lead volume doubled within the first month. Highly recommend.',
    stars:    5,
  },
  {
    initials: 'AC',
    name:     'Alex C.',
    role:     'Consulting Agency CEO',
    category: 'AI Automation & CRM',
    quote:    'Easy to work with and eager to deliver. The automation system he built has saved our team hours every single week.',
    stars:    5,
  },
  {
    initials: 'DK',
    name:     'Dana K.',
    role:     'Marketing Manager',
    category: 'Paid Social Campaigns',
    quote:    'Great work ethic. Delivered exactly what was promised and communicated throughout. Will work with again.',
    stars:    5,
  },
]

const PROCESS_STEPS = [
  {
    num:   '01',
    title: 'Strategy',
    desc:  'Every engagement starts with a revenue audit. We map your current state, identify the highest-leverage opportunities, and build a 90-day roadmap before a single dollar is spent.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-8 h-8 text-gold">
        <path d="M6 30 L16 20 L22 26 L30 14 L36 20" />
        <circle cx="36" cy="8" r="3.5" />
        <path d="M6 36 h28" />
      </svg>
    ),
  },
  {
    num:   '02',
    title: 'Build',
    desc:  'Campaigns go live. Sites are deployed. Automation workflows are activated. Most clients see their first results within 14–18 days of engagement start.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-8 h-8 text-gold">
        <rect x="4" y="8" width="32" height="22" rx="2" />
        <path d="M12 16 h6 M12 22 h10 M12 12 h16" />
        <path d="M14 30 L12 36 M26 30 L28 36 M10 36 h20" />
      </svg>
    ),
  },
  {
    num:   '03',
    title: 'Automate',
    desc:  'AI systems, CRM workflows, and follow-up sequences take manual work off your team\'s plate. The system works around the clock — nights, weekends, and holidays.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-8 h-8 text-gold">
        <circle cx="20" cy="12" r="5" />
        <circle cx="8" cy="28" r="4" />
        <circle cx="32" cy="28" r="4" />
        <path d="M17 16 L11 25 M23 16 L29 25 M12 28 h16" />
      </svg>
    ),
  },
  {
    num:   '04',
    title: 'Scale',
    desc:  'Weekly data reviews, A/B tests, budget reallocation, and compounding optimisation. Results improve month after month — not plateau after month two.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-8 h-8 text-gold">
        <path d="M6 34 L14 22 L22 28 L32 12" />
        <path d="M28 12 h4 v4" />
        <path d="M6 6 v28 h28" />
      </svg>
    ),
  },
] as const

/* ─────────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] },
  }),
}

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay },
  }),
}

const slideLeft = {
  hidden:  { opacity: 0, x: -24 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] },
  }),
}

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.65, delay, ease: [0.23, 1, 0.32, 1] },
  }),
}

/* ─────────────────────────────────────────────────────────────────
   SMALL REUSABLE COMPONENTS
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
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="btn-primary inline-flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.12em] uppercase text-bg bg-gold px-10 py-4 no-underline"
    >
      {children}
    </motion.a>
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

/* Animated counter hook */
function useCounter(target: number, duration = 1800) {
  const [count, setCount]   = useState(0)
  const [started, setStart] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView || started) return
    setStart(true)
    const start = performance.now()
    const tick  = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, started, target, duration])

  return { ref, count }
}

/* Stat counter component */
function AnimatedStat({ val, suffix, lbl }: { val: string; suffix: string; lbl: string }) {
  const numeric = parseInt(val.replace(/\D/g, ''))
  const { ref, count } = useCounter(numeric)
  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="font-cormorant font-light text-[2.8rem] text-brand leading-none mb-1">
        {count}<span className="text-gold">{suffix}</span>
      </div>
      <div className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-muted">{lbl}</div>
    </div>
  )
}

/* Card thumbnail placeholder */
function CaseThumbnail({
  gradient,
  category,
  num,
  featured = false,
}: {
  gradient: CaseStudy['gradient']
  category: string
  num: string
  featured?: boolean
}) {
  const accent = GRAD_ACCENT[gradient]
  return (
    <div className="absolute inset-0">
      {/* base gradient */}
      <div className="absolute inset-0" style={{ background: GRAD_BG[gradient] }} />
      {/* diagonal rule */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,transparent,transparent 24px,
            ${accent} 24px,${accent} 25px
          )`,
        }}
      />
      {/* corner radial glow */}
      <div
        className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-40"
        style={{ background: `radial-gradient(circle,${accent} 0%,transparent 70%)` }}
      />
      {/* bottom glow */}
      <div
        className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-25"
        style={{ background: `radial-gradient(circle,${accent} 0%,transparent 70%)` }}
      />
      {/* mock UI lines */}
      <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-2 opacity-30">
        <div className="h-1 rounded-sm bg-white/20" style={{ width: '55%' }} />
        <div className="h-1 rounded-sm bg-white/20" style={{ width: '80%' }} />
        <div className="h-1 rounded-sm bg-white/20" style={{ width: '40%' }} />
      </div>
      {/* number watermark */}
      <div className="absolute top-6 right-6 font-cormorant text-[4rem] font-light leading-none text-white/[0.05]">
        {num}
      </div>
      {/* badges */}
      <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
        {featured && (
          <span className="font-mono text-[0.58rem] tracking-[0.18em] uppercase text-bg bg-gold px-3 py-1.5 leading-none">
            Featured
          </span>
        )}
        <span className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-muted border border-white/15 px-3 py-1.5 bg-black/50 backdrop-blur-sm leading-none">
          {category}
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   SECTION WRAPPERS WITH SCROLL REVEAL
───────────────────────────────────────────────────────────────── */
function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   CURSOR HOOK
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
  const [activeFilter, setActiveFilter] = useState('All')

  const heroRef   = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY     = useTransform(scrollYProgress, [0, 1], [0, 60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const filters = ['All', 'Featured', 'Lead Generation', 'eCommerce Growth', 'Google Ads', 'AI Automation', 'Paid Social']

  const filteredCases = CASE_STUDIES.filter(c => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Featured') return c.featured
    return c.category === activeFilter
  })

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
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
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
      <section ref={heroRef} className="relative overflow-hidden px-8 md:px-16 pt-44 pb-28 min-h-[90vh] flex flex-col justify-end">
        {/* layered atmospheric bg */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 60% 55% at 75% 18%,rgba(201,168,76,0.10) 0%,transparent 60%)',
              'radial-gradient(ellipse 40% 50% at 15% 80%,rgba(201,168,76,0.05) 0%,transparent 55%)',
              'radial-gradient(ellipse 30% 30% at 50% 50%,rgba(201,168,76,0.03) 0%,transparent 70%)',
              '#0a0a09',
            ].join(', '),
          }}
        />
        <div className="hero-grid-overlay absolute inset-0" style={{ opacity: 0.45 }} />

        {/* parallax content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-[1280px] mx-auto w-full"
        >
          {/* eyebrow */}
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="hero-eyebrow flex items-center gap-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-gold mb-6"
          >
            Selected Work — 2021–2025
          </motion.p>

          {/* headline */}
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={0.12}
            className="font-cormorant font-light text-hero text-brand leading-[0.93] tracking-tight mb-10 max-w-5xl"
          >
            Growth Systems<br />
            Built for <em className="italic text-gold">Modern Brands.</em>
          </motion.h1>

          {/* sub + trust */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.24}
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10"
          >
            <p className="max-w-[500px] text-muted leading-[1.8] text-[1rem]">
              Real client results across AI automation, digital marketing, Shopify growth, lead
              generation, performance advertising, and conversion-focused web systems — built
              for brands that compete internationally.
            </p>
            <div className="flex flex-col gap-3 items-start md:items-end flex-shrink-0">
              {[
                'AI automation systems',
                'Digital marketing execution',
                'Lead generation & CRO',
              ].map(item => (
                <div
                  key={item}
                  className="inline-flex items-center gap-3 font-mono text-[0.63rem] tracking-[0.12em] uppercase border border-border px-4 py-2 text-muted"
                >
                  <span className="text-gold text-[0.5rem]">◆</span>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* animated stats */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.36}
            className="flex flex-wrap gap-12 md:gap-20 mt-16 pt-10 border-t border-white/[0.07]"
          >
            {HERO_STATS.map(s => (
              <AnimatedStat key={s.lbl} val={s.val} suffix={s.suffix} lbl={s.lbl} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════════════════════════ */}
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
      <section className="bg-bg2 px-8 md:px-16 py-28">
        <div className="max-w-[1280px] mx-auto">
          {/* header */}
          <RevealSection className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-14">
            <div>
              <SectionLabel>Case Studies</SectionLabel>
              <SectionTitle>
                Six projects.<br />
                <em className="italic text-gold">Proven systems.</em>
              </SectionTitle>
            </div>
            <p className="text-muted text-[0.9rem] leading-[1.75] max-w-xs self-end">
              Every project here started with a clear business problem and ended with a measurable revenue outcome.
            </p>
          </RevealSection>

          {/* filter bar */}
          <div className="flex flex-wrap gap-px bg-border border border-border mb-px overflow-hidden">
            {filters.map(f => (
              <motion.button
                key={f}
                onClick={() => setActiveFilter(f)}
                whileTap={{ scale: 0.97 }}
                className={`font-mono text-[0.65rem] tracking-[0.12em] uppercase px-6 py-4 transition-all duration-200 cursor-pointer border-0 outline-none ${
                  activeFilter === f
                    ? 'bg-gold text-bg'
                    : 'bg-bg2 text-muted hover:text-gold hover:bg-surface'
                }`}
              >
                {f}
                {activeFilter === f && <span className="ml-2 text-[0.5rem]">◆</span>}
              </motion.button>
            ))}
          </div>

          {/* grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
            >
              {filteredCases.length === 0 ? (
                <div className="col-span-3 bg-bg3 py-24 text-center">
                  <p className="font-cormorant text-[1.4rem] font-light text-muted mb-2">
                    No projects in this category.
                  </p>
                  <button
                    onClick={() => setActiveFilter('All')}
                    className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-gold border-b border-gold pb-px bg-transparent cursor-pointer outline-none"
                  >
                    View all work →
                  </button>
                </div>
              ) : (
                filteredCases.map((c, idx) => (
                  <motion.a
                    key={c.slug}
                    href={`/work/${c.slug}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: idx * 0.07, ease: [0.23, 1, 0.32, 1] }}
                    className="group flex flex-col bg-bg3 no-underline overflow-hidden border-0 outline-none"
                  >
                    {/* thumbnail */}
                    <div className="relative overflow-hidden h-56 flex-shrink-0">
                      <CaseThumbnail
                        gradient={c.gradient}
                        category={c.category}
                        num={c.num}
                        featured={c.featured}
                      />
                      {/* hover overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gold/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      />
                      {/* scale on hover */}
                      <motion.div
                        className="absolute inset-0"
                        style={{ transformOrigin: 'center' }}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                      />
                    </div>

                    {/* content */}
                    <div className="flex flex-col flex-1 p-8 group-hover:bg-surface transition-colors duration-300">
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-dim">
                          {c.industry}
                        </span>
                        <span className="font-mono text-[0.58rem] tracking-[0.16em] text-gold/50">
                          {c.num}
                        </span>
                      </div>

                      <h3 className="font-cormorant font-normal text-[1.3rem] leading-[1.2] text-brand mb-3 group-hover:text-gold transition-colors duration-300">
                        {c.title}
                      </h3>

                      <p className="text-muted text-[0.83rem] leading-[1.72] mb-6 line-clamp-3">
                        {c.desc}
                      </p>

                      {/* metrics */}
                      <div className="flex gap-6 mb-6 pt-5 border-t border-white/[0.06]">
                        {c.results.map(r => (
                          <div key={r.lbl}>
                            <div className="font-cormorant font-light text-[1.5rem] text-gold leading-none">
                              {r.val}
                            </div>
                            <div className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-dim mt-0.5">
                              {r.lbl}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {c.tags.map(t => (
                          <span
                            key={t}
                            className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-dim border border-border px-2.5 py-1 group-hover:border-gold/20 group-hover:text-muted/80 transition-colors duration-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted group-hover:text-gold transition-colors duration-200">
                          View case study
                        </span>
                        <motion.span
                          className="text-muted group-hover:text-gold transition-colors duration-200 text-sm"
                          animate={{ x: 0 }}
                          whileGroupHover={{ x: 4 }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </motion.a>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* count */}
          <div className="mt-px border border-border border-t-0 bg-bg3 px-8 py-4 flex items-center justify-between">
            <span className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-dim">
              Showing {filteredCases.length} of {CASE_STUDIES.length} projects
            </span>
            <BtnGhost href="/contact">Start your own project →</BtnGhost>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          UPWORK SHOWCASE
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg px-8 md:px-16 py-28">
        <div className="max-w-[1280px] mx-auto">
          <RevealSection className="mb-16">
            <SectionLabel>Verified Track Record</SectionLabel>
            <SectionTitle>
              Trusted on Upwork<br />
              <em className="italic text-gold">by clients worldwide</em>
            </SectionTitle>
          </RevealSection>

          <RevealSection delay={0.1}>
            <div className="grid lg:grid-cols-[1fr_400px] gap-px bg-border border border-border overflow-hidden">
              {/* Left: profile card */}
              <div className="bg-bg3 p-10 md:p-14 relative overflow-hidden">
                {/* corner glow */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
                  style={{ background: 'radial-gradient(circle,rgba(201,168,76,1) 0%,transparent 70%)' }}
                />

                <div className="flex items-start gap-6 mb-10">
                  {/* avatar */}
                  <div className="w-16 h-16 rounded-full border border-gold/30 bg-surface flex items-center justify-center flex-shrink-0">
                    <span className="font-cormorant text-[1.6rem] font-light text-gold">T</span>
                  </div>
                  <div>
                    <h3 className="font-cormorant text-[1.5rem] font-normal text-brand mb-1">
                      Towhid — Nexyra<span className="text-gold">.</span>
                    </h3>
                    <p className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted">
                      Digital Marketing & AI Automation Specialist
                    </p>
                  </div>
                </div>

                {/* badges row */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {[
                    { label: 'Top Rated',        glow: true  },
                    { label: '100% Job Success', glow: false },
                    { label: '5-Star Reviews',   glow: false },
                    { label: 'Multi-Year',       glow: false },
                  ].map(({ label, glow }) => (
                    <span
                      key={label}
                      className={`font-mono text-[0.6rem] tracking-[0.14em] uppercase px-4 py-2 leading-none ${
                        glow
                          ? 'text-bg bg-gold'
                          : 'text-muted border border-border'
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* metrics grid */}
                <div className="grid grid-cols-2 gap-px bg-border mb-10">
                  {[
                    { val: '80+',    lbl: 'Projects completed'   },
                    { val: '5.0',    lbl: 'Average star rating'  },
                    { val: '100%',   lbl: 'Job success score'    },
                    { val: '4+yrs',  lbl: 'Platform experience'  },
                  ].map(({ val, lbl }) => (
                    <div key={lbl} className="bg-bg3 px-6 py-5">
                      <div className="font-cormorant font-light text-[2rem] text-gold leading-none mb-1">
                        {val}
                      </div>
                      <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-dim">
                        {lbl}
                      </div>
                    </div>
                  ))}
                </div>

                {/* about */}
                <p className="text-muted text-[0.9rem] leading-[1.78] mb-10">
                  Specialising in AI-powered lead generation, performance advertising, and conversion
                  engineering for international clients across real estate, eCommerce, and local services.
                  All Upwork work is executed personally — not delegated to junior staff.
                </p>

                {/* what clients say */}
                <div className="pt-8 border-t border-white/[0.06]">
                  <p className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted mb-5">
                    What clients say
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      '"Diligent, thorough, precise, and easy to communicate with."',
                      '"Very proactive — results came faster than expected."',
                      '"Excellent work ethic and highly motivated."',
                    ].map((q, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-gold text-[0.65rem] mt-0.5 flex-shrink-0">◆</span>
                        <p className="font-cormorant italic text-[1rem] text-brand/75 leading-[1.5]">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: CTA panel */}
              <div className="bg-bg2 p-10 md:p-14 flex flex-col justify-between gap-10 border-t lg:border-t-0 lg:border-l border-border">
                <div>
                  <p className="section-label mb-6">Work with Towhid</p>
                  <h3 className="font-cormorant text-[1.6rem] font-normal leading-tight text-brand mb-6">
                    Hire directly on Upwork or through Nexyra<span className="text-gold">.</span>
                  </h3>
                  <p className="text-muted text-[0.88rem] leading-[1.75] mb-8">
                    Whether you prefer the security of Upwork&apos;s payment protection or a direct
                    engagement through Nexyra — both paths lead to the same outcome: a growth
                    system built specifically for your business.
                  </p>

                  {/* platform options */}
                  <div className="flex flex-col gap-4">
                    {[
                      {
                        name: 'Upwork Platform',
                        desc: 'Full payment protection, contract history, dispute resolution',
                        href: 'https://www.upwork.com/freelancers/towhid',
                        primary: true,
                      },
                      {
                        name: 'Direct via Nexyra',
                        desc: 'Faster onboarding, retainer contracts, full agency scope',
                        href: '/contact',
                        primary: false,
                      },
                    ].map(opt => (
                      <a
                        key={opt.name}
                        href={opt.href}
                        target={opt.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className={`flex items-start gap-4 p-5 border no-underline transition-all duration-300 group ${
                          opt.primary
                            ? 'border-gold/30 bg-gold/[0.04] hover:bg-gold/[0.08]'
                            : 'border-border hover:border-gold/20 hover:bg-surface'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                            opt.primary ? 'bg-gold' : 'bg-dim'
                          }`}
                        />
                        <div>
                          <p className={`font-mono text-[0.65rem] tracking-[0.12em] uppercase mb-1 ${
                            opt.primary ? 'text-gold' : 'text-muted'
                          }`}>
                            {opt.name}
                          </p>
                          <p className="text-dim text-[0.82rem]">{opt.desc}</p>
                        </div>
                        <span className="ml-auto text-dim group-hover:text-gold transition-colors text-sm self-center">→</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col gap-4">
                  <BtnPrimary href="https://www.upwork.com/freelancers/towhid">
                    View Upwork Profile →
                  </BtnPrimary>
                  <BtnGhost href="/contact">Start a project directly</BtnGhost>
                </div>

                {/* trust note */}
                <p className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-dim pt-4 border-t border-white/[0.05]">
                  International clients · All time zones · Rolling contracts · No lock-in
                </p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 px-8 md:px-16 py-28">
        <div className="max-w-[1280px] mx-auto">
          <RevealSection className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <div>
              <SectionLabel>Client Feedback</SectionLabel>
              <SectionTitle>
                What clients<br />
                <em className="italic text-gold">actually say</em>
              </SectionTitle>
            </div>
            <div className="self-end">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-cormorant text-[2.2rem] font-light text-gold leading-none">5.0</span>
                <div>
                  <div className="text-gold text-[0.8rem] tracking-[0.08em]">★★★★★</div>
                  <p className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">Average rating</p>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.name}
                ref={useRef(null)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={scaleIn}
                custom={idx * 0.09}
                className="bg-bg3 p-8 md:p-10 flex flex-col gap-6 hover:bg-surface transition-colors duration-300 group"
              >
                {/* quote mark */}
                <div className="font-cormorant text-[4rem] font-light text-gold/20 leading-[0.7] group-hover:text-gold/35 transition-colors duration-300">
                  &ldquo;
                </div>

                {/* category badge */}
                <span className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-gold/60 border border-gold/15 px-3 py-1.5 self-start">
                  {t.category}
                </span>

                {/* quote */}
                <p className="font-cormorant italic text-[1.1rem] text-brand/85 leading-[1.65] flex-1">
                  {t.quote}
                </p>

                {/* stars */}
                <div className="text-gold text-[0.75rem] tracking-[0.08em]">
                  {'★'.repeat(t.stars)}
                </div>

                {/* author */}
                <div className="flex items-center gap-4 pt-5 border-t border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center flex-shrink-0 group-hover:border-gold/30 transition-colors duration-300">
                    <span className="font-cormorant text-[1rem] text-gold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-cabinet font-bold text-[0.88rem] text-brand">{t.name}</p>
                    <p className="font-mono text-[0.58rem] tracking-[0.08em] uppercase text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* aggregate trust bar */}
          <div className="mt-px border border-border border-t-0 bg-bg3 grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { val: '5.0',  lbl: 'Star rating on Upwork'     },
              { val: '100%', lbl: 'Job success score'          },
              { val: '80+',  lbl: 'Completed contracts'        },
              { val: 'All',  lbl: 'Reviews verified by Upwork' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="px-8 py-6 text-center">
                <div className="font-cormorant font-light text-[1.8rem] text-gold leading-none mb-1">{val}</div>
                <div className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-dim">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROCESS — Strategy · Build · Automate · Scale
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg px-8 md:px-16 py-28 overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <RevealSection className="grid md:grid-cols-2 gap-12 items-end mb-20">
            <div>
              <SectionLabel>The Method</SectionLabel>
              <SectionTitle>
                Every project follows<br />
                <em className="italic text-gold">the same proven system</em>
              </SectionTitle>
            </div>
            <p className="text-muted leading-[1.8] self-end text-[0.95rem]">
              There is no guesswork in how Nexyra operates. Every engagement runs through four
              disciplines in sequence — because skipping steps is how results stall.
            </p>
          </RevealSection>

          {/* process steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {PROCESS_STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={idx * 0.1}
                className="process-step bg-bg p-10 group"
              >
                {/* icon */}
                <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {step.icon}
                </div>

                {/* ghost number */}
                <div className="font-cormorant text-[4.5rem] font-light leading-none mb-3 text-gold/[0.08] group-hover:text-gold/20 transition-colors duration-500">
                  {step.num}
                </div>

                <h3 className="font-cormorant text-[1.5rem] font-normal text-brand mb-4">
                  {step.title}
                </h3>
                <p className="text-muted text-[0.87rem] leading-[1.75]">{step.desc}</p>

                {/* animated underline */}
                <motion.div
                  className="mt-6 h-px bg-gold/0 group-hover:bg-gold/30 transition-all duration-500"
                  style={{ width: '40px' }}
                />
              </motion.div>
            ))}
          </div>

          {/* cinematic timeline accent */}
          <RevealSection delay={0.2} className="mt-16 pt-10 border-t border-white/[0.05]">
            <div className="flex flex-wrap gap-10 md:gap-20 items-center">
              <div>
                <span className="font-cormorant text-[2.2rem] font-light text-brand leading-none">
                  14–18<span className="text-gold">d</span>
                </span>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted mt-1">Go-live target</p>
              </div>
              <div>
                <span className="font-cormorant text-[2.2rem] font-light text-brand leading-none">
                  90<span className="text-gold">d</span>
                </span>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted mt-1">Full system maturity</p>
              </div>
              <div>
                <span className="font-cormorant text-[2.2rem] font-light text-brand leading-none">
                  Weekly<span className="text-gold">.</span>
                </span>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted mt-1">Optimisation cycles</p>
              </div>
              <div className="md:ml-auto">
                <BtnGhost href="/services">See all services →</BtnGhost>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA — cinematic full-bleed
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 relative overflow-hidden px-8 md:px-16 py-44 text-center">
        {/* layered glow background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(201,168,76,0.08) 0%,transparent 70%),#111110',
              'radial-gradient(ellipse 75% 75% at 50% 50%,rgba(201,168,76,0.11) 0%,transparent 70%),#111110',
              'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(201,168,76,0.08) 0%,transparent 70%),#111110',
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
        />

        {/* pulsing rings */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full border border-gold/[0.07] animate-ring"
          style={{ top: '50%', left: '50%' }}
        />
        <div
          className="absolute w-[900px] h-[900px] rounded-full border border-gold/[0.07] animate-ring-2"
          style={{ top: '50%', left: '50%' }}
        />
        {/* third ring */}
        <motion.div
          animate={{ opacity: [0.03, 0.07, 0.03], scale: [1, 1.02, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute w-[1200px] h-[1200px] rounded-full border border-gold"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        />

        <RevealSection className="relative z-10 max-w-[1280px] mx-auto">
          <SectionLabel className="justify-center">Ready to grow?</SectionLabel>

          {/* cinematic headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            className="font-cormorant font-light text-cta text-brand mb-6 max-w-4xl mx-auto"
          >
            Let&apos;s build your<br />
            <em className="italic text-gold">growth infrastructure.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="text-muted max-w-[500px] mx-auto mb-4 leading-[1.8] text-[1rem]"
          >
            The businesses in this portfolio all started with one decision — to stop improvising
            and start building a system. Your next case study starts with a conversation.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-gold/60 mb-14"
          >
            International clients welcome · Strategy call is always free · No pitch, no pressure
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex justify-center gap-6 flex-wrap mb-24"
          >
            <BtnPrimary href="/contact">Book a Strategy Call →</BtnPrimary>
            <BtnGhost href="/contact">Discuss your project</BtnGhost>
          </motion.div>

          {/* final trust grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-14 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { val: 'No retainer lock-in',   sub: 'Monthly rolling contracts'    },
              { val: 'Results in 14 days',     sub: 'Systems go live fast'         },
              { val: '12+ countries served',   sub: 'International experience'     },
              { val: 'Full attribution stack', sub: 'You know exactly what works'  },
            ].map(({ val, sub }) => (
              <div key={val} className="text-center">
                <p className="font-cormorant text-[1rem] font-normal text-brand mb-1">{val}</p>
                <p className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">{sub}</p>
              </div>
            ))}
          </motion.div>
        </RevealSection>
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
          {['LinkedIn', 'Upwork', 'Instagram', 'Contact'].map(s => (
            <a
              key={s}
              href={s === 'Upwork' ? 'https://www.upwork.com/freelancers/towhid' : s === 'Contact' ? '/contact' : '#'}
              target={s === 'Upwork' ? '_blank' : undefined}
              rel="noopener noreferrer"
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