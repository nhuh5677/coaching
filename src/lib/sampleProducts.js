// Dữ liệu mẫu: hiển thị khi chưa cấu hình Firebase, và dùng cho nút "Tạo dữ liệu mẫu" ở trang admin
export const SAMPLE_PRODUCTS = [
  {
    name: 'Áo thi đấu Smash Pro', nameEn: 'Smash Pro Match Jersey',
    category: 'ao', gender: 'nam', price: 189000, originalPrice: 250000,
    sizes: ['S', 'M', 'L', 'XL'], inStock: true, images: [],
    description: 'Vải thun lạnh co giãn 4 chiều, thấm hút mồ hôi nhanh. Form ôm vừa, thoải mái khi smash và di chuyển.',
    descriptionEn: 'Four-way stretch cooling fabric that wicks sweat fast. A tailored-yet-comfortable fit for smashing and moving freely.',
  },
  {
    name: 'Áo cầu lông Feather Lady', nameEn: 'Feather Lady Badminton Tee',
    category: 'ao', gender: 'nu', price: 169000,
    sizes: ['XS', 'S', 'M', 'L'], inStock: true, images: [],
    description: 'Thiết kế nữ tính, cổ tròn, vải mè thoáng khí. Phù hợp tập luyện và thi đấu phong trào.',
    descriptionEn: 'A feminine crew-neck design in breathable mesh fabric. Great for training and club matches.',
  },
  {
    name: 'Quần short Court Flex', nameEn: 'Court Flex Shorts',
    category: 'quan', gender: 'nam', price: 139000,
    sizes: ['M', 'L', 'XL', 'XXL'], inStock: true, images: [],
    description: 'Quần short thể thao có túi khoá kéo, lưng thun co giãn, không cản trở khi lunge.',
    descriptionEn: 'Sport shorts with a zip pocket and stretchy elastic waistband that never holds you back in a lunge.',
  },
  {
    name: 'Váy cầu lông Shuttle Skirt', nameEn: 'Shuttle Pleated Skirt',
    category: 'vay', gender: 'nu', price: 159000, originalPrice: 199000,
    sizes: ['S', 'M', 'L'], inStock: true, images: [],
    description: 'Váy xếp ly có quần trong, vải nhẹ, bay bổng mà vẫn kín đáo khi vận động mạnh.',
    descriptionEn: 'A pleated skirt with built-in shorts — light and flowy, yet secure during intense movement.',
  },
  {
    name: 'Bộ đồ đội tuyển Mint Team', nameEn: 'Mint Team Kit',
    category: 'bo', gender: 'unisex', price: 299000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true, images: [],
    description: 'Combo áo + quần đồng bộ, nhận in tên/logo đội theo yêu cầu. Liên hệ để đặt số lượng lớn.',
    descriptionEn: 'Matching top + shorts set, with custom team name/logo printing available. Contact us for bulk orders.',
  },
  {
    name: 'Băng cổ tay thấm mồ hôi', nameEn: 'Sweat Wristband',
    category: 'phukien', gender: 'unisex', price: 49000,
    sizes: ['Free size'], inStock: false, images: [],
    description: 'Cotton dày, thấm hút tốt, giữ tay khô ráo để cầm vợt chắc hơn.',
    descriptionEn: 'Thick, highly absorbent cotton that keeps your hands dry for a firmer racket grip.',
  },
]
