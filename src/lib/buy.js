/** Nội dung tin nhắn đặt hàng, theo ngôn ngữ khách đang xem */
export function orderMessage(product, size, { lang, t, price, pick }) {
  const url = `${window.location.origin}${import.meta.env.BASE_URL}shop/${product.id}`
  const name = pick(product, 'name')
  // Khách xem tiếng Anh → kèm tên tiếng Việt để shop dễ nhận ra sản phẩm
  const fullName = lang === 'en' && name !== product.name ? `${name} — ${product.name}` : name
  const { main, alt } = price(product.price)
  return [
    t('order.greeting'),
    `• ${fullName}${product.gender ? ` (${t(`gender.${product.gender}`)})` : ''}`,
    size ? `• ${t('order.size')}: ${size}` : null,
    `• ${t('order.price')}: ${main} (~${alt})`,
    `• Link: ${url}`,
  ].filter(Boolean).join('\n')
}

/**
 * Copy nội dung đặt hàng vào clipboard. Zalo/TikTok không hỗ trợ điền sẵn tin nhắn
 * qua link, nên khách chỉ việc dán & gửi. Phải gọi ngay trong sự kiện click
 * (khi trang còn focus) thì trình duyệt mới cho phép.
 */
export function copyText(text) {
  if (!navigator.clipboard?.writeText) return Promise.reject(new Error('Clipboard không khả dụng'))
  return navigator.clipboard.writeText(text)
}
