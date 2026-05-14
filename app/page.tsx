'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NAV_LINKS = ['Services', 'Work', 'Blog', 'Contact'] as const

const MARQUEE_ITEMS = [
  'Digital Marketing', 'Web Design', 'AI Automation', 'Brand Strategy',
  'SEO & Growth', 'Conversion Optimization', 'Funnel Architecture', 'AI Workflows',
]

const HERO_STATS = [
  { num: '7', suffix: '+', label: 'Years experience' },
  { num: '84', suffix: '+', label: 'Projects delivered' },
  { num: '3', suffix: '×', label: 'Avg. ROI increase' },
  { num: '98', suffix: '%', label: 'Client retention' },
]

const SERVICES = [
  {
    num: '01',
    name: 'Digital Marketing & Growth',
    desc: 'Data-driven campaigns across paid, organic, and owned channels. From strategy to execution — every decision backed by metrics that matter.',
    tags: ['Paid Ads', 'SEO', 'Content', 'Email', 'Analytics'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 text-gold opacity-70 mb-8">
        <path d="M6 36 L18 24 L26 32 L36 18 L42 24" />
        <circle cx="42" cy="12" r="4" />
        <path d="M6 42 h36" />
      </svg>
    ),
  },
  {
    num: '02',
    name: 'Web Design & Development',
    desc: 'High-converting websites and digital experiences that blend aesthetic precision with performance engineering. Built to impress and built to convert.',
    tags: ['UI/UX', 'Next.js', 'CRO', 'Motion', 'CMS'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 text-gold opacity-70 mb-8">
        <rect x="4" y="8" width="40" height="28" rx="2" />
        <path d="M16 36 L12 44 M32 36 L36 44 M12 44 h24" />
        <path d="M14 20 h8 M14 26 h14 M14 14 h20" />
      </svg>
    ),
  },
  {
    num: '03',
    name: 'AI Automation & Systems',
    desc: 'Custom AI pipelines, workflow automation, and intelligent systems that eliminate repetitive work and scale your operations without scaling your headcount.',
    tags: ['GPT APIs', 'n8n', 'Zapier', 'Make', 'LLMs'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 text-gold opacity-70 mb-8">
        <circle cx="24" cy="14" r="6" />
        <circle cx="10" cy="34" r="5" />
        <circle cx="38" cy="34" r="5" />
        <path d="M20 19 L13 30 M28 19 L35 30 M15 34 h18" />
      </svg>
    ),
  },
]

const PROCESS_STEPS = [
  { num: '01', title: 'Diagnose',   desc: 'Deep audit of your current marketing, site, and systems. I find exactly where revenue is leaking before recommending anything.' },
  { num: '02', title: 'Strategize', desc: 'A custom 90-day roadmap with clear priorities, resource allocation, and measurable milestones. No generic playbooks.' },
  { num: '03', title: 'Execute',    desc: 'High-velocity implementation across design, campaigns, and automation. Weekly reports keep you fully in the loop.' },
  { num: '04', title: 'Compound',   desc: 'Systematic optimization, A/B testing, and knowledge transfer so your systems keep improving long after our engagement.' },
]

const CASE_SMALL = [
  {
    tag: 'SaaS / Web Design',
    title: 'SaaSify Rebrand & Conversion Overhaul',
    desc: 'Redesigned the entire marketing site with conversion-first architecture. Trial signups increased 142% in 60 days.',
    metrics: [{ val: '142%', lbl: 'More signups' }, { val: '38%', lbl: 'Churn reduction' }],
    link: 'Case study →',
    gradient: 'bg-case-v2',
    dotColor: '#4c9af0',
  },
  {
    tag: 'Agency / AI Automation',
    title: "Automating VerdeAgency's Client Workflows",
    desc: 'Built an AI-powered reporting and client communication system, saving 22 hours per week across the team.',
    metrics: [{ val: '22hrs', lbl: 'Saved weekly' }, { val: '$180K', lbl: 'Annual savings' }],
    link: 'Case study →',
    gradient: 'bg-case-v3',
    dotColor: '#4caf7d',
  },
]

