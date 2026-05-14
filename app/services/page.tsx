'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ─────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────── */
interface DeepService {
  id: string
  label: string
  problem: string
  build: string[]
  outcome: string
  metric: { val: string; lbl: string }[]
  tag: string
}

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',     href: '/'          },
  { label: 'Services', href: '/services'  },
  { label: 'Work',     href: '/#work'     },
  { label: 'Contact',  href: '/#contact'  },
] as const

const TRUST_STATS = [
  { val: '150+', lbl: 'Clients worldwide'      },
  { val: '4.8×', lbl: 'Avg. ROAS delivered'    },
  { val: '92%',  lbl: 'Lead cost reduction'    },
  { val: '18d',  lbl: 'Avg. go-live time'      },
] as const

const MARQUEE_ITEMS = [
  'Google Ads', 'Meta Ads', 'Web Design', 'SEO', 'AI Automation',
  'Lead Generation', 'CRO', 'Real Estate', 'Landing Pages', 'CRM Workflows',
]

const SERVICE_CARDS = [
  {
    num: '01',
    title: 'Google Ads Management',
    desc:  'Intent-driven campaigns built to capture buyers already searching for your service. Every dollar tracked, every conversion attributed.',
    fit:   'Local service businesses, home services, clinics',
    outcome: 'Qualified leads within 14 days of launch',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold opacity-70">
        <circle cx="20" cy="20" r="12" /><path d="M30 30 L42 42" />
        <path d="M20 14 v6 h5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Facebook & Instagram Ads',
    desc:  'Scroll-stopping creative paired with precision audience architecture. Social ads that build demand, not just impressions.',
    fit:   'eCommerce brands, real estate agents, consultants',
    outcome: 'Cost-per-lead dropped an average of 47% in 60 days',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold opacity-70">
        <rect x="6" y="6" width="36" height="36" rx="8" />
        <path d="M24 34 v-10 a4 4 0 0 1 8 0" /><path d="M18 24 h12" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Website Design & Development',
    desc:  'Fast, conversion-engineered websites built in Next.js. Designed to win trust in 3 seconds and move visitors to action.',
    fit:   'All industries — this is your best-performing salesperson',
    outcome: 'Average 2.4× increase in contact form conversions',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold opacity-70">
        <rect x="4" y="8" width="40" height="28" rx="2" />
        <path d="M14 20 h8 M14 26 h14 M14 14 h20" />
        <path d="M16 36 L12 44 M32 36 L36 44 M12 44 h24" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Landing Page Design',
    desc:  'Single-purpose, high-intent pages built around one offer and one action. No distractions. No leaks. Just conversions.',
    fit:   'Campaigns, product launches, service offers',
    outcome: 'Industry benchmark-beating conversion rates from day one',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold opacity-70">
        <rect x="8" y="4" width="32" height="40" rx="2" />
        <path d="M14 14 h20 M14 22 h14 M14 30 h20" />
        <path d="M16 38 h16" strokeWidth={2} />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'SEO & Content Strategy',
    desc:  'Organic visibility compounded over time. We build the keyword architecture, content, and technical foundation that search engines reward.',
    fit:   'Local businesses, eCommerce, service directories',
    outcome: 'Page-1 rankings for high-intent local and national terms',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold opacity-70">
        <path d="M6 36 L18 24 L26 32 L36 18 L42 24" />
        <circle cx="42" cy="12" r="4" /><path d="M6 42 h36" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'AI Automation & CRM Workflows',
    desc:  'Intelligent pipelines that follow up, qualify, and nurture leads while your team focuses on closing. Powered by GPT, Make, and n8n.',
    fit:   'Agencies, real estate, high-volume service businesses',
    outcome: '22+ hours saved per week per business on average',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold opacity-70">
        <circle cx="24" cy="14" r="6" />
        <circle cx="10" cy="34" r="5" /><circle cx="38" cy="34" r="5" />
        <path d="M20 19 L13 30 M28 19 L35 30 M15 34 h18" />
      </svg>
    ),
  },
  {
    num: '07',
    title: 'Lead Generation Strategy',
    desc:  'End-to-end lead system architecture — from traffic source to CRM entry. We design the full funnel, not just the ad.',
    fit:   'Roofers, HVAC, plumbers, real estate teams, clinics',
    outcome: 'Predictable, scalable lead volume without referral dependency',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold opacity-70">
        <path d="M24 6 L42 18 V38 A2 2 0 0 1 40 40 H8 A2 2 0 0 1 6 38 V18 Z" />
        <path d="M24 6 L6 18 M24 6 L42 18 M6 18 h36" />
        <path d="M18 28 h12 M24 22 v12" />
      </svg>
    ),
  },
  {
    num: '08',
    title: 'Conversion Rate Optimization',
    desc:  'We audit your existing funnel, identify the friction killing your conversions, and rebuild with data-backed decisions — not guesswork.',
    fit:   'Any business with existing traffic that isn\'t converting',
    outcome: 'Average 38% uplift in conversion rate within 90 days',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold opacity-70">
        <path d="M8 40 L20 26 L28 32 L40 16" />
        <path d="M34 16 h6 v6" /><path d="M8 8 v32 h32" />
      </svg>
    ),
  },
] as const

