// Bộ icon SVG nhỏ dùng chung
const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const BagIcon = (p) => (
  <svg {...base} {...p}><path d="M6 7h12l1 14H5L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
)
export const PhoneIcon = (p) => (
  <svg {...base} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
)
export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const ArrowLeftIcon = (p) => (
  <svg {...base} {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
)
export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const EditIcon = (p) => (
  <svg {...base} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
)
export const TrashIcon = (p) => (
  <svg {...base} {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
)
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
)
export const LogoutIcon = (p) => (
  <svg {...base} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
)
export const ImageIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
)

export const ZaloIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect width="40" height="40" rx="8" fill="#fff" />
    <text y="28" x="5" fontSize="22" fontWeight="bold" fill="#0068FF" fontFamily="Arial, sans-serif">Z</text>
  </svg>
)

export const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.6 2h-3.4v13.3a2.9 2.9 0 1 1-2-2.8V9a6.4 6.4 0 1 0 5.4 6.3V8.6a8 8 0 0 0 4.4 1.3V6.5a4.5 4.5 0 0 1-4.4-4.5z" />
  </svg>
)

// Hình quả cầu dùng làm placeholder khi sản phẩm chưa có ảnh
export const ShuttleArt = ({ className }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M60 96 34 36q26-12 52 0L60 96z" opacity=".9" />
      <path d="M47 32 60 96l13-64M60 30v66" opacity=".45" />
      <path d="M40 50q20-8 40 0M45 66q15-6 30 0" opacity=".35" />
    </g>
    <circle cx="60" cy="98" r="10" fill="currentColor" opacity=".9" />
  </svg>
)
