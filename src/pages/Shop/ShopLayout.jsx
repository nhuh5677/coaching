import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TikTokIcon, ZaloIcon } from '../../components/Icons'
import { CONTACT } from '../../lib/config'
import { isFirebaseConfigured } from '../../lib/firebase'
import { BuyProvider } from './BuySheet'
import './shop.css'

function ShopNav() {
  return (
    <header className="s-nav">
      <div className="s-logo">
        <Link to="/" className="s-logo-word" title="Về trang giới thiệu HLV">HUỲNH NHƯ</Link>
        <span className="s-logo-sep" aria-hidden="true" />
        <span className="s-logo-sub">Badminton Store</span>
      </div>
      <div className="s-nav-right">
        <a href={CONTACT.tiktok} target="_blank" rel="noreferrer" className="s-nav-link" title={`TikTok ${CONTACT.tiktokHandle}`}>
          <TikTokIcon size={16} />
          <span>TikTok</span>
        </a>
        <a href={CONTACT.zalo} target="_blank" rel="noreferrer" className="s-nav-cta">
          <ZaloIcon size={16} />
          <span>Liên hệ Zalo</span>
        </a>
      </div>
    </header>
  )
}

export default function ShopLayout({ children }) {
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
          <span>Đặt hàng qua Zalo <a href={CONTACT.zalo} target="_blank" rel="noreferrer">{CONTACT.phone}</a></span>
          <span className="s-topbar-dot" aria-hidden="true" />
          <span>TikTok <a href={CONTACT.tiktok} target="_blank" rel="noreferrer">{CONTACT.tiktokHandle}</a></span>
          <span className="s-topbar-dot hide-sm" aria-hidden="true" />
          <span className="hide-sm">Tư vấn chọn size miễn phí</span>
        </div>
        <ShopNav />
        {!isFirebaseConfigured && (
          <div className="s-demo">Đang xem dữ liệu mẫu — chưa kết nối Firebase (xem README).</div>
        )}
        <main className="s-main">{children}</main>

        <footer className="s-footer">
          <div className="s-footer-inner">
            <div className="s-footer-brand">
              <p className="s-footer-logo">HUỲNH NHƯ</p>
              <p className="s-footer-title">Trang phục cầu lông <em>cho người chơi có gu.</em></p>
              <p className="s-footer-sub">Cần tư vấn size hay phối đồ? Liên hệ trực tiếp, shop hỗ trợ bạn chọn sản phẩm phù hợp nhất.</p>
            </div>
            <div className="s-footer-cols">
              <div>
                <p className="s-footer-h">Đặt hàng</p>
                <a href={CONTACT.zalo} target="_blank" rel="noreferrer"><ZaloIcon size={16} /> Zalo {CONTACT.phone}</a>
                <a href={CONTACT.tiktok} target="_blank" rel="noreferrer"><TikTokIcon size={15} /> TikTok {CONTACT.tiktokHandle}</a>
                <a href={CONTACT.tel}>Hotline {CONTACT.phone}</a>
              </div>
              <div>
                <p className="s-footer-h">Khám phá</p>
                <Link to="/shop?gender=nam">Đồ Nam</Link>
                <Link to="/shop?gender=nu">Đồ Nữ</Link>
                <Link to="/">Lớp học cầu lông</Link>
              </div>
            </div>
          </div>
          <p className="s-footer-copy">
            <span>© {new Date().getFullYear()} Huỳnh Như Badminton Store</span>
            <span>Đà Nẵng, Việt Nam</span>
          </p>
        </footer>
      </div>
    </BuyProvider>
  )
}
