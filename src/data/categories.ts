import type { Category } from '../types'
export const categories: Category[] = [
  { id: 'restaurant', label: { en: 'Restaurant', ja: 'レストラン', 'zh-TW': '餐廳', ko: '레스토랑', tl: 'Restaurant' }, icon: '🍽️', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'cafe', label: { en: 'Cafe', ja: 'カフェ', 'zh-TW': '咖啡廳', ko: '카페', tl: 'Cafe' }, icon: '☕', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'convenience', label: { en: 'Convenience Store', ja: 'コンビニ', 'zh-TW': '便利商店', ko: '편의점', tl: 'Convenience Store' }, icon: '🏪', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'drugstore', label: { en: 'Drug Store', ja: 'ドラッグストア', 'zh-TW': '藥妝店', ko: '드럭스토어', tl: 'Drug Store' }, icon: '💊', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'atm', label: { en: 'ATM', ja: 'ATM', 'zh-TW': 'ATM', ko: 'ATM', tl: 'ATM' }, icon: '🏧', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'hospital', label: { en: 'Hospital', ja: '病院', 'zh-TW': '醫院', ko: '병원', tl: 'Hospital' }, icon: '🏥', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { id: 'shopping', label: { en: 'Shopping', ja: 'ショッピング', 'zh-TW': '購物', ko: '쇼핑', tl: 'Shopping' }, icon: '🛍️', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'laundry', label: { en: 'Laundry', ja: 'コインランドリー', 'zh-TW': '洗衣店', ko: '세탁소', tl: 'Laundry' }, icon: '👕', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { id: 'taxi', label: { en: 'Taxi', ja: 'タクシー', 'zh-TW': '計程車', ko: '택시', tl: 'Taxi' }, icon: '🚕', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'tourist', label: { en: 'Tourist Spot', ja: '観光スポット', 'zh-TW': '觀光景點', ko: '관광지', tl: 'Tourist Spot' }, icon: '🗺️', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
]