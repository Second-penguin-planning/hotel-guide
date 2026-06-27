import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, Phone, ChevronRight } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { categories, hotels, stores } from '../data'
import Header from '../components/Header'

export default function CategoryPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const { lang, t } = useLang()
  const navigate = useNavigate()
  const hotel = hotels.find(h => h.id === hotelId)
  if (!hotel) { navigate('/'); return null }

  const countByCat = (id: string) =>
    stores.filter(s => s.active && s.hotelIds.includes(hotelId!) && s.categoryId === id).length

  const allStoresPath = '/hotel/' + hotelId + '/stores'

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showBack backTo="/" backLabel={t('hotels')} />

      {/* Hotel info banner */}
      <div className="bg-brand-600 bg-hotel-pattern">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-1">Toyoko Inn</p>
          <h1 className="text-white text-lg font-bold leading-snug mb-2">{hotel.name[lang]}</h1>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <MapPin size={11} />
              <span>{hotel.address[lang]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <Phone size={11} />
              <span>{hotel.phone}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <p className="section-label">{t('categories')}</p>
          <button
            onClick={() => navigate(allStoresPath)}
            className="flex items-center gap-1 text-sm text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            {t('allCategories')}
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map(cat => {
            const count = countByCat(cat.id)
            const path = '/hotel/' + hotelId + '/stores?category=' + cat.id
            const disabled = count === 0
            return (
              <button
                key={cat.id}
                disabled={disabled}
                onClick={() => !disabled && navigate(path)}
                className={
                  'relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-150 ' +
                  (disabled
                    ? 'bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed'
                    : cat.color + ' hover:scale-105 hover:shadow-lg cursor-pointer')
                }
              >
                <span className="text-3xl mb-2 drop-shadow-sm">{cat.icon}</span>
                <span className="text-sm font-bold leading-tight text-center">{cat.label[lang]}</span>
                {count > 0 && (
                  <span className="mt-1.5 text-xs bg-white/30 rounded-full px-2 py-0.5 font-medium">
                    {count}件
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
