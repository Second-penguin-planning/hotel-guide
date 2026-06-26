import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Star, Tag, Hotel, Store, ChevronDown, ChevronUp } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { stores as initialStores, hotels, categories } from '../data'
import type { Store } from '../types'
import Header from '../components/Header'
import Badge from '../components/Badge'

export default function AdminPage() {
  const { lang, t } = useLang()
  const [stores, setStores] = useState<Store[]>(initialStores)
  const [expandedStore, setExpandedStore] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'stores' | 'hotels'>('stores')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setStores((prev) => prev.filter((s) => s.id !== id))
    setDeleteConfirm(null)
  }

  const toggleRecommended = (id: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === id ? { ...s, recommended: !s.recommended } : s))
    )
  }

  const toggleSponsored = (id: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === id ? { ...s, sponsored: !s.sponsored } : s))
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBack backTo="/" />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">⚙️ {t('admin')}</h1>
          <div className="flex gap-2">
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab('stores')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'stores' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Store size={15} />
                {t('stores')}
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'hotels' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Hotel size={15} />
                {t('hotels')}
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'stores' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{stores.length} stores</p>
              <button className="flex items-center gap-1.5 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
                <Plus size={15} />
                {t('addStore')}
              </button>
            </div>

            <div className="space-y-3">
              {stores.map((store) => {
                const cat = categories.find((c) => c.id === store.categoryId)
                const isExpanded = expandedStore === store.id
                return (
                  <div key={store.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedStore(isExpanded ? null : store.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl">{cat?.icon}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{store.name[lang]}</p>
                          <p className="text-xs text-gray-500 truncate">{store.address[lang]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {store.recommended && <Badge variant="orange">⭐</Badge>}
                        {store.sponsored && <Badge variant="purple">🏷️</Badge>}
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-3">
                        {/* Walk times */}
                        <div className="flex flex-wrap gap-2 text-xs">
                          {hotels.map((h) => (
                            <span key={h.id} className="px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600">
                              {h.name[lang]}: {store.walkMinutes[h.id] ?? '-'} min
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleRecommended(store.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              store.recommended
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Star size={13} />
                            {t('recommended')}
                          </button>
                          <button
                            onClick={() => toggleSponsored(store.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              store.sponsored
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Tag size={13} />
                            {t('sponsored')}
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            <Edit2 size={13} />
                            {t('editStore')}
                          </button>
                          {deleteConfirm === store.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(store.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                              >
                                確認
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                {t('cancel')}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(store.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={13} />
                              {t('deleteStore')}
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/store/${store.id}?hotel=${hotels[0].id}`}
                            className="text-xs text-brand-600 hover:underline"
                          >
                            → {t('storeDetail')}
                          </Link>
                          <Link
                            to={`/store/${store.id}/flyer?hotel=${hotels[0].id}`}
                            target="_blank"
                            className="text-xs text-brand-600 hover:underline"
                          >
                            → {t('printFlyer')}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {activeTab === 'hotels' && (
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-gray-900 mb-1">{hotel.name[lang]}</h2>
                    <p className="text-sm text-gray-500 mb-1">📍 {hotel.address[lang]}</p>
                    <p className="text-sm text-gray-500">📞 {hotel.phone}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      lat: {hotel.lat}, lng: {hotel.lng}
                    </p>
                  </div>
                  <button className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium shrink-0">
                    <Edit2 size={14} />
                    Edit
                  </button>
                </div>
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-4 text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors">
              <Plus size={18} />
              Add Hotel
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
