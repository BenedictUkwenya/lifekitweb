import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Sparkles, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { isExpiredAuthHash, parseHashParams } from '../utils/authHash'

const PRIMARY = '#89273B'
const API = import.meta.env.VITE_API_URL
const TOKEN_STORAGE_KEY = 'lifekit_reset_tokens'

function loadStoredTokens() {
  try {
    const raw = sessionStorage.getItem(TOKEN_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function storeTokens(tokens) {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
}

function clearStoredTokens() {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY)
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [tokens, setTokens] = useState({ access_token: '', refresh_token: '', code: '' })
  const [sessionReady, setSessionReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [linkInvalid, setLinkInvalid] = useState(false)

  useEffect(() => {
    const params = parseHashParams()
    const query = new URLSearchParams(window.location.search)
    const code = query.get('code') || ''

    if (isExpiredAuthHash(params)) {
      clearStoredTokens()
      setLinkInvalid(true)
      window.history.replaceState(null, '', window.location.pathname)
      return
    }

    const accessToken = params.get('access_token') || ''
    const refreshToken = params.get('refresh_token') || ''
    const type = params.get('type')

    if (code) {
      const next = { access_token: '', refresh_token: '', code }
      setTokens(next)
      storeTokens(next)
      setSessionReady(true)
      window.history.replaceState(null, '', window.location.pathname)
      return
    }

    if (accessToken && (type === 'recovery' || !type)) {
      const next = { access_token: accessToken, refresh_token: refreshToken, code: '' }
      setTokens(next)
      storeTokens(next)
      setSessionReady(true)
      window.history.replaceState(null, '', window.location.pathname)
      return
    }

    const stored = loadStoredTokens()
    if (stored?.access_token || stored?.code) {
      setTokens(stored)
      setSessionReady(true)
      return
    }

    setLinkInvalid(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!sessionReady) return setError(t('resetPassword.errorGeneric'))
    if (password.length < 6) return setError(t('resetPassword.errorShort'))
    if (password !== confirm) return setError(t('resetPassword.errorMatch'))

    setLoading(true)
    setError('')

    try {
      await axios.post(`${API}/auth/reset-password`, {
        new_password: password,
        access_token: tokens.access_token || undefined,
        refresh_token: tokens.refresh_token || undefined,
        code: tokens.code || undefined,
      })
      clearStoredTokens()
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.error || t('resetPassword.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  if (!sessionReady && !linkInvalid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={28} className="animate-spin" style={{ color: PRIMARY }} />
      </div>
    )
  }

  if (linkInvalid) {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6 py-12 sm:px-10 bg-white">
        <div className="w-full max-w-md mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">{t('resetPassword.invalidTitle')}</h2>
          <p className="mt-3 text-gray-500 text-sm">{t('resetPassword.invalidMessage')}</p>
          <Link
            to="/forgot-password"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            {t('resetPassword.requestNewLink')}
          </Link>
        </div>
      </div>
    )
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
        {!done ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t('resetPassword.title')}</h2>
            <p className="mt-2 text-gray-500 text-sm">{t('resetPassword.subtitle')}</p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('resetPassword.passwordLabel')}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('resetPassword.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none bg-gray-50 focus:bg-white transition"
                    onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }}
                    onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('resetPassword.confirmLabel')}
                </label>
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t('resetPassword.confirmPlaceholder')}
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError('') }}
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
                  <><Loader2 size={17} className="animate-spin" /> {t('resetPassword.submitting')}</>
                ) : (
                  <>{t('resetPassword.submit')} <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">{t('resetPassword.successTitle')}</h2>
            <p className="mt-3 text-gray-500 text-sm">{t('resetPassword.successMessage')}</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: PRIMARY }}
            >
              {t('resetPassword.signIn')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
