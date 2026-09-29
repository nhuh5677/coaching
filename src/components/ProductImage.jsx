import { useState } from 'react'
import { ShuttleArt } from './Icons'

/** Ảnh sản phẩm có placeholder hình quả cầu khi thiếu ảnh / lỗi tải */
export default function ProductImage({ src, alt, className = '', eager = false }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className={`product-img-fallback ${className}`} role="img" aria-label={alt}>
        <ShuttleArt className="product-img-fallback-art" />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
