import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts (TIDAK di-lazy load agar UI inti cepat muncul)
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Error Page
import ErrorPage from './pages/ErrorPage';

// ==========================================
// MENGGUNAKAN REACT LAZY UNTUK SEMUA HALAMAN
// ==========================================
const Login = lazy(() => import('./pages/auth/Login'));
const DashboardOwner = lazy(() => import('./pages/owner/DashboardOwner'));
const KelolaPakaian = lazy(() => import('./pages/owner/KelolaPakaian'));
const KelolaLayanan = lazy(() => import('./pages/owner/KelolaLayanan'));
const Laporan = lazy(() => import('./pages/owner/Laporan'));
const KelolaPelanggan = lazy(() => import('./pages/karyawan/KelolaPelanggan'));
const InputCucian = lazy(() => import('./pages/karyawan/InputCucian'));
const KelolaNota = lazy(() => import('./pages/karyawan/KelolaNota'));
const DetailNota = lazy(() => import('./pages/karyawan/DetailNota'));

const ProtectedRoute = ({ children, allowedRole }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    const redirectPath = userRole === 'owner' ? '/owner/dashboard' : '/karyawan/input-cucian';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Route Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Route Owner */}
        <Route element={<MainLayout />}>
          <Route path="/owner/*" element={
            <ProtectedRoute allowedRole="owner">
              <Routes>
                <Route path="dashboard" element={<DashboardOwner />} />
                <Route path="kelola-pakaian" element={<KelolaPakaian />} />
                <Route path="kelola-layanan" element={<KelolaLayanan />} />
                <Route path="laporan" element={<Laporan />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Route>

        {/* Route Karyawan */}
        <Route element={<MainLayout />}>
          <Route path="/karyawan/*" element={
            <ProtectedRoute allowedRole="karyawan">
              <Routes>
                <Route path="input-cucian" element={<InputCucian />} />
                <Route path="kelola-pelanggan" element={<KelolaPelanggan />} />
                <Route path="kelola-nota" element={<KelolaNota />} />
                
                {/* UBAH BARIS DI BAWAH INI */}
                <Route path="detail-nota/:id" element={<DetailNota />} /> 
                
              </Routes>
            </ProtectedRoute>
          } />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;