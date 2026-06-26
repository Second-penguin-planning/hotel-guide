import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Settings } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { useLang } from '../context/LanguageContext'

interface Props { showBack?: boolean; backTo?: string; backLabel?: string }

export default function Header({ showBack, backTo, backLabel }: Props) {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button onClick={() => backTo ? navigate(backTo) : navigate(-1)}
              className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors">
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">{backLabel ?? t('backToList')}</span>
            </button>
          ) : (
            <Link to="/" className="font-bold text-lg">🗺️ Area Guide</Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/admin" className="text-white/60 hover:text-white transition-colors">
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </header>
  )
}