const DEEP_SERVICES: DeepService[] = [
  {
    id: 'google-ads',
    label: 'Google Ads · Local Services',
    problem:
      'Most local service businesses are invisible at the moment a buyer types "roofing company near me" or "emergency plumber." When they do run ads, they bleed budget on broad match, weak landing pages, and zero conversion tracking.',
    build: [
      'Full Google Ads account audit and rebuild from scratch',
      'High-intent keyword architecture with negative keyword discipline',
      'Dedicated landing pages for every service and location',
      'Call tracking, form tracking, and offline conversion import',
      'Weekly bid strategy adjustments and monthly performance reviews',
    ],
    outcome:
      'Our clients typically see cost-per-lead drop 40–65% within the first 60 days while lead volume scales 2–3× — without increasing ad spend.',
    metric: [
      { val: '65%',  lbl: 'Avg. CPL reduction'  },
      { val: '2.9×', lbl: 'Lead volume increase' },
      { val: '14d',  lbl: 'First leads arrive'   },
    ],
    tag: 'For roofers, HVAC, plumbers, clinics, electricians',
  },
  {
    id: 'real-estate',
    label: 'Lead Generation · Real Estate',
    problem:
      'Real estate agents and teams are drowning in expensive Zillow leads and cold databases. They need a predictable, owned lead system that surfaces qualified buyers and sellers — not tire-kickers.',
    build: [
      'Hyper-local Facebook & Instagram campaigns targeting buyer/seller intent signals',
      'IDX-integrated landing pages with instant valuation tools',
      'AI-powered follow-up sequences via SMS, email, and CRM automation',
      'Lead scoring models to surface hot prospects automatically',
      'Monthly funnel performance audits and audience refreshes',
    ],
    outcome:
      'Real estate clients move off portal dependency and onto a predictable monthly pipeline of 30–80 qualified contacts with full attribution back to ad spend.',
    metric: [
      { val: '30–80', lbl: 'Qualified leads/month' },
      { val: '3.1×',  lbl: 'Cost vs. Zillow leads' },
      { val: '78%',   lbl: 'Lead response rate'    },
    ],
    tag: 'For solo agents, teams, brokerages, developers',
  },
  {
    id: 'web-design',
    label: 'Web Design & Development',
    problem:
      'Most business websites are digital brochures — slow, generic, and disconnected from any revenue goal. They load poorly on mobile, fail to communicate value in 3 seconds, and have no clear path to contact.',
    build: [
      'Strategic UX architecture mapped to your customer journey',
      'Conversion-first design with visual hierarchy and trust signals',
      'Built in Next.js for sub-1.5s load times and perfect Core Web Vitals',
      'CMS integration for effortless content updates',
      'Ongoing CRO — A/B tests, heatmaps, and quarterly redesigns',
    ],
    outcome:
      'A Nexyra-built website is not a project — it is a revenue asset. Clients report 2–4× improvements in qualified enquiries within 30 days of launch.',
    metric: [
      { val: '<1.5s', lbl: 'Target load time'       },
      { val: '2.4×',  lbl: 'Avg. conversion uplift'  },
      { val: '100',   lbl: 'Lighthouse score target' },
    ],
    tag: 'For all industries — your highest-leverage investment',
  },
  {
    id: 'ai-automation',
    label: 'AI Automation · Client Acquisition',
    problem:
      'Sales teams spend 60% of their time on tasks that don\'t close deals — chasing cold leads, sending follow-up emails manually, updating CRMs, and re-qualifying contacts that went cold weeks ago.',
    build: [
      'Custom AI-powered lead qualification bots (GPT + Typeform / Tally)',
      'Multi-channel follow-up sequences: email, SMS, WhatsApp',
      'CRM auto-population and pipeline stage triggers via Make / n8n',
      'Proposal generation automation from intake to PDF delivery',
      'Dashboard reporting that surfaces pipeline health at a glance',
    ],
    outcome:
      'Businesses running our AI automation layer close more deals with fewer team hours — the system works nights, weekends, and holidays without instruction.',
    metric: [
      { val: '22hrs', lbl: 'Saved per team/week'  },
      { val: '5min',  lbl: 'Avg. lead response'   },
      { val: '3.6×',  lbl: 'Pipeline throughput'  },
    ],
    tag: 'For agencies, real estate teams, high-volume services',
  },
]

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Audit',
    desc:  'We dissect your current ads, site, and conversion funnel. Every leak, every missed opportunity, every dollar left on the table — identified before we recommend anything.',
  },
  {
    num: '02',
    title: 'Strategy',
    desc:  'A bespoke 90-day growth roadmap: channel priorities, budget allocation, funnel architecture, and KPIs. Not a template — a plan built for your business.',
  },
  {
    num: '03',
    title: 'Build',
    desc:  'Campaigns launched, sites deployed, automations activated. Our team moves fast — most clients are live within 14–18 days of engagement start.',
  },
  {
    num: '04',
    title: 'Optimise',
    desc:  'Weekly iteration cycles driven by data. We A/B test, reallocate budget, refine copy, and push performance compounding — month after month.',
  },
] as const

