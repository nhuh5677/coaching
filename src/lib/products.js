import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query,
  serverTimestamp, updateDoc, writeBatch,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { SAMPLE_PRODUCTS } from './sampleProducts'

const COL = 'products'

const demoProducts = SAMPLE_PRODUCTS.map((p, i) => ({ id: `demo-${i + 1}`, ...p }))

/** Lắng nghe realtime danh sách sản phẩm. Trả về hàm huỷ. */
export function subscribeProducts(onData, onError) {
  if (!isFirebaseConfigured) {
    onData(demoProducts)
    return () => {}
  }
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  )
}

/** Lắng nghe realtime 1 sản phẩm. onData(null) nếu không tồn tại. */
export function subscribeProduct(id, onData, onError) {
  if (!isFirebaseConfigured) {
    onData(demoProducts.find((p) => p.id === id) || null)
    return () => {}
  }
  return onSnapshot(
    doc(db, COL, id),
    (snap) => onData(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    onError,
  )
}

function clean(data) {
  return {
    name: data.name.trim(),
    nameEn: (data.nameEn || '').trim(),
    category: data.category,
    gender: data.gender,
    price: Number(data.price) || 0,
    originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
    sizes: data.sizes || [],
    images: data.images || [],
    description: (data.description || '').trim(),
    descriptionEn: (data.descriptionEn || '').trim(),
    inStock: data.inStock !== false,
  }
}

export function createProduct(data) {
  return addDoc(collection(db, COL), {
    ...clean(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function updateProduct(id, data) {
  return updateDoc(doc(db, COL, id), { ...clean(data), updatedAt: serverTimestamp() })
}

export function setProductStock(id, inStock) {
  return updateDoc(doc(db, COL, id), { inStock, updatedAt: serverTimestamp() })
}

export function deleteProduct(id) {
  return deleteDoc(doc(db, COL, id))
}

export async function seedSampleProducts() {
  const batch = writeBatch(db)
  SAMPLE_PRODUCTS.forEach((p) => {
    batch.set(doc(collection(db, COL)), {
      ...clean(p),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })
  await batch.commit()
}
