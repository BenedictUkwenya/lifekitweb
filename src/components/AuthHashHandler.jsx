import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { hasAuthHash, hasRecoveryCode, isExpiredAuthHash, isRecoveryHash, parseHashParams } from '../utils/authHash'

/**
 * Supabase password-reset links put tokens in the URL hash. If the redirect
 * lands on "/" instead of "/reset-password", forward the user to the right page.
 */
export default function AuthHashHandler({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!hasAuthHash()) return

    const params = parseHashParams()
    const hash = window.location.hash

    if ((isRecoveryHash(params) || hasRecoveryCode()) && location.pathname !== '/reset-password') {
      const suffix = hasRecoveryCode() ? window.location.search : hash
      navigate(`/reset-password${suffix}`, { replace: true })
      return
    }

    if (isExpiredAuthHash(params)) {
      const code = params.get('error_code') || 'link_expired'
      if (location.pathname !== '/forgot-password') {
        navigate(`/forgot-password?error=${code}`, { replace: true })
      }
    }
  }, [location.pathname, location.hash, navigate])

  return children
}
