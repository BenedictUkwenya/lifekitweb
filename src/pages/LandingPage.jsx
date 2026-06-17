import { createElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { ContainerTextFlip } from '../components/ui/container-text-flip'
import {
  ArrowRight, ArrowUp, Star, Users, Calendar,
  Repeat2, Clock, Shield, Store, Sparkles, Menu, X
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const P = '#89273B'
const Motion = motion

// ─────────────────────────────────────────────────────────────────────────────
// Motion helpers
// ─────────────────────────────────────────────────────────────────────────────
// Product decision: animations always play, even when the OS requests reduced
// motion. Flip RESPECT_REDUCED_MOTION back to true to restore accessibility.
const RESPECT_REDUCED_MOTION = false

const prefersReduced = () =>
  RESPECT_REDUCED_MOTION &&
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth < 768

/**
 * Reveals children matching `selector` with a staggered fade + translateY when
 * the scope scrolls into view. Plays once, respects reduced motion, and lightens
 * the stagger on mobile. Never affects layout (only opacity/transform).
 */
function useScrollReveal(scope, { selector = '.reveal-item', y = 30, stagger = 0.18 } = {}) {
  useGSAP(() => {
    const targets = gsap.utils.toArray(selector, scope.current)
    if (!targets.length) return

    if (prefersReduced()) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }

    gsap.from(targets, {
      opacity: 0,
      y,
      duration: 0.6,
      ease: 'power3.out',
      stagger: isMobile() ? Math.min(stagger, 0.08) : stagger,
      scrollTrigger: { trigger: scope.current, start: 'top 80%', once: true },
    })
  }, { scope })
}

// ─────────────────────────────────────────────────────────────────────────────
// Scroll-triggered animation
// ─────────────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function Fade({ children, delay = 0, y = 30, className = '' }) {
  const [ref, visible] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : `translateY(${y}px)`,
        transition: `opacity 0.72s cubic-bezier(.16,1,.3,1) ${delay}ms,
                     transform 0.72s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Phone Mockup shell
// ─────────────────────────────────────────────────────────────────────────────
function PhoneMockup({ children }) {
  return (
    <div className="relative" style={{ width: 244, height: 492 }}>
      <div className="absolute inset-0 rounded-[3rem] bg-gray-900 border-[5px] border-gray-800 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex justify-center pt-2">
          <div className="w-20 h-[18px] bg-gray-900 rounded-full" />
        </div>
        <div className="absolute inset-0 top-6 rounded-b-[2.6rem] overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero right: dashboard mockup card
// ─────────────────────────────────────────────────────────────────────────────
function GraciaChatMockup() {
  const { t } = useTranslation()
  const quickActions = [
    t('hero.mockupAction1'),
    t('hero.mockupAction2'),
    t('hero.mockupAction3'),
  ]

  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      {/* Soft glow behind */}
      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-[0.12] scale-90 translate-y-6 rounded-full"
        style={{ backgroundColor: P }}
      />

      {/* Chat card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-extrabold shrink-0"
            style={{ backgroundColor: P }}
          >K</div>
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-gray-900">{t('hero.mockupName')}</span>
            <span className="text-[11px] text-gray-400">· {t('hero.mockupRole')}</span>
          </div>
        </div>

        {/* Assistant message bubble */}
        <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 mb-5">
          <p className="text-[13px] text-gray-700 leading-relaxed">{t('hero.mockupMessage')}</p>
        </div>

        {/* Quick actions */}
        <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-2.5">
          {t('hero.mockupQuickActions')}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {quickActions.map((label) => (
            <span
              key={label}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full border transition-colors"
              style={{ color: P, borderColor: `${P}30` }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl pl-4 pr-1.5 py-1.5">
          <span className="flex-1 text-[12px] text-gray-400">{t('hero.mockupInput')}</span>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: P }}
            aria-hidden="true"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>

      {/* Floating: people nearby */}
      <div className="absolute -bottom-4 right-4 bg-white rounded-2xl shadow-lg px-3 py-2 border border-gray-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gray-100" />
        <p className="text-[11px] font-medium text-gray-600 whitespace-nowrap">{t('hero.mockupNearby')}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated Logo: dramatic entrance + playful hover
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedLogo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="LifeKit home">
      <Motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.4, rotate: -25, y: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
        whileHover={{
          scale: 1.08,
          rotate: [0, -8, 8, -4, 0],
          transition: { rotate: { duration: 0.6, ease: 'easeInOut' }, scale: { duration: 0.2 } },
        }}
        whileTap={{ scale: 0.92 }}
      >
        <img
          src="/logo2.png"
          alt="LifeKit"
          className="h-8 sm:h-9 w-auto select-none"
          draggable={false}
          onError={e => {
            e.currentTarget.style.display = 'none'
            const fb = e.currentTarget.nextElementSibling
            if (fb) fb.style.display = 'block'
          }}
        />
        <span className="hidden text-2xl font-extrabold tracking-tight" style={{ color: P }}>LifeKit</span>

        {/* Sweeping shine overlay */}
        <Motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-md"
        >
          <Motion.span
            className="absolute top-0 -left-1/3 h-full w-1/3 skew-x-[-20deg]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)' }}
            initial={{ x: '-150%' }}
            animate={{ x: '350%' }}
            transition={{ duration: 1.1, ease: 'easeInOut', delay: 1.0 }}
          />
        </Motion.span>
      </Motion.div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────
function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const links = [
    { href: '#features',     label: t('nav.features')     },
    { href: '#process',      label: t('nav.process')      },
    { href: '#aiTools',      label: t('nav.aiTools')      },
    { href: '#testimonials', label: t('nav.testimonials') },
  ]

  return (
    <Motion.nav
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <AnimatedLogo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7 mx-auto">
          {links.map(({ href, label }) => (
            <a key={href} href={href} className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              {label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Desktop-only auth actions */}
          <Link to="/login" className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 transition-colors">
            {t('nav.signIn')}
          </Link>
          <Link
            to="/register"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: P }}
          >
            {t('nav.joinAsProvider')}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 -mr-1 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <Motion.span
              key={open ? 'x' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.18 }}
              className="block"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </Motion.span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <Motion.div
              className="md:hidden fixed inset-0 top-16 -z-10 bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <Motion.div
              className="md:hidden bg-white border-t border-gray-100 px-5 pt-2 pb-6 shadow-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              {links.map(({ href, label }, i) => (
                <Motion.a
                  key={href}
                  href={href}
                  className="block py-3.5 text-[15px] font-medium text-gray-700 hover:text-gray-900 border-b border-gray-50"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05 }}
                >
                  {label}
                </Motion.a>
              ))}

              {/* Auth actions in the menu */}
              <Motion.div
                className="flex flex-col gap-2.5 pt-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + links.length * 0.05 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: P }}
                  onClick={() => setOpen(false)}
                >
                  {t('nav.joinAsProvider')}
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-xl text-gray-700 text-[15px] font-semibold border border-gray-200 hover:border-gray-300 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {t('nav.signIn')}
                </Link>
              </Motion.div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </Motion.nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const { t } = useTranslation()

  const flipWords = [
    t('hero.flipWord1'),
    t('hero.flipWord2'),
    t('hero.flipWord3'),
    t('hero.flipWord4'),
  ]

  const headlineContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }
  const wordVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="relative pt-36 pb-28 px-5 sm:px-8 overflow-hidden">
      {/* Ambient animated background */}
      <div aria-hidden className="ambient-blob pointer-events-none absolute inset-0 -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

        {/* Left */}
        <div className="flex-1 max-w-xl">
          <Motion.h1
            className="text-[3.4rem] sm:text-[4.25rem] lg:text-[5rem] font-extrabold tracking-tight text-gray-900 leading-[1.02] mb-7"
            variants={headlineContainer}
            initial="hidden"
            animate="visible"
          >
            <span className="block">
              <Motion.span className="inline-block" variants={wordVariant}>
                {t('hero.titlePart1')}
              </Motion.span>{' '}
              <ContainerTextFlip
                words={flipWords}
                interval={2400}
                className="top-[0.08em] mx-1"
                textClassName="px-1"
              />
            </span>
            <Motion.span className="block mt-3" variants={wordVariant}>
              {t('hero.titlePart2')}
            </Motion.span>
          </Motion.h1>

          <Motion.p
            className="text-[1.1rem] text-gray-500 leading-relaxed mb-9 max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          >
            {t('hero.subtitle')}
          </Motion.p>

          <Motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.6 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-white text-[15px] font-semibold hover:opacity-90 hover:shadow-lg transition-all"
              style={{ backgroundColor: P }}
            >
              {t('hero.ctaPrimary')}
              <ArrowRight size={16} />
            </Link>
            <a
              href="#process"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-gray-700 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-600 transition-colors"
            >
              {t('hero.ctaSecondary')} →
            </a>
          </Motion.div>

          <Motion.p
            className="text-[13px] text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.95 }}
          >
            {t('hero.note')}
          </Motion.p>
        </div>

        {/* Right */}
        <Motion.div
          className="flex-1 flex justify-center lg:justify-end w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.5 }}
        >
          <GraciaChatMockup />
        </Motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats Bar
// ─────────────────────────────────────────────────────────────────────────────
function StatsBar() {
  const { t } = useTranslation()
  const scope = useRef(null)

  const stats = [
    { value: '0%',                 label: t('stats.commissionLabel') },
    { value: '5',                  label: t('stats.aiFeaturesLabel') },
    { value: t('stats.timeValue'), label: t('stats.timeLabel')   },
    { value: t('stats.swapValue'), label: t('stats.swapLabel')   },
  ]

  // A stat is "countable" only when it is a plain integer with an optional % sign.
  const parseCountable = (raw) => {
    const m = /^(\d+)(%?)$/.exec(raw.trim())
    return m ? { number: parseInt(m[1], 10), suffix: m[2] } : null
  }

  useGSAP(() => {
    const items = gsap.utils.toArray('.stat-item', scope.current)
    const counters = gsap.utils.toArray('[data-count]', scope.current)

    if (prefersReduced()) {
      gsap.set(items, { opacity: 1, y: 0 })
      counters.forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || '')
      })
      return
    }

    items.forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.15,
        scrollTrigger: { trigger: scope.current, start: 'top 85%', once: true },
      })
    })

    counters.forEach((el) => {
      const target = parseFloat(el.dataset.count)
      const suffix = el.dataset.suffix || ''
      const idx = parseInt(el.dataset.index, 10) || 0
      const obj = { v: 0 }
      gsap.to(obj, {
        v: target,
        duration: 1.2,
        ease: 'power2.out',
        delay: idx * 0.15,
        scrollTrigger: { trigger: scope.current, start: 'top 85%', once: true },
        onUpdate: () => { el.textContent = Math.round(obj.v) + suffix },
      })
    })
  }, { scope })

  return (
    <div className="border-y border-gray-100 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={scope} className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {stats.map(({ value, label }, i) => {
            const c = parseCountable(value)
            return (
              <div key={label} className="stat-item py-8 px-6">
                <p
                  className="text-3xl font-extrabold mb-1"
                  style={{ color: i === 0 ? P : '#111827' }}
                >
                  {c ? (
                    <span data-count={c.number} data-suffix={c.suffix} data-index={i}>
                      0{c.suffix}
                    </span>
                  ) : (
                    value
                  )}
                </p>
                <p className="text-xs text-gray-400 font-medium leading-snug">{label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Process Section
// ─────────────────────────────────────────────────────────────────────────────
function ProcessSection() {
  const { t } = useTranslation()
  const gridRef = useRef(null)

  const steps = [
    { num: '01', title: t('process.step1Title'), desc: t('process.step1Desc') },
    { num: '02', title: t('process.step2Title'), desc: t('process.step2Desc') },
    { num: '03', title: t('process.step3Title'), desc: t('process.step3Desc') },
  ]

  useScrollReveal(gridRef, { stagger: 0.2 })

  return (
    <section id="process" className="py-24 px-5 sm:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Fade className="mb-16">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest mb-4" style={{ color: P }}>
            {t('process.label')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight max-w-2xl">
            {t('process.title')}
          </h2>
        </Fade>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div key={step.num} className="reveal-item h-full">
              <Motion.div
                whileHover={{ y: -6, boxShadow: '0 22px 45px -18px rgba(0,0,0,0.22)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="relative bg-white rounded-2xl border border-gray-100 p-7 pb-10 h-full overflow-hidden"
              >
                {/* Watermark number */}
                <span
                  className="absolute -bottom-6 right-2 text-[8rem] font-extrabold leading-none select-none pointer-events-none"
                  style={{ color: `${P}08` }}
                >
                  {step.num}
                </span>

                <span className="block text-[11px] font-mono text-gray-400 mb-12">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold mb-3 leading-snug" style={{ color: P }}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                  {step.desc}
                </p>
              </Motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Features Grid
// ─────────────────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const { t } = useTranslation()
  const gridRef = useRef(null)

  const cards = [
    { title: t('features.f1Title'), desc: t('features.f1Desc'), Icon: Sparkles },
    { title: t('features.f2Title'), desc: t('features.f2Desc'), Icon: Store },
    { title: t('features.f3Title'), desc: t('features.f3Desc'), Icon: Repeat2 },
    { title: t('features.f4Title'), desc: t('features.f4Desc'), Icon: Users },
  ]

  useScrollReveal(gridRef, { stagger: 0.12 })

  return (
    <section id="features" className="py-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Heading: left */}
        <Fade className="lg:w-80 shrink-0">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest mb-4" style={{ color: P }}>
            {t('features.label')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            {t('features.title')}
          </h2>
        </Fade>

        {/* Grid: right */}
        <div ref={gridRef} className="flex-1 grid sm:grid-cols-2 gap-5">
          {cards.map(({ title, desc, Icon }) => (
            <div key={title} className="reveal-item h-full">
              <div className="flex flex-col bg-white rounded-2xl border border-gray-100 p-7 h-full min-h-[14rem] hover:shadow-md transition-shadow cursor-default">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-auto"
                  style={{ backgroundColor: `${P}10` }}
                >
                  {createElement(Icon, { size: 18, color: P })}
                </div>
                <div className="mt-12">
                  <h3 className="text-[15px] font-bold mb-2 leading-snug" style={{ color: P }}>
                    {title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenarios / Use Cases
// ─────────────────────────────────────────────────────────────────────────────
function ScenariosSection() {
  const { t } = useTranslation()

  const items = [
    { label: t('scenarios.s1Label'), title: t('scenarios.s1Title'), desc: t('scenarios.s1Desc') },
    { label: t('scenarios.s2Label'), title: t('scenarios.s2Title'), desc: t('scenarios.s2Desc') },
    { label: t('scenarios.s3Label'), title: t('scenarios.s3Title'), desc: t('scenarios.s3Desc') },
  ]

  return (
    <section className="py-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <Fade className="mb-14">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest mb-4" style={{ color: P }}>
            {t('scenarios.label')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight max-w-2xl">
            {t('scenarios.title')}
          </h2>
        </Fade>

        {/* Three columns */}
        <div className="grid md:grid-cols-3 gap-10 lg:gap-14 mb-14">
          {items.map((item, i) => (
            <Fade key={item.label} delay={i * 100}>
              <span className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">
                {item.label}
              </span>
              <h3 className="text-lg font-bold mb-3 leading-snug" style={{ color: P }}>
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </Fade>
          ))}
        </div>

        {/* Large image */}
        <Fade delay={120}>
          <div
            className="relative w-full rounded-3xl overflow-hidden border-2"
            style={{ borderColor: P, aspectRatio: '16 / 7' }}
          >
            <img
              src="/scenarios.png"
              alt={t('scenarios.title')}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => {
                e.currentTarget.style.display = 'none'
                const fb = e.currentTarget.nextElementSibling
                if (fb) fb.style.display = 'flex'
              }}
            />
            {/* Placeholder fallback */}
            <div
              className="absolute inset-0 hidden items-center justify-center bg-gray-100"
            >
              <div className="text-center">
                <p className="text-5xl mb-3">🖼️</p>
                <p className="text-sm font-medium text-gray-400">{t('scenarios.imagePlaceholder')}</p>
                <p className="text-xs text-gray-300 mt-1">public/scenarios.png</p>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Bookings Feature
// ─────────────────────────────────────────────────────────────────────────────
function BookingsSection() {
  const { t } = useTranslation()

  const items = [
    { Icon: Calendar, title: t('bookings.feature1Title'), desc: t('bookings.feature1Desc') },
    { Icon: Shield,   title: t('bookings.feature2Title'), desc: t('bookings.feature2Desc') },
    { Icon: Clock,    title: t('bookings.feature3Title'), desc: t('bookings.feature3Desc') },
  ]

  return (
    <section className="py-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

        {/* Left: text */}
        <div className="flex-1 order-2 lg:order-1">
          <Fade>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-4">
              {t('bookings.sectionLabel')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              {t('bookings.title1')}<br />
              <span style={{ color: P }}>{t('bookings.titleHighlight')}</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-lg">
              {t('bookings.subtitle')}
            </p>
          </Fade>

          <div className="space-y-7">
            {items.map(({ Icon, title, desc }, i) => (
              <Fade key={title} delay={i * 100}>
                <div className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: P }}
                  >
                    {createElement(Icon, { size: 17 })}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>

          <Fade delay={320}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 mt-10 px-6 py-3.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: P }}
            >
              {t('hero.ctaPrimary')}
              <ArrowRight size={15} />
            </Link>
          </Fade>
        </div>

        {/* Right: phone mockup */}
        <Fade delay={120} className="order-1 lg:order-2 flex justify-center">
          <div className="relative">
            <div
              className="absolute inset-0 -z-10 blur-3xl opacity-20 scale-75 rounded-full"
              style={{ backgroundColor: P }}
            />
            <PhoneMockup>
              <div className="flex flex-col h-full bg-gray-50">
                {/* App header */}
                <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                    style={{ backgroundColor: P }}
                  >L</div>
                  <div>
                    <div className="w-16 h-2 bg-gray-200 rounded" />
                    <div className="w-10 h-1.5 bg-gray-100 rounded mt-1" />
                  </div>
                </div>
                {/* Booking items */}
                <div className="flex-1 p-3 space-y-2.5 overflow-hidden">
                  {[
                    { color: P,         badge: 'Confirmed'  },
                    { color: '#7C3AED', badge: 'Skill Swap' },
                    { color: '#16A34A', badge: 'Completed'  },
                  ].map(({ color, badge }, i) => (
                    <div key={i} className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm items-center">
                      <div className="w-9 h-9 rounded-xl shrink-0" style={{ backgroundColor: `${color}15` }} />
                      <div className="flex-1">
                        <div className="w-3/4 h-2 bg-gray-200 rounded mb-1.5" />
                        <div className="w-1/2 h-1.5 bg-gray-100 rounded" />
                      </div>
                      <span
                        className="text-[8px] font-extrabold px-2 py-1 rounded-full whitespace-nowrap"
                        style={{ color, backgroundColor: `${color}15` }}
                      >{badge}</span>
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <div className="p-3">
                  <div
                    className="w-full h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: P }}
                  >
                    <div className="w-20 h-2 bg-white/40 rounded" />
                  </div>
                </div>
              </div>
            </PhoneMockup>
          </div>
        </Fade>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Smart Tools Section (dark)
// ─────────────────────────────────────────────────────────────────────────────
function AiToolsSection() {
  const { t } = useTranslation()

  const tools = [1, 2, 3, 4, 5].map(n => ({
    tag:   t(`aiTools.tool${n}Tag`),
    title: t(`aiTools.tool${n}Title`),
    desc:  t(`aiTools.tool${n}Desc`),
  }))

  return (
    <section id="aiTools" className="py-24 px-5 sm:px-8" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto">
        <Fade className="mb-16">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-600 mb-4">
            {t('aiTools.sectionLabel')}
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight max-w-xl">
              {t('aiTools.title')}
            </h2>
            <p className="text-gray-500 max-w-sm lg:pb-1">
              {t('aiTools.subtitle')}
            </p>
          </div>
        </Fade>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <Fade key={tool.tag} delay={i * 80}>
              <div
                className="rounded-3xl p-7 border border-white/5 hover:border-white/10 transition-colors cursor-default h-full"
                style={{ backgroundColor: '#141414' }}
              >
                <span
                  className="block text-[9px] font-extrabold uppercase tracking-widest mb-3"
                  style={{ color: P }}
                >
                  {tool.tag}
                </span>
                <h3 className="text-[15px] font-bold text-white mb-2 leading-snug">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const { t } = useTranslation()

  const items = [
    { text: t('social.t1Text'), name: t('social.t1Name'), role: t('social.t1Role'), initials: 'SO' },
    { text: t('social.t2Text'), name: t('social.t2Name'), role: t('social.t2Role'), initials: 'AK' },
    { text: t('social.t3Text'), name: t('social.t3Name'), role: t('social.t3Role'), initials: 'MJ' },
  ]

  return (
    <section id="testimonials" className="py-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <Fade className="mb-16">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-4">
            {t('social.label')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            {t('social.title')}
          </h2>
        </Fade>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <Fade key={item.name} delay={i * 100}>
              <div className="bg-gray-50 rounded-3xl p-7 flex flex-col gap-5 hover:shadow-md transition-shadow h-full">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} fill="#FBBF24" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-[15px] text-gray-700 leading-relaxed flex-1">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                    style={{ backgroundColor: P }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.role}</p>
                  </div>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Final CTA (maroon gradient)
// ─────────────────────────────────────────────────────────────────────────────
function FinalCta() {
  const { t } = useTranslation()

  return (
    <section
      className="py-28 px-5 sm:px-8"
      style={{
        background: `linear-gradient(135deg, ${P} 0%, #5a1825 55%, #3d101a 100%)`,
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <Fade>
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/55 mb-7">
            {t('finalCta.badge')}
          </span>
          <h2 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
            {t('finalCta.title1')}<br />
            {t('finalCta.title2')}
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {t('finalCta.subtitle')}
          </p>

          <div className="flex justify-center mb-8">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white font-semibold hover:opacity-90 hover:shadow-xl transition-all"
              style={{ color: P }}
            >
              {t('finalCta.ctaPrimary')}
              <ArrowRight size={16} />
            </Link>
          </div>

          <p className="text-white/50 text-sm">{t('finalCta.note')}</p>
        </Fade>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-white border-t border-gray-100 py-16 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 mb-12">
          <div className="lg:max-w-60">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo2.png"
                alt="LifeKit"
                className="h-8 w-auto"
                onError={e => {
                  e.currentTarget.style.display = 'none'
                  const fb = e.currentTarget.nextElementSibling
                  if (fb) fb.style.display = 'block'
                }}
              />
              <span className="hidden text-xl font-extrabold" style={{ color: P }}>LifeKit</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t('footer.tagline')}</p>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-900 mb-5">
                {t('footer.providersHeading')}
              </h4>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map(n => (
                  <li key={n}>
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
                      {t(`footer.link${n}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-900 mb-5">
                {t('footer.companyHeading')}
              </h4>
              <ul className="space-y-3">
                {[5, 6, 7, 8, 9].map(n => (
                  <li key={n}>
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
                      {t(`footer.link${n}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-900 mb-5">
                {t('footer.comingSoon')}
              </h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">📱 <span>iOS App</span></div>
                <div className="flex items-center gap-2">🤖 <span>Android App</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} LifeKit · {t('footer.rights')}
          </p>
          <p className="text-xs text-gray-300">{t('footer.builtWith')}</p>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <ProcessSection />
      <FeaturesSection />
      <ScenariosSection />
      <BookingsSection />
      <AiToolsSection />
      <TestimonialsSection />
      <FinalCta />
      {/* <Footer /> */}
    </div>
  )
}