const TARGET_INDUSTRIES = [
  { label: 'Roofers',                  tag: 'Home Services' },
  { label: 'Plumbers',                 tag: 'Home Services' },
  { label: 'HVAC Companies',           tag: 'Home Services' },
  { label: 'Real Estate Agents',       tag: 'Real Estate'   },
  { label: 'Property Developers',      tag: 'Real Estate'   },
  { label: 'Local Clinics',            tag: 'Healthcare'    },
  { label: 'Consultants & Coaches',    tag: 'B2B Services'  },
  { label: 'eCommerce Brands',         tag: 'Retail'        },
  { label: 'Electricians & Trades',    tag: 'Home Services' },
  { label: 'Law Firms',                tag: 'Professional'  },
  { label: 'Mortgage Brokers',         tag: 'Finance'       },
  { label: 'Service-Based SMBs',       tag: 'General'       },
] as const

const WHY_POINTS = [
  {
    num:   '01',
    title: 'Strategy before tactics',
    desc:  'Every engagement starts with a revenue audit, not a proposal. We identify the highest-leverage moves first — then we build.',
  },
  {
    num:   '02',
    title: 'AI-augmented execution',
    desc:  'Our internal workflows use AI to move faster, personalise at scale, and surface insights that human analysis alone would miss.',
  },
  {
    num:   '03',
    title: 'Conversion-obsessed design',
    desc:  'Every design decision maps to a business outcome. We don\'t build beautiful for beautiful\'s sake — we build to convert.',
  },
  {
    num:   '04',
    title: 'Attribution you can trust',
    desc:  'You see exactly which campaigns, keywords, and pages drive revenue — not vanity metrics that feel good but mean nothing.',
  },
  {
    num:   '05',
    title: 'International experience',
    desc:  'We\'ve built growth systems for clients across North America, Europe, the Middle East, and Australia. Time zones are not barriers.',
  },
  {
    num:   '06',
    title: 'One team, full stack',
    desc:  'Ads, web, SEO, automation — under one roof. No vendor fragmentation, no blame-shifting, no "that\'s not our department."',
  },
] as const

