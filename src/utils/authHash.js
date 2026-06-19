export function parseHashParams() {
  const raw = window.location.hash
  if (!raw || raw.length < 2) return new URLSearchParams()
  return new URLSearchParams(raw.startsWith('#') ? raw.slice(1) : raw)
}

/** Returns true when the URL carries a Supabase auth payload. */
export function hasAuthHash() {
  if (new URLSearchParams(window.location.search).has('code')) return true
  const params = parseHashParams()
  return (
    params.has('access_token') ||
    params.has('error') ||
    params.has('error_code')
  )
}

export function isRecoveryHash(params) {
  const type = params.get('type')
  return Boolean(params.get('access_token') && (type === 'recovery' || !type))
}

export function hasRecoveryCode() {
  return new URLSearchParams(window.location.search).has('code')
}

export function isExpiredAuthHash(params) {
  const code = params.get('error_code')
  const error = params.get('error')
  return code === 'otp_expired' || error === 'access_denied'
}
