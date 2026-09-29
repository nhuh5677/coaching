import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Thanh điều hướng dùng chung.
 * - solid: luôn có nền (trang shop); nếu không, nền chỉ hiện khi cuộn (trang home)
 */
export default function SiteNav({ solid = false, links = null, right = null }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`site-nav${solid ? ' solid' : ''}${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="nav-logo">HUỲNH NHƯ ✦</Link>
      {links}
      <div className="nav-right">{right}</div>
    </nav>
  )
}
