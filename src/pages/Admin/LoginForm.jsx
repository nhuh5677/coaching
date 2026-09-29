import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authErrorMessage } from '../../lib/useAuth'
import { ShuttleArt } from '../../components/Icons'

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onLogin(email, password)
    } catch (err) {
      setError(authErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-center">
      <form className="admin-card login-card" onSubmit={submit}>
        <ShuttleArt className="login-art" />
        <p className="section-tag">Khu vực quản trị</p>
        <h1 className="admin-title">Đăng nhập</h1>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
          />
        </label>
        <label className="field">
          <span>Mật khẩu</span>
          <div className="pw-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button type="button" className="pw-toggle" onClick={() => setShowPw((v) => !v)}>
              {showPw ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', marginTop: 8 }}>
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <Link to="/" className="login-back">← Về trang chủ</Link>
      </form>
    </div>
  )
}
