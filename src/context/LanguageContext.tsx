import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Language } from '../types'

type TKey = 'selectHotel'|'selectHotelPrompt'|'allCategories'|'search'|'searchPlaceholder'|'walkFilter'|'walk5'|'walk10'|'walk15'|'walkAll'|'language'|'price'|'anyPrice'|'anyLanguage'|'sponsored'|'recommended'|'halal'|'vegetarian'|'phone'|'address'|'hours'|'closedDays'|'website'|'googleMap'|'printFlyer'|'generateQR'|'backToList'|'backToCategories'|'noResults'|'minutesWalk'|'admin'|'addStore'|'editStore'|'deleteStore'|'save'|'cancel'|'hotels'|'stores'|'categories'|'foreignLanguage'|'notes'|'storeDetail'

type T = Record<TKey,string>
const t_en: T = { selectHotel:'Select Your Hotel',selectHotelPrompt:'Please choose your hotel',allCategories:'All',search:'Search',searchPlaceholder:'Search by name or keyword…',walkFilter:'Walking Distance',walk5:'Within 5 min',walk10:'Within 10 min',walk15:'Within 15 min',walkAll:'All',language:'Foreign Language',price:'Price Range',anyPrice:'Any price',anyLanguage:'Any language',sponsored:'Sponsored',recommended:'Recommended',halal:'Halal',vegetarian:'Vegetarian',phone:'Phone',address:'Address',hours:'Hours',closedDays:'Closed',website:'Website',googleMap:'Google Map',printFlyer:'Print Flyer',generateQR:'Generate QR',backToList:'Back to List',backToCategories:'Back to Categories',noResults:'No results found.',minutesWalk:'min walk',admin:'Admin',addStore:'Add Store',editStore:'Edit Store',deleteStore:'Delete',save:'Save',cancel:'Cancel',hotels:'Hotels',stores:'Stores',categories:'Categories',foreignLanguage:'Foreign Language',notes:'Notes',storeDetail:'Store Details' }
const t_ja: T = { selectHotel:'ホテルを選択',selectHotelPrompt:'ご宿泊のホテルをお選びください',allCategories:'すべて',search:'検索',searchPlaceholder:'店名・キーワードで検索…',walkFilter:'徒歩時間',walk5:'徒歩5分以内',walk10:'徒歩10分以内',walk15:'徒歩15分以内',walkAll:'すべて',language:'外国語対応',price:'価格帯',anyPrice:'価格帯を選択',anyLanguage:'言語を選択',sponsored:'スポンサー',recommended:'おすすめ',halal:'ハラール',vegetarian:'ベジタリアン',phone:'電話番号',address:'住所',hours:'営業時間',closedDays:'定休日',website:'ホームページ',googleMap:'Googleマップ',printFlyer:'チラシ印刷',generateQR:'QRコード',backToList:'一覧に戻る',backToCategories:'カテゴリーに戻る',noResults:'該当する店舗がありません。',minutesWalk:'分',admin:'管理画面',addStore:'店舗追加',editStore:'店舗編集',deleteStore:'削除',save:'保存',cancel:'キャンセル',hotels:'ホテル',stores:'店舗',categories:'カテゴリー',foreignLanguage:'外国語対応',notes:'備考',storeDetail:'店舗詳細' }
const t_zhTW: T = { selectHotel:'選擇飯店',selectHotelPrompt:'請選擇您的入住飯店',allCategories:'全部',search:'搜尋',searchPlaceholder:'以店名或關鍵字搜尋…',walkFilter:'步行距離',walk5:'步行5分鐘內',walk10:'步行10分鐘內',walk15:'步行15分鐘內',walkAll:'全部',language:'外語服務',price:'價格範圍',anyPrice:'不限價格',anyLanguage:'不限語言',sponsored:'贊助',recommended:'推薦',halal:'清真',vegetarian:'素食',phone:'電話',address:'地址',hours:'營業時間',closedDays:'公休日',website:'網站',googleMap:'Google地圖',printFlyer:'列印傳單',generateQR:'產生QR碼',backToList:'返回列表',backToCategories:'返回分類',noResults:'找不到相關結果。',minutesWalk:'分鐘',admin:'管理',addStore:'新增店家',editStore:'編輯店家',deleteStore:'刪除',save:'儲存',cancel:'取消',hotels:'飯店',stores:'店家',categories:'分類',foreignLanguage:'外語服務',notes:'備註',storeDetail:'店家詳情' }
const t_ko: T = { selectHotel:'호텔 선택',selectHotelPrompt:'숙박 호텔을 선택해 주세요',allCategories:'전체',search:'검색',searchPlaceholder:'이름이나 키워드로 검색…',walkFilter:'도보 거리',walk5:'도보 5분 이내',walk10:'도보 10분 이내',walk15:'도보 15분 이내',walkAll:'전체',language:'외국어 대응',price:'가격대',anyPrice:'가격 무관',anyLanguage:'언어 무관',sponsored:'스폰서',recommended:'추천',halal:'할랄',vegetarian:'채식',phone:'전화',address:'주소',hours:'영업시간',closedDays:'휴무일',website:'웹사이트',googleMap:'구글 지도',printFlyer:'전단 인쇄',generateQR:'QR 생성',backToList:'목록으로',backToCategories:'카테고리로',noResults:'결과가 없습니다.',minutesWalk:'분',admin:'관리자',addStore:'가게 추가',editStore:'가게 수정',deleteStore:'삭제',save:'저장',cancel:'취소',hotels:'호텔',stores:'가게',categories:'카테고리',foreignLanguage:'외국어 대응',notes:'비고',storeDetail:'가게 상세' }

const translations: Record<Language,T> = { en: t_en, ja: t_ja, 'zh-TW': t_zhTW, ko: t_ko, tl: t_en }

interface Ctx { lang: Language; setLang: (l: Language) => void; t: (k: TKey) => string }
const LanguageContext = createContext<Ctx | null>(null)
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en')
  const t = (k: TKey) => translations[lang][k] ?? k
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}
export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be inside LanguageProvider')
  return ctx
}