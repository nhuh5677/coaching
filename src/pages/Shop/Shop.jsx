import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ShopLayout from './ShopLayout'
import ProductCard, { ProductCardSkeleton } from './ProductCard'
import ProductImage from '../../components/ProductImage'
import { SearchIcon, ShuttleArt } from '../../components/Icons'
import { CATEGORIES, GENDERS } from '../../lib/config'
import { formatPrice, formatUsd } from '../../lib/format'
import { useProducts } from '../../lib/useProducts'

const SORTS = {
  new: 'Mới nhất',
  'price-asc': 'Giá thấp → cao',
  'price-desc': 'Giá cao → thấp',
}

const VALUES = [
  { title: 'Chất liệu thể thao', text: 'Thoáng khí, co giãn, nhanh khô' },
  { title: 'Tư vấn size 1–1', text: 'Gửi chiều cao & cân nặng để được gợi ý' },
  { title: 'Đặt hàng linh hoạt', text: 'Qua Zalo hoặc TikTok' },
]

function Hero({ products, onPick }) {
  // Ưu tiên sản phẩm còn hàng & có ảnh để trưng bày
  const showcase = useMemo(() => {
    const ok = products.filter((p) => p.inStock !== false)
    return [...ok.filter((p) => p.images?.length), ...ok.filter((p) => !p.images?.length)].slice(0, 3)
  }, [products])

  return (
    <section className="s-hero">
      <div className="s-hero-text">
        <p className="s-kicker">Badminton Apparel · Đà Nẵng</p>
        <h1 className="s-hero-title">
          Trang phục cầu lông,<br />
          <em>chuẩn từng chuyển động.</em>
        </h1>
        <p className="s-hero-sub">
          Những thiết kế được chọn lọc cho người chơi nghiêm túc — thoáng khí, co giãn,
          đứng form trên sân và chỉn chu ngoài đời thường.
        </p>
        <div className="s-hero-ctas">
          <button type="button" className="s-btn s-btn-ink s-btn-lg" onClick={() => onPick('all')}>
            Khám phá sản phẩm
          </button>
          <button type="button" className="s-btn s-btn-ghost s-btn-lg" onClick={() => onPick('nam')}>Nam</button>
          <button type="button" className="s-btn s-btn-ghost s-btn-lg" onClick={() => onPick('nu')}>Nữ</button>
        </div>
      </div>

      <div className={`s-hero-gallery n-${Math.max(showcase.length, 1)}`}>
        {showcase.map((p, i) => (
          <Link key={p.id} to={`/shop/${p.id}`} className={`s-hg-item s-hg-${i + 1}`}>
            <ProductImage src={p.images?.[0]} alt={p.name} eager />
            <span className="s-hg-caption">
              <span>{p.name}</span>
              <b>{formatPrice(p.price)} <i>{formatUsd(p.price)}</i></b>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Shop() {
  const { products, loading, error } = useProducts()
  // Bộ lọc lưu trên URL để chia sẻ link & giữ nguyên khi bấm Back
  const [params, setParams] = useSearchParams()
  const gender = params.get('gender') || 'all'
  const category = params.get('cat') || 'all'
  const sort = params.get('sort') || 'new'
  // Ô tìm kiếm giữ state riêng (gõ mượt, không mất ký tự tiếng Việt), đồng bộ lên URL sau 300ms
  const [q, setQ] = useState(() => params.get('q') || '')
  const gridRef = useRef(null)

  useEffect(() => { document.title = 'Huỳnh Như Badminton Store' }, [])

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
      && (!term || p.name?.toLowerCase().includes(term)))
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
        {VALUES.map((v, i) => (
          <li key={v.title}>
            <span className="s-values-no">0{i + 1}</span>
            <div><b>{v.title}</b><span>{v.text}</span></div>
          </li>
        ))}
      </ul>

      <section className="s-catalog" ref={gridRef}>
        <div className="s-catalog-head">
          <div>
            <p className="s-kicker">Cửa hàng</p>
            <h2 className="s-h2">{gender === 'nam' ? 'Đồ Nam' : gender === 'nu' ? 'Đồ Nữ' : 'Tất cả sản phẩm'}</h2>
          </div>
          {!loading && <p className="s-count">{filtered.length} sản phẩm</p>}
        </div>

        <div className="s-toolbar">
          <div className="s-seg" role="tablist" aria-label="Giới tính">
            {[['all', 'Tất cả'], ['nam', 'Nam'], ['nu', 'Nữ']].map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={gender === key}
                className={`${gender === key ? 'active' : ''} seg-${key}`}
                onClick={() => setParam('gender', key, 'all')}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="s-search">
            <SearchIcon />
            <input type="search" placeholder="Tìm sản phẩm" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>

          <select className="s-sort" value={sort} onChange={(e) => setParam('sort', e.target.value, 'new')} aria-label="Sắp xếp">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {usedCategories.length > 1 && (
          <div className="s-cats">
            <button type="button" className={category === 'all' ? 'active' : ''} onClick={() => setParam('cat', 'all', 'all')}>
              Tất cả
            </button>
            {usedCategories.map((c) => (
              <button key={c} type="button" className={category === c ? 'active' : ''} onClick={() => setParam('cat', c, 'all')}>
                {CATEGORIES[c]}
              </button>
            ))}
          </div>
        )}

        {error ? (
          <div className="s-empty">
            <p>Không tải được sản phẩm. Vui lòng thử lại sau.</p>
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
                <p>{products.length ? 'Không có sản phẩm phù hợp bộ lọc.' : 'Bộ sưu tập đang được cập nhật. Vui lòng quay lại sau.'}</p>
                {products.length > 0 && (
                  <button type="button" className="s-btn s-btn-outline" onClick={() => { setQ(''); setParams({}, { replace: true }) }}>
                    Xoá bộ lọc
                  </button>
                )}
              </div>
            )}
          </>
        )}
        {!loading && gender !== 'all' && filtered.length > 0 && (
          <p className="s-note">Đang hiện đồ {GENDERS[gender]} và Unisex.</p>
        )}
      </section>
    </ShopLayout>
  )
}
