import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { hotels } from '../data'
import Header from '../components/Header'

export default function HotelSelectPage() {
  const { lang, t } = useLang()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏨</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('selectHotel')}</h1>
          <p className="text-gray-500">{t('selectHotelPrompt')}</p>
        </div>
        <div className="grid gap-4">
          {hotels.map(hotel => (
            <button key={hotel.id} onClick={() => navigate('/hotel/' + hotel.id)}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all p-6 text-left group">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 mb-1">{hotel.name[lang]}</h2>
                  <p className="text-sm text-gray-500">📍 {hotel.address[lang]}</p>
                  <p className="text-sm text-gray-400 mt-0.5">📞 {hotel.phone}</p>
                </div>
                <span className="text-red-400 group-hover:text-red-600 text-2xl">›</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}