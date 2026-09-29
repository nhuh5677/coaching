import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import { ToastProvider } from './components/Toast'

// Shop & admin tải riêng để trang Home nhẹ hơn
const Shop = lazy(() => import('./pages/Shop/Shop'))
const ProductDetail = lazy(() => import('./pages/Shop/ProductDetail'))
const Admin = lazy(() => import('./pages/Admin/Admin'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PageLoader() {
  return (
    <div className="page-loader">
      <span className="shuttle-spinner" aria-label="Đang tải" />
    </div>
  )
}

function NotFound() {
  return (
    <div className="not-found">
      <p className="section-tag">404</p>
      <h1 className="section-title">Cầu ra ngoài sân rồi!</h1>
      <p>Trang bạn tìm không tồn tại.</p>
      <a className="btn-primary" href={import.meta.env.BASE_URL}>Về trang chủ</a>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ToastProvider>
  )
}
