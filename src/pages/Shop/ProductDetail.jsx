import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ShopLayout from './ShopLayout'
import ProductCard from './ProductCard'
import ProductImage from '../../components/ProductImage'
import { BagIcon, PhoneIcon, ShuttleArt } from '../../components/Icons'
import { useToast } from '../../components/Toast'
import { CONTACT } from '../../lib/config'
import { discountPercent } from '../../lib/format'
import { useLang } from '../../i18n'
import { useProduct, useProducts } from '../../lib/useProducts'
import { useBuy } from './BuySheet'

function Gallery({ images, name }) {
  const { t } = useLang()
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
            <button type="button" className="s-gal-nav prev" onClick={() => go(-1)} aria-label={t('detail.prev')}>‹</button>
            <button type="button" className="s-gal-nav next" onClick={() => go(1)} aria-label={t('detail.next')}>›</button>
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
              aria-label={t('detail.image', { n: idx + 1 })}
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
  const { t } = useLang()
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
      <div className="s-catalog-head"><div><p className="s-kicker">{t('detail.relatedKicker')}</p><h2 className="s-h2">{t('detail.relatedTitle')}</h2></div></div>
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
  const { t, price, money, pick } = useLang()
  const name = pick(product, 'name')

  useEffect(() => { setSize(null) }, [id])
  useEffect(() => {
    if (product) document.title = t('detail.docTitle', { name })
  }, [product, name, t])

  if (loading) {
    return <div className="s-loading"><span className="s-spinner" /></div>
  }

  if (error || !product) {
    return (
        <div className="s-empty" style={{ padding: '80px 16px' }}>
          <ShuttleArt className="s-empty-art" />
          <p>{error ? t('detail.error') : t('detail.notFound')}</p>
          <Link to="/shop" className="s-btn s-btn-ink">{t('detail.back')}</Link>
        </div>
    )
  }

  const off = discountPercent(product.price, product.originalPrice)
  const soldOut = product.inStock === false
  const needSize = product.sizes?.length > 1 && !size
  const { main, alt } = price(product.price)
  const description = pick(product, 'description')

  const onBuy = () => {
    if (needSize) {
      toast(t('detail.needSize'), 'error')
      document.querySelector('.s-sizes')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    openBuy(product, size || product.sizes?.[0] || null)
  }

  const BuyButton = ({ className = '' }) => (soldOut ? (
    <button type="button" className={`s-btn s-btn-disabled ${className}`} disabled>{t('detail.outOfStock')}</button>
  ) : (
    <button type="button" className={`s-btn s-btn-ink ${className}`} onClick={onBuy}>
      <BagIcon /> {t('card.buy')}
    </button>
  ))

  return (
    <>
      <div className="s-detail">
        <nav className="s-crumbs" aria-label="breadcrumb">
          <Link to="/shop">Shop</Link>
          <span>/</span>
          {product.category && <><Link to={`/shop?cat=${product.category}`}>{t(`category.${product.category}`)}</Link><span>/</span></>}
          <b>{name}</b>
        </nav>

        <div className="s-detail-grid">
          <Gallery images={product.images} name={name} />

          <div className="s-info">
            <div className="s-info-tags">
              <p className="s-kicker">
                {product.category ? t(`category.${product.category}`) : t('card.product')}
                {product.gender && <><span className="s-dot" />{t(`gender.${product.gender}`)}</>}
              </p>
            </div>
            <h1 className="s-info-name">{name}</h1>

            <div className="s-info-price">
              <strong className={off > 0 ? 'is-sale' : ''}>{main}</strong>
              <span className="s-alt s-alt-lg">{alt}</span>
              {off > 0 && (
                <>
                  <s>{money(product.originalPrice)}</s>
                  <span className="s-tag s-tag-sale">−{off}%</span>
                </>
              )}
            </div>
            {off > 0 && <p className="s-save">{t('detail.save', { amount: money(product.originalPrice - product.price) })}</p>}

            <p className={`s-stock ${soldOut ? 'out' : 'in'}`}>
              <span /> {soldOut ? t('detail.outOfStock') : t('detail.inStock')}
            </p>

            {product.sizes?.length > 0 && (
              <div className="s-sizes">
                <div className="s-label-row">
                  <p className="s-label">{t('detail.size')}{size ? <> — <b>{size}</b></> : ''}</p>
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
                <p className="s-size-hint">{t('detail.sizeHint')}</p>
              </div>
            )}

            <div className="s-info-actions">
              <BuyButton className="s-btn-lg s-btn-grow" />
              <a href={CONTACT.tel} className="s-btn s-btn-icon" aria-label={t('detail.call', { phone: CONTACT.phone })} title={t('detail.call', { phone: CONTACT.phone })}>
                <PhoneIcon />
              </a>
            </div>

            <ol className="s-steps" aria-label={t('detail.stepsLabel')}>
              {t('detail.steps').map((step, i) => (
                <li key={i}><b>0{i + 1}</b><span>{step}</span></li>
              ))}
            </ol>

            {description && (
              <div className="s-desc">
                <p className="s-label">{t('detail.description')}</p>
                <p>{description}</p>
              </div>
            )}
          </div>
        </div>

        <Related product={product} />
      </div>

      {/* Thanh mua hàng dính dưới màn hình (mobile) */}
      <div className="s-buybar">
        <div className="s-buybar-price">
          <strong className={off > 0 ? 'is-sale' : ''}>{main} <small>{alt}</small></strong>
          <span>{size ? t('detail.sizeChosen', { size }) : product.sizes?.length > 1 ? t('detail.noSize') : name}</span>
        </div>
        <BuyButton />
      </div>
    </>
  )
}
