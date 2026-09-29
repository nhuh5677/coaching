import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import ProductImage from '../../components/ProductImage'
import { CloseIcon, TikTokIcon, ZaloIcon } from '../../components/Icons'
import { useToast } from '../../components/Toast'
import { CONTACT } from '../../lib/config'
import { formatPrice, formatUsd } from '../../lib/format'
import { copyOrderMessage } from '../../lib/buy'

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

const CHANNELS = [
  {
    key: 'zalo',
    name: 'Zalo',
    title: 'Mua qua Zalo',
    sub: `Chat Zalo ${CONTACT.phone}`,
    href: CONTACT.zalo,
    Icon: () => <ZaloIcon size={22} />,
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    title: 'Mua qua TikTok',
    sub: `Nhắn tin ${CONTACT.tiktokHandle}`,
    href: CONTACT.tiktok,
    Icon: () => <TikTokIcon size={20} />,
  },
]

function BuySheet({ product, size, onClose }) {
  const toast = useToast()

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
          <div><p className="s-kicker">Đặt hàng</p><h2 id="buy-title">Chọn kênh liên hệ</h2></div>
          <button type="button" className="s-sheet-close" onClick={onClose} aria-label="Đóng"><CloseIcon /></button>
        </div>

        <div className="s-sheet-product">
          <div className="s-sheet-thumb">
            <ProductImage src={product.images?.[0]} alt="" />
          </div>
          <div className="s-sheet-info">
            <p className="s-sheet-name">{product.name}</p>
            <p className="s-sheet-meta">
              {size && <span className="s-sheet-size">Size {size}</span>}
              <b>{formatPrice(product.price)}</b>
              <span className="s-usd">{formatUsd(product.price)}</span>
            </p>
          </div>
        </div>

        <div className="s-sheet-options">
          {CHANNELS.map(({ key, name, title, sub, href, Icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`s-channel s-channel-${key}`}
              onClick={() => { copyOrderMessage(product, size, toast, name); onClose() }}
            >
              <span className="s-channel-icon"><Icon /></span>
              <span className="s-channel-text">
                <b>{title}</b>
                <small>{sub}</small>
              </span>
              <span className="s-channel-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>

        <p className="s-sheet-note">Thông tin đơn hàng sẽ được sao chép tự động — bạn chỉ cần dán vào tin nhắn và gửi.</p>
      </div>
    </div>
  )
}
