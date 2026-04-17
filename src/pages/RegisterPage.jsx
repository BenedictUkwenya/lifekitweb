import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Percent,
} from 'lucide-react'

const PRIMARY = '#89273B'
const PRIMARY_D = '#6e1e2f'
const API = import.meta.env.VITE_API_URL

const TRUST_BADGES = [
  { icon: <Percent size={18} />, text: '0% commission — forever, as a founding member' },
  { icon: <ShieldCheck size={18} />, text: '1 full year of Pro tier, completely free' },
  { icon: <TrendingUp size={18} />, text: 'AI-powered income insights from day one' },
  { icon: <Sparkles size={18} />, text: 'AI Autofill creates your listings in seconds' },
]

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' })
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const validate = () => {
    if (!form.full_name.trim()) return 'Full name is required.'
    if (!form.email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.password !== form.confirm_password) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.post(`${API}/auth/signup`, {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirm_password: form.confirm_password,
        is_provider_signup: true,
        is_web_signup: true,
      })

      setSuccess('Account created! Please check your email to confirm, then sign in.')
      setTimeout(() => navigate('/login'), 3500)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
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
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={11} />
            Early Adopter — Limited Spots
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
            Join LifeKit<br />Providers
          </h1>
          <p className="mt-4 text-white/75 text-lg leading-relaxed max-w-sm">
            Get <span className="text-white font-bold">1 Year of Pro for Free</span> when you
            register today. No credit card, no catch.
          </p>

          {/* Trust badges */}
          <ul className="mt-10 flex flex-col gap-4">
            {TRUST_BADGES.map((b) => (
              <li key={b.text} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  {b.icon}
                </span>
                <span className="text-white/85 text-sm leading-snug pt-1">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-500 text-sm">
            Already have one?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: PRIMARY }}>
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="full_name"
                autoComplete="name"
                placeholder="Jane Smith"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:border-transparent bg-gray-50 focus:bg-white"
                style={{ '--tw-ring-color': PRIMARY }}
                onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }}
                onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }}
                disabled={loading}
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm_password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:bg-white transition"
                  onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }}
                  onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <span className="mt-0.5 flex-shrink-0 text-red-500">⚠</span>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-green-500" />
                {success}
              </div>
            )}

            {/* Pro badge reminder */}
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 border"
              style={{ backgroundColor: `${PRIMARY}08`, borderColor: `${PRIMARY}30` }}
            >
              <Sparkles size={16} style={{ color: PRIMARY }} className="flex-shrink-0" />
              <p className="text-xs text-gray-600">
                You're signing up as a{' '}
                <span className="font-bold" style={{ color: PRIMARY }}>Founding Provider</span>
                {' '}— 0% commission + 1 year Pro free.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mt-1"
              style={{ backgroundColor: PRIMARY }}
            >
              {loading ? (
                <><Loader2 size={17} className="animate-spin" /> Creating account…</>
              ) : (
                <>Create my free account <ArrowRight size={16} /></>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By registering you agree to our{' '}
              <a href="#" className="underline hover:text-gray-600">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

