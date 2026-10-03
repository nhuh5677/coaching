import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FacebookIcon, ShuttleIcon, TikTokIcon, ZaloIcon } from '../../components/Icons'
import { CONTACT } from '../../lib/config'
import { isFirebaseConfigured } from '../../lib/firebase'
import { BuyProvider } from './BuySheet'
import { useLang } from '../../i18n'
import LangSwitch from '../../components/LangSwitch'
import './shop.css'

function ShopNav() {
  const { t } = useLang()
  return (
    <header className="s-nav">
      <div className="s-logo">
        <Link to="/" className="s-logo-word" title={t('shop.logoTitle')}>HUỲNH NHƯ</Link>
        <span className="s-logo-sep" aria-hidden="true" />
        <span className="s-logo-sub">Badminton Store</span>
      </div>
      <div className="s-nav-right">
        <LangSwitch className="s-lang" />
        <a href={CONTACT.tiktok} target="_blank" rel="noreferrer" className="s-nav-link" title={`TikTok ${CONTACT.tiktokHandle}`}>
          <TikTokIcon size={16} />
          <span>{t('shop.nav.tiktok')}</span>
        </a>
        <a href={CONTACT.facebook} target="_blank" rel="noreferrer" className="s-nav-link" title={`Facebook ${CONTACT.facebookName}`}>
          <FacebookIcon size={16} />
          <span>Facebook</span>
        </a>
        <Link to="/" className="s-nav-learn">
          <ShuttleIcon />
          <span className="s-nav-learn-full">{t('shop.nav.learn')}</span>
          <span className="s-nav-learn-short">{t('shop.nav.learnShort')}</span>
        </Link>
        <a href={CONTACT.zalo} target="_blank" rel="noreferrer" className="s-nav-cta">
          <ZaloIcon size={16} />
          <span>{t('shop.nav.zalo')}</span>
        </a>
      </div>
    </header>
  )
}

export default function ShopLayout({ children }) {
  const { t } = useLang()
  // Shop dùng theme sáng riêng → đổi nền body để khi cuộn quá đà không lộ nền tối
  useEffect(() => {
    document.body.classList.add('theme-shop')
    const meta = document.querySelector('meta[name="theme-color"]')
    const prev = meta?.getAttribute('content')
    meta?.setAttribute('content', '#F7F6F3')
    return () => {
      document.body.classList.remove('theme-shop')
      if (prev) meta?.setAttribute('content', prev)
    }
  }, [])

  return (
    <BuyProvider>
      <div className="shop">
        <div className="s-topbar">
          <span>{t('shop.topbar.order')} <a href={CONTACT.zalo} target="_blank" rel="noreferrer">{CONTACT.phone}</a></span>
          <span className="s-topbar-dot" aria-hidden="true" />
          <span>{t('shop.topbar.tiktok')} <a href={CONTACT.tiktok} target="_blank" rel="noreferrer">{CONTACT.tiktokHandle}</a></span>
          <span className="s-topbar-dot hide-sm" aria-hidden="true" />
          <span className="hide-sm">{t('shop.topbar.advice')}</span>
        </div>
        <ShopNav />
        {!isFirebaseConfigured && (
          <div className="s-demo">{t('shop.demo')}</div>
        )}
        <main className="s-main">{children}</main>

        <footer className="s-footer">
          <div className="s-footer-inner">
            <div className="s-footer-brand">
              <p className="s-footer-logo">HUỲNH NHƯ</p>
              <p className="s-footer-title">{t('shop.footer.title1')} <em>{t('shop.footer.title2')}</em></p>
              <p className="s-footer-sub">{t('shop.footer.sub')}</p>
            </div>
            <div className="s-footer-cols">
              <div>
                <p className="s-footer-h">{t('shop.footer.order')}</p>
                <a href={CONTACT.zalo} target="_blank" rel="noreferrer"><ZaloIcon size={16} /> Zalo {CONTACT.phone}</a>
                <a href={CONTACT.tiktok} target="_blank" rel="noreferrer"><TikTokIcon size={15} /> TikTok {CONTACT.tiktokHandle}</a>
                <a href={CONTACT.facebook} target="_blank" rel="noreferrer"><FacebookIcon size={15} /> {CONTACT.facebookName}</a>
                <a href={CONTACT.tel}>Hotline {CONTACT.phone}</a>
              </div>
              <div>
                <p className="s-footer-h">{t('shop.footer.explore')}</p>
                <Link to="/shop?gender=nam">{t('shop.footer.men')}</Link>
                <Link to="/shop?gender=nu">{t('shop.footer.women')}</Link>
                <Link to="/">{t('shop.footer.classes')}</Link>
              </div>
            </div>
          </div>
          <p className="s-footer-copy">
            <span>© {new Date().getFullYear()} Huỳnh Như Badminton Store</span>
            <span>{t('shop.footer.place')}</span>
          </p>
        </footer>
      </div>
    </BuyProvider>
  )
}
