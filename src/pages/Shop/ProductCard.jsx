import { Link } from 'react-router-dom'
import ProductImage from '../../components/ProductImage'
import { CATEGORIES, GENDERS } from '../../lib/config'
import { discountPercent, formatPrice, formatUsd } from '../../lib/format'
import { useBuy } from './BuySheet'

const TWO_WEEKS = 14 * 24 * 3600 * 1000

export function isNew(product) {
  const t = product.createdAt?.toMillis?.()
  return Boolean(t && Date.now() - t < TWO_WEEKS)
}

export default function ProductCard({ product, index = 0 }) {
  const openBuy = useBuy()
  const off = discountPercent(product.price, product.originalPrice)
  const soldOut = product.inStock === false
  const [img1, img2] = product.images || []

  return (
    <article
      className={`s-card${soldOut ? ' is-out' : ''}`}
      style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
    >
      <Link to={`/shop/${product.id}`} className="s-card-link" aria-label={product.name}>
        <div className={`s-card-media${img2 ? ' has-alt' : ''}`}>
          <ProductImage src={img1} alt={product.name} className="s-card-img" />
          {img2 && <ProductImage src={img2} alt="" className="s-card-img s-card-img-alt" />}

          <div className="s-card-tags">
            {off > 0 && <span className="s-tag s-tag-sale">−{off}%</span>}
            {isNew(product) && <span className="s-tag s-tag-new">Mới</span>}
            {soldOut && <span className="s-tag s-tag-out">Hết hàng</span>}
          </div>
        </div>

        <div className="s-card-body">
          <p className="s-card-meta">
            {CATEGORIES[product.category] || 'Sản phẩm'}
            {product.gender && <><span className="s-dot" />{GENDERS[product.gender]}</>}
          </p>
          <h3 className="s-card-name">{product.name}</h3>
          <div className="s-price">
            <strong className={off > 0 ? 'is-sale' : ''}>{formatPrice(product.price)}</strong>
            <span className="s-usd">{formatUsd(product.price)}</span>
          </div>
          {off > 0 && <s className="s-was">{formatPrice(product.originalPrice)}</s>}
          {product.sizes?.length > 0 && (
            <p className="s-card-sizes">{product.sizes.join(' · ')}</p>
          )}
        </div>
      </Link>

      <div className="s-card-foot">
        <button
          type="button"
          className="s-btn s-btn-block s-btn-outline"
          disabled={soldOut}
          onClick={() => openBuy(product)}
        >
          {soldOut ? 'Tạm hết hàng' : 'Mua ngay'}
        </button>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="s-card s-skel" aria-hidden="true">
      <div className="s-card-media s-sk" />
      <div className="s-card-body">
        <div className="s-sk s-sk-line" style={{ width: '35%' }} />
        <div className="s-sk s-sk-line" style={{ width: '80%', height: 16 }} />
        <div className="s-sk s-sk-line" style={{ width: '40%', height: 16 }} />
      </div>
    </div>
  )
}
