import { USD_RATE } from './config'

const vndFormatters = {
  vi: new Intl.NumberFormat('vi-VN'),
  en: new Intl.NumberFormat('en-US'),
}
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

const isEmpty = (v) => v == null || v === '' || Number.isNaN(Number(v))

/** 189000 → "189.000₫" (vi) / "189,000₫" (en) */
export function formatVnd(value, lang = 'vi') {
  if (isEmpty(value)) return ''
  return `${(vndFormatters[lang] || vndFormatters.vi).format(Number(value))}₫`
}

/** Giữ tên cũ cho trang admin (luôn tiếng Việt) */
export const formatPrice = (value) => formatVnd(value, 'vi')

/** Giá VNĐ quy đổi sang USD theo USD_RATE, VD 189000 → "$7.27" */
export function formatUsd(vndValue) {
  if (isEmpty(vndValue)) return ''
  return usd.format(Number(vndValue) / USD_RATE)
}

export function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round((1 - price / originalPrice) * 100)
}
