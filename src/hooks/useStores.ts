import { useMemo } from 'react'
import { stores } from '../data'
import type { SearchFilters, Store } from '../types'
export function useStores(filters: SearchFilters): Store[] {
  return useMemo(() => stores.filter(s => {
    if (!s.active) return false
    if (!s.hotelIds.includes(filters.hotelId)) return false
    if (filters.categoryId !== 'all' && s.categoryId !== filters.categoryId) return false
    const walk = s.walkMinutes[filters.hotelId] ?? 99
    if (filters.walk === '5' && walk > 5) return false
    if (filters.walk === '10' && walk > 10) return false
    if (filters.walk === '15' && walk > 15) return false
    if (filters.language !== 'any' && !s.languages.includes(filters.language as any)) return false
    if (filters.priceRange !== 'any' && s.priceRange !== filters.priceRange) return false
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const nm = Object.values(s.name).some(n => n.toLowerCase().includes(kw))
      const nt = Object.values(s.notes).some(n => n.toLowerCase().includes(kw))
      if (!nm && !nt) return false
    }
    return true
  }), [filters])
}