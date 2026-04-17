import { Link } from 'react-router-dom'
import {
  Sparkles, ArrowRight, CheckCircle2, Menu, X,
  TrendingUp, Users, Repeat2, ShoppingCart, Brain,
  Zap, MessageCircle, Star, Percent,
  ShieldCheck, Smartphone,
} from 'lucide-react'
import { useState } from 'react'

const PRIMARY = '#89273B'

// ── Phone Mockup shell ─────────────────────────────────────────────────
function PhoneMockup({ src, alt = 'App screen', className = '' }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-25 scale-90"
        style={{ backgroundColor: PRIMARY }}
      />
      <div className="relative bg-gray-900 rounded-[44px] p-[5px] shadow-2xl ring-1 ring-white/10 w-56 sm:w-64 md:w-72">
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-900 rounded-full z-20" />
        <div className="rounded-[38px] overflow-hidden bg-white aspect-[9/19.5]">
          {src
            ? <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
            : <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200" />}
        </div>
      </div>
    </div>
  )
}

// ── Section label ──────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
      style={{ color: PRIMARY, backgroundColor: `${PRIMARY}12` }}
    >
      {children}
    </span>
  )
}

// ── Navbar ─────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo2.png" alt="LifeKit" className="h-8 w-auto" />
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">LifeKit</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Skill Swap', 'Community', 'AI Tools'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Sign In</Link>
          <Link
            to="/register"
            className="text-sm font-bold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95 shadow-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            Join as Provider
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 flex flex-col gap-4">
          {['Features', 'Skill Swap', 'Community', 'AI Tools'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} onClick={() => setOpen(false)} className="text-sm text-gray-700 font-medium">{l}</a>
          ))}
          <hr className="border-gray-100" />
          <Link to="/login" className="text-sm text-gray-700 font-medium">Sign In</Link>
          <Link to="/register" className="text-sm font-bold text-white text-center px-4 py-2.5 rounded-xl" style={{ backgroundColor: PRIMARY }}>
            Join as Provider
          </Link>
        </div>
      )}
    </nav>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-28 pb-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
          >
            <Sparkles size={11} />
            Founding Provider — 1 Year Pro Free
          </span>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            The ultimate platform for{' '}
            <span style={{ color: PRIMARY }}>skilled providers</span>{' '}
            &amp; their communities.
          </h1>

          <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
            LifeKit is more than a booking app. It is a living ecosystem — book services, swap skills,
            build communities, and grow your income with an AI that works around the clock for you.
          </p>

          <ul className="mt-7 flex flex-col gap-2.5">
            {[
              '0% commission forever as a Founding Provider',
              'Full AI toolkit: autofill, radar, 24/7 concierge',
              'Skill Swap — trade services without spending a cent',
              'Social feed and community hubs built in',
            ].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                <CheckCircle2 size={16} className="flex-shrink-0 text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-2xl shadow-xl transition-all hover:opacity-90 active:scale-95 text-base"
              style={{ backgroundColor: PRIMARY }}
            >
              Claim 1 Year Free Pro <ArrowRight size={17} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 font-semibold text-gray-700 px-7 py-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-base"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['#f87171', '#fb923c', '#a78bfa', '#34d399', '#60a5fa'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">200+ providers</span> already on the waitlist
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <PhoneMockup src="/homepage.png" alt="LifeKit Home Screen" className="mx-auto" />
        </div>
      </div>
    </section>
  )
}

