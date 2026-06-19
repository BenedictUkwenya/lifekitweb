import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Sparkles, ArrowLeft, ArrowRight, Loader2, MailCheck } from 'lucide-react'
import LanguageSwitcher from '../components/LanguageSwitcher'

const PRIMARY = '#89273B'
const API = import.meta.env.VITE_API_URL

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return setError(t('forgotPassword.errorRequired'))

    setLoading(true)
    setError('')

    try {
      await axios.post(`${API}/auth/forgot-password`, {
        email: email.trim().toLowerCase(),
        redirect_to: `${window.location.origin}/reset-password`,
      })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.error || t('forgotPassword.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 sm:px-10 bg-white">
      <div className="lg:hidden mb-8 flex items-center justify-between max-w-md mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
            <Sparkles size={15} color="#fff" />
          </div>
          <span className="font-bold text-gray-900">LifeKit</span>
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md mx-auto">
        {!sent ? (
          <>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft size={15} />
              {t('forgotPassword.backToLogin')}
            </Link>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t('forgotPassword.title')}</h2>
            <p className="mt-2 text-gray-500 text-sm">{t('forgotPassword.subtitle')}</p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('forgotPassword.emailLabel')}
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:bg-white transition"
                  onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }}
                  onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <span className="mt-0.5 flex-shrink-0">⚠</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                style={{ backgroundColor: PRIMARY }}
              >
                {loading ? (
                  <><Loader2 size={17} className="animate-spin" /> {t('forgotPassword.submitting')}</>
                ) : (
                  <>{t('forgotPassword.submit')} <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${PRIMARY}15` }}
            >
              <MailCheck size={36} style={{ color: PRIMARY }} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">{t('forgotPassword.successTitle')}</h2>
            <p className="mt-3 text-gray-500 text-sm leading-relaxed">
              {t('forgotPassword.successMessage', { email: email.trim() })}
            </p>
            <p className="mt-2 text-gray-400 text-xs">{t('forgotPassword.spamHint')}</p>
            <Link
              to="/login"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: PRIMARY }}
            >
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