/* ─────────────────────────────────────────────────────────────────
   REUSABLE UI COMPONENTS
   (mirroring the homepage's exact component signatures)
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
   HOOKS
───────────────────────────────────────────────────────────────── */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
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
export default function ServicesPage() {
  useScrollReveal()
  const { cursorRef, trailRef } = useCursor()

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const [activeDeep, setActiveDeep] = useState<string>(DEEP_SERVICES[0].id)
  const activeService = DEEP_SERVICES.find(s => s.id === activeDeep)!

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
                  l.href === '/services' ? 'text-gold' : 'text-muted hover:text-gold'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#cta"
          className="font-mono text-[0.72rem] tracking-[0.1em] uppercase text-bg bg-gold px-6 py-2.5 no-underline hover:bg-gold2 transition-all hover:-translate-y-px"
        >
          Book a Call
        </a>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-end px-8 md:px-16 pb-24 pt-32 overflow-hidden"
      >
        {/* layered backgrounds */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 55% 45% at 75% 15%, rgba(201,168,76,0.09) 0%, transparent 60%)',
              'radial-gradient(ellipse 35% 55% at 15% 85%, rgba(232,160,32,0.05) 0%, transparent 50%)',
              '#0a0a09',
            ].join(', '),
          }}
        />
        {/* subtle grid */}
        <div
          className="hero-grid-overlay absolute inset-0"
          style={{ opacity: 0.6 }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto w-full">
          {/* eyebrow */}
          <p className="hero-eyebrow flex items-center gap-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-gold mb-6 animate-fade-up-1">
            Full-Service Growth Systems
          </p>

          {/* headline */}
          <h1 className="font-cormorant font-light text-hero text-brand mb-8 animate-fade-up-2 max-w-5xl">
            Ads, websites, and AI<br />
            systems that <em className="italic text-gold">compound.</em>
          </h1>

          {/* sub + actions */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 animate-fade-up-3">
            <p className="max-w-[480px] text-muted leading-[1.8] text-[1rem]">
              Nexyra builds the paid traffic, conversion infrastructure, and AI automation that turns
              anonymous visitors into booked appointments and closed revenue — for service businesses
              and brands that compete internationally.
            </p>
            <div className="flex flex-col gap-4 items-start md:items-end flex-shrink-0">
              <div className="inline-flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.12em] uppercase text-green border border-green/25 px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-dot" />
                Taking new clients — Q3 2025
              </div>
              <BtnPrimary href="#cta">Book a Strategy Call →</BtnPrimary>
              <BtnGhost href="/#work">View Our Work</BtnGhost>
            </div>
          </div>

          {/* trust stats */}
          <div className="flex flex-wrap gap-12 md:gap-20 mt-16 pt-10 border-t border-white/[0.07] animate-fade-up-4">
            {TRUST_STATS.map(({ val, lbl }) => (
              <div key={lbl}>
                <div className="font-cormorant font-light text-[2.8rem] text-brand leading-none mb-1">
                  {val.includes('+') || val.includes('×') || val.includes('d') ? (
                    <>
                      {val.replace(/[+×d]/g, '')}
                      <span className="text-gold">{val.match(/[+×d]/)?.[0]}</span>
                    </>
                  ) : val.includes('%') ? (
                    <>{val.replace('%', '')}<span className="text-gold">%</span></>
                  ) : (
                    <span className="text-gold">{val}</span>
                  )}
                </div>
                <div className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted">{lbl}</div>
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
          SERVICE OVERVIEW GRID
      ══════════════════════════════════════════════════════════ */}
      <section id="services-grid" className="bg-bg2 px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div>
              <SectionLabel>What We Build</SectionLabel>
              <SectionTitle>
                Eight systems.<br />
                <em className="italic text-gold">One growth engine.</em>
              </SectionTitle>
            </div>
            <p className="text-muted text-[0.9rem] leading-[1.75] max-w-xs self-end">
              Every service is designed to plug into the others — creating a compounding growth system, not a collection of siloed tactics.
            </p>
          </div>

          {/* 4-col grid, collapses gracefully */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {SERVICE_CARDS.map((s, idx) => (
              <div
                key={s.num}
                className={`service-card bg-bg2 p-8 cursor-default flex flex-col gap-6 reveal reveal-d${Math.min(idx % 4, 3) as 0 | 1 | 2 | 3}`}
              >
                <div className="flex items-start justify-between">
                  {s.icon}
                  <span className="font-mono text-[0.6rem] tracking-[0.18em] text-gold/50">{s.num}</span>
                </div>

                <div>
                  <h3 className="font-cormorant text-[1.35rem] font-normal leading-tight mb-3">{s.title}</h3>
                  <p className="text-muted text-[0.84rem] leading-[1.7]">{s.desc}</p>
                </div>

                <div className="mt-auto pt-5 border-t border-white/[0.06] flex flex-col gap-3">
                  <div>
                    <p className="font-mono text-[0.58rem] tracking-[0.15em] uppercase text-gold/60 mb-1">Best for</p>
                    <p className="text-dim text-[0.8rem] leading-[1.6]">{s.fit}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.58rem] tracking-[0.15em] uppercase text-gold/60 mb-1">Outcome</p>
                    <p className="text-brand/70 text-[0.8rem] leading-[1.6] font-medium">{s.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          DEEP SERVICE SECTIONS (tabbed)
      ══════════════════════════════════════════════════════════ */}
      <section id="deep-services" className="bg-bg px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal mb-16">
            <SectionLabel>In Depth</SectionLabel>
            <SectionTitle>
              How each system<br />
              <em className="italic text-gold">actually works</em>
            </SectionTitle>
          </div>

          {/* Tab bar */}
          <div className="reveal flex flex-wrap gap-px bg-border mb-0 border border-border">
            {DEEP_SERVICES.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveDeep(s.id)}
                className={`flex-1 min-w-[160px] px-6 py-4 font-mono text-[0.65rem] tracking-[0.12em] uppercase transition-all text-left border-none outline-none cursor-pointer ${
                  activeDeep === s.id
                    ? 'bg-gold text-bg'
                    : 'bg-bg2 text-muted hover:text-gold hover:bg-surface'
                }`}
              >
                {s.label.split(' · ')[0]}
                <span className="block text-[0.58rem] tracking-[0.08em] mt-0.5 opacity-70">
                  {s.label.split(' · ')[1]}
                </span>
              </button>
            ))}
          </div>

          {/* Active service panel */}
          <div
            key={activeDeep}
            className="border border-t-0 border-border bg-bg3"
          >
            <div className="grid md:grid-cols-[1fr_400px] gap-0">
              {/* Left: problem + what we build */}
              <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-border">
                {/* tag */}
                <span className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-gold mb-8 block">
                  {activeService.tag}
                </span>

                {/* problem */}
                <div className="mb-10">
                  <p className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-muted mb-4">
                    The problem
                  </p>
                  <p className="text-muted leading-[1.8] text-[0.95rem]">
                    {activeService.problem}
                  </p>
                </div>

                {/* what we build */}
                <div>
                  <p className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-muted mb-6">
                    What Nexyra builds
                  </p>
                  <ul className="flex flex-col gap-3">
                    {activeService.build.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="text-gold mt-1 flex-shrink-0 text-[0.7rem]">◆</span>
                        <span className="text-brand/85 text-[0.92rem] leading-[1.7]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: outcome + metrics + CTA */}
              <div className="p-10 md:p-14 flex flex-col justify-between gap-10">
                <div>
                  <p className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-muted mb-4">
                    The outcome
                  </p>
                  <p className="font-cormorant italic text-[1.35rem] text-brand/90 leading-[1.5]">
                    &ldquo;{activeService.outcome}&rdquo;
                  </p>
                </div>

                {/* metrics */}
                <div className="flex flex-col gap-6 pt-8 border-t border-white/[0.06]">
                  {activeService.metric.map(m => (
                    <div key={m.lbl} className="flex items-baseline gap-3">
                      <span className="font-cormorant font-light text-[2.4rem] text-gold leading-none">
                        {m.val}
                      </span>
                      <span className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-muted">
                        {m.lbl}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/[0.06]">
                  <BtnPrimary href="#cta">Get this system built →</BtnPrimary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROCESS
      ══════════════════════════════════════════════════════════ */}
      <section id="process" className="bg-bg2 px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal grid md:grid-cols-2 gap-16 items-end mb-20">
            <div>
              <SectionLabel>How We Work</SectionLabel>
              <SectionTitle>
                Four steps to a<br />
                <em className="italic text-gold">self-compounding system</em>
              </SectionTitle>
            </div>
            <p className="text-muted leading-[1.8] self-end text-[0.95rem]">
              We don&apos;t onboard and disappear. Every engagement follows a structured methodology that
              gets you to revenue faster and keeps improving long after launch day.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.num}
                className={`process-step bg-bg2 p-10 group reveal reveal-d${idx as 0 | 1 | 2 | 3}`}
              >
                <div className="font-cormorant text-[5rem] font-light leading-none mb-4 text-gold/[0.08] group-hover:text-gold/20 transition-colors duration-500">
                  {step.num}
                </div>
                <h3 className="font-cormorant text-[1.4rem] font-normal mb-4 text-brand">{step.title}</h3>
                <p className="text-muted text-[0.88rem] leading-[1.75]">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Timeline accent */}
          <div className="reveal mt-16 pt-10 border-t border-white/[0.05]">
            <div className="flex flex-wrap gap-10 md:gap-20 items-center">
              <div>
                <span className="font-cormorant text-[2.4rem] font-light text-brand leading-none">
                  14–18<span className="text-gold">d</span>
                </span>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted mt-1">Avg. go-live</p>
              </div>
              <div>
                <span className="font-cormorant text-[2.4rem] font-light text-brand leading-none">
                  Weekly<span className="text-gold">.</span>
                </span>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted mt-1">Performance reports</p>
              </div>
              <div>
                <span className="font-cormorant text-[2.4rem] font-light text-brand leading-none">
                  No<span className="text-gold"> lock-in</span>
                </span>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted mt-1">Monthly rolling contracts</p>
              </div>
              <div className="md:ml-auto">
                <BtnGhost href="#cta">Start the audit →</BtnGhost>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHO THIS IS FOR
      ══════════════════════════════════════════════════════════ */}
      <section id="who" className="bg-bg px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal grid md:grid-cols-2 gap-16 items-end mb-20">
            <div>
              <SectionLabel>Who We Serve</SectionLabel>
              <SectionTitle>
                Built for businesses<br />
                <em className="italic text-gold">that compete on results</em>
              </SectionTitle>
            </div>
            <p className="text-muted leading-[1.8] self-end text-[0.95rem]">
              We work with local service businesses, real estate professionals, and growth-stage brands
              who are done with agencies that over-promise and under-deliver.
            </p>
          </div>

          {/* Industry cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
            {TARGET_INDUSTRIES.map((ind, idx) => (
              <div
                key={ind.label}
                className={`bg-bg3 border-0 p-8 group hover:bg-surface transition-colors duration-300 cursor-default reveal reveal-d${Math.min(idx % 4, 3) as 0 | 1 | 2 | 3}`}
              >
                <span className="font-mono text-[0.58rem] tracking-[0.16em] uppercase text-gold/50 block mb-3">
                  {ind.tag}
                </span>
                <h4 className="font-cormorant text-[1.2rem] font-normal text-brand group-hover:text-gold transition-colors duration-300">
                  {ind.label}
                </h4>
                <div
                  className="mt-4 h-px bg-gold/0 group-hover:bg-gold/30 transition-all duration-500"
                  style={{ width: '40px' }}
                />
              </div>
            ))}
          </div>

          {/* Qualifier note */}
          <div className="reveal mt-12 p-8 border border-border bg-bg3 flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div>
              <p className="font-cormorant text-[1.15rem] font-normal text-brand/90 mb-1">
                Not sure if we&apos;re a fit?
              </p>
              <p className="text-muted text-[0.88rem] leading-[1.7]">
                We only take on clients where we can see a clear path to ROI. Book a 20-minute discovery
                call — no pitch, no pressure. Just an honest assessment.
              </p>
            </div>
            <div className="flex-shrink-0">
              <BtnPrimary href="#cta">Let&apos;s find out →</BtnPrimary>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHY NEXYRA
      ══════════════════════════════════════════════════════════ */}
      <section id="why" className="bg-bg2 px-8 md:px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal mb-20">
            <SectionLabel>Why Nexyra</SectionLabel>
            <SectionTitle className="max-w-2xl">
              Not an agency.<br />
              <em className="italic text-gold">A growth infrastructure partner.</em>
            </SectionTitle>
          </div>

          {/* 6-point grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {WHY_POINTS.map((pt, idx) => (
              <div
                key={pt.num}
                className={`service-card bg-bg2 p-10 cursor-default reveal reveal-d${Math.min(idx % 3, 3) as 0 | 1 | 2 | 3}`}
              >
                <p className="font-mono text-[0.6rem] tracking-[0.18em] text-gold mb-6">{pt.num}</p>
                <h3 className="font-cormorant text-[1.4rem] font-normal leading-snug mb-4">{pt.title}</h3>
                <p className="text-muted text-[0.88rem] leading-[1.75]">{pt.desc}</p>
              </div>
            ))}
          </div>

          {/* Differentiator banner */}
          <div className="reveal mt-16 grid md:grid-cols-3 gap-px bg-border">
            {[
              { stat: 'Zero',    detail: 'vanity metrics — every report ties to revenue'          },
              { stat: 'Always',  detail: 'AI-augmented — faster, smarter, more personalised'      },
              { stat: 'Full',    detail: 'attribution stack — you know exactly what\'s working'   },
            ].map(({ stat, detail }) => (
              <div key={stat} className="bg-bg3 px-10 py-8 flex items-center gap-6">
                <span className="font-cormorant text-[2rem] font-light text-gold leading-none flex-shrink-0">{stat}</span>
                <span className="text-muted text-[0.88rem] leading-[1.6]">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section id="cta" className="bg-bg relative overflow-hidden px-8 md:px-16 py-40 text-center">
        {/* atmospheric glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%), #0a0a09',
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

        <div className="relative z-10 max-w-[1280px] mx-auto reveal">
          <SectionLabel className="justify-center">Ready to grow?</SectionLabel>

          <h2 className="font-cormorant font-light text-cta text-brand mb-6 max-w-3xl mx-auto">
            Let&apos;s build the system<br />
            your business <em className="italic text-gold">deserves.</em>
          </h2>

          <p className="text-muted max-w-[520px] mx-auto mb-4 leading-[1.8] text-[1rem]">
            We work with a limited number of clients each quarter to maintain quality. If you&apos;re
            serious about predictable lead flow, international-grade web presence, and AI-powered
            operations — this is where it starts.
          </p>

          <p className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-gold/60 mb-12">
            International clients welcome · Discovery call is always free
          </p>

          <div className="flex justify-center gap-6 flex-wrap mb-20">
            <BtnPrimary href="/#contact">Book a Strategy Call →</BtnPrimary>
            <BtnGhost href="/#work">See client results first</BtnGhost>
          </div>

          {/* Final trust strip */}
          <div className="pt-12 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: 'No retainer lock-in',      sub: 'Monthly rolling contracts'     },
              { val: 'Results in 14 days',        sub: 'Campaigns live fast'           },
              { val: 'International welcome',     sub: 'Clients across 12+ countries'  },
              { val: 'Full attribution included', sub: 'Know exactly what works'       },
            ].map(({ val, sub }) => (
              <div key={val} className="text-center">
                <p className="font-cormorant text-[1.05rem] font-normal text-brand mb-1">{val}</p>
                <p className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-muted">{sub}</p>
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