// Thông tin liên hệ & danh mục dùng chung cho toàn site
export const CONTACT = {
  phone: '0918887581',
  zalo: 'https://zalo.me/0918887581',
  tel: 'tel:+84918887581',
  tiktok: 'https://www.tiktok.com/@daycaulong_hn',
  tiktokHandle: '@daycaulong_hn',
  facebook: 'https://www.facebook.com/profile.php?id=61581019289410',
  facebookName: 'Huỳnh Như Badminton Academy',
}

// Tỉ giá quy đổi để hiện giá USD song song (1 USD = ? VNĐ). Cập nhật khi tỉ giá thay đổi.
export const USD_RATE = 26000

export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

export const GENDERS = {
  nam: 'Nam',
  nu: 'Nữ',
  unisex: 'Unisex',
}

export const CATEGORIES = {
  ao: 'Áo',
  quan: 'Quần',
  vay: 'Váy',
  bo: 'Bộ quần áo',
  phukien: 'Phụ kiện',
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
