// Xoá ảnh Cloudinary "mồ côi": ảnh do shop upload (có tag) nhưng không còn sản phẩm nào dùng
// (sản phẩm đã xoá, ảnh bị gỡ khi sửa, hoặc upload rồi không bấm lưu).
//
// Chạy tự động mỗi đêm bởi .github/workflows/cleanup-images.yml.
// Chạy tay:  node --env-file=.env --env-file=.env.local scripts/cleanup-cloudinary.mjs [--dry-run]
//   (.env.local chứa CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET — không commit file này)

const TAG = 'coaching-nhu-product' // khớp CLOUDINARY_TAG trong src/lib/images.js
const PREFIX = 'coaching-nhu/products/' // khớp folder trong src/lib/images.js (ảnh upload trước khi có tag)
// Bỏ qua ảnh mới upload — có thể admin đang soạn sản phẩm dở
const MIN_AGE_HOURS = Number(process.env.MIN_AGE_HOURS || 24)

const {
  VITE_CLOUDINARY_CLOUD_NAME: CLOUD_NAME,
  VITE_FIREBASE_PROJECT_ID: PROJECT_ID,
  VITE_FIREBASE_API_KEY: FIREBASE_API_KEY,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env
const DRY_RUN = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true'

for (const [k, v] of Object.entries({ CLOUD_NAME, PROJECT_ID, FIREBASE_API_KEY, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET })) {
  if (!v) throw new Error(`Thiếu biến môi trường: ${k}`)
}

const cloudAuth = 'Basic ' + Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64')
const cloudApi = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`

async function getJson(url, init) {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`${init?.method || 'GET'} ${url.split('?')[0]} → ${res.status} ${await res.text()}`)
  return res.json()
}

/** Tất cả URL ảnh đang được sản phẩm dùng (đọc Firestore qua REST — collection products public read) */
async function fetchUsedImageUrls() {
  const urls = new Set()
  let pageToken = ''
  let count = 0
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products`
      + `?pageSize=300&key=${FIREBASE_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
    const json = await getJson(url)
    for (const doc of json.documents || []) {
      count++
      for (const v of doc.fields?.images?.arrayValue?.values || []) {
        if (v.stringValue) urls.add(v.stringValue)
      }
    }
    pageToken = json.nextPageToken || ''
  } while (pageToken)
  console.log(`Firestore: ${count} sản phẩm, ${urls.size} ảnh đang dùng`)
  return urls
}

/** Lấy public_id từ URL Cloudinary: .../upload/<transform>/v123/<public_id>.<ext> */
function publicIdFromUrl(url) {
  const m = url.match(new RegExp(`^https?://res\\.cloudinary\\.com/${CLOUD_NAME}/image/upload/(.+)$`))
  if (!m) return null
  const parts = m[1].split('/')
  const v = parts.findIndex((p) => /^v\d+$/.test(p))
  const rest = v >= 0 ? parts.slice(v + 1) : parts.filter((p) => !/^[a-z]{1,3}_[^/]*$/.test(p))
  return decodeURIComponent(rest.join('/')).replace(/\.[a-z0-9]+$/i, '')
}

async function listResources(path) {
  const all = []
  let cursor = ''
  do {
    const sep = path.includes('?') ? '&' : '?'
    const json = await getJson(
      `${cloudApi}/resources/image/${path}${sep}max_results=500${cursor ? `&next_cursor=${cursor}` : ''}`,
      { headers: { Authorization: cloudAuth } },
    )
    all.push(...json.resources)
    cursor = json.next_cursor || ''
  } while (cursor)
  return all
}

/** Ảnh của shop: có tag, hoặc nằm trong thư mục sản phẩm */
async function fetchShopImages() {
  const byId = new Map()
  for (const r of await listResources(`tags/${TAG}`)) byId.set(r.public_id, r)
  for (const r of await listResources(`upload?prefix=${encodeURIComponent(PREFIX)}`)) byId.set(r.public_id, r)
  console.log(`Cloudinary: ${byId.size} ảnh của shop (tag "${TAG}" hoặc thư mục "${PREFIX}")`)
  return [...byId.values()]
}

async function deleteImages(publicIds) {
  for (let i = 0; i < publicIds.length; i += 100) {
    const params = new URLSearchParams()
    for (const id of publicIds.slice(i, i + 100)) params.append('public_ids[]', id)
    const json = await getJson(`${cloudApi}/resources/image/upload?${params}`, {
      method: 'DELETE',
      headers: { Authorization: cloudAuth },
    })
    for (const [id, status] of Object.entries(json.deleted)) console.log(`  ${status}: ${id}`)
  }
}

// Đọc Firestore trước: nếu lỗi thì dừng luôn, không bao giờ xoá khi chưa biết ảnh nào đang dùng
const usedIds = new Set([...(await fetchUsedImageUrls())].map(publicIdFromUrl).filter(Boolean))
const images = await fetchShopImages()
const cutoff = Date.now() - MIN_AGE_HOURS * 3600 * 1000
const orphans = images.filter((r) => !usedIds.has(r.public_id) && new Date(r.created_at).getTime() < cutoff)

if (!orphans.length) {
  console.log(`Không có ảnh nào cần xoá (chỉ xét ảnh upload quá ${MIN_AGE_HOURS} giờ).`)
} else if (DRY_RUN) {
  console.log(`[DRY RUN] Sẽ xoá ${orphans.length} ảnh:`)
  for (const r of orphans) console.log(`  ${r.public_id}  (${r.created_at}, ${Math.round(r.bytes / 1024)} KB)`)
} else {
  console.log(`Xoá ${orphans.length} ảnh không còn dùng:`)
  await deleteImages(orphans.map((r) => r.public_id))
}
