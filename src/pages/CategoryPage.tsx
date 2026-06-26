import { useNavigate, useParams } from 'react-router-dom'
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
    <div className="min-h-screen bg-gray-50">
      <Header showBack backTo="/" backLabel={t('hotels')} />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">{hotel.name[lang]}</h1>
          <p className="text-sm text-gray-500">📍 {hotel.address[lang]}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">{t('categories')}</h2>
          <button onClick={() => navigate(allStoresPath)} className="text-sm text-red-600 hover:text-red-700 font-medium">
            {t('allCategories')} →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map(cat => {
            const count = countByCat(cat.id)
            const path = '/hotel/' + hotelId + '/stores?category=' + cat.id
            return (
              <button key={cat.id} disabled={count === 0}
                onClick={() => navigate(path)}
                className={cat.color + ' flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ' + (count === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 hover:shadow-md')}>
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-sm font-semibold leading-tight text-center">{cat.label[lang]}</span>
                {count > 0 && <span className="mt-1 text-xs opacity-70">{count}件</span>}
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}