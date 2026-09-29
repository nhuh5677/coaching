import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { app, isFirebaseConfigured } from './firebase'
import { ADMIN_EMAILS } from './config'

// Auth chỉ dùng ở trang admin → khởi tạo tại đây để shop không phải tải thêm
const auth = app ? getAuth(app) : null

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = đang kiểm tra

  useEffect(() => {
    if (!isFirebaseConfigured) { setUser(null); return }
    return onAuthStateChanged(auth, (u) => setUser(u))
  }, [])

  const isAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))

  return {
    user,
    loading: user === undefined,
    isAdmin,
    login: (email, password) => signInWithEmailAndPassword(auth, email.trim(), password),
    logout: () => signOut(auth),
  }
}

export function authErrorMessage(err) {
  const code = err?.code || ''
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return 'Email hoặc mật khẩu không đúng.'
  if (code.includes('too-many-requests')) return 'Thử sai quá nhiều lần, vui lòng đợi vài phút.'
  if (code.includes('invalid-email')) return 'Email không hợp lệ.'
  if (code.includes('network')) return 'Lỗi mạng, kiểm tra kết nối internet.'
  return 'Đăng nhập thất bại. ' + (err?.message || '')
}