// ── Stats Bar ──────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <div className="py-12" style={{ backgroundColor: PRIMARY }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {[
          { value: '0%', label: 'Commission (Founding Providers)' },
          { value: '5', label: 'AI-powered features' },
          { value: '< 5m', label: 'Time to first listing' },
          { value: 'Unlimited', label: 'Skill Swap possibilities' },
        ].map(s => (
          <div key={s.label}>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</p>
            <p className="mt-1 text-white/60 text-xs sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Skill Swap ─────────────────────────────────────────────────────────
function SkillSwap() {
  return (
    <section id="skill-swap" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex justify-center order-2 lg:order-1">
          <PhoneMockup src="/skillswap.png" alt="Skill Swap Screen" />
        </div>

        <div className="order-1 lg:order-2">
          <SectionLabel>The Game Changer</SectionLabel>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Trade your skill.<br />
            <span style={{ color: PRIMARY }}>No money needed.</span>
          </h2>
          <p className="mt-5 text-gray-500 text-lg leading-relaxed">
            LifeKit Skill Swap is the world's first AI-engineered barter layer built into a service marketplace.
            As a provider, you can exchange your expertise directly — a Hairdresser trades a Blowout for a Manicure,
            a Tutor swaps lessons for a Meal Prep session.
          </p>
          <p className="mt-3 text-gray-500 leading-relaxed">
            Our AI matches compatible skills, coordinates scheduling, and tracks the fairness of every exchange
            so you keep more value in your hands.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: <Repeat2 size={20} />, title: 'AI-matched swaps', desc: 'We find providers whose skills complement yours' },
              { icon: <ShieldCheck size={20} />, title: 'Fair-value tracking', desc: 'AI ensures balanced exchanges every time' },
              { icon: <Zap size={20} />, title: 'Zero transaction fees', desc: 'Swaps are completely free — always' },
              { icon: <Star size={20} />, title: 'Reputation carries over', desc: 'Your swap reviews boost your main profile' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${PRIMARY}12`, color: PRIMARY }}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Community ──────────────────────────────────────────────────────────
function Community() {
  const cards = [
    {
      icon: <Users size={22} />,
      title: 'Community Hubs',
      desc: 'Join niche groups built around what you do — Hair and Beauty, Home Services, Tutors, Movers. Share tips, get referrals, and collaborate with peers in your city.',
    },
    {
      icon: <MessageCircle size={22} />,
      title: 'Social Activity Feed',
      desc: "Post updates, showcase your work, ask for advice. LifeKit's feed turns a service app into a professional social network where customers discover you organically.",
    },
    {
      icon: <TrendingUp size={22} />,
      title: 'Referral Network',
      desc: "When you can't take a job, pass it to a trusted peer and earn a referral reward. Your community is your pipeline.",
    },
  ]
  return (
    <section id="community" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionLabel>Community</SectionLabel>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            LifeKit is a social network.<br />Services are just the start.
          </h2>
          <p className="mt-4 text-gray-500 text-lg leading-relaxed">
            Your success should not depend on a solo hustle. LifeKit puts you inside a living, breathing professional
            community where visibility, trust, and income grow together.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {cards.map(c => (
            <div
              key={c.title}
              className="p-6 rounded-3xl border border-gray-100 shadow-sm bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${PRIMARY}12`, color: PRIMARY }}>
                {c.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{c.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start gap-6 max-w-3xl mx-auto">
            {[
              { color: '#f87171', initials: 'AK', name: 'Amara K.', role: 'Nail Tech', time: '2h', text: 'Just finished a full set of marble acrylics. Slots open this weekend!', likes: 24 },
              { color: '#60a5fa', initials: 'JD', name: 'James D.', role: 'Electrician', time: '4h', text: 'Pro tip: always quote 15% above your cost estimate for first-time clients. Protects your margins.', likes: 41 },
              { color: '#34d399', initials: 'PN', name: 'Priya N.', role: 'Math Tutor', time: '6h', text: "Skill Swap request: I'll tutor your kid for 4 sessions in exchange for massage therapy. Anyone?", likes: 17 },
            ].map(p => (
              <div key={p.name} className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ backgroundColor: p.color }}>
                    {p.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.role} · {p.time} ago</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{p.text}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                  <Star size={11} fill={PRIMARY} color={PRIMARY} /> {p.likes} likes
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Bookings ───────────────────────────────────────────────────────────
function Bookings() {
  return (
    <section id="features" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <SectionLabel>Bookings</SectionLabel>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Book in 60 seconds.<br />
            <span style={{ color: PRIMARY }}>Get paid instantly.</span>
          </h2>
          <p className="mt-5 text-gray-500 text-lg leading-relaxed">
            Customers build a cart of services, pay through our secure escrow system, and you get notified
            immediately. Whether you charge a flat fee or hourly, the platform handles pricing, scheduling,
            and payouts automatically.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {[
              { icon: <ShoppingCart size={18} />, title: 'Multi-service cart', desc: 'Customers can book multiple services from multiple providers in a single checkout.' },
              { icon: <ShieldCheck size={18} />, title: 'Escrow protection', desc: 'Funds are held securely until the service is delivered. You get paid, guaranteed.' },
              { icon: <Zap size={18} />, title: 'Fixed and hourly pricing', desc: 'Set a flat rate or charge per hour — the app handles the maths for you.' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${PRIMARY}12`, color: PRIMARY }}>
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{f.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <PhoneMockup src="/cart.png" alt="Cart Screen" />
        </div>
      </div>
    </section>
  )
}

// ── AI Tools ───────────────────────────────────────────────────────────
function AiTools() {
  const tiles = [
    {
      icon: <TrendingUp size={24} />,
      tag: 'Opportunity Radar',
      title: 'Your personal market analyst',
      desc: 'Scans local demand daily and surfaces the exact services you should be offering this week to maximise revenue.',
      wide: false,
    },
    {
      icon: <Sparkles size={24} />,
      tag: 'Magic Autofill',
      title: 'List a service in under 10 seconds',
      desc: 'Describe your skill in plain English. AI writes the full listing — title, description, and price — instantly.',
      wide: false,
    },
    {
      icon: <MessageCircle size={24} />,
      tag: '24/7 AI Concierge',
      title: 'Always-on support for every customer',
      desc: 'An AI assistant helps customers find services, answer questions, and book around the clock — while you sleep.',
      wide: true,
    },
    {
      icon: <Brain size={24} />,
      tag: 'Onboarding Planner',
      title: 'A 7-day plan built just for you',
      desc: 'A personalised onboarding roadmap guides new providers through their first bookings step by step.',
      wide: false,
    },
    {
      icon: <Repeat2 size={24} />,
      tag: 'AI Skill Match',
      title: 'Smart Skill Swap pairing',
      desc: 'Our AI finds the most compatible swap partners based on skill value, location, and availability.',
      wide: false,
    },
  ]

  return (
    <section id="ai-tools" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionLabel>AI Intelligence Layer</SectionLabel>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Five AI tools working for you around the clock.
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Every major feature in LifeKit has an AI layer powering it — not as a gimmick, but as a genuine force multiplier for your income.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((t, i) => (
            <div
              key={t.tag}
              className={`relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between border border-gray-100 shadow-sm group hover:shadow-md transition-all duration-200 ${t.wide ? 'sm:col-span-2 lg:col-span-2' : ''}`}
              style={{ background: i % 2 === 0 ? `linear-gradient(135deg, ${PRIMARY}08, white)` : 'white' }}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform" style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}>
                  {t.icon}
                </div>
                <span
                  className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${PRIMARY}12`, color: PRIMARY }}
                >
                  {t.tag}
                </span>
                <h3 className="mt-3 text-lg font-extrabold text-gray-900 leading-snug">{t.title}</h3>
              </div>
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Final CTA ──────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <div
          className="relative overflow-hidden rounded-[2rem] px-8 py-16 text-white shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #7c3aed 100%)` }}
        >
          {[120, 80, 160, 60, 100, 140].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: ['-20%', '60%', '-10%', '70%', '10%', '40%'][i],
                left: ['-5%', '80%', '70%', '-2%', '40%', '60%'][i],
              }}
            />
          ))}
          <div className="relative">
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Limited Founding Spots
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
              Seed the Marketplace.<br />
              Claim your Founding Provider status.
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Founding Providers lock in <strong className="text-white">0% commission forever</strong> and unlock every AI feature
              free for a full year. Once spots are gone, they are gone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white font-extrabold px-8 py-4 rounded-2xl text-base transition-all hover:bg-gray-100 active:scale-95 shadow-lg"
                style={{ color: PRIMARY }}
              >
                Claim my free spot <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/15 font-semibold px-8 py-4 rounded-2xl text-base text-white hover:bg-white/25 transition-all border border-white/20"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: <Percent size={14} />, text: '0% commission forever' },
                { icon: <Sparkles size={14} />, text: '1 year Pro free' },
                { icon: <ShieldCheck size={14} />, text: 'No credit card needed' },
              ].map(t => (
                <div key={t.text} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  {t.icon} {t.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo2.png" alt="LifeKit" className="h-8 w-auto" />
              <span className="text-lg font-extrabold tracking-tight">LifeKit</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The AI-powered service ecosystem that lets skilled providers earn, swap, and grow together.
            </p>
            <div className="mt-6 flex gap-3 flex-wrap">
              {['iOS App Store', 'Google Play'].map(label => (
                <div key={label} className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-2.5 border border-gray-700">
                  <Smartphone size={14} className="text-gray-400" />
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Coming soon</p>
                    <p className="text-xs font-semibold text-gray-200">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Providers</h4>
            <ul className="flex flex-col gap-2.5">
              {['Become a Provider', 'Skill Swap', 'AI Tools', 'Help Center'].map(l => (
                <li key={l}><a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {['About Us', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'].map(l => (
                <li key={l}><a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>&#169; {new Date().getFullYear()} LifeKit. All rights reserved.</p>
          <p>Built with care for every skilled professional.</p>
        </div>
      </div>
    </footer>
  )
}

// ── Page ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <SkillSwap />
        <Community />
        <Bookings />
        <AiTools />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
