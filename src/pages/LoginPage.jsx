import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import {
  Sparkles, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Star, Users, TrendingUp, Percent, Clock, Globe,
} from 'lucide-react'
import LanguageSwitcher from '../components/LanguageSwitcher'

const PRIMARY = '#89273B'
const API = import.meta.env.VITE_API_URL
const OTP_LENGTH = 6

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

function isUnverifiedError(err) {
  const data = err.response?.data
  if (data?.isUnverified || data?.code === 'EMAIL_NOT_CONFIRMED') return true
  const msg = (data?.error || err.message || '').toLowerCase()
  return msg.includes('not confirmed') || msg.includes('not verified')
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [step, setStep] = useState('credentials')
  const [form, setForm] = useState({ email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const sendingRef = useRef(false)
  const submitLockRef = useRef(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setInfo('')
  }

  const lang = (i18n.language || 'en').split('-')[0]

  const startCooldown = (seconds = 60) => {
    setCooldown(seconds)
  }

  // Tick cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return undefined
    const id = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const sendVerificationCode = async () => {
    if (sendingRef.current) {
      const err = new Error('SEND_IN_FLIGHT')
      err.code = 'SEND_IN_FLIGHT'
      throw err
    }
    if (cooldown > 0) {
      const err = new Error(`Please wait ${cooldown}s before requesting another code.`)
      err.code = 'COOLDOWN'
      err.retryAfterSec = cooldown
      throw err
    }

    sendingRef.current = true
    try {
      const { data } = await axios.post(`${API}/auth/resend-otp`, {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        language: lang,
      })
      startCooldown(data?.cooldownSec || 60)
      return data
    } finally {
      sendingRef.current = false
    }
  }

  const enterVerifyStep = async ({ autoSend = true } = {}) => {
    setStep('verify')
    setOtp('')
    setError('')
    if (!autoSend) return

    setLoading(true)
    try {
      await sendVerificationCode()
      setInfo(t('login.verifyCodeSent'))
    } catch (err) {
      if (err.code === 'SEND_IN_FLIGHT' || err.code === 'COOLDOWN') {
        setInfo(t('login.verifyCodeSent'))
      } else if (err.response?.status === 429) {
        const wait = err.response?.data?.retryAfterSec || 60
        startCooldown(wait)
        setInfo(t('login.verifyCodeSent'))
      } else {
        setError(err.response?.data?.error || t('login.errorResend'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) return setError(t('login.errorRequired'))
    if (submitLockRef.current || loading) return

    submitLockRef.current = true
    setLoading(true)
    setError('')
    setInfo('')

    try {
      const { data } = await axios.post(`${API}/auth/login`, {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      if (data.session?.access_token) {
        localStorage.setItem('provider_token', data.session.access_token)
        if (data.session.refresh_token) localStorage.setItem('provider_refresh_token', data.session.refresh_token)
      }
      if (data.user) {
        localStorage.setItem('provider_user', JSON.stringify(data.user))
      }

      navigate('/dashboard')
    } catch (err) {
      if (isUnverifiedError(err)) {
        setLoading(false)
        submitLockRef.current = false
        await enterVerifyStep({ autoSend: true })
        return
      }
      setError(err.response?.data?.error || t('login.errorInvalid'))
    } finally {
      setLoading(false)
      submitLockRef.current = false
    }
  }

  const handleResendOtp = async () => {
    if (loading || sendingRef.current || cooldown > 0) return

    setLoading(true)
    setError('')
    setInfo('')
    try {
      await sendVerificationCode()
      setOtp('')
      setInfo(t('login.verifyCodeSent'))
    } catch (err) {
      if (err.code === 'SEND_IN_FLIGHT' || err.code === 'COOLDOWN') {
        setInfo(t('login.verifyWait', { seconds: err.retryAfterSec || cooldown || 60 }))
      } else if (err.response?.status === 429) {
        const wait = err.response?.data?.retryAfterSec || 60
        startCooldown(wait)
        setInfo(t('login.verifyWait', { seconds: wait }))
      } else if (err.response?.data?.alreadyVerified) {
        setError(t('login.alreadyVerified'))
        setStep('credentials')
      } else {
        setError(err.response?.data?.error || t('login.errorResend'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (code) => {
    if (code.length !== OTP_LENGTH) return

    setLoading(true)
    setError('')
    setInfo('')

    try {
      const { data } = await axios.post(`${API}/auth/verify-otp`, {
        email: form.email.trim().toLowerCase(),
        token: code,
      })

      if (data.session?.access_token) {
        localStorage.setItem('provider_token', data.session.access_token)
        if (data.session.refresh_token) localStorage.setItem('provider_refresh_token', data.session.refresh_token)
      }
      if (data.user) {
        localStorage.setItem('provider_user', JSON.stringify(data.user))
      }

      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || ''
      setError(
        msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('expired')
          ? t('login.errorOtpInvalid')
          : (msg || t('login.errorGeneric'))
      )
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

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
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <img src="/logo2.png" alt="" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">LifeKit</span>
          </Link>
          <LanguageSwitcher variant="light" />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
            {t('login.sideHeading')}
          </h1>
          <p className="mt-4 text-white/75 text-lg leading-relaxed max-w-sm">
            {t('login.sideSubtitle')}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: <Percent size={18} />, value: '3%', label: t('login.statProviders') },
              { icon: <Clock size={18} />, value: '< 5 min', label: t('login.statRating') },
              { icon: <Globe size={18} />, value: '3', label: t('login.statEarnings') },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center">
                <div className="flex justify-center text-white/70 mb-2">{s.icon}</div>
                <p className="text-white font-extrabold text-lg">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4">
            {[
              { quote: t('login.testimonial1'), name: t('login.testimonial1Name'), role: t('login.testimonial1Role') },
              { quote: t('login.testimonial2'), name: t('login.testimonial2Name'), role: t('login.testimonial2Role') },
            ].map((item) => (
              <div key={item.name} className="bg-white/10 rounded-2xl p-5">
                <p className="text-white/85 text-sm leading-relaxed">{item.quote}</p>
                <div className="mt-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{item.name}</p>
                    <p className="text-white/50 text-xs">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs relative z-10">
          © {new Date().getFullYear()} LifeKit. {t('footer.rights')}
        </p>
      </div>

      {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 xl:px-20 bg-white">
        <div className="lg:hidden mb-8 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/logo2.png" alt="" className="w-8 h-8 object-contain" />
            <span className="font-bold text-gray-900">LifeKit</span>
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md mx-auto">
          {isVerifyStep ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep('credentials')
                  setOtp('')
                  setError('')
                  setInfo('')
                }}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
                disabled={loading}
              >
                <ArrowLeft size={15} />
                {t('login.verifyBack')}
              </button>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t('login.verifyTitle')}</h2>
              <p className="mt-2 text-gray-500 text-sm">
                {t('login.verifySubtitle', { email: form.email.trim().toLowerCase() })}
              </p>

              <div className="mt-8 flex flex-col gap-5">
                <OtpInput
                  value={otp}
                  disabled={loading}
                  onChange={(code) => {
                    setOtp(code)
                    setError('')
                    if (code.length === OTP_LENGTH) handleVerifyOtp(code)
                  }}
                />

                {info && !error && (
                  <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                    {info}
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <span className="mt-0.5 flex-shrink-0">⚠</span>
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || cooldown > 0}
                  className="text-sm font-semibold hover:underline disabled:opacity-60 disabled:no-underline self-center"
                  style={{ color: PRIMARY }}
                >
                  {loading
                    ? t('login.verifyResending')
                    : cooldown > 0
                      ? t('login.verifyWait', { seconds: cooldown })
                      : t('login.verifyResend')}
                </button>

                <p className="text-xs text-gray-400 text-center">{t('login.verifyHint')}</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t('login.pageTitle')}</h2>
              <p className="mt-2 text-gray-500 text-sm">
                {t('login.noAccount')}{' '}
                <Link to="/register" className="font-semibold hover:underline" style={{ color: PRIMARY }}>
                  {t('login.createAccount')}
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('login.emailLabel')}</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={t('login.emailPlaceholder')}
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:bg-white transition"
                    onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }}
                    onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }}
                    disabled={loading}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">{t('login.passwordLabel')}</label>
                    <Link to="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: PRIMARY }}>
                      {t('login.forgotPassword')}
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      placeholder={t('login.passwordPlaceholder')}
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

                {error && (
                  <div className="flex flex-col gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex-shrink-0">⚠</span>
                      <span>{error}</span>
                    </div>
                    {(error.toLowerCase().includes('not confirmed') || error.toLowerCase().includes('not verified')) && (
                      <button
                        type="button"
                        onClick={() => enterVerifyStep({ autoSend: true })}
                        disabled={loading}
                        className="text-left text-sm font-bold hover:underline disabled:opacity-60"
                        style={{ color: PRIMARY }}
                      >
                        {t('login.verifyResend')}
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mt-1"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {loading ? (
                    <><Loader2 size={17} className="animate-spin" /> {t('login.submittingButton')}</>
                  ) : (
                    <>{t('login.submitButton')} <ArrowRight size={16} /></>
                  )}
                </button>

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">{t('login.orDivider')}</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <Link
                  to="/register"
                  className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm border-2 transition-all hover:bg-gray-50 active:scale-[0.98]"
                  style={{ color: PRIMARY, borderColor: PRIMARY }}
                >
                  {t('login.createProviderAccount')}
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
