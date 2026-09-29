import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../lib/useProducts'
import { deleteProduct, seedSampleProducts, setProductStock } from '../../lib/products'
import { CATEGORIES, GENDERS } from '../../lib/config'
import { formatPrice } from '../../lib/format'
import { useToast } from '../../components/Toast'
import ProductImage from '../../components/ProductImage'
import { EditIcon, LogoutIcon, PlusIcon, SearchIcon, TrashIcon } from '../../components/Icons'
import ProductForm from './ProductForm'
import ConfirmDialog from './ConfirmDialog'

export default function Dashboard({ user, onLogout }) {
  const { products, loading, error } = useProducts()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [gender, setGender] = useState('all')
  const [editing, setEditing] = useState(null) // null | 'new' | product
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const stats = useMemo(() => ({
    total: products.length,
    nam: products.filter((p) => p.gender === 'nam').length,
    nu: products.filter((p) => p.gender === 'nu').length,
    out: products.filter((p) => p.inStock === false).length,
  }), [products])

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return products.filter((p) =>
      (gender === 'all' || p.gender === gender) && (!term || p.name?.toLowerCase().includes(term)))
  }, [products, q, gender])

  const confirmDelete = async () => {
    setBusy(true)
    try {
      await deleteProduct(deleting.id)
      toast(`Đã xoá "${deleting.name}"`)
      setDeleting(null)
    } catch (err) {
      toast('Xoá thất bại: ' + err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const toggleStock = async (p) => {
    try {
      await setProductStock(p.id, p.inStock === false)
      toast(p.inStock === false ? 'Đã chuyển sang Còn hàng' : 'Đã chuyển sang Hết hàng')
    } catch (err) {
      toast('Cập nhật thất bại: ' + err.message, 'error')
    }
  }

  const seed = async () => {
    setBusy(true)
    try {
      await seedSampleProducts()
      toast('Đã tạo 6 sản phẩm mẫu')
    } catch (err) {
      toast('Tạo dữ liệu mẫu thất bại: ' + err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <header className="admin-header">
        <div className="admin-header-left">
          <Link to="/" className="nav-logo">HUỲNH NHƯ ✦</Link>
          <span className="admin-pill">Admin</span>
        </div>
        <div className="admin-header-right">
          <Link to="/shop" className="btn-ghost-sm" target="_blank">Xem shop ↗</Link>
          <span className="admin-user" title={user.email}>{user.email}</span>
          <button type="button" className="btn-ghost-sm" onClick={onLogout} title="Đăng xuất">
            <LogoutIcon /> <span className="hide-sm">Đăng xuất</span>
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-top">
          <div>
            <h1 className="admin-title">Sản phẩm</h1>
            <p className="admin-muted">Thêm, sửa, xoá sản phẩm hiển thị trên shop. Thay đổi cập nhật ngay lập tức.</p>
          </div>
          <button type="button" className="btn-primary" onClick={() => setEditing('new')}>
            <PlusIcon /> Thêm sản phẩm
          </button>
        </div>

        <div className="stats">
          <div className="stat"><span>Tổng</span><strong>{stats.total}</strong></div>
          <div className="stat"><span>Nam</span><strong>{stats.nam}</strong></div>
          <div className="stat"><span>Nữ</span><strong>{stats.nu}</strong></div>
          <div className="stat stat-warn"><span>Hết hàng</span><strong>{stats.out}</strong></div>
        </div>

        <div className="admin-toolbar">
          <label className="admin-search">
            <SearchIcon />
            <input type="search" placeholder="Tìm theo tên..." value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="admin-select" aria-label="Lọc giới tính">
            <option value="all">Tất cả giới tính</option>
            {Object.entries(GENDERS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {error && (
          <p className="form-error">
            Lỗi tải dữ liệu: {error.message}. Kiểm tra lại Firestore đã được tạo và rules đã được publish.
          </p>
        )}

        {loading ? (
          <div className="page-loader" style={{ minHeight: 240 }}><span className="shuttle-spinner" /></div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <p>Chưa có sản phẩm nào.</p>
            <div className="admin-empty-actions">
              <button type="button" className="btn-primary" onClick={() => setEditing('new')}><PlusIcon /> Thêm sản phẩm đầu tiên</button>
              <button type="button" className="btn-outline" onClick={seed} disabled={busy}>Tạo dữ liệu mẫu</button>
            </div>
          </div>
        ) : (
          <div className="admin-list">
            <div className="admin-row admin-row-head">
              <span>Sản phẩm</span><span>Giá</span><span>Giới tính</span><span>Size</span><span>Tình trạng</span><span />
            </div>
            {list.map((p) => (
              <div key={p.id} className="admin-row">
                <div className="admin-prod">
                  <div className="admin-thumb"><ProductImage src={p.images?.[0]} alt="" /></div>
                  <div>
                    <p className="admin-prod-name">{p.name}</p>
                    <p className="admin-prod-cat">{CATEGORIES[p.category] || '—'} · {p.images?.length || 0} ảnh</p>
                  </div>
                </div>
                <div className="admin-price" data-label="Giá">
                  <strong>{formatPrice(p.price)}</strong>
                  {p.originalPrice > p.price && <s>{formatPrice(p.originalPrice)}</s>}
                </div>
                <div data-label="Giới tính"><span className={`badge badge-${p.gender}`}>{GENDERS[p.gender]}</span></div>
                <div className="admin-sizes" data-label="Size">{p.sizes?.join(', ') || '—'}</div>
                <div data-label="Tình trạng">
                  <button
                    type="button"
                    className={`stock-toggle ${p.inStock === false ? 'off' : 'on'}`}
                    onClick={() => toggleStock(p)}
                    title="Bấm để đổi trạng thái"
                  >
                    <span /> {p.inStock === false ? 'Hết hàng' : 'Còn hàng'}
                  </button>
                </div>
                <div className="admin-actions">
                  <Link to={`/shop/${p.id}`} target="_blank" className="icon-btn" title="Xem trên shop">↗</Link>
                  <button type="button" className="icon-btn" title="Sửa" onClick={() => setEditing(p)}><EditIcon /></button>
                  <button type="button" className="icon-btn danger" title="Xoá" onClick={() => setDeleting(p)}><TrashIcon /></button>
                </div>
              </div>
            ))}
            {list.length === 0 && <p className="admin-muted" style={{ padding: 20 }}>Không có sản phẩm phù hợp.</p>}
          </div>
        )}
      </main>

      {editing && (
        <ProductForm
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(isNew) => { toast(isNew ? 'Đã thêm sản phẩm' : 'Đã lưu thay đổi'); setEditing(null) }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Xoá sản phẩm?"
          message={`"${deleting.name}" sẽ bị xoá vĩnh viễn khỏi shop.`}
          confirmText="Xoá"
          danger
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
