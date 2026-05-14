'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ─────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────── */
interface FormState {
  fullName:      string
  workEmail:     string
  company:       string
  website:       string
  service:       string
  budget:        string
  details:       string
}

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',     href: '/'         },
  { label: 'Services', href: '/services' },
  { label: 'Blog',     href: '/blog'     },
  { label: 'Contact',  href: '/contact'  },
] as const

const MARQUEE_ITEMS = [
  'Google Ads', 'Website Design', 'AI Automation', 'Lead Generation',
  'SEO & Content', 'Real Estate', 'Local Services', 'eCommerce', 'CRO',
]

const SERVICE_OPTIONS = [
  'Google Ads Management',
  'Facebook & Instagram Ads',
  'Website Design & Development',
  'Landing Page Design',
  'SEO & Content Strategy',
  'AI Automation & CRM Workflows',
  'Lead Generation Strategy',
  'Conversion Rate Optimization',
  'Full Growth System (Multiple Services)',
  'Not sure — I need guidance',
] as const

const BUDGET_OPTIONS = [
  'Under $1,000 / month',
  '$1,000 – $2,500 / month',
  '$2,500 – $5,000 / month',
  '$5,000 – $10,000 / month',
  '$10,000+ / month',
  'Project-based — let\'s discuss',
] as const

const SERVICE_CARDS = [
  {
    num:   '01',
    title: 'Google Ads',
    desc:  'Intent-driven search campaigns for local and national markets. Qualified leads within 14 days.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9 text-gold opacity-70">
        <circle cx="20" cy="20" r="12" /><path d="M30 30 L42 42" /><path d="M20 14 v6 h5" />
      </svg>
    ),
  },
  {
    num:   '02',
    title: 'Website Design',
    desc:  'Conversion-engineered websites built in Next.js. Fast, premium, and built to turn visitors into leads.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9 text-gold opacity-70">
        <rect x="4" y="8" width="40" height="28" rx="2" /><path d="M14 20 h8 M14 26 h14" />
        <path d="M16 36 L12 44 M32 36 L36 44 M12 44 h24" />
      </svg>
    ),
  },
  {
    num:   '03',
    title: 'AI Automation',
    desc:  'GPT-powered workflows that qualify leads, send follow-ups, and update your CRM — without your team.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9 text-gold opacity-70">
        <circle cx="24" cy="14" r="6" /><circle cx="10" cy="34" r="5" /><circle cx="38" cy="34" r="5" />
        <path d="M20 19 L13 30 M28 19 L35 30 M15 34 h18" />
      </svg>
    ),
  },
  {
    num:   '04',
    title: 'SEO & Content',
    desc:  'Organic search architecture built to compound — keyword strategy, technical SEO, and content that ranks.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9 text-gold opacity-70">
        <path d="M6 36 L18 24 L26 32 L36 18 L42 24" /><circle cx="42" cy="12" r="4" /><path d="M6 42 h36" />
      </svg>
    ),
  },
  {
    num:   '05',
    title: 'Lead Generation',
    desc:  'Full-funnel lead systems for home services, real estate, and local businesses. Predictable volume, owned pipeline.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9 text-gold opacity-70">
        <path d="M24 6 L42 18 V38 A2 2 0 0 1 40 40 H8 A2 2 0 0 1 6 38 V18 Z" />
        <path d="M24 6 L6 18 M24 6 L42 18 M6 18 h36" /><path d="M18 28 h12 M24 22 v12" />
      </svg>
    ),
  },
  {
    num:   '06',
    title: 'Conversion Optimization',
    desc:  'Funnel audit, friction removal, and A/B-tested redesigns that increase revenue from your existing traffic.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9 text-gold opacity-70">
        <path d="M8 40 L20 26 L28 32 L40 16" /><path d="M34 16 h6 v6" /><path d="M8 8 v32 h32" />
      </svg>
    ),
  },
] as const

