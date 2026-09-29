import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/useAuth'
import { isFirebaseConfigured } from '../../lib/firebase'
import { ADMIN_EMAILS } from '../../lib/config'
import LoginForm from './LoginForm'
import Dashboard from './Dashboard'
import './admin.css'

function SetupNotice() {
  return (
    <div className="admin-center">
      <div className="admin-card">
        <p className="section-tag">Chưa cấu hình</p>
        <h1 className="admin-title">Kết nối Firebase</h1>
        <p className="admin-muted">
          Điền thông tin Firebase vào file <code>.env</code> ở thư mục gốc project rồi chạy lại
          <code> npm run dev</code>. Xem hướng dẫn chi tiết trong <code>README.md</code>.
        </p>
        <Link to="/shop" className="btn-outline" style={{ marginTop: 20 }}>Xem shop (dữ liệu mẫu)</Link>
      </div>
    </div>
  )
}

export default function Admin() {
  const { user, loading, isAdmin, login, logout } = useAuth()

  useEffect(() => { document.title = 'Quản trị Shop — HLV Huỳnh Như' }, [])

  if (!isFirebaseConfigured) return <div className="admin"><SetupNotice /></div>

  if (loading) {
    return <div className="admin page-loader"><span className="shuttle-spinner" /></div>
  }

  if (!user) return <div className="admin"><LoginForm onLogin={login} /></div>

  if (!isAdmin) {
    return (
      <div className="admin admin-center">
        <div className="admin-card">
          <p className="section-tag">Không có quyền</p>
          <h1 className="admin-title">Tài khoản không phải admin</h1>
          <p className="admin-muted">
            Bạn đang đăng nhập bằng <b>{user.email}</b>.
            {ADMIN_EMAILS.length === 0 && ' (Chưa khai báo VITE_ADMIN_EMAILS trong file .env)'}
          </p>
          <button type="button" className="btn-outline" style={{ marginTop: 20 }} onClick={logout}>Đăng xuất</button>
        </div>
      </div>
    )
  }

  return <div className="admin"><Dashboard user={user} onLogout={logout} /></div>
}
