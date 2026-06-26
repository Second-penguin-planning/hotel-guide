import { useLang } from '../context/LanguageContext'
import type { Language } from '../types'
const LANGS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' }, { code: 'ja', label: 'JA' },
  { code: 'zh-TW', label: '繁' }, { code: 'ko', label: 'KO' }, { code: 'tl', label: 'TL' }
]
export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex gap-1">
      {LANGS.map(({ code, label }) => (
        <button key={code} onClick={() => setLang(code)}
          className={lang === code ? 'px-2 py-0.5 rounded text-xs font-semibold bg-white text-red-600' : 'px-2 py-0.5 rounded text-xs font-semibold text-white/80 hover:text-white hover:bg-white/20'}>
          {label}
        </button>
      ))}
    </div>
  )
}