import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Tag, Trash2, Edit2, ChevronDown, ChevronUp, Plus, X, Save } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { stores as initialStores, hotels, categories } from '../data'
import type { Store, CategoryId } from '../types'
import Header from '../components/Header'
import Badge from '../components/Badge'

const emptyStore = (): Store => ({
  id: 'store-' + Date.now(),
  hotelIds: [hotels[0].id],
  categoryId: 'restaurant',
  name: { en: '', ja: '', 'zh-TW': '', ko: '', tl: '' },
  address: { en: '', ja: '', 'zh-TW': '', ko: '', tl: '' },
  lat: 34.708, lng: 135.496,
  walkMinutes: {},
  hours: '',
  closedDays: { en: 'None', ja: 'なし', 'zh-TW': '無', ko: '없음', tl: 'Wala' },
  languages: ['en'],
  halal: false, vegetarian: false, sponsored: false, recommended: false,
  photos: [], notes: { en: '', ja: '', 'zh-TW': '', ko: '', tl: '' },
  active: true,
})

interface FormProps {
  store: Store
  onSave: (s: Store) => void
  onClose: () => void
}

function StoreForm({ store, onSave, onClose }: FormProps) {
  const [form, setForm] = useState<Store>({ ...store })
  const set = (key: keyof Store, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">店舗情報</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">カテゴリー</label>
            <select value={form.categoryId} onChange={e => set('categoryId', e.target.value as CategoryId)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label.ja}</option>)}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">店名</label>
            <div className="space-y-2">
              {(['en', 'ja'] as const).map(l => (
                <div key={l} className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400 w-6 shrink-0">{l}</span>
                  <input value={form.name[l]} onChange={e => set('name', { ...form.name, [l]: e.target.value })}
                    placeholder={'店名 (' + l + ')'}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">住所</label>
            <div className="space-y-2">
              {(['en', 'ja'] as const).map(l => (
                <div key={l} className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400 w-6 shrink-0">{l}</span>
                  <input value={form.address[l]} onChange={e => set('address', { ...form.address, [l]: e.target.value })}
                    placeholder={'住所 (' + l + ')'}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Phone & Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">電話</label>
              <input value={form.phone ?? ''} onChange={e => set('phone', e.target.value)}
                placeholder="06-XXXX-XXXX"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">営業時間</label>
              <input value={form.hours} onChange={e => set('hours', e.target.value)}
                placeholder="9:00-22:00"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
          </div>

          {/* Walk minutes */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">徒歩時間（分）</label>
            <div className="flex gap-3">
              {hotels.map(h => (
                <div key={h.id} className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 truncate">{h.name.ja}</p>
                  <input type="number" min="1" max="60"
                    value={form.walkMinutes[h.id] ?? ''}
                    onChange={e => set('walkMinutes', { ...form.walkMinutes, [h.id]: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Price & Google Map */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">価格帯</label>
              <select value={form.priceRange ?? ''} onChange={e => set('priceRange', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="">-</option>
                <option value="¥">¥</option><option value="¥¥">¥¥</option>
                <option value="¥¥¥">¥¥¥</option><option value="¥¥¥¥">¥¥¥¥</option>
              </select>
            </div>
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.recommended} onChange={e => set('recommended', e.target.checked)} className="rounded" />
                おすすめ
              </label>
              <label className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.sponsored} onChange={e => set('sponsored', e.target.checked)} className="rounded" />
                スポンサー
              </label>
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.halal} onChange={e => set('halal', e.target.checked)} className="rounded" />
              🌙 ハラール
            </label>
            <label className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.vegetarian} onChange={e => set('vegetarian', e.target.checked)} className="rounded" />
              🌿 ベジタリアン
            </label>
          </div>

          {/* Google Map URL */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Google Map URL</label>
            <input value={form.googleMapUrl ?? ''} onChange={e => set('googleMapUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>

          {/* Website */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">ホームページ</label>
            <input value={form.website ?? ''} onChange={e => set('website', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">備考 (EN)</label>
            <textarea value={form.notes.en} onChange={e => set('notes', { ...form.notes, en: e.target.value })}
              rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">備考 (JA)</label>
            <textarea value={form.notes.ja} onChange={e => set('notes', { ...form.notes, ja: e.target.value })}
              rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button onClick={() => onSave(form)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white rounded-xl py-3 font-semibold hover:bg-red-700 transition-colors">
            <Save size={18} />保存
          </button>
          <button onClick={onClose}
            className="flex items-center justify-center gap-2 px-6 bg-gray-100 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-200 transition-colors">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { lang } = useLang()
  const [stores, setStores] = useState<Store[]>(initialStores)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<Store | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const toggle = (id: string, key: 'recommended' | 'sponsored') =>
    setStores(prev => prev.map(s => s.id === id ? { ...s, [key]: !s[key] } : s))

  const saveStore = (s: Store) => {
    setStores(prev => {
      const idx = prev.findIndex(x => x.id === s.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = s; return next }
      return [...prev, s]
    })
    setEditTarget(null)
    setShowAddForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBack backTo="/" />
      {(editTarget || showAddForm) && (
        <StoreForm
          store={editTarget ?? emptyStore()}
          onSave={saveStore}
          onClose={() => { setEditTarget(null); setShowAddForm(false) }}
        />
      )}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">⚙️ 管理画面</h1>
          <button onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
            <Plus size={15} />店舗追加
          </button>
        </div>

        <div className="space-y-3">
          {stores.map(store => {
            const cat = categories.find(c => c.id === store.categoryId)
            const open = expanded === store.id
            return (
              <div key={store.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(open ? null : store.id)}>
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
                    {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {open && (
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {hotels.map(h => (
                        <span key={h.id} className="px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600">
                          {h.name[lang]}: {store.walkMinutes[h.id] ?? '-'} 分
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => toggle(store.id, 'recommended')}
                        className={store.recommended ? 'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-100 text-orange-700' : 'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-600'}>
                        <Star size={13} />おすすめ
                      </button>
                      <button onClick={() => toggle(store.id, 'sponsored')}
                        className={store.sponsored ? 'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-700' : 'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-600'}>
                        <Tag size={13} />スポンサー
                      </button>
                      <button onClick={() => setEditTarget(store)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Edit2 size={13} />編集
                      </button>
                      {delConfirm === store.id ? (
                        <>
                          <button onClick={() => { setStores(p => p.filter(s => s.id !== store.id)); setDelConfirm(null) }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 text-white">確認</button>
                          <button onClick={() => setDelConfirm(null)}
                            className="px-3 py-1.5 rounded-lg text-xs bg-white border border-gray-200 text-gray-600">キャンセル</button>
                        </>
                      ) : (
                        <button onClick={() => setDelConfirm(store.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 size={13} />削除
                        </button>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Link to={'/store/' + store.id + '?hotel=' + hotels[0].id} className="text-xs text-red-600 hover:underline">→ 店舗詳細</Link>
                      <Link to={'/store/' + store.id + '/flyer?hotel=' + hotels[0].id} target="_blank" className="text-xs text-red-600 hover:underline">→ チラシ</Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          ※ 現在はメモリ上のデータです。本番環境ではデータベースに保存されます。
        </p>
      </main>
    </div>
  )
}