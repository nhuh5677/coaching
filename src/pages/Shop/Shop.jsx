import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ShopLayout from './ShopLayout'
import ProductCard, { ProductCardSkeleton } from './ProductCard'
import ProductImage from '../../components/ProductImage'
import { SearchIcon, ShuttleArt } from '../../components/Icons'
import { CATEGORIES } from '../../lib/config'
import { useProducts } from '../../lib/useProducts'
import { useLang } from '../../i18n'

const SORT_KEYS = ['new', 'price-asc', 'price-desc']

function Hero({ products, onPick }) {
  const { t, price, pick } = useLang()
  // Ưu tiên sản phẩm còn hàng & có ảnh để trưng bày
  const showcase = useMemo(() => {
    const ok = products.filter((p) => p.inStock !== false)
    return [...ok.filter((p) => p.images?.length), ...ok.filter((p) => !p.images?.length)].slice(0, 3)
  }, [products])

  return (
    <section className="s-hero">
      <div className="s-hero-text">
        <p className="s-kicker">{t('shop.hero.kicker')}</p>
        <h1 className="s-hero-title">
          {t('shop.hero.title1')}<br />
          <em>{t('shop.hero.title2')}</em>
        </h1>
        <p className="s-hero-sub">{t('shop.hero.sub')}</p>
        <div className="s-hero-ctas">
          <button type="button" className="s-btn s-btn-ink s-btn-lg" onClick={() => onPick('all')}>
            {t('shop.hero.explore')}
          </button>
          <button type="button" className="s-btn s-btn-ghost s-btn-lg" onClick={() => onPick('nam')}>{t('gender.nam')}</button>
          <button type="button" className="s-btn s-btn-ghost s-btn-lg" onClick={() => onPick('nu')}>{t('gender.nu')}</button>
        </div>
      </div>

      <div className={`s-hero-gallery n-${Math.max(showcase.length, 1)}`}>
        {showcase.map((p, i) => {
          const { main, alt } = price(p.price)
          return (
            <Link key={p.id} to={`/shop/${p.id}`} className={`s-hg-item s-hg-${i + 1}`}>
              <ProductImage src={p.images?.[0]} alt={pick(p, 'name')} eager />
              <span className="s-hg-caption">
                <span>{pick(p, 'name')}</span>
                <b>{main} <i>{alt}</i></b>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default function Shop() {
  const { products, loading, error } = useProducts()
  const { t } = useLang()
  // Bộ lọc lưu trên URL để chia sẻ link & giữ nguyên khi bấm Back
  const [params, setParams] = useSearchParams()
  const gender = params.get('gender') || 'all'
  const category = params.get('cat') || 'all'
  const sort = params.get('sort') || 'new'
  // Ô tìm kiếm giữ state riêng (gõ mượt, không mất ký tự tiếng Việt), đồng bộ lên URL sau 300ms
  const [q, setQ] = useState(() => params.get('q') || '')
  const gridRef = useRef(null)

  useEffect(() => { document.title = t('shop.docTitle') }, [t])

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  useEffect(() => {
    if (q === (params.get('q') || '')) return
    const t = setTimeout(() => setParam('q', q, ''), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const pickGender = (g) => {
    setParam('gender', g, 'all')
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = products.filter((p) =>
      (gender === 'all' || p.gender === gender || p.gender === 'unisex')
      && (category === 'all' || p.category === category)
      && (!term || p.name?.toLowerCase().includes(term) || p.nameEn?.toLowerCase().includes(term)))
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    // Hàng còn trước, hết hàng xuống cuối
    return [...list].sort((a, b) => (a.inStock === false) - (b.inStock === false))
  }, [products, gender, category, sort, q])

  const usedCategories = useMemo(
    () => Object.keys(CATEGORIES).filter((c) => products.some((p) => p.category === c)),
    [products],
  )

  return (
    <ShopLayout>
      <Hero products={products} onPick={pickGender} />

      <ul className="s-values">
        {t('shop.values').map((v, i) => (
          <li key={v.title}>
            <span className="s-values-no">0{i + 1}</span>
            <div><b>{v.title}</b><span>{v.text}</span></div>
          </li>
        ))}
      </ul>

      <section className="s-catalog" ref={gridRef}>
        <div className="s-catalog-head">
          <div>
            <p className="s-kicker">{t('shop.catalog.kicker')}</p>
            <h2 className="s-h2">{t(`shop.catalog.${gender === 'nam' ? 'men' : gender === 'nu' ? 'women' : 'all'}`)}</h2>
          </div>
          {!loading && (
            <p className="s-count">{t(filtered.length === 1 ? 'shop.catalog.countOne' : 'shop.catalog.count', { n: filtered.length })}</p>
          )}
        </div>

        <div className="s-toolbar">
          <div className="s-seg" role="tablist" aria-label={t('shop.catalog.genderLabel')}>
            {['all', 'nam', 'nu'].map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={gender === key}
                className={`${gender === key ? 'active' : ''} seg-${key}`}
                onClick={() => setParam('gender', key, 'all')}
              >
                {t(`shop.catalog.tabs.${key}`)}
              </button>
            ))}
          </div>

          <label className="s-search">
            <SearchIcon />
            <input type="search" placeholder={t('shop.catalog.search')} value={q} onChange={(e) => setQ(e.target.value)} />
          </label>

          <select className="s-sort" value={sort} onChange={(e) => setParam('sort', e.target.value, 'new')} aria-label={t('shop.catalog.sortLabel')}>
            {SORT_KEYS.map((k) => <option key={k} value={k}>{t(`shop.catalog.sort.${k}`)}</option>)}
          </select>
        </div>

        {usedCategories.length > 1 && (
          <div className="s-cats">
            <button type="button" className={category === 'all' ? 'active' : ''} onClick={() => setParam('cat', 'all', 'all')}>
              {t('shop.catalog.allCats')}
            </button>
            {usedCategories.map((c) => (
              <button key={c} type="button" className={category === c ? 'active' : ''} onClick={() => setParam('cat', c, 'all')}>
                {t(`category.${c}`)}
              </button>
            ))}
          </div>
        )}

        {error ? (
          <div className="s-empty">
            <p>{t('shop.catalog.error')}</p>
            <small>{error.message}</small>
          </div>
        ) : (
          <>
            <div className="s-grid">
              {loading
                ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
                : filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
            {!loading && filtered.length === 0 && (
              <div className="s-empty">
                <ShuttleArt className="s-empty-art" />
                <p>{products.length ? t('shop.catalog.noMatch') : t('shop.catalog.empty')}</p>
                {products.length > 0 && (
                  <button type="button" className="s-btn s-btn-outline" onClick={() => { setQ(''); setParams({}, { replace: true }) }}>
                    {t('shop.catalog.clear')}
                  </button>
                )}
              </div>
            )}
          </>
        )}
        {!loading && gender !== 'all' && filtered.length > 0 && (
          <p className="s-note">{t('shop.catalog.note', { gender: t(`gender.${gender}`) })}</p>
        )}
      </section>
    </ShopLayout>
  )
}
