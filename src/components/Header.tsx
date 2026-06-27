import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Settings } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { useLang } from '../context/LanguageContext'

interface Props { showBack?: boolean; backTo?: string; backLabel?: string }

export default function Header({ showBack, backTo, backLabel }: Props) {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <header className="bg-brand-600 text-white shadow-lg">
      {/* Top bar: gold accent line */}
      <div className="h-1 bg-gradient-to-r from-gold-400 via-yellow-300 to-gold-400" />

      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Left: back or logo */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={() => backTo ? navigate(backTo) : navigate(-1)}
              className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">{backLabel ?? t('backToList')}</span>
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2.5">
              {/* Toyoko Inn style logo mark */}
              <div className="flex flex-col items-center justify-center w-8 h-8 rounded bg-white/10 border border-white/20">
                <span className="text-white font-black text-xs leading-none">東横</span>
                <span className="text-gold-400 font-black text-xs leading-none">INN</span>
              </div>
              <div className="leading-tight">
                <div className="text-xs text-white/60 font-medium tracking-widest uppercase">Toyoko Inn</div>
                <div className="text-sm font-bold text-white leading-none">Area Guide</div>
              </div>
            </Link>
          )}
        </div>

        {/* Right: language + admin */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/admin" className="text-white/50 hover:text-white/90 transition-colors">
            <Settings size={17} />
          </Link>
        </div>
      </div>
    </header>
  )
}
