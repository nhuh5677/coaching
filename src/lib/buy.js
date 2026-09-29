import { GENDERS } from './config'
import { formatPrice, formatUsd } from './format'

export function orderMessage(product, size) {
  const url = `${window.location.origin}${import.meta.env.BASE_URL}shop/${product.id}`
  return [
    'Chào shop, mình muốn đặt:',
    `• ${product.name}${product.gender ? ` (${GENDERS[product.gender]})` : ''}`,
    size ? `• Size: ${size}` : null,
    `• Giá: ${formatPrice(product.price)} (~${formatUsd(product.price)})`,
    `• Link: ${url}`,
  ].filter(Boolean).join('\n')
}

/**
 * Gắn vào onClick của link Zalo/TikTok (không preventDefault → link vẫn mở app).
 * Zalo/TikTok không hỗ trợ điền sẵn tin nhắn qua link, nên copy nội dung đặt hàng
 * vào clipboard để khách chỉ việc dán & gửi. Gọi clipboard ngay trong click
 * (khi trang còn focus) thì trình duyệt mới cho phép.
 */
export function copyOrderMessage(product, size, toast, channel = 'Zalo') {
  const fallback = () => toast?.(`Nhắn ${channel} cho shop kèm tên sản phẩm để đặt hàng nhé!`, 'info')
  if (!navigator.clipboard?.writeText) { fallback(); return }
  navigator.clipboard.writeText(orderMessage(product, size)).then(
    () => toast?.(`Đã copy thông tin sản phẩm — dán vào tin nhắn ${channel} để gửi cho shop nhé!`, 'info'),
    fallback,
  )
}
