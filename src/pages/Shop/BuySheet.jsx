import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import ProductImage from '../../components/ProductImage'
import { CloseIcon, FacebookIcon, TikTokIcon, ZaloIcon } from '../../components/Icons'
import { useToast } from '../../components/Toast'
import { CONTACT } from '../../lib/config'
import { copyText, orderMessage } from '../../lib/buy'
import { useLang } from '../../i18n'

const BuyContext = createContext(() => {})

/** Bấm "Mua ngay" ở bất kỳ đâu trong shop → mở bảng chọn kênh đặt hàng */
export function BuyProvider({ children }) {
  const [order, setOrder] = useState(null) // { product, size }
  const openBuy = useCallback((product, size = null) => setOrder({ product, size }), [])

  return (
    <BuyContext.Provider value={openBuy}>
      {children}
      {order && <BuySheet {...order} onClose={() => setOrder(null)} />}
    </BuyContext.Provider>
  )
}

export const useBuy = () => useContext(BuyContext)

// Thứ tự hiển thị: Zalo → TikTok → Facebook
const CHANNELS = [
  { key: 'zalo', name: 'Zalo', href: CONTACT.zalo, vars: { phone: CONTACT.phone }, Icon: () => <ZaloIcon size={22} /> },
  { key: 'tiktok', name: 'TikTok', href: CONTACT.tiktok, vars: { handle: CONTACT.tiktokHandle }, Icon: () => <TikTokIcon size={20} /> },
  { key: 'facebook', name: 'Facebook', href: CONTACT.facebook, vars: { name: CONTACT.facebookName }, Icon: () => <FacebookIcon size={22} /> },
]

function BuySheet({ product, size, onClose }) {
  const toast = useToast()
  const i18n = useLang()
  const { t, price, pick } = i18n
  const { main, alt } = price(product.price)

  const choose = (channel) => {
    // Gọi ngay trong click để trình duyệt cho phép ghi clipboard
    copyText(orderMessage(product, size, i18n)).then(
      () => toast(t('sheet.copied', { channel }), 'info'),
      () => toast(t('sheet.copyFailed', { channel }), 'info'),
    )
    onClose()
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="s-sheet-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="s-sheet" role="dialog" aria-modal="true" aria-labelledby="buy-title">
        <div className="s-sheet-handle" aria-hidden="true" />
        <div className="s-sheet-head">
          <div><p className="s-kicker">{t('sheet.kicker')}</p><h2 id="buy-title">{t('sheet.title')}</h2></div>
          <button type="button" className="s-sheet-close" onClick={onClose} aria-label={t('sheet.close')}><CloseIcon /></button>
        </div>

        <div className="s-sheet-product">
          <div className="s-sheet-thumb">
            <ProductImage src={product.images?.[0]} alt="" />
          </div>
          <div className="s-sheet-info">
            <p className="s-sheet-name">{pick(product, 'name')}</p>
            <p className="s-sheet-meta">
              {size && <span className="s-sheet-size">{t('detail.sizeChosen', { size })}</span>}
              <b>{main}</b>
              <span className="s-alt">{alt}</span>
            </p>
          </div>
        </div>

        <div className="s-sheet-options">
          {CHANNELS.map(({ key, name, href, vars, Icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`s-channel s-channel-${key}`}
              onClick={() => choose(name)}
            >
              <span className="s-channel-icon"><Icon /></span>
              <span className="s-channel-text">
                <b>{t(`sheet.${key}Title`)}</b>
                <small>{t(`sheet.${key}Sub`, vars)}</small>
              </span>
              <span className="s-channel-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>

        <p className="s-sheet-note">{t('sheet.note')}</p>
      </div>
    </div>
  )
}
