import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../i18n'
import LangSwitch from '../../components/LangSwitch'
import { LESSONS } from './lessons'
import './learn.css'

/** Khung chung của trang tài liệu học: theme xanh sân cầu riêng (sáng/tối theo máy) */
export default function LearnLayout({ done, children }) {
  const { lang, t } = useLang()

  useEffect(() => {
    document.body.classList.add('theme-learn')
    const meta = document.querySelector('meta[name="theme-color"]')
    const prev = meta?.getAttribute('content')
    const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    meta?.setAttribute('content', dark ? '#0E1B17' : '#EEF2EC')
    return () => {
      document.body.classList.remove('theme-learn')
      if (prev) meta?.setAttribute('content', prev)
    }
  }, [])

  const doneCount = LESSONS.filter((l) => done[l.id]).length

  return (
    <div className="learn">
      <header className="ln-top">
        <div className="ln-wrap">
          <Link className="ln-brand" to="/hoc">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M6 8 L18 4 L26 16 L14 22 Z" fill="var(--l-shuttle)" />
              <circle cx="23" cy="22" r="6" fill="var(--l-court)" />
            </svg>
            <span>{t('learn.brand')}</span>
          </Link>
          <nav className="ln-nav" aria-label={t('learn.nav.aria')}>
            <Link to={{ pathname: '/hoc', hash: 'lo-trinh' }} className="hide-sm">{t('learn.nav.roadmap')}</Link>
            <Link to="/" className="hide-sm">{t('learn.nav.coach')}</Link>
            <Link to="/shop" className="hide-sm">{t('learn.nav.shop')}</Link>
            <span className="ln-pill">{t('learn.progress', { n: doneCount, total: LESSONS.length })}</span>
            <LangSwitch className="ln-lang" />
          </nav>
        </div>
      </header>
      {lang !== 'vi' && <p className="ln-lang-note"><span className="ln-wrap">{t('learn.viOnly')}</span></p>}
      {children}
      <footer className="ln-footer">
        <div className="ln-wrap">
          <p>{t('learn.footer.safety')}</p>
          <p>{t('learn.footer.saved')}</p>
          <p><Link to="/">{t('learn.footer.coach')}</Link> · <Link to="/shop">{t('learn.nav.shop')}</Link></p>
        </div>
      </footer>
    </div>
  )
}
