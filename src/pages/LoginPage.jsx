import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react'

const PRIMARY = '#89273B'
const API = import.meta.env.VITE_API_URL

const TESTIMONIALS = [
  {
    quote: "LifeKit's AI wrote my entire service listing in under 10 seconds. Bookings came in the same day.",
    name: 'Sarah O.',
    role: 'Hair Stylist',
  },
  {
    quote: 'The Opportunity Radar told me to add nail extensions — that one service doubled my revenue.',
    name: 'Amara K.',
    role: 'Beauty Provider',
  },
]

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) return setError('Email and password are required.')

    setLoading(true)
    setError('')

    try {
      const { data } = await axios.post(`${API}/auth/login`, {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      // Persist session to localStorage
      if (data.session?.access_token) {
        localStorage.setItem('provider_token', data.session.access_token)
      }
      if (data.user) {
        localStorage.setItem('provider_user', JSON.stringify(data.user))
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ───────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden"
        style={{ backgroundColor: PRIMARY }}
      >
        {/* Background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-10 bg-white" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles size={18} color="#fff" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">LifeKit</span>
        </Link>

        {/* Main copy */}
        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
            Welcome<br />back.
          </h1>
          <p className="mt-4 text-white/75 text-lg leading-relaxed max-w-sm">
            Your customers are waiting. Sign in to manage bookings, track earnings,
            and grow your business with AI.
          </p>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: <Users size={18} />, value: '200+', label: 'Providers' },
              { icon: <Star size={18} />, value: '4.9★', label: 'Avg. rating' },
              { icon: <TrendingUp size={18} />, value: '$2.4k', label: 'Avg. earnings' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center">
                <div className="flex justify-center text-white/70 mb-2">{s.icon}</div>
                <p className="text-white font-extrabold text-lg">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mt-10 flex flex-col gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/10 rounded-2xl p-5">
                <p className="text-white/85 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="mt-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs relative z-10">
          © {new Date().getFullYear()} LifeKit. All rights reserved.
        </p>
      </div>

      {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 xl:px-20 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span className="font-bold text-gray-900">LifeKit</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-gray-500 text-sm">
            New here?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: PRIMARY }}>
              Create a free account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:bg-white transition"
                onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }}
                onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium hover:underline" style={{ color: PRIMARY }}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:bg-white transition"
                  onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }}
                  onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <span className="mt-0.5 flex-shrink-0">⚠</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mt-1"
              style={{ backgroundColor: PRIMARY }}
            >
              {loading ? (
                <><Loader2 size={17} className="animate-spin" /> Signing in…</>
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">Don't have an account?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <Link
              to="/register"
              className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm border-2 transition-all hover:bg-gray-50 active:scale-[0.98]"
              style={{ color: PRIMARY, borderColor: PRIMARY }}
            >
              Create a free provider account
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