const BLOG_POSTS = [
  {
    cat: 'AI & Automation',
    date: 'May 8, 2025 · 9 min read',
    title: "The $0 AI Stack That's Replacing $30K/yr in Agency Tools",
    excerpt: 'How to build a fully automated content, CRM, and reporting pipeline using open-source AI models and no-code glue. The future of lean agencies.',
    bg: 'bg-blog-b1',
    featured: true,
  },
  {
    cat: 'Web Design',
    date: 'Apr 21, 2025 · 6 min read',
    title: 'Dark Mode Done Right: The UX Principles Most Designers Miss',
    excerpt: "Dark mode isn't just inverting colors. Here's the science behind contrast ratios, semantic color systems, and why your dark mode is probably hurting conversions.",
    bg: 'bg-blog-b2',
    featured: false,
  },
  {
    cat: 'Growth',
    date: 'Apr 3, 2025 · 7 min read',
    title: 'Why Most B2B Funnels Fail in the Middle (And How to Fix Yours)',
    excerpt: 'Top of funnel is easy. Bottom of funnel gets all the love. But the middle — nurturing, intent signals, and timing — is where most revenue dies.',
    bg: 'bg-blog-b3',
    featured: false,
  },
]

const TESTIMONIALS = [
  {
    text: "Aria didn't just redesign our site — she reconstructed how we think about online revenue. The AI systems she built have become the backbone of our marketing operation. ROI was visible within 45 days.",
    name: 'James Moreau',
    role: 'CEO, Luminary Co.',
    initials: 'JM',
  },
  {
    text: "We'd worked with three agencies before Aria. None of them came close to understanding our SaaS metrics the way she did. The site redesign practically doubled our demo request rate. Extraordinary work.",
    name: 'Sophie Kwan',
    role: 'Head of Growth, SaaSify',
    initials: 'SK',
  },
  {
    text: 'The automation workflows Aria built are genuinely wild. We went from spending 30% of our week on reports to having everything delivered automatically to clients before 8am Monday. Game-changing.',
    name: 'Rafael Lima',
    role: 'Founder, VerdeAgency',
    initials: 'RL',
  },
]

/* ─────────────────────────────────────────────
   SMALL REUSABLE COMPONENTS
───────────────────────────────────────────── */

function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`section-label ${className}`}>{children}</p>
  )
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

