import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'en', label: 'EN', nativeLabel: 'English' },
  { code: 'ka', label: 'KA', nativeLabel: 'ქართული' },
  { code: 'ru', label: 'RU', nativeLabel: 'Русский' },
]

/**
 * A compact three-button language switcher.
 * Pass `variant="light"` for use on dark backgrounds (landing page header).
 * Default variant is "dark" (dark text on light background).
 */
export default function LanguageSwitcher({ variant = 'dark', className = '' }) {
  const { i18n } = useTranslation()
  const current  = i18n.language?.slice(0, 2) || 'en'

  const handleChange = (code) => {
    i18n.changeLanguage(code)
  }

  const activeBase  = variant === 'light'
    ? 'bg-white text-[#89273B] font-bold'
    : 'bg-[#89273B] text-white font-bold'

  const inactiveBase = variant === 'light'
    ? 'text-white/70 hover:text-white font-medium'
    : 'text-gray-500 hover:text-gray-800 font-medium'

  return (
    <div className={`flex items-center gap-0.5 rounded-xl p-0.5 ${variant === 'light' ? 'bg-white/15' : 'bg-gray-100'} ${className}`}>
      {LANGS.map(({ code, label, nativeLabel }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          title={nativeLabel}
          className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
            current === code ? activeBase : inactiveBase
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
