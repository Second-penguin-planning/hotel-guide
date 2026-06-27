import { useNavigate, Link } from 'react-router-dom'
import { MapPin, Phone, ChevronRight, Table2 } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { hotels } from '../data'
import Header from '../components/Header'

export default function HotelSelectPage() {
  const { lang, t } = useLang()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Banner */}
      <div className="bg-brand-600 bg-hotel-pattern">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          {/* Crest / emblem */}
          <div className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/10 border-2 border-gold-400/60 mb-4">
            <span className="text-2xl font-black text-white leading-none">東横</span>
            <span className="text-xs font-bold text-gold-400 leading-none tracking-widest">INN</span>
          </div>
          <h1 className="text-white text-xl font-bold mb-1">Toyoko Inn Area Guide</h1>
          <p className="text-white/60 text-sm">{t('selectHotelPrompt')}</p>
        </div>
      </div>

      {/* Gold divider wave */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <p className="section-label mb-4 text-center">{t('selectHotel')}</p>

        <div className="grid gap-4">
          {hotels.map((hotel, i) => (
            <button
              key={hotel.id}
              onClick={() => navigate('/hotel/' + hotel.id)}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-300 transition-all duration-200 text-left group overflow-hidden"
            >
              {/* Color bar */}
              <div className={'h-1.5 w-full ' + (i === 0 ? 'bg-brand-600' : 'bg-accent-500')} />

              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Hotel number badge */}
                  <div className={'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm ' + (i === 0 ? 'bg-brand-600' : 'bg-accent-500')}>
                    {i + 1}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors mb-1 leading-snug">
                      {hotel.name[lang]}
                    </h2>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                      <MapPin size={11} className="shrink-0" />
                      <span>{hotel.address[lang]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone size={11} className="shrink-0" />
                      <span>{hotel.phone}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  className="shrink-0 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Store table link */}
        <Link
          to="/store-table"
          className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-brand-200 text-brand-600 font-semibold text-sm hover:bg-brand-50 transition-colors"
        >
          <Table2 size={16} />
          周辺店舗 一覧表を見る
        </Link>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by Toyoko Inn Group
        </p>
      </main>
    </div>
  )
}
