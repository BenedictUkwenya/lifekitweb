import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import {
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Percent,
} from 'lucide-react'
import LanguageSwitcher from '../components/LanguageSwitcher'

const PRIMARY = '#89273B'
const API = import.meta.env.VITE_API_URL
const OTP_LENGTH = 6

function friendlyAuthError(err, fallback) {
  const msg = (err.response?.data?.error || err.message || '').toLowerCase()
  if (msg.includes('otp') || msg.includes('token') || msg.includes('verification') || msg.includes('expired')) {
    return null
  }
  return err.response?.data?.error || fallback
}

function OtpInput({ value, onChange, disabled }) {
  const inputsRef = useRef([])

  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] || '')

  const focusAt = (index) => {
    const el = inputsRef.current[index]
    if (el) el.focus()
  }

  const updateDigit = (index, char) => {
    const next = digits.slice()
    next[index] = char
    onChange(next.join('').slice(0, OTP_LENGTH))
    if (char && index < OTP_LENGTH - 1) focusAt(index + 1)
  }

  const handleChange = (index, e) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) {
      updateDigit(index, '')
      return
    }
    if (raw.length > 1) {
      const pasted = raw.slice(0, OTP_LENGTH)
      onChange(pasted)
      focusAt(Math.min(pasted.length, OTP_LENGTH - 1))
      return
    }
    updateDigit(index, raw)
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusAt(index - 1)
    }
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={6}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => {
            e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`
            e.target.style.borderColor = PRIMARY
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = ''
            e.target.style.borderColor = ''
          }}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none transition disabled:opacity-60"
        />
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [step, setStep] = useState('details')
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' })
  const [otp, setOtp] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const validate = () => {
    if (!form.full_name.trim()) return t('register.errorFullName')
    if (!form.email.trim()) return t('register.errorEmail')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('register.errorEmailInvalid')
    if (form.password.length < 6) return t('register.errorPasswordShort')
    if (form.password !== form.confirm_password) return t('register.errorPasswordMatch')
    return null
  }

  const signupPayload = () => ({
    full_name: form.full_name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    confirm_password: form.confirm_password,
    is_provider_signup: true,
    is_web_signup: true,
  })

  const handleSignup = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)

    setLoading(true)
    setError('')

    try {
      await axios.post(`${API}/auth/signup`, signupPayload())
      setOtp('')
      setStep('verify')
    } catch (err) {
      setError(friendlyAuthError(err, t('register.errorGeneric')))
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setError('')

    try {
      await axios.post(`${API}/auth/signup`, signupPayload())
      setOtp('')
    } catch (err) {
      setError(friendlyAuthError(err, t('register.errorResend')))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (code) => {
    if (code.length !== OTP_LENGTH) return

    setLoading(true)
    setError('')

    try {
      const { data } = await axios.post(`${API}/auth/verify-otp`, {
        email: form.email.trim().toLowerCase(),
        token: code,
      })

      if (data.session?.access_token) {
        localStorage.setItem('provider_token', data.session.access_token)
      }
      if (data.user) {
        localStorage.setItem('provider_user', JSON.stringify(data.user))
      }

      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || ''
      setError(
        msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('expired')
          ? t('register.errorOtpInvalid')
          : (msg || t('register.errorGeneric'))
      )
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const TRUST_BADGES = [
    { icon: <Percent size={18} />, text: t('register.trust1') },
    { icon: <ShieldCheck size={18} />, text: t('register.trust2') },
    { icon: <TrendingUp size={18} />, text: t('register.trust3') },
    { icon: <Sparkles size={18} />, text: t('register.trust4') },
  ]

  const isVerifyStep = step === 'verify'

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ───────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden"
        style={{ backgroundColor: PRIMARY }}
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-10 bg-white" />

        <div className="flex items-center justify-between relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles size={18} color="#fff" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">LifeKit</span>
          </Link>
          <LanguageSwitcher variant="light" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={11} />
            {t('register.sideEarlyAdopter')}
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
            {t('register.sideHeading1')}<br />{t('register.sideHeading2')}
          </h1>
          <p className="mt-4 text-white/75 text-lg leading-relaxed max-w-sm">
            {t('register.sideBenefit', { highlight: t('register.sideBenefitHighlight') })}
          </p>

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

        <p className="text-white/40 text-xs relative z-10">
          © {new Date().getFullYear()} LifeKit. {t('footer.rights')}
        </p>
      </div>

      {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 xl:px-20 bg-white">
        <div className="lg:hidden mb-8 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span className="font-bold text-gray-900">LifeKit</span>
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md mx-auto">
          {isVerifyStep ? (
            <>
              <button
                type="button"
                onClick={() => { setStep('details'); setError(''); setOtp('') }}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 transition-colors disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                {t('register.otpBack')}
              </button>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t('register.otpTitle')}</h2>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                {t('register.otpSubtitle', { email: form.email.trim().toLowerCase() })}
              </p>

              <div className="mt-10 flex flex-col gap-6">
                <OtpInput
                  value={otp}
                  onChange={(code) => {
                    setOtp(code)
                    setError('')
                    if (code.length === OTP_LENGTH) handleVerifyOtp(code)
                  }}
                  disabled={loading}
                />

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <span className="mt-0.5 flex-shrink-0 text-red-500">⚠</span>
                    {error}
                  </div>
                )}

                {loading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Loader2 size={16} className="animate-spin" />
                    {t('register.otpVerifying')}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-sm font-semibold hover:underline disabled:opacity-50 transition-opacity"
                  style={{ color: PRIMARY }}
                >
                  {loading ? t('register.otpResending') : t('register.otpResend')}
                </button>

                <p className="text-center text-xs text-gray-400">
                  {t('register.otpHint')}
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t('register.pageTitle')}</h2>
              <p className="mt-2 text-gray-500 text-sm">
                {t('register.haveAccount')}{' '}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: PRIMARY }}>
                  {t('register.signIn')}
                </Link>
              </p>

              <form onSubmit={handleSignup} className="mt-8 flex flex-col gap-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('register.fullNameLabel')}</label>
                  <input
                    type="text"
                    name="full_name"
                    autoComplete="name"
                    placeholder={t('register.fullNamePlaceholder')}
                    value={form.full_name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:border-transparent bg-gray-50 focus:bg-white"
                    onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }}
                    onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('register.emailLabel')}</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={t('register.emailPlaceholder')}
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:bg-white transition"
                    onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }}
                    onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('register.passwordLabel')}</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      name="password"
                      autoComplete="new-password"
                      placeholder={t('register.passwordPlaceholder')}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('register.confirmPasswordLabel')}</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirm_password"
                      autoComplete="new-password"
                      placeholder={t('register.confirmPasswordPlaceholder')}
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

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <span className="mt-0.5 flex-shrink-0 text-red-500">⚠</span>
                    {error}
                  </div>
                )}

                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                  style={{ backgroundColor: `${PRIMARY}08`, borderColor: `${PRIMARY}30` }}
                >
                  <Sparkles size={16} style={{ color: PRIMARY }} className="flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    {t('register.youreSigningUp')}{' '}
                    <span className="font-bold" style={{ color: PRIMARY }}>{t('register.foundingBadge')}</span>
                    {t('register.foundingText')}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mt-1"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {loading ? (
                    <><Loader2 size={17} className="animate-spin" /> {t('register.submittingButton')}</>
                  ) : (
                    <>{t('register.submitButton')} <ArrowRight size={16} /></>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  {t('register.termsText')}{' '}
                  <a href="#" className="underline hover:text-gray-600">{t('register.termsLink')}</a>
                  {' '}{t('register.andText')}{' '}
                  <a href="#" className="underline hover:text-gray-600">{t('register.privacyLink')}</a>.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
