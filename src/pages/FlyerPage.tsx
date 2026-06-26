import { useParams, useSearchParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useLang } from '../context/LanguageContext'
import { stores, hotels, categories } from '../data'

export default function FlyerPage() {
  const { storeId } = useParams<{ storeId: string }>()
  const [sp] = useSearchParams()
  const { lang } = useLang()
  const hotelId = sp.get('hotel') ?? ''
  const store = stores.find(s => s.id === storeId)
  const hotel = hotels.find(h => h.id === hotelId)
  const cat = store ? categories.find(c => c.id === store.categoryId) : null
  const walk = store?.walkMinutes[hotelId]
  const detailUrl = window.location.origin + '/hotel-guide/#/store/' + storeId + '?hotel=' + hotelId

  if (!store) return <p>Store not found</p>

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-8">
        <div className="text-center mb-6 pb-4 border-b border-gray-200">
          <div className="text-sm text-gray-500 mb-1">{hotel?.name[lang]} — Area Guide</div>
          <div className="text-4xl mb-2">{cat?.icon}</div>
          <h1 className="text-2xl font-bold text-gray-900">{store.name[lang]}</h1>
          <p className="text-sm text-gray-500 mt-1">{cat?.label[lang]}</p>
        </div>

        <div className="space-y-2 text-sm mb-6">
          <div className="flex gap-2">
            <span className="w-20 text-gray-500 shrink-0">Address</span>
            <span>{store.address[lang]}</span>
          </div>
          {store.phone && (
            <div className="flex gap-2">
              <span className="w-20 text-gray-500 shrink-0">Phone</span>
              <span>{store.phone}</span>
            </div>
          )}
          {store.hours && (
            <div className="flex gap-2">
              <span className="w-20 text-gray-500 shrink-0">Hours</span>
              <span>{store.hours}</span>
            </div>
          )}
          {walk !== undefined && (
            <div className="flex gap-2">
              <span className="w-20 text-gray-500 shrink-0">Walk</span>
              <span>{walk} min from hotel</span>
            </div>
          )}
          {store.priceRange && (
            <div className="flex gap-2">
              <span className="w-20 text-gray-500 shrink-0">Price</span>
              <span className="font-mono">{store.priceRange}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {store.halal && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Halal</span>}
          {store.vegetarian && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Vegetarian</span>}
          {store.languages.length > 1 && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Foreign Language OK</span>}
        </div>

        {store.notes[lang] && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-xs text-amber-900">
            {store.notes[lang]}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">Scan for details</p>
            <QRCodeSVG value={detailUrl} size={100} />
          </div>
          {store.googleMapUrl && (
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Google Maps</p>
              <QRCodeSVG value={store.googleMapUrl} size={80} />
            </div>
          )}
        </div>

        <div className="mt-8 text-center print:hidden">
          <button onClick={() => window.print()} className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700">
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  )
}