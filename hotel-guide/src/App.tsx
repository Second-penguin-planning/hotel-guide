import { HashRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import HotelSelectPage from './pages/HotelSelectPage'
import CategoryPage from './pages/CategoryPage'
import StoreListPage from './pages/StoreListPage'
import StoreDetailPage from './pages/StoreDetailPage'
import FlyerPage from './pages/FlyerPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HotelSelectPage />} />
          <Route path="/hotel/:hotelId" element={<CategoryPage />} />
          <Route path="/hotel/:hotelId/stores" element={<StoreListPage />} />
          <Route path="/store/:storeId" element={<StoreDetailPage />} />
          <Route path="/store/:storeId/flyer" element={<FlyerPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  )
}
