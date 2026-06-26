import { Link } from 'react-router-dom'
import { Clock, MapPin } from 'lucide-react'
import type { Store } from '../types'
import { useLang } from '../context/LanguageContext'
import { categories } from '../data'
import Badge from './Badge'

interface Props {
  store: Store
  hotelId: string
}

export default function StoreCard({ store, hotelId }: Props) {
  const { lang, t } = useLang()
  const category = categories.find((c) => c.id === store.categoryId)
  const walk = store.walkMinutes[hotelId]

  return (
    <Link
      to={`/store/${store.id}?hotel=${hotelId}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
    >
      {store.photos[0] && (
        <div className="h-36 bg-gray-100 overflow-hidden">
          <img src={store.photos[0]} alt={store.name[lang]} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-lg">{category?.icon}</span>
            <h3 className="font-semibold text-gray-900 truncate">{store.name[lang]}</h3>
          </div>
          {store.priceRange && (
            <span className="text-xs text-gray-500 shrink-0 font-mono">{store.priceRange}</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin size={12} />
          <span className="truncate">{store.address[lang]}</span>
        </div>

        {store.hours && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <Clock size={12} />
            <span>{store.hours}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {walk !== undefined && (
            <Badge variant="blue">🚶 {walk} {t('minutesWalk')}</Badge>
          )}
          {store.recommended && <Badge variant="orange">⭐ {t('recommended')}</Badge>}
          {store.sponsored && <Badge variant="purple">🏷️ {t('sponsored')}</Badge>}
          {store.halal && <Badge variant="green">🌙 {t('halal')}</Badge>}
          {store.vegetarian && <Badge variant="green">🌿 {t('vegetarian')}</Badge>}
          {store.languages.length > 1 && (
            <Badge variant="gray">🌐 {t('foreignLanguage')}</Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
