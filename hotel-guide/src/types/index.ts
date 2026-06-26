export type Language = 'en' | 'ja' | 'zh-TW' | 'ko' | 'tl'

export interface Hotel {
  id: string
  name: Record<Language, string>
  address: Record<Language, string>
  phone: string
  lat: number
  lng: number
  imageUrl?: string
}

export type CategoryId =
  | 'restaurant'
  | 'cafe'
  | 'convenience'
  | 'drugstore'
  | 'atm'
  | 'hospital'
  | 'shopping'
  | 'laundry'
  | 'taxi'
  | 'tourist'

export interface Category {
  id: CategoryId
  label: Record<Language, string>
  icon: string
  color: string
}

export type PriceRange = '¥' | '¥¥' | '¥¥¥' | '¥¥¥¥'

export interface BusinessHours {
  open: string
  close: string
  closed?: boolean
}

export interface Store {
  id: string
  hotelIds: string[]
  categoryId: CategoryId
  name: Record<Language, string>
  phone?: string
  address: Record<Language, string>
  lat: number
  lng: number
  walkMinutes: Record<string, number>
  hours: string
  closedDays: Record<Language, string>
  priceRange?: PriceRange
  languages: Language[]
  halal: boolean
  vegetarian: boolean
  sponsored: boolean
  recommended: boolean
  photos: string[]
  googleMapUrl?: string
  website?: string
  notes: Record<Language, string>
  active: boolean
}

export interface Advertisement {
  id: string
  storeId: string
  hotelIds: string[]
  imageUrl: string
  linkUrl?: string
  startDate: string
  endDate: string
  active: boolean
}

export type WalkFilter = '5' | '10' | '15' | 'all'

export interface SearchFilters {
  hotelId: string
  categoryId: CategoryId | 'all'
  walk: WalkFilter
  keyword: string
  language: Language | 'any'
  priceRange: PriceRange | 'any'
}
