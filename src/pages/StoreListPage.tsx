import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { hotels, categories } from '../data'
import { useStores } from '../hooks/useStores'
import type { SearchFilters, CategoryId, WalkFilter } from '../types'
import Header from '../components/Header'
import StoreCard from '../components/StoreCard'

export default function StoreListPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [searchParams] = useSearchParams()
  const { lang, t } = useLang()
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(false)
  const hotel = hotels.find(h => h.id === hotelId)

  const [filters, setFilters] = useState<SearchFilters>({
    hotelId: hotelId ?? '',
    categoryId: (searchParams.get('category') as CategoryId) ?? 'all',
    walk: 'all', keyword: '', language: 'any', priceRange: 'any'
  })

  useEffect(() => {
    const cat = searchParams.get('category') as CategoryId | null
    if (cat) setFilters(f => ({ ...f, categoryId: cat }))
  }, [searchParams])

  const results = useStores(filters).sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1
    if (!a.sponsored && b.sponsored) return 1
    if (a.recommended && !b.recommended) return -1
    if (!a.recommended && b.recommended) return 1
    return (a.walkMinutes[hotelId!] ?? 99) - (b.walkMinutes[hotelId!] ?? 99)
  })

  if (!hotel) { navigate('/'); return null }

  const curCat = categories.find(c => c.id === filters.categoryId)
  const backPath = '/hotel/' + hotelId

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBack backTo={backPath} backLabel={t('backToCategories')} />
      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold text-gray-900">
              {curCat ? curCat.icon + ' ' + curCat.label[lang] : t('allCategories')}
            </h1>
            <p className="text-xs text-gray-500">{hotel.name[lang]}</p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white' : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-gray-600 border border-gray-200'}>
            <SlidersHorizontal size={15} />{t('search')}
          </button>
        </div>

        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder={t('searchPlaceholder')} value={filters.keyword}
              onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            {filters.keyword && (
              <button onClick={() => setFilters(f => ({ ...f, keyword: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={15} />
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">{t('walkFilter')}</label>
                <div className="flex flex-wrap gap-2">
                  {(['all', '5', '10', '15'] as WalkFilter[]).map(w => (
                    <button key={w} onClick={() => setFilters(f => ({ ...f, walk: w }))}
                      className={filters.walk === w ? 'px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white' : 'px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600'}>
                      {w === 'all' ? t('walkAll') : w === '5' ? t('walk5') : w === '10' ? t('walk10') : t('walk15')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">{t('categories')}</label>
                <select value={filters.categoryId} onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value as any }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                  <option value="all">{t('allCategories')}</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label[lang]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">{t('language')}</label>
                <select value={filters.language} onChange={e => setFilters(f => ({ ...f, language: e.target.value as any }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                  <option value="any">{t('anyLanguage')}</option>
                  <option value="en">English</option>
                  <option value="zh-TW">繁體中文</option>
                  <option value="ko">한국어</option>
                  <option value="tl">Filipino</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mb-3">{results.length}件</p>

        {results.length === 0
          ? <div className="text-center py-20 text-gray-400"><div className="text-4xl mb-3">🔍</div><p>{t('noResults')}</p></div>
          : <div className="grid gap-4">{results.map(s => <StoreCard key={s.id} store={s} hotelId={hotelId!} />)}</div>
        }
      </main>
    </div>
  )
}