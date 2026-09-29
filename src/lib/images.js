// Xử lý ảnh sản phẩm: upload Cloudinary (nếu có cấu hình) hoặc nén thành data URL lưu vào Firestore.
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

// Tag để script dọn ảnh (scripts/cleanup-cloudinary.mjs) chỉ xét ảnh do shop upload
export const CLOUDINARY_TAG = 'coaching-nhu-product'

// Firestore giới hạn 1MB / document → giữ tổng ảnh inline dưới ngưỡng này
export const INLINE_BUDGET = 850 * 1024

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Không đọc được ảnh')) }
    img.src = url
  })
}

async function compressToDataUrl(file, maxSize = 800, quality = 0.72) {
  const img = await loadImage(file)
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}

async function uploadToCloudinary(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('folder', 'coaching-nhu/products')
  form.append('tags', CLOUDINARY_TAG)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error('Upload Cloudinary thất bại')
  const json = await res.json()
  // Tự động tối ưu định dạng/kích thước khi hiển thị
  return json.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1000/')
}

/** Trả về URL (Cloudinary) hoặc data URL đã nén */
export function processImage(file) {
  if (!file.type.startsWith('image/')) return Promise.reject(new Error('File không phải ảnh'))
  return isCloudinaryConfigured ? uploadToCloudinary(file) : compressToDataUrl(file)
}

export function inlineImagesSize(images) {
  return images.filter((s) => s.startsWith('data:')).reduce((sum, s) => sum + s.length, 0)
}
