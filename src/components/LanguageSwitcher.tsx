import { useLang } from '../context/LanguageContext'
import type { Language } from '../types'

const LANGS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' }, { code: 'ja', label: 'JA' },
  { code: 'zh-TW', label: '繁' }, { code: 'ko', label: 'KO' }, { code: 'tl', label: 'TL' }
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex gap-0.5 bg-white/10 rounded-lg p-0.5">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={
            lang === code
              ? 'px-2 py-1 rounded-md text-xs font-bold bg-white text-brand-600 shadow-sm'
              : 'px-2 py-1 rounded-md text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors'
          }
        >
          {label}
        </button>
      ))}
    </div>
  )
}