const CONTACT_DETAILS = [
  {
    label:    'Email',
    value:    'hello@nexyra.com',
    sub:      'Respond within 4 business hours',
    href:     'mailto:hello@nexyra.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label:    'LinkedIn',
    value:    'linkedin.com/company/nexyra',
    sub:      'DMs open for qualified enquiries',
    href:     'https://linkedin.com/company/nexyra',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label:    'Upwork',
    value:    'upwork.com/agency/nexyra',
    sub:      'Top Rated Agency — verified reviews',
    href:     'https://upwork.com/agency/nexyra',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 12 C3 7.03 7.03 3 12 3 s9 4.03 9 9 -4.03 9 -9 9 S3 16.97 3 12z" />
        <path d="M8 12 h8 M14 9 l3 3 -3 3" />
      </svg>
    ),
  },
  {
    label:    'Response Time',
    value:    'Within 4 hours',
    sub:      'Mon–Fri, 9am–6pm GMT+4',
    href:     null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
      </svg>
    ),
  },
  {
    label:    'Availability',
    value:    'Open for Q3 2025',
    sub:      'Limited to 4 new clients per quarter',
    href:     null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
] as const

const PROCESS_STEPS = [
  {
    num:   '01',
    title: 'We Review Your Inquiry',
    time:  'Within 4 hours',
    desc:  'Every submission is reviewed by a senior strategist — not an SDR, not an AI bot. We assess your business, goals, and current marketing situation before we respond.',
  },
  {
    num:   '02',
    title: 'Strategy Call',
    time:  '30 minutes',
    desc:  'A focused conversation about your growth goals, current challenges, and where the highest-leverage opportunities are. No pitch deck. No pressure. Just a genuine strategic assessment.',
  },
  {
    num:   '03',
    title: 'Custom Growth Plan',
    time:  'Within 48 hours',
    desc:  'We send a bespoke proposal outlining the exact systems we\'d build, the expected outcomes, and the investment required. If it makes sense on both sides, we start building.',
  },
] as const

const IDEAL_FIT = [
  'You run a service business and want a predictable, owned lead pipeline',
  'You\'re spending on ads but your cost-per-lead is too high',
  'Your website exists but isn\'t converting visitors to enquiries',
  'You want AI automation to handle follow-up, CRM, and qualification',
  'You\'re a real estate agent, broker, or developer who wants off portal dependency',
  'You\'re a home service business — roofing, HVAC, plumbing — ready to scale',
  'You have a monthly budget of $1,000+ and want measurable ROI',
  'You value long-term partnership over one-off projects',
]

const NOT_A_FIT = [
  'You need a $200 website with no conversion strategy',
  'You want someone to just run ads with no landing page or tracking',
  'You\'re looking for vanity metrics — followers, impressions, reach',
  'You\'re not open to a structured growth process',
  'You need someone to start tomorrow with zero onboarding',
]

const TRUST_STATS = [
  { val: '150+', lbl: 'Clients worldwide'   },
  { val: '12+',  lbl: 'Countries served'    },
  { val: '4.8×', lbl: 'Avg. ROAS delivered' },
  { val: 'Q3',   lbl: 'Currently accepting' },
] as const

/* ─────────────────────────────────────────────────────────────────
   SHARED UI COMPONENTS — exact signatures from homepage/services/blog
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

/* Shared form input styles */
const INPUT_BASE =
  'bg-bg border border-border text-brand px-5 py-4 font-mono text-[0.85rem] outline-none focus:border-gold transition-colors placeholder:text-dim w-full'

