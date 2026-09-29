// Dữ liệu mẫu: hiển thị khi chưa cấu hình Firebase, và dùng cho nút "Tạo dữ liệu mẫu" ở trang admin
export const SAMPLE_PRODUCTS = [
  {
    name: 'Áo thi đấu Smash Pro',
    category: 'ao', gender: 'nam', price: 189000, originalPrice: 250000,
    sizes: ['S', 'M', 'L', 'XL'], inStock: true, images: [],
    description: 'Vải thun lạnh co giãn 4 chiều, thấm hút mồ hôi nhanh. Form ôm vừa, thoải mái khi smash và di chuyển.',
  },
  {
    name: 'Áo cầu lông Feather Lady',
    category: 'ao', gender: 'nu', price: 169000,
    sizes: ['XS', 'S', 'M', 'L'], inStock: true, images: [],
    description: 'Thiết kế nữ tính, cổ tròn, vải mè thoáng khí. Phù hợp tập luyện và thi đấu phong trào.',
  },
  {
    name: 'Quần short Court Flex',
    category: 'quan', gender: 'nam', price: 139000,
    sizes: ['M', 'L', 'XL', 'XXL'], inStock: true, images: [],
    description: 'Quần short thể thao có túi khoá kéo, lưng thun co giãn, không cản trở khi lunge.',
  },
  {
    name: 'Váy cầu lông Shuttle Skirt',
    category: 'vay', gender: 'nu', price: 159000, originalPrice: 199000,
    sizes: ['S', 'M', 'L'], inStock: true, images: [],
    description: 'Váy xếp ly có quần trong, vải nhẹ, bay bổng mà vẫn kín đáo khi vận động mạnh.',
  },
  {
    name: 'Bộ đồ đội tuyển Mint Team',
    category: 'bo', gender: 'unisex', price: 299000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true, images: [],
    description: 'Combo áo + quần đồng bộ, nhận in tên/logo đội theo yêu cầu. Liên hệ để đặt số lượng lớn.',
  },
  {
    name: 'Băng cổ tay thấm mồ hôi',
    category: 'phukien', gender: 'unisex', price: 49000,
    sizes: ['Free size'], inStock: false, images: [],
    description: 'Cotton dày, thấm hút tốt, giữ tay khô ráo để cầm vợt chắc hơn.',
  },
]
