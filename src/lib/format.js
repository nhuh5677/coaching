import { USD_RATE } from './config'

const vnd = new Intl.NumberFormat('vi-VN')
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function formatPrice(value) {
  if (value == null || value === '' || Number.isNaN(Number(value))) return ''
  return `${vnd.format(Number(value))}₫`
}

/** Giá VNĐ quy đổi sang USD theo USD_RATE, VD 189000 → "$7.27" */
export function formatUsd(vndValue) {
  if (vndValue == null || vndValue === '' || Number.isNaN(Number(vndValue))) return ''
  return usd.format(Number(vndValue) / USD_RATE)
}

export function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round((1 - price / originalPrice) * 100)
}