const LABEL_BASE =
  'font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted block mb-2'

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
export default function ContactPage() {
  useScrollReveal()
  const { cursorRef, trailRef } = useCursor()

  const [scrolled,    setScrolled]    = useState(false)
  const [selectedSvc, setSelectedSvc] = useState<string>('')
  const [submitted,   setSubmitted]   = useState(false)
  const [form, setForm] = useState<FormState>({
    fullName:  '',
    workEmail: '',
    company:   '',
    website:   '',
    service:   '',
    budget:    '',
    details:   '',
  })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleServiceCard(title: string) {
    setSelectedSvc(prev => (prev === title ? '' : title))
    // mirror into the form's service field for submission
    setForm(prev => ({
      ...prev,
      service: selectedSvc === title ? '' : title,
    }))
    // scroll to form smoothly
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Wire this to your API route, email service, or CRM later
    setSubmitted(true)
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
                  l.href === '/contact' ? 'text-gold' : 'text-muted hover:text-gold'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#inquiry-form"
          className="font-mono text-[0.72rem] tracking-[0.1em] uppercase text-bg bg-gold px-6 py-2.5 no-underline hover:bg-gold2 transition-all hover:-translate-y-px"
        >
          Start Project
        </a>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-8 md:px-16 pt-40 pb-28">
        {/* atmospheric glow */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 55% 55% at 68% 15%, rgba(201,168,76,0.1) 0%, transparent 60%)',
              'radial-gradient(ellipse 40% 50% at 15% 85%, rgba(201,168,76,0.05) 0%, transparent 55%)',
              '#0a0a09',
            ].join(', '),
          }}
        />
        <div className="hero-grid-overlay absolute inset-0" style={{ opacity: 0.5 }} />

        <div className="relative z-10 max-w-[1280px] mx-auto">
          {/* eyebrow */}
          <p className="hero-eyebrow flex items-center gap-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-gold mb-6 animate-fade-up-1">
            Start a Growth Conversation
          </p>

          {/* headline */}
          <h1 className="font-cormorant font-light text-hero text-brand leading-[0.95] tracking-tight mb-8 animate-fade-up-2 max-w-5xl">
            Tell us where you are.<br />
            We&apos;ll show you where you <em className="italic text-gold">could be.</em>
          </h1>

          {/* description + availability */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 animate-fade-up-3">
            <p className="max-w-[500px] text-muted leading-[1.8] text-[1rem]">
              Every engagement starts with an honest conversation — not a sales pitch.
              Fill in the form below and a senior strategist at Nexyra will personally
              review your inquiry and respond within 4 business hours.
            </p>
            <div className="flex flex-col gap-3 items-start md:items-end flex-shrink-0">
              <div className="inline-flex items-center gap-2.5 font-mono text-[0.63rem] tracking-[0.12em] uppercase border border-green/25 px-4 py-2 text-green">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-dot" />
                Open for Q3 2025 — 4 spots remaining
              </div>
              {[
                'International clients welcome',
                'No pitch calls — strategy first',
              ].map(t => (
                <div
                  key={t}
                  className="inline-flex items-center gap-2.5 font-mono text-[0.63rem] tracking-[0.12em] uppercase border border-border px-4 py-2 text-muted"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* stat strip */}
          <div className="flex flex-wrap gap-12 md:gap-20 mt-14 pt-10 border-t border-white/[0.07] animate-fade-up-4">
            {TRUST_STATS.map(({ val, lbl }) => (
              <div key={lbl}>
                <div className="font-cormorant font-light text-[2.6rem] text-brand leading-none mb-1">
                  {val.includes('+') ? (
                    <>{val.replace('+', '')}<span className="text-gold">+</span></>
                  ) : val.includes('×') ? (
                    <>{val.replace('×', '')}<span className="text-gold">×</span></>
                  ) : (
                    <>{val}<span className="text-gold">.</span></>
                  )}
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
          SERVICE SELECTION CARDS
          (above the form so users can click a service to pre-fill)
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 px-8 md:px-16 py-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
            <div>
              <SectionLabel>What Do You Need?</SectionLabel>
              <SectionTitle>
                Select a service<br />
                <em className="italic text-gold">to get started.</em>
              </SectionTitle>
            </div>
            <p className="text-muted text-[0.88rem] leading-[1.75] max-w-xs self-end">
              Click a card to pre-fill the inquiry form below. You can select multiple or describe
              your needs in your own words.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {SERVICE_CARDS.map((s, idx) => {
              const isActive = selectedSvc === s.title
              return (
                <button
                  key={s.num}
                  onClick={() => handleServiceCard(s.title)}
                  className={`reveal reveal-d${Math.min(idx % 3, 3) as 0|1|2|3} group text-left p-10 cursor-pointer outline-none border-0 transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-gold/[0.08]'
                      : 'bg-bg2 hover:bg-surface'
                  }`}
                >
                  {/* active bottom border */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-400 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />

                  <div className="flex items-start justify-between mb-8">
                    <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                      {s.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.58rem] tracking-[0.18em] text-dim">{s.num}</span>
                      {isActive && (
                        <span className="text-gold text-[0.55rem]">◆</span>
                      )}
                    </div>
                  </div>

                  <h3 className={`font-cormorant text-[1.3rem] font-normal leading-tight mb-3 transition-colors duration-300 ${
                    isActive ? 'text-gold' : 'text-brand group-hover:text-gold'
                  }`}>
                    {s.title}
                  </h3>
                  <p className="text-muted text-[0.84rem] leading-[1.7]">{s.desc}</p>

                  {isActive && (
                    <div className="mt-6 pt-5 border-t border-gold/20">
                      <span className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-gold">
                        Selected — scroll down to continue →
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTACT FORM
      ══════════════════════════════════════════════════════════ */}
      <section id="inquiry-form" className="bg-bg px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal grid md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_440px] gap-0 border border-border">

            {/* ── Left: form ── */}
            <div className="p-10 md:p-16 border-b md:border-b-0 md:border-r border-border">
              <SectionLabel className="mb-6">Project Inquiry</SectionLabel>
              <h2 className="font-cormorant font-light text-[2rem] md:text-[2.4rem] text-brand leading-tight mb-2">
                Tell us about<br />
                <em className="italic text-gold">your project.</em>
              </h2>
              <p className="text-muted text-[0.88rem] leading-[1.75] mb-10">
                The more detail you share, the more useful our response will be.
                Every field except website URL is required.
              </p>

              {submitted ? (
                /* ── Success state ── */
                <div className="py-16 text-center border border-gold/20 bg-gold/[0.04]">
                  <div className="font-cormorant text-[2.8rem] font-light text-brand mb-3">
                    Received<span className="text-gold">.</span>
                  </div>
                  <p className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-green mb-6">
                    Your inquiry is in — we&apos;ll respond within 4 hours
                  </p>
                  <p className="text-muted text-[0.88rem] leading-[1.7] max-w-xs mx-auto">
                    A senior strategist will personally review your submission and reach
                    out via your work email to schedule a call.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="fullName" className={LABEL_BASE}>
                        Full Name <span className="text-gold">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Alex Johnson"
                        className={INPUT_BASE}
                      />
                    </div>
                    <div>
                      <label htmlFor="workEmail" className={LABEL_BASE}>
                        Work Email <span className="text-gold">*</span>
                      </label>
                      <input
                        id="workEmail"
                        name="workEmail"
                        type="email"
                        required
                        value={form.workEmail}
                        onChange={handleChange}
                        placeholder="alex@company.com"
                        className={INPUT_BASE}
                      />
                    </div>
                  </div>

                  {/* Row 2: Company + Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="company" className={LABEL_BASE}>
                        Company / Brand <span className="text-gold">*</span>
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                        className={INPUT_BASE}
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className={LABEL_BASE}>
                        Website URL
                        <span className="text-dim normal-case tracking-normal font-cabinet ml-1 text-[0.6rem]">(optional)</span>
                      </label>
                      <input
                        id="website"
                        name="website"
                        type="url"
                        value={form.website}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                        className={INPUT_BASE}
                      />
                    </div>
                  </div>

                  {/* Row 3: Service + Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="service" className={LABEL_BASE}>
                        Service Needed <span className="text-gold">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="service"
                          name="service"
                          required
                          value={form.service || selectedSvc}
                          onChange={handleChange}
                          className={`${INPUT_BASE} appearance-none pr-10 cursor-pointer`}
                          style={{ background: '#0a0a09' }}
                        >
                          <option value="" disabled>Select a service</option>
                          {SERVICE_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-muted">
                            <path d="M2 4 l4 4 l4 -4" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="budget" className={LABEL_BASE}>
                        Monthly Budget <span className="text-gold">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="budget"
                          name="budget"
                          required
                          value={form.budget}
                          onChange={handleChange}
                          className={`${INPUT_BASE} appearance-none pr-10 cursor-pointer`}
                          style={{ background: '#0a0a09' }}
                        >
                          <option value="" disabled>Select a range</option>
                          {BUDGET_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-muted">
                            <path d="M2 4 l4 4 l4 -4" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Project Details */}
                  <div>
                    <label htmlFor="details" className={LABEL_BASE}>
                      Project Details <span className="text-gold">*</span>
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      required
                      rows={6}
                      value={form.details}
                      onChange={handleChange}
                      placeholder="Tell us about your business, your current situation, what's not working, and what success looks like for you. The more context you share, the better our first response will be."
                      className={`${INPUT_BASE} resize-y`}
                    />
                  </div>

                  {/* Privacy note + submit */}
                  <div className="flex flex-col gap-4 pt-2">
                    <p className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-dim">
                      Your information is never shared with third parties. We don&apos;t do cold
                      outreach or add you to generic mailing lists.
                    </p>
                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center gap-3 font-mono text-[0.75rem] tracking-[0.12em] uppercase text-bg bg-gold py-5 cursor-pointer border-0 outline-none hover:bg-gold2 transition-colors"
                    >
                      Send Project Inquiry →
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ── Right: sidebar ── */}
            <div className="flex flex-col divide-y divide-border">
              {/* What happens next */}
              <div className="p-10 bg-bg3">
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-gold mb-6">
                  What happens next
                </p>
                <div className="flex flex-col gap-6">
                  {PROCESS_STEPS.map(step => (
                    <div key={step.num} className="flex gap-5">
                      <div className="flex-shrink-0">
                        <span className="font-cormorant text-[1.6rem] font-light text-gold/30 leading-none">
                          {step.num}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <h4 className="font-cormorant text-[1.05rem] font-normal text-brand leading-tight">
                            {step.title}
                          </h4>
                          <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-gold/60 flex-shrink-0">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-muted text-[0.82rem] leading-[1.7]">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response guarantee */}
              <div className="p-10 bg-bg3">
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted mb-4">
                  Our commitment
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: '◆', text: 'Reviewed by a senior strategist — not a bot' },
                    { icon: '◆', text: 'Responded within 4 business hours'           },
                    { icon: '◆', text: 'No unsolicited follow-ups if it\'s not a fit' },
                    { icon: '◆', text: 'Honest assessment — no over-promising'        },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <span className="text-gold text-[0.6rem] mt-1 flex-shrink-0">{icon}</span>
                      <span className="text-muted text-[0.84rem] leading-[1.65]">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct contact */}
              <div className="p-10 bg-bg3">
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted mb-4">
                  Prefer to reach out directly?
                </p>
                <a
                  href="mailto:hello@nexyra.com"
                  className="group flex items-center gap-3 no-underline mb-3"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-gold flex-shrink-0">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span className="font-mono text-[0.75rem] tracking-[0.08em] text-muted group-hover:text-gold transition-colors">
                    hello@nexyra.com
                  </span>
                </a>
                <p className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-dim">
                  Mon – Fri · 9am – 6pm GMT+4
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTACT DETAILS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 px-8 md:px-16 py-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal mb-14">
            <SectionLabel>Find Us</SectionLabel>
            <SectionTitle>
              Multiple ways to<br />
              <em className="italic text-gold">start the conversation.</em>
            </SectionTitle>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-border">
            {CONTACT_DETAILS.map((detail, idx) => {
              const inner = (
                <div
                  className={`group flex flex-col gap-5 bg-bg2 p-8 h-full transition-colors duration-300 ${
                    detail.href ? 'hover:bg-surface cursor-pointer' : 'cursor-default'
                  } reveal reveal-d${Math.min(idx, 3) as 0|1|2|3}`}
                >
                  <div className={`text-gold opacity-70 transition-opacity group-hover:opacity-100 ${detail.href ? '' : 'opacity-50'}`}>
                    {detail.icon}
                  </div>
                  <div>
                    <p className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-dim mb-2">
                      {detail.label}
                    </p>
                    <p className={`font-cormorant text-[1.1rem] font-normal leading-tight mb-2 transition-colors duration-300 ${
                      detail.href ? 'text-brand group-hover:text-gold' : 'text-brand'
                    }`}>
                      {detail.value}
                    </p>
                    <p className="text-muted text-[0.78rem] leading-[1.6]">{detail.sub}</p>
                  </div>
                  {detail.href && (
                    <div className="mt-auto">
                      <span className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-gold/0 group-hover:text-gold transition-colors duration-300">
                        Visit →
                      </span>
                    </div>
                  )}
                </div>
              )

              return detail.href ? (
                <a key={detail.label} href={detail.href} className="no-underline block">
                  {inner}
                </a>
              ) : (
                <div key={detail.label}>{inner}</div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          IDEAL CLIENT FIT
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal mb-16">
            <SectionLabel>Fit Assessment</SectionLabel>
            <SectionTitle>
              Who we work with —<br />
              <em className="italic text-gold">and who we don&apos;t.</em>
            </SectionTitle>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border">
            {/* Ideal clients */}
            <div className="reveal bg-bg3 p-10 md:p-14">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-green" />
                <p className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-green">
                  We&apos;re a strong fit if you…
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {IDEAL_FIT.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <span className="text-green text-[0.65rem] mt-1 flex-shrink-0">◆</span>
                    <span className="text-brand/85 text-[0.9rem] leading-[1.7]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-white/[0.06]">
                <a href="#inquiry-form" className="inline-flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.12em] uppercase text-gold hover:gap-5 transition-all duration-300">
                  This is me — start the inquiry →
                </a>
              </div>
            </div>

            {/* Not a fit */}
            <div className="reveal reveal-d1 bg-bg3 p-10 md:p-14">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-dim" />
                <p className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-dim">
                  We&apos;re probably not a fit if you…
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {NOT_A_FIT.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-dim text-[0.65rem] mt-1 flex-shrink-0">—</span>
                    <span className="text-muted text-[0.9rem] leading-[1.7]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-white/[0.06]">
                <p className="text-muted text-[0.82rem] leading-[1.7]">
                  If you&apos;re not sure, send an inquiry anyway. We&apos;ll be honest with you —
                  if we&apos;re not the right fit, we&apos;ll point you in the right direction.
                </p>
              </div>
            </div>
          </div>

          {/* Qualifier note */}
          <div className="reveal mt-px p-8 md:p-10 border border-t-0 border-border bg-bg3 flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div>
              <p className="font-cormorant text-[1.2rem] font-normal text-brand mb-1">
                Not sure if you qualify? Send the inquiry regardless.
              </p>
              <p className="text-muted text-[0.86rem] leading-[1.7]">
                We&apos;d rather have an honest 20-minute conversation than miss the chance to help
                a business that would genuinely benefit from what we build.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="#inquiry-form"
                className="btn-primary inline-flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.12em] uppercase text-bg bg-gold px-8 py-4 no-underline transition-transform hover:-translate-y-0.5"
              >
                Submit an Inquiry →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROCESS AFTER INQUIRY
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg2 px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal grid md:grid-cols-2 gap-16 items-end mb-20">
            <div>
              <SectionLabel>What to Expect</SectionLabel>
              <SectionTitle>
                Three steps from<br />
                <em className="italic text-gold">inquiry to growth plan.</em>
              </SectionTitle>
            </div>
            <p className="text-muted leading-[1.8] self-end text-[0.95rem]">
              We respect your time. No endless sales cycles, no proposals-before-strategy,
              no pressure. Here is exactly what happens after you hit send.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.num}
                className={`process-step bg-bg2 p-10 md:p-12 group reveal reveal-d${idx as 0|1|2}`}
              >
                {/* ghost number */}
                <div className="font-cormorant text-[6rem] font-light leading-none mb-6 text-gold/[0.07] group-hover:text-gold/[0.18] transition-colors duration-500">
                  {step.num}
                </div>
                {/* time badge */}
                <div className="inline-flex items-center gap-2 font-mono text-[0.58rem] tracking-[0.15em] uppercase text-gold/60 border border-gold/20 px-3 py-1.5 mb-5">
                  {step.time}
                </div>
                <h3 className="font-cormorant text-[1.4rem] font-normal text-brand mb-4 leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted text-[0.88rem] leading-[1.75]">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Timeline note */}
          <div className="reveal mt-12 pt-10 border-t border-white/[0.05] flex flex-wrap gap-10 md:gap-20 items-center">
            <div>
              <span className="font-cormorant text-[2.2rem] font-light text-brand leading-none">
                &lt;4<span className="text-gold">hrs</span>
              </span>
              <p className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted mt-1">First response</p>
            </div>
            <div>
              <span className="font-cormorant text-[2.2rem] font-light text-brand leading-none">
                30<span className="text-gold">min</span>
              </span>
              <p className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted mt-1">Strategy call</p>
            </div>
            <div>
              <span className="font-cormorant text-[2.2rem] font-light text-brand leading-none">
                48<span className="text-gold">hrs</span>
              </span>
              <p className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted mt-1">Custom growth plan</p>
            </div>
            <div className="md:ml-auto">
              <BtnGhost href="#inquiry-form">Submit your inquiry →</BtnGhost>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-bg relative overflow-hidden px-8 md:px-16 py-40 text-center">
        {/* glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(201,168,76,0.08) 0%,transparent 70%),#0a0a09',
          }}
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

        <div className="relative z-10 reveal max-w-[1280px] mx-auto">
          <SectionLabel className="justify-center">The Decision Point</SectionLabel>

          <h2 className="font-cormorant font-light text-cta text-brand mb-6 max-w-3xl mx-auto">
            Serious about growth?<br />
            <em className="italic text-gold">Let&apos;s build it.</em>
          </h2>

          <p className="text-muted max-w-[520px] mx-auto mb-4 leading-[1.8] text-[1rem]">
            We take on a limited number of new clients each quarter to protect quality of delivery.
            If your timing is right and your goals are serious — the inquiry form is the first step.
            No commitment required to start the conversation.
          </p>

          <p className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-gold/60 mb-14">
            International clients welcome across all time zones
          </p>

          <div className="flex justify-center gap-6 flex-wrap mb-20">
            <a
              href="#inquiry-form"
              className="btn-primary inline-flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.12em] uppercase text-bg bg-gold px-10 py-4 no-underline transition-transform hover:-translate-y-0.5"
            >
              Send Project Inquiry →
            </a>
            <BtnGhost href="/services">Explore our services</BtnGhost>
          </div>

          {/* trust strip */}
          <div className="pt-12 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: 'Response &lt;4hrs',  sub: 'Mon – Fri, business hours' },
              { val: 'No lock-in',         sub: 'Monthly rolling contracts'  },
              { val: '12+ countries',      sub: 'International experience'   },
              { val: 'Full attribution',   sub: 'Know exactly what works'    },
            ].map(({ val, sub }) => (
              <div key={val} className="text-center">
                <p
                  className="font-cormorant text-[1rem] font-normal text-brand mb-1"
                  dangerouslySetInnerHTML={{ __html: val }}
                />
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
          {['LinkedIn', 'Instagram', 'Twitter', 'Upwork'].map(s => (
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