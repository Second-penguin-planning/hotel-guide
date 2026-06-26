export type Language = 'en' | 'ja' | 'zh-TW' | 'ko' | 'tl'
export type CategoryId = 'restaurant' | 'cafe' | 'convenience' | 'drugstore' | 'atm' | 'hospital' | 'shopping' | 'laundry' | 'taxi' | 'tourist'
export type PriceRange = 'yen' | 'yenyen' | 'yenyenyen' | 'yenyenyenyen'
export type WalkFilter = '5' | '10' | '15' | 'all'
export interface Hotel { id: string; name: Record<Language,string>; address: Record<Language,string>; phone: string; lat: number; lng: number }
export interface Category { id: CategoryId; label: Record<Language,string>; icon: string; color: string }
export interface Store { id: string; hotelIds: string[]; categoryId: CategoryId; name: Record<Language,string>; phone?: string; address: Record<Language,string>; lat: number; lng: number; walkMinutes: Record<string,number>; hours: string; closedDays: Record<Language,string>; priceRange?: string; languages: Language[]; halal: boolean; vegetarian: boolean; sponsored: boolean; recommended: boolean; photos: string[]; googleMapUrl?: string; website?: string; notes: Record<Language,string>; active: boolean }
export interface SearchFilters { hotelId: string; categoryId: CategoryId | 'all'; walk: WalkFilter; keyword: string; language: Language | 'any'; priceRange: string }