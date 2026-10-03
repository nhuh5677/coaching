import { Link } from 'react-router-dom'
import ProductImage from '../../components/ProductImage'
import { discountPercent } from '../../lib/format'
import { useLang } from '../../i18n'
import { useBuy } from './BuySheet'

const TWO_WEEKS = 14 * 24 * 3600 * 1000

export function isNew(product) {
  const t = product.createdAt?.toMillis?.()
  return Boolean(t && Date.now() - t < TWO_WEEKS)
}

export default function ProductCard({ product, index = 0 }) {
  const openBuy = useBuy()
  const { t, price, money, pick } = useLang()
  const name = pick(product, 'name')
  const { main, alt } = price(product.price)
  const off = discountPercent(product.price, product.originalPrice)
  const soldOut = product.inStock === false
  const [img1, img2] = product.images || []

  return (
    <article
      className={`s-card${soldOut ? ' is-out' : ''}`}
      style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
    >
      <Link to={`/shop/${product.id}`} className="s-card-link" aria-label={name}>
        <div className={`s-card-media${img2 ? ' has-alt' : ''}`}>
          <ProductImage src={img1} alt={name} className="s-card-img" />
          {img2 && <ProductImage src={img2} alt="" className="s-card-img s-card-img-alt" />}

          <div className="s-card-tags">
            {off > 0 && <span className="s-tag s-tag-sale">−{off}%</span>}
            {isNew(product) && <span className="s-tag s-tag-new">{t('card.isNew')}</span>}
            {soldOut && <span className="s-tag s-tag-out">{t('card.soldOut')}</span>}
          </div>
        </div>

        <div className="s-card-body">
          <p className="s-card-meta">
            {product.category ? t(`category.${product.category}`) : t('card.product')}
            {product.gender && <><span className="s-dot" />{t(`gender.${product.gender}`)}</>}
          </p>
          <h3 className="s-card-name">{name}</h3>
          <div className="s-price">
            <strong className={off > 0 ? 'is-sale' : ''}>{main}</strong>
            <span className="s-alt">{alt}</span>
          </div>
          {off > 0 && <s className="s-was">{money(product.originalPrice)}</s>}
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
          {soldOut ? t('card.outOfStock') : t('card.buy')}
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
