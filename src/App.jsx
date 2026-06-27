import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useDemo } from './contexts/DemoContext'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ItemDetailPage from './pages/ItemDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookingPage from './pages/BookingPage'
import InfoPage from './pages/InfoPage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardHome from './pages/dashboard/DashboardHome'
import MyItemsPage from './pages/dashboard/MyItemsPage'
import ItemFormPage from './pages/dashboard/ItemFormPage'
import RequestsPage from './pages/dashboard/RequestsPage'
import MyRentalsPage from './pages/dashboard/MyRentalsPage'
import FavoritesPage from './pages/dashboard/FavoritesPage'
import NotificationsPage from './pages/dashboard/NotificationsPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import AdminOverviewPage from './pages/admin/AdminOverviewPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminItemsPage from './pages/admin/AdminItemsPage'
import AdminRentalsPage from './pages/admin/AdminRentalsPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'

function RequireAuth({ children, admin = false }) {
  const { currentUser } = useDemo()
  const location = useLocation()
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (admin && currentUser.role !== 'admin') return <Navigate to="/dashboard" replace />
  if (!admin && currentUser.role === 'admin') return <Navigate to="/admin" replace />
  return children
}

export default function App() {
  return <Routes>
    <Route element={<PublicLayout/>}>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/jelajahi" element={<ExplorePage/>}/>
      <Route path="/barang/:slug" element={<ItemDetailPage/>}/>
      <Route path="/barang/:slug/sewa" element={<RequireAuth><BookingPage/></RequireAuth>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/cara-kerja" element={<InfoPage type="cara"/>}/>
      <Route path="/keamanan" element={<InfoPage type="keamanan"/>}/>
      <Route path="/syarat" element={<InfoPage type="syarat"/>}/>
    </Route>

    <Route path="/dashboard" element={<RequireAuth><DashboardLayout/></RequireAuth>}>
      <Route index element={<DashboardHome/>}/>
      <Route path="barang" element={<MyItemsPage/>}/>
      <Route path="tambah-barang" element={<ItemFormPage/>}/>
      <Route path="barang/:id/edit" element={<ItemFormPage/>}/>
      <Route path="permintaan" element={<RequestsPage/>}/>
      <Route path="penyewaan" element={<MyRentalsPage/>}/>
      <Route path="favorit" element={<FavoritesPage/>}/>
      <Route path="notifikasi" element={<NotificationsPage/>}/>
      <Route path="profil" element={<ProfilePage/>}/>
    </Route>

    <Route path="/admin" element={<RequireAuth admin><DashboardLayout admin/></RequireAuth>}>
      <Route index element={<AdminOverviewPage/>}/>
      <Route path="pengguna" element={<AdminUsersPage/>}/>
      <Route path="barang" element={<AdminItemsPage/>}/>
      <Route path="penyewaan" element={<AdminRentalsPage/>}/>
      <Route path="laporan" element={<AdminReportsPage/>}/>
    </Route>

    <Route path="*" element={<NotFoundPage/>}/>
  </Routes>
}
