import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Phone, MapPin, Clock, Globe, ExternalLink, Printer } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useLang } from '../context/LanguageContext'
import { stores, hotels, categories } from '../data'
import Header from '../components/Header'
import Badge from '../components/Badge'

export default function StoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>()
  const [searchParams] = useSearchParams()
  const { lang, t } = useLang()
  const navigate = useNavigate()

  const hotelId = searchParams.get('hotel') ?? ''
  const store = stores.find((s) => s.id === storeId)
  const hotel = hotels.find((h) => h.id === hotelId)
  const category = store ? categories.find((c) => c.id === store.categoryId) : null

  if (!store) {
    navigate('/')
    return null
  }

  const walk = store.walkMinutes[hotelId]
  const pageUrl = window.location.href

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBack backTo={`/hotel/${hotelId}/stores`} backLabel={t('backToList')} />
      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* Hero image */}
        {store.photos[0] ? (
          <div className="rounded-2xl overflow-hidden h-48 mb-4">
            <img src={store.photos[0]} alt={store.name[lang]} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-100 h-32 flex items-center justify-center text-6xl mb-4">
            {category?.icon ?? '🏪'}
          </div>
        )}

        {/* Title */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{category?.icon}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${category?.color}`}>
                  {category?.label[lang]}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{store.name[lang]}</h1>
            </div>
            {store.priceRange && (
              <span className="text-lg font-mono text-gray-500 shrink-0">{store.priceRange}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {walk !== undefined && <Badge variant="blue">🚶 {walk} {t('minutesWalk')}</Badge>}
            {store.recommended && <Badge variant="orange">⭐ {t('recommended')}</Badge>}
            {store.sponsored && <Badge variant="purple">🏷️ {t('sponsored')}</Badge>}
            {store.halal && <Badge variant="green">🌙 {t('halal')}</Badge>}
            {store.vegetarian && <Badge variant="green">🌿 {t('vegetarian')}</Badge>}
          </div>

          {/* Info rows */}
          <div className="space-y-3 text-sm">
            {store.phone && (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400 shrink-0" />
                <a href={`tel:${store.phone}`} className="text-brand-600 hover:underline">
                  {store.phone}
                </a>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
              <span className="text-gray-700">{store.address[lang]}</span>
            </div>
            {store.hours && (
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-gray-400 shrink-0" />
                <span className="text-gray-700">{store.hours}</span>
              </div>
            )}
            {store.closedDays[lang] && store.closedDays[lang] !== 'None' && store.closedDays[lang] !== 'なし' && (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs w-4 shrink-0">✕</span>
                <span className="text-gray-700">{t('closedDays')}: {store.closedDays[lang]}</span>
              </div>
            )}
            {store.languages.length > 0 && (
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-gray-400 shrink-0" />
                <span className="text-gray-700">
                  {t('foreignLanguage')}: {store.languages.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {store.notes[lang] && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-sm text-amber-900">
            <p className="font-semibold mb-1">📝 {t('notes')}</p>
            <p>{store.notes[lang]}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {store.googleMapUrl && (
            <a
              href={store.googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-brand-600 text-white rounded-xl py-3 font-semibold hover:bg-brand-700 transition-colors"
            >
              <MapPin size={18} />
              {t('googleMap')}
            </a>
          )}
          {store.website && (
            <a
              href={store.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={18} />
              {t('website')}
            </a>
          )}
        </div>

        {/* Print Flyer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">🖨️ {t('printFlyer')}</h2>
            <Link
              to={`/store/${storeId}/flyer?hotel=${hotelId}`}
              target="_blank"
              className="flex items-center gap-1.5 text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
            >
              <Printer size={15} />
              {t('printFlyer')}
            </Link>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-gray-500">{t('generateQR')}</p>
            <QRCodeSVG value={pageUrl} size={128} />
            <p className="text-xs text-gray-400 break-all text-center max-w-xs">{pageUrl}</p>
          </div>
        </div>

        {/* Hotel context */}
        {hotel && (
          <p className="text-center text-xs text-gray-400">
            📍 {t('hotels')}: {hotel.name[lang]}
          </p>
        )}
      </main>
    </div>
  )
}
