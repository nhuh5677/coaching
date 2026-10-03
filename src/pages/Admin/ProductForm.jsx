import { useEffect, useRef, useState } from 'react'
import { createProduct, updateProduct } from '../../lib/products'
import { CATEGORIES, GENDERS, SIZES } from '../../lib/config'
import { INLINE_BUDGET, inlineImagesSize, isCloudinaryConfigured, processImage } from '../../lib/images'
import { CloseIcon, ImageIcon } from '../../components/Icons'
import ProductImage from '../../components/ProductImage'

const EMPTY = {
  name: '',
  nameEn: '',
  category: 'ao',
  gender: 'nam',
  price: '',
  originalPrice: '',
  sizes: ['S', 'M', 'L', 'XL'],
  images: [],
  description: '',
  descriptionEn: '',
  inStock: true,
}

const MAX_IMAGES = 8

export default function ProductForm({ product, onClose, onSaved }) {
  const isNew = !product
  const [form, setForm] = useState(() => (product
    ? { ...EMPTY, ...product, price: product.price ?? '', originalPrice: product.originalPrice ?? '' }
    : EMPTY))
  const [customSize, setCustomSize] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !saving) onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [saving, onClose])

  const toggleSize = (s) => set('sizes', form.sizes.includes(s)
    ? form.sizes.filter((x) => x !== s)
    : [...form.sizes, s].sort((a, b) => orderOf(a) - orderOf(b)))

  const addCustomSize = () => {
    const s = customSize.trim()
    if (s && !form.sizes.includes(s)) set('sizes', [...form.sizes, s])
    setCustomSize('')
  }

  const addFiles = async (files) => {
    const room = MAX_IMAGES - form.images.length
    const list = Array.from(files).slice(0, room)
    if (!list.length) return
    setError('')
    setUploading((n) => n + list.length)
    for (const file of list) {
      try {
        const url = await processImage(file)
        setForm((f) => ({ ...f, images: [...f.images, url] }))
      } catch (err) {
        setError(`${file.name}: ${err.message}`)
      } finally {
        setUploading((n) => n - 1)
      }
    }
  }

  const addImageUrl = () => {
    const url = imageUrl.trim()
    if (!/^https?:\/\//i.test(url)) { setError('Link ảnh phải bắt đầu bằng http:// hoặc https://'); return }
    if (form.images.length >= MAX_IMAGES) return
    set('images', [...form.images, url])
    setImageUrl('')
    setError('')
  }

  const moveImage = (i, dir) => {
    const next = [...form.images]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    set('images', next)
  }

  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i))

  const inlineSize = inlineImagesSize(form.images)
  const overBudget = inlineSize > INLINE_BUDGET

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Vui lòng nhập tên sản phẩm')
    if (form.price === '' || Number(form.price) < 0) return setError('Vui lòng nhập giá hợp lệ')
    if (form.originalPrice !== '' && Number(form.originalPrice) > 0 && Number(form.originalPrice) <= Number(form.price)) {
      return setError('Giá gốc phải lớn hơn giá bán (hoặc để trống nếu không giảm giá)')
    }
    if (overBudget) return setError('Tổng dung lượng ảnh quá lớn, hãy bớt ảnh hoặc dùng link ảnh / Cloudinary')
    setSaving(true)
    try {
      if (isNew) await createProduct(form)
      else await updateProduct(product.id, form)
      onSaved(isNew)
    } catch (err) {
      setError(err.code === 'permission-denied'
        ? 'Không có quyền ghi. Kiểm tra email admin trong firestore.rules đã đúng và đã Publish chưa.'
        : 'Lưu thất bại: ' + err.message)
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}>
      <form className="modal modal-lg" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="pf-title">
        <div className="modal-head">
          <h2 id="pf-title" className="modal-title">{isNew ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} disabled={saving} aria-label="Đóng"><CloseIcon /></button>
        </div>

        <div className="modal-body">
          <label className="field">
            <span>Tên sản phẩm *</span>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="VD: Áo thi đấu Yonex 2026" maxLength={200} autoFocus />
          </label>

          <label className="field">
            <span>Tên tiếng Anh (tuỳ chọn — hiện khi khách chọn EN)</span>
            <input value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} placeholder="VD: Yonex 2026 Match Jersey" maxLength={200} />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Loại</span>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <div className="field">
              <span>Giới tính</span>
              <div className="seg">
                {Object.entries(GENDERS).map(([k, v]) => (
                  <button key={k} type="button" className={form.gender === k ? 'active' : ''} onClick={() => set('gender', k)}>{v}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Giá bán (VNĐ) *</span>
              <input type="number" inputMode="numeric" min="0" step="1000" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="189000" />
            </label>
            <label className="field">
              <span>Giá gốc (nếu đang giảm giá)</span>
              <input type="number" inputMode="numeric" min="0" step="1000" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} placeholder="250000" />
            </label>
          </div>

          <div className="field">
            <span>Size</span>
            <div className="size-checks">
              {[...SIZES, ...form.sizes.filter((s) => !SIZES.includes(s))].map((s) => (
                <button key={s} type="button" className={form.sizes.includes(s) ? 'active' : ''} onClick={() => toggleSize(s)}>{s}</button>
              ))}
              <div className="custom-size">
                <input
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize() } }}
                  placeholder="Size khác (VD: Free size, 38)"
                />
                <button type="button" onClick={addCustomSize}>+</button>
              </div>
            </div>
          </div>

          <div className="field">
            <span>Ảnh sản phẩm ({form.images.length}/{MAX_IMAGES}) — ảnh đầu tiên là ảnh bìa</span>
            <div className="img-grid">
              {form.images.map((src, i) => (
                <div key={src.slice(-40) + i} className="img-item">
                  <ProductImage src={src} alt="" />
                  {i === 0 && <span className="img-cover">Bìa</span>}
                  <div className="img-tools">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="Sang trái">‹</button>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} aria-label="Sang phải">›</button>
                    <button type="button" onClick={() => removeImage(i)} aria-label="Xoá ảnh" className="danger">✕</button>
                  </div>
                </div>
              ))}
              {Array.from({ length: uploading }, (_, i) => (
                <div key={`up${i}`} className="img-item img-loading"><span className="shuttle-spinner" /></div>
              ))}
              {form.images.length + uploading < MAX_IMAGES && (
                <button
                  type="button"
                  className="img-add"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
                >
                  <ImageIcon /> <span>Tải ảnh lên</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
            />
            <div className="url-add">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl() } }}
                placeholder="...hoặc dán link ảnh (https://...)"
              />
              <button type="button" className="btn-ghost-sm" onClick={addImageUrl}>Thêm link</button>
            </div>
            {!isCloudinaryConfigured && inlineSize > 0 && (
              <p className={`hint ${overBudget ? 'hint-error' : ''}`}>
                Ảnh được nén & lưu trong Firestore: {Math.round(inlineSize / 1024)}KB / {Math.round(INLINE_BUDGET / 1024)}KB.
              </p>
            )}
          </div>

          <label className="field">
            <span>Mô tả</span>
            <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Chất liệu, form dáng, hướng dẫn chọn size..." />
          </label>

          <label className="field">
            <span>Mô tả tiếng Anh (tuỳ chọn)</span>
            <textarea rows={3} value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} placeholder="Material, fit, sizing tips..." />
          </label>

          <label className="switch">
            <input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} />
            <span className="switch-track" />
            <span>{form.inStock ? 'Còn hàng' : 'Hết hàng'}</span>
          </label>

          {error && <p className="form-error">{error}</p>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-ghost-sm" onClick={onClose} disabled={saving}>Huỷ</button>
          <button type="submit" className="btn-primary" disabled={saving || uploading > 0}>
            {saving ? 'Đang lưu...' : uploading > 0 ? 'Đang tải ảnh...' : isNew ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  )
}

function orderOf(size) {
  const i = SIZES.indexOf(size)
  return i === -1 ? 99 : i
}
