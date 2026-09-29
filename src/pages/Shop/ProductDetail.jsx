import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ShopLayout from './ShopLayout'
import ProductCard from './ProductCard'
import ProductImage from '../../components/ProductImage'
import { BagIcon, PhoneIcon, ShuttleArt } from '../../components/Icons'
import { useToast } from '../../components/Toast'
import { CATEGORIES, CONTACT, GENDERS } from '../../lib/config'
import { discountPercent, formatPrice, formatUsd } from '../../lib/format'
import { useProduct, useProducts } from '../../lib/useProducts'
import { useBuy } from './BuySheet'

function Gallery({ images, name }) {
  const [index, setIndex] = useState(0)
  const list = images?.length ? images : [null]
  const i = Math.min(index, list.length - 1)
  const go = (d) => setIndex((i + d + list.length) % list.length)

  return (
    <div className="s-gallery">
      <div className="s-gallery-main">
        <ProductImage key={`${i}-${list[i] ? list[i].slice(-24) : 'none'}`} src={list[i]} alt={name} eager />
        {list.length > 1 && (
          <>
            <button type="button" className="s-gal-nav prev" onClick={() => go(-1)} aria-label="Ảnh trước">‹</button>
            <button type="button" className="s-gal-nav next" onClick={() => go(1)} aria-label="Ảnh sau">›</button>
            <span className="s-gal-count">{i + 1}/{list.length}</span>
          </>
        )}
      </div>
      {list.length > 1 && (
        <div className="s-thumbs">
          {list.map((src, idx) => (
            <button
              key={idx}
              type="button"
              className={idx === i ? 'active' : ''}
              onClick={() => setIndex(idx)}
              aria-label={`Ảnh ${idx + 1}`}
            >
              <ProductImage src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Related({ product }) {
  const { products } = useProducts()
  const related = useMemo(
    () => products
      .filter((p) => p.id !== product.id && p.inStock !== false
        && (p.gender === product.gender || p.gender === 'unisex' || p.category === product.category))
      .slice(0, 4),
    [products, product],
  )
  if (!related.length) return null
  return (
    <section className="s-related">
      <div className="s-catalog-head"><div><p className="s-kicker">Gợi ý</p><h2 className="s-h2">Có thể bạn sẽ thích</h2></div></div>
      <div className="s-grid">
        {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}

// ShopLayout chứa BuyProvider → phần nội dung phải nằm bên trong để dùng được useBuy()
export default function ProductDetail() {
  return <ShopLayout><DetailContent /></ShopLayout>
}

function DetailContent() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const [size, setSize] = useState(null)
  const toast = useToast()
  const openBuy = useBuy()

  useEffect(() => { setSize(null) }, [id])
  useEffect(() => {
    if (product) document.title = `${product.name} — Huỳnh Như Badminton Shop`
  }, [product])

  if (loading) {
    return <div className="s-loading"><span className="s-spinner" /></div>
  }

  if (error || !product) {
    return (
        <div className="s-empty" style={{ padding: '80px 16px' }}>
          <ShuttleArt className="s-empty-art" />
          <p>{error ? 'Không tải được sản phẩm.' : 'Sản phẩm không tồn tại hoặc đã bị xoá.'}</p>
          <Link to="/shop" className="s-btn s-btn-ink">Quay lại shop</Link>
        </div>
    )
  }

  const off = discountPercent(product.price, product.originalPrice)
  const soldOut = product.inStock === false
  const needSize = product.sizes?.length > 1 && !size

  const onBuy = () => {
    if (needSize) {
      toast('Vui lòng chọn size trước khi đặt hàng.', 'error')
      document.querySelector('.s-sizes')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    openBuy(product, size || product.sizes?.[0] || null)
  }

  const BuyButton = ({ className = '' }) => (soldOut ? (
    <button type="button" className={`s-btn s-btn-disabled ${className}`} disabled>Tạm hết hàng</button>
  ) : (
    <button type="button" className={`s-btn s-btn-ink ${className}`} onClick={onBuy}>
      <BagIcon /> Mua ngay
    </button>
  ))

  return (
    <>
      <div className="s-detail">
        <nav className="s-crumbs" aria-label="breadcrumb">
          <Link to="/shop">Shop</Link>
          <span>/</span>
          {product.category && <><Link to={`/shop?cat=${product.category}`}>{CATEGORIES[product.category]}</Link><span>/</span></>}
          <b>{product.name}</b>
        </nav>

        <div className="s-detail-grid">
          <Gallery images={product.images} name={product.name} />

          <div className="s-info">
            <div className="s-info-tags">
              <p className="s-kicker">
                {CATEGORIES[product.category] || 'Sản phẩm'}
                {product.gender && <><span className="s-dot" />{GENDERS[product.gender]}</>}
              </p>
            </div>
            <h1 className="s-info-name">{product.name}</h1>

            <div className="s-info-price">
              <strong className={off > 0 ? 'is-sale' : ''}>{formatPrice(product.price)}</strong>
              <span className="s-usd s-usd-lg">{formatUsd(product.price)}</span>
              {off > 0 && (
                <>
                  <s>{formatPrice(product.originalPrice)}</s>
                  <span className="s-tag s-tag-sale">−{off}%</span>
                </>
              )}
            </div>
            {off > 0 && <p className="s-save">Tiết kiệm {formatPrice(product.originalPrice - product.price)}</p>}

            <p className={`s-stock ${soldOut ? 'out' : 'in'}`}>
              <span /> {soldOut ? 'Tạm hết hàng' : 'Còn hàng'}
            </p>

            {product.sizes?.length > 0 && (
              <div className="s-sizes">
                <div className="s-label-row">
                  <p className="s-label">Kích cỡ{size ? <> — <b>{size}</b></> : ''}</p>
                </div>
                <div className="s-size-options">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={size === s ? 'active' : ''}
                      onClick={() => setSize(s)}
                      disabled={soldOut}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="s-size-hint">Chưa chắc về size? Gửi chiều cao và cân nặng qua Zalo hoặc TikTok để được tư vấn.</p>
              </div>
            )}

            <div className="s-info-actions">
              <BuyButton className="s-btn-lg s-btn-grow" />
              <a href={CONTACT.tel} className="s-btn s-btn-icon" aria-label={`Gọi ${CONTACT.phone}`} title={`Gọi ${CONTACT.phone}`}>
                <PhoneIcon />
              </a>
            </div>

            <ol className="s-steps" aria-label="Cách đặt hàng">
              <li><b>01</b><span>Chọn kích cỡ phù hợp</span></li>
              <li><b>02</b><span>Bấm “Mua ngay”, chọn Zalo hoặc TikTok</span></li>
              <li><b>03</b><span>Dán thông tin đơn đã sao chép và gửi</span></li>
            </ol>

            {product.description && (
              <div className="s-desc">
                <p className="s-label">Mô tả</p>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>

        <Related product={product} />
      </div>

      {/* Thanh mua hàng dính dưới màn hình (mobile) */}
      <div className="s-buybar">
        <div className="s-buybar-price">
          <strong className={off > 0 ? 'is-sale' : ''}>{formatPrice(product.price)} <small>{formatUsd(product.price)}</small></strong>
          <span>{size ? `Size ${size}` : product.sizes?.length > 1 ? 'Chưa chọn size' : product.name}</span>
        </div>
        <BuyButton />
      </div>
    </>
  )
}
