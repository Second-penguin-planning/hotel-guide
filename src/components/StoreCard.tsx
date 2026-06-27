import { Link } from 'react-router-dom'
import { Clock, MapPin, ChevronRight } from 'lucide-react'
import type { Store } from '../types'
import { useLang } from '../context/LanguageContext'
import { categories } from '../data'
import Badge from './Badge'

interface Props { store: Store; hotelId: string }

export default function StoreCard({ store, hotelId }: Props) {
  const { lang, t } = useLang()
  const cat = categories.find(c => c.id === store.categoryId)
  const walk = store.walkMinutes[hotelId]
  const href = '/store/' + store.id + '?hotel=' + hotelId

  return (
    <Link
      to={href}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all duration-150 overflow-hidden group"
    >
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div className={'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-2xl ' + (cat?.color ?? 'bg-gray-100')}>
          {cat?.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-brand-600 transition-colors">
              {store.name[lang]}
            </h3>
            {store.priceRange && (
              <span className="text-xs text-gray-400 shrink-0 font-mono">{store.priceRange}</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{store.address[lang]}</span>
          </div>

          {store.hours && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
              <Clock size={11} className="shrink-0" />
              <span className="truncate">{store.hours}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {walk !== undefined && <Badge variant="blue">🚶 {walk}{t('minutesWalk')}</Badge>}
            {store.recommended && <Badge variant="orange">⭐ {t('recommended')}</Badge>}
            {store.sponsored && <Badge variant="purple">🏷️ {t('sponsored')}</Badge>}
            {store.halal && <Badge variant="green">🌙 {t('halal')}</Badge>}
            {store.vegetarian && <Badge variant="green">🌿 {t('vegetarian')}</Badge>}
          </div>
        </div>

        <ChevronRight size={16} className="shrink-0 text-gray-300 group-hover:text-brand-400 transition-colors" />
      </div>
    </Link>
  )
}