/* Mock browser window used inside case-study cards */
function MockBrowser({ dotColor = '#c9a84c', inset = '2rem', showChart = false }: {
  dotColor?: string; inset?: string; showChart?: boolean
}) {
  const chartHeights = [40, 65, 50, 80, 60, 90, 75]
  return (
    <div
      className="absolute flex flex-col overflow-hidden border border-white/[0.08] bg-white/[0.03]"
      style={{ inset }}
    >
      <div className="flex items-center gap-2 h-8 px-4 bg-white/[0.04] border-b border-white/[0.05] flex-shrink-0">
        {[0.5, 0.3, 0.15].map((op, i) => (
          <span key={i} className="w-2 h-2 rounded-full" style={{ background: dotColor, opacity: op }} />
        ))}
      </div>
      <div className="p-6 flex-1">
        <div className="h-1.5 rounded-sm bg-white/[0.06] mb-2.5" style={{ width: '70%' }} />
        <div className="h-1.5 rounded-sm bg-white/[0.06] mb-2.5" style={{ width: '45%' }} />
        <div className="h-1.5 rounded-sm bg-white/[0.06]"       style={{ width: '85%' }} />
      </div>
      {showChart && (
        <div className="flex items-end gap-1 mx-6 mb-4 h-14">
          {chartHeights.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gold rounded-t-sm mock-bar-item"
              style={{ height: `${h}%`, opacity: 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */

/** Attaches IntersectionObserver to every .reveal element */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/** Custom gold cursor + trailing ring */
function useCursor() {
  const cursorRef  = useRef<HTMLDivElement>(null)
  const trailRef   = useRef<HTMLDivElement>(null)
  const pos        = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 })
  const raf        = useRef<number>(0)

  const onMove = useCallback((e: MouseEvent) => {
    pos.current.tx = e.clientX
    pos.current.ty = e.clientY
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${e.clientX - 6}px,${e.clientY - 6}px)`
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', onMove)

    const tick = () => {
      const p = pos.current
      p.cx += (p.tx - p.cx) * 0.1
      p.cy += (p.ty - p.cy) * 0.1
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${p.cx - 20}px,${p.cy - 20}px)`
      }
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

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function Page() {
  useScrollReveal()
  const { cursorRef, trailRef } = useCursor()

  /* nav border on scroll */
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* form state */
  const [sent, setSent] = useState(false)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
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

      {/* ════════════════════════════════════
          NAV
      ════════════════════════════════════ */}
      <nav
        className={`fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-16 py-6 backdrop-blur-xl transition-colors duration-300 ${
          scrolled ? 'border-b border-white/10' : 'border-b border-white/[0.07]'
        }`}
        style={{ background: 'linear-gradient(180deg,rgba(10,10,9,0.95) 0%,transparent 100%)' }}
      >
        <a href="#hero" className="font-cormorant text-[1.4rem] font-semibold tracking-[0.02em] text-brand no-underline">
          Aria<span className="text-gold">.</span>Voss
        </a>

        <ul className="hidden md:flex gap-10 list-none">
          {NAV_LINKS.map(l => (
            <li key={l}>
              <a
                href={`/${l.toLowerCase()}`}
                className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-muted no-underline hover:text-gold transition-colors"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="font-mono text-[0.72rem] tracking-[0.1em] uppercase text-bg bg-gold px-6 py-2.5 no-underline hover:bg-gold2 transition-all hover:-translate-y-px"
        >
          Book a Call
        </a>
      </nav>

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-end px-16 pb-24 overflow-hidden"
      >
        {/* backgrounds */}
        <div className="absolute inset-0 bg-hero-glow bg-bg" />
        <div className="hero-grid-overlay absolute inset-0" />

        <div className="relative z-10">
          {/* eyebrow */}
          <p className="hero-eyebrow flex items-center gap-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-gold mb-6 animate-fade-up-1">
            Available for new projects
          </p>

          {/* title */}
          <h1 className="font-cormorant font-light text-hero text-brand mb-8 animate-fade-up-2">
            Digital<br />
            Strategy<br />
            <em className="italic text-gold">Re-imagined.</em>
          </h1>

          {/* bottom row */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 animate-fade-up-3">
            <p className="max-w-[420px] text-muted leading-[1.75]">
              I&apos;m Aria Voss — a digital marketer, web designer, and AI automation architect
              helping ambitious brands grow faster, look sharper, and work smarter.
            </p>
            <div className="flex flex-col gap-4 items-start md:items-end">
              {/* availability badge */}
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.12em] uppercase text-green border border-green/25 px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-dot" />
                Open to projects
              </span>
              <BtnPrimary href="#work">View My Work →</BtnPrimary>
              <BtnGhost href="#contact">Let&apos;s Talk ↓</BtnGhost>
            </div>
          </div>

          {/* stats */}
          <div className="flex flex-wrap gap-16 mt-16 pt-10 border-t border-white/[0.07] animate-fade-up-4">
            {HERO_STATS.map(({ num, suffix, label }) => (
              <div key={label}>
                <div className="font-cormorant font-light text-[2.8rem] text-brand leading-none mb-1">
                  {num}<span className="text-gold">{suffix}</span>
                </div>
                <div className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          MARQUEE
      ════════════════════════════════════ */}
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

      {/* ════════════════════════════════════
          SERVICES
      ════════════════════════════════════ */}
      <section id="services" className="bg-bg2 px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          {/* header */}
          <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
            <div>
              <SectionLabel>What I Do</SectionLabel>
              <SectionTitle>
                Expertise that<br /><em className="italic text-gold">drives results</em>
              </SectionTitle>
            </div>
            <BtnGhost href="#contact">Explore all services →</BtnGhost>
          </div>

          {/* grid */}
          <div className="grid md:grid-cols-3 gap-px bg-border">
            {SERVICES.map((s, idx) => (
              <div
                key={s.num}
                className={`service-card bg-bg2 p-12 cursor-default reveal ${idx === 1 ? 'reveal-d1' : idx === 2 ? 'reveal-d2' : ''}`}
              >
                <p className="font-mono text-[0.65rem] tracking-[0.15em] text-gold mb-8">{s.num}</p>
                {s.icon}
                <h3 className="font-cormorant text-[1.75rem] font-normal leading-tight mb-4">{s.name}</h3>
                <p className="text-muted text-[0.9rem] leading-[1.7] mb-8">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <span
                      key={t}
                      className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-dim border border-border px-2.5 py-1 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CASE STUDIES
      ════════════════════════════════════ */}
      <section id="work" className="bg-bg px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          {/* intro */}
          <div className="grid md:grid-cols-2 gap-20 mb-20 items-end">
            <div className="reveal">
              <SectionLabel>Case Studies</SectionLabel>
              <SectionTitle>
                Work that<br /><em className="italic text-gold">speaks for itself</em>
              </SectionTitle>
            </div>
            <p className="reveal reveal-d1 text-muted leading-[1.75] self-end">
              Selected projects across industries. Real numbers, real results.
              Every engagement starts with understanding your business — not just your brief.
            </p>
          </div>

          {/* cards */}
          <div className="flex flex-col gap-6">
            {/* Featured */}
            <div
              className="reveal group grid md:grid-cols-2 min-h-[420px] overflow-hidden border border-border hover:border-gold/30 transition-colors cursor-pointer bg-bg3"
            >
              {/* visual */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-case-v1 transition-transform duration-700 group-hover:scale-[1.04]">
                  <MockBrowser dotColor="#c9a84c" inset="2rem" showChart />
                </div>
              </div>
              {/* content */}
              <div className="p-12 flex flex-col justify-between">
                <div>
                  <p className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-gold mb-6">
                    E-commerce / Growth Marketing
                  </p>
                  <h3 className="font-cormorant text-[1.8rem] font-normal leading-tight mb-4">
                    Scaling Luminary Co. from $40K to $280K MRR
                  </h3>
                  <p className="text-muted text-[0.88rem] leading-[1.7] mb-8">
                    Full-funnel redesign — from ad creative to checkout UX — combined with an AI-powered email
                    automation system that increased repeat purchase rate by 3×.
                  </p>
                </div>
                <div>
                  <div className="flex gap-8 mb-6">
                    {[['7×','Revenue growth'],['62%','LTV increase'],['4.2×','ROAS']].map(([v,l]) => (
                      <div key={l}>
                        <div className="font-cormorant text-[2rem] font-light text-gold leading-none">{v}</div>
                        <div className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-muted mt-1">{l}</div>
                      </div>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.1em] uppercase text-muted group-hover:text-gold group-hover:gap-3 transition-all">
                    Read case study →
                  </span>
                </div>
              </div>
            </div>

            {/* Two smaller */}
            <div className="grid md:grid-cols-2 gap-6">
              {CASE_SMALL.map((c, idx) => (
                <div
                  key={c.title}
                  className={`reveal ${idx === 1 ? 'reveal-d2' : 'reveal-d1'} group flex flex-col overflow-hidden border border-border hover:border-gold/30 transition-colors cursor-pointer bg-bg3`}
                >
                  {/* visual */}
                  <div className="relative overflow-hidden h-48 flex-shrink-0">
                    <div className={`absolute inset-0 ${c.gradient} transition-transform duration-700 group-hover:scale-[1.04]`}>
                      <MockBrowser dotColor={c.dotColor} inset="1.5rem" />
                    </div>
                  </div>
                  {/* content */}
                  <div className="p-10 flex flex-col justify-between flex-1">
                    <div>
                      <p className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-gold mb-5">{c.tag}</p>
                      <h3 className="font-cormorant text-[1.4rem] font-normal leading-tight mb-3">{c.title}</h3>
                      <p className="text-muted text-[0.82rem] leading-[1.7] mb-6">{c.desc}</p>
                    </div>
                    <div>
                      <div className="flex gap-8 mb-6">
                        {c.metrics.map(m => (
                          <div key={m.lbl}>
                            <div className="font-cormorant text-[1.6rem] font-light text-gold leading-none">{m.val}</div>
                            <div className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-muted mt-1">{m.lbl}</div>
                          </div>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.1em] uppercase text-muted group-hover:text-gold transition-colors">
                        {c.link}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          PROCESS
      ════════════════════════════════════ */}
      <section id="process" className="bg-bg2 px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal">
            <SectionLabel>How I Work</SectionLabel>
            <SectionTitle>
              A process built<br />for <em className="italic text-gold">predictable wins</em>
            </SectionTitle>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mt-20">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.num}
                className={`process-step bg-bg2 p-10 group reveal reveal-d${idx as 0|1|2|3}`}
              >
                <div className="font-cormorant text-[5rem] font-light leading-none mb-4 text-gold/[0.08] group-hover:text-gold/20 transition-colors">
                  {step.num}
                </div>
                <h3 className="font-cormorant text-[1.4rem] font-normal mb-4">{step.title}</h3>
                <p className="text-muted text-[0.88rem] leading-[1.7]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          BLOG
      ════════════════════════════════════ */}
      <section id="blog" className="bg-bg px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal flex justify-between items-end">
            <div>
              <SectionLabel>Insights</SectionLabel>
              <SectionTitle>
                Thinking out<br /><em className="italic text-gold">loud</em>
              </SectionTitle>
            </div>
            <BtnGhost href="#">All articles →</BtnGhost>
          </div>

          <div className="grid md:grid-cols-[1.6fr_1fr_1fr] gap-6 mt-10">
            {BLOG_POSTS.map((post, idx) => (
              <div
                key={post.title}
                className={`group border border-border hover:border-gold/30 transition-colors cursor-pointer overflow-hidden reveal ${idx === 1 ? 'reveal-d1' : idx === 2 ? 'reveal-d2' : ''}`}
              >
                {/* thumb */}
                <div className={`relative overflow-hidden ${post.featured ? 'h-80' : 'h-60'}`}>
                  <div className={`absolute inset-0 ${post.bg} transition-transform duration-700 group-hover:scale-[1.05]`}>
                    <div className="blog-thumb-pattern" />
                  </div>
                  <span className="absolute top-6 left-6 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-bg bg-gold px-3 py-1.5">
                    {post.cat}
                  </span>
                </div>
                {/* body */}
                <div className="p-8">
                  <p className="font-mono text-[0.62rem] tracking-[0.1em] text-dim mb-3">{post.date}</p>
                  <h3 className={`font-cormorant font-normal leading-tight mb-3 group-hover:text-gold transition-colors ${post.featured ? 'text-[1.75rem]' : 'text-[1.35rem]'}`}>
                    {post.title}
                  </h3>
                  <p className="text-muted text-[0.85rem] leading-[1.7]">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════ */}
      <section id="testimonials" className="bg-bg2 px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal">
            <SectionLabel>Client Voices</SectionLabel>
            <SectionTitle>
              What clients<br /><em className="italic text-gold">say</em>
            </SectionTitle>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={t.name}
                className={`bg-bg3 border border-border p-10 hover:border-gold/20 hover:-translate-y-1 transition-all reveal ${idx === 1 ? 'reveal-d1' : idx === 2 ? 'reveal-d2' : ''}`}
              >
                <div className="font-cormorant text-[4rem] font-light text-gold/30 leading-[0.6] mb-6">&ldquo;</div>
                <p className="font-cormorant italic text-[1.1rem] leading-[1.7] text-brand/85 mb-8">{t.text}</p>
                <p className="text-gold tracking-[0.1em] mb-6 text-[0.8rem]">★★★★★</p>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full border border-border bg-surface flex items-center justify-center font-cormorant text-[1.2rem] text-gold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[0.9rem]">{t.name}</p>
                    <p className="font-mono text-[0.62rem] tracking-[0.08em] text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA
      ════════════════════════════════════ */}
      <section id="cta" className="bg-bg relative overflow-hidden text-center px-16 py-40">
        {/* glow bg */}
        <div className="absolute inset-0 bg-cta-glow bg-bg" />
        {/* rings */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full border border-gold/[0.07] animate-ring"
          style={{ top: '50%', left: '50%' }}
        />
        <div
          className="absolute w-[900px] h-[900px] rounded-full border border-gold/[0.07] animate-ring-2"
          style={{ top: '50%', left: '50%' }}
        />

        <div className="relative z-10 reveal">
          <SectionLabel className="justify-center">Ready to start?</SectionLabel>
          <h2 className="font-cormorant font-light text-cta text-brand mb-6">
            Let&apos;s build something<br />
            <em className="italic text-gold">remarkable</em> together
          </h2>
          <p className="text-muted max-w-[480px] mx-auto mb-12">
            Most clients see measurable results within 60 days. A 30-minute discovery call costs nothing —
            let&apos;s find out if we&apos;re a fit.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <BtnPrimary href="#contact">Start a Conversation →</BtnPrimary>
            <BtnGhost href="#work">See more work</BtnGhost>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CONTACT
      ════════════════════════════════════ */}
      <section id="contact" className="bg-bg2 px-16 py-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="reveal">
            <SectionLabel>Get in Touch</SectionLabel>
            <SectionTitle className="mb-16">
              Let&apos;s<br /><em className="italic text-gold">connect</em>
            </SectionTitle>
          </div>

          <div className="grid md:grid-cols-2 gap-32 items-start">
            {/* info */}
            <div className="reveal">
              <h3 className="font-cormorant text-[1.5rem] font-normal mb-6">
                I&apos;m currently available for select projects
              </h3>
              <p className="text-muted leading-[1.75] mb-12">
                Whether you&apos;re looking for a strategic partner, a full redesign, or an AI system that actually works
                — I&apos;d love to hear about your goals and share how I can help.
              </p>

              <div className="flex flex-col gap-4">
                {/* Email */}
                <a
                  href="mailto:aria@ariavoss.com"
                  className="flex items-center gap-4 px-6 py-5 border border-border hover:border-gold hover:bg-gold/[0.04] transition-all no-underline text-brand"
                >
                  <svg className="text-gold flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <div>
                    <p className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-muted mb-0.5">Email</p>
                    <p className="text-[0.95rem]">aria@ariavoss.com</p>
                  </div>
                </a>
                {/* LinkedIn */}
                <a
                  href="#"
                  className="flex items-center gap-4 px-6 py-5 border border-border hover:border-gold hover:bg-gold/[0.04] transition-all no-underline text-brand"
                >
                  <svg className="text-gold flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <div>
                    <p className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-muted mb-0.5">LinkedIn</p>
                    <p className="text-[0.95rem]">linkedin.com/in/ariavoss</p>
                  </div>
                </a>
                {/* Call */}
                <a
                  href="#"
                  className="flex items-center gap-4 px-6 py-5 border border-border hover:border-gold hover:bg-gold/[0.04] transition-all no-underline text-brand"
                >
                  <svg className="text-gold flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z" />
                  </svg>
                  <div>
                    <p className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-muted mb-0.5">Discovery Call</p>
                    <p className="text-[0.95rem]">Book a 30-min session</p>
                  </div>
                </a>
              </div>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="reveal reveal-d1 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                {['First Name', 'Last Name'].map((label, i) => (
                  <div key={label} className="flex flex-col gap-2">
                    <label className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted">{label}</label>
                    <input
                      type="text"
                      placeholder={i === 0 ? 'Alex' : 'Chen'}
                      className="bg-bg3 border border-border text-brand px-5 py-4 text-[0.95rem] outline-none focus:border-gold transition-colors placeholder:text-dim font-cabinet"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted">Email</label>
                <input
                  type="email"
                  placeholder="alex@company.com"
                  className="bg-bg3 border border-border text-brand px-5 py-4 text-[0.95rem] outline-none focus:border-gold transition-colors placeholder:text-dim font-cabinet"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted">Company / Project</label>
                <input
                  type="text"
                  placeholder="Your company name"
                  className="bg-bg3 border border-border text-brand px-5 py-4 text-[0.95rem] outline-none focus:border-gold transition-colors placeholder:text-dim font-cabinet"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted">How can I help?</label>
                <textarea
                  rows={5}
                  placeholder="Tell me about your project, goals, and timeline..."
                  className="bg-bg3 border border-border text-brand px-5 py-4 text-[0.95rem] outline-none focus:border-gold transition-colors placeholder:text-dim resize-y font-cabinet"
                />
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-3 font-mono text-[0.75rem] tracking-[0.12em] uppercase py-4 transition-all hover:-translate-y-px ${
                  sent
                    ? 'bg-green text-bg cursor-default'
                    : 'bg-gold text-bg hover:bg-gold2'
                }`}
              >
                {sent ? '✓ Message Sent!' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer className="bg-bg border-t border-border px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-cormorant text-[1.2rem] font-normal text-brand">
          Aria<span className="text-gold">.</span>Voss
        </p>
        <p className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-dim">
          © 2025 Aria Voss. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['LinkedIn', 'Twitter', 'Dribbble', 'Read.cv'].map(s => (
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