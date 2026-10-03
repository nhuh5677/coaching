import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { formatUsd, formatVnd } from '../lib/format'
import vi from './vi'
import en from './en'

const DICTS = { vi, en }
export const LANGS = ['vi', 'en']
const STORAGE_KEY = 'lang'

function detectLang() {
  // Ưu tiên: ?lang=en trên URL → lựa chọn khách đã bấm lần trước → mặc định tiếng Việt.
  // Không đoán theo ngôn ngữ trình duyệt vì nhiều người Việt dùng trình duyệt tiếng Anh.
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (LANGS.includes(fromUrl)) return fromUrl
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(saved)) return saved
  } catch { /* localStorage có thể bị chặn */ }
  return 'vi'
}

function lookup(dict, key) {
  return key.split('.').reduce((obj, k) => (obj == null ? obj : obj[k]), dict)
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detectLang)

  const setLang = useCallback((next) => {
    setLangState(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* bỏ qua */ }
  }, [])

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const value = useMemo(() => {
    /** t('shop.hero.title', { n: 3 }) — thiếu bản dịch thì lấy tiếng Việt */
    const t = (key, vars) => {
      let v = lookup(DICTS[lang], key)
      if (v == null) v = lookup(vi, key)
      if (v == null) return key
      if (typeof v === 'string' && vars) {
        v = v.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`))
      }
      return v
    }

    /** Giá chính theo ngôn ngữ (EN → USD, VI → VNĐ) */
    const money = (vndValue) => (lang === 'en' ? formatUsd(vndValue) : formatVnd(vndValue, lang))
    /** { main, alt }: giá chính + giá phụ để hiển thị song song */
    const price = (vndValue) => (lang === 'en'
      ? { main: formatUsd(vndValue), alt: formatVnd(vndValue, lang) }
      : { main: formatVnd(vndValue, lang), alt: formatUsd(vndValue) })

    /** Trường nội dung sản phẩm theo ngôn ngữ, VD pick(p, 'name') → nameEn nếu có */
    const pick = (product, field) => {
      if (!product) return ''
      if (lang === 'en') {
        const en = product[`${field}En`]
        if (typeof en === 'string' && en.trim()) return en
      }
      return product[field] || ''
    }

    return { lang, setLang, t, money, price, pick }
  }, [lang, setLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang phải được dùng bên trong <LangProvider>')
  return ctx
}
