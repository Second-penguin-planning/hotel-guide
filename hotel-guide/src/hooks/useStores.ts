import { useMemo } from 'react'
import { stores } from '../data'
import type { SearchFilters, Store } from '../types'

export function useStores(filters: SearchFilters): Store[] {
  return useMemo(() => {
    return stores.filter((store) => {
      if (!store.active) return false

      if (!store.hotelIds.includes(filters.hotelId)) return false

      if (filters.categoryId !== 'all' && store.categoryId !== filters.categoryId) return false

      const walk = store.walkMinutes[filters.hotelId] ?? 99
      if (filters.walk === '5' && walk > 5) return false
      if (filters.walk === '10' && walk > 10) return false
      if (filters.walk === '15' && walk > 15) return false

      if (filters.language !== 'any' && !store.languages.includes(filters.language)) return false

      if (filters.priceRange !== 'any' && store.priceRange !== filters.priceRange) return false

      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase()
        const nameMatch = Object.values(store.name).some((n) => n.toLowerCase().includes(kw))
        const notesMatch = Object.values(store.notes).some((n) => n.toLowerCase().includes(kw))
        if (!nameMatch && !notesMatch) return false
      }

      return true
    })
  }, [filters])
}
