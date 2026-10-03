# HLV Cầu Lông Huỳnh Như — Website + Shop

React (Vite) + Firebase (Firestore + Authentication), deploy lên GitHub Pages.

| Trang | Đường dẫn | Mô tả |
|---|---|---|
| Home | `/` | Thông tin HLV (giữ nguyên giao diện cũ) + nút **Shop** trên thanh menu |
| Shop | `/shop` | Lưới sản phẩm, lọc Nam/Nữ, loại, tìm kiếm, sắp xếp giá |
| Chi tiết | `/shop/:id` | Ảnh, giá, chọn size, nút **Mua qua Zalo** |
| Admin | `/admin` | Đăng nhập → thêm / sửa / xoá sản phẩm, bật tắt còn hàng |

> Nút **Mua ngay** mở bảng chọn kênh: **Zalo** (`0918887581`) hoặc **TikTok** (`@daycaulong_hn`), đồng thời tự copy sẵn nội dung đặt hàng (tên SP, size, giá, link) để khách dán vào tin nhắn rồi gửi.
> Giá USD được quy đổi tự động từ giá VNĐ theo `USD_RATE`.
>
> **Đa ngôn ngữ (VI / EN):** nút chọn ngôn ngữ ở góc phải thanh menu. Mặc định tiếng Việt; khách bấm EN thì cả web chuyển sang tiếng Anh, **giá USD hiển thị chính** (VI thì VNĐ chính). Lựa chọn được ghi nhớ trên trình duyệt; có thể gửi link thẳng bản tiếng Anh bằng `?lang=en` (VD `.../shop?lang=en`).
> Sửa câu chữ trên web: `src/i18n/vi.js` (tiếng Việt) và `src/i18n/en.js` (tiếng Anh).
> Tên / mô tả sản phẩm tiếng Anh: nhập ở ô **"Tên tiếng Anh"**, **"Mô tả tiếng Anh"** trong form admin (bỏ trống thì hiện bản tiếng Việt).
> Đổi số điện thoại, link TikTok, Facebook, tỉ giá USD: sửa `src/lib/config.js`.

---

## 1. Chạy thử trên máy

```bash
npm install
npm run dev
```

Mở http://localhost:5173. Khi chưa cấu hình Firebase, shop hiện **dữ liệu mẫu** để xem giao diện.

---

## 2. Tạo Firebase (làm 1 lần, ~10 phút)

### 2.1. Tạo project
1. Vào https://console.firebase.google.com → **Add project** → đặt tên (VD `coaching-nhu`) → có thể tắt Google Analytics → **Create**.

### 2.2. Tạo Web App & lấy config
1. Trong project → biểu tượng **`</>`** (Web) → đặt tên app → **Register app** (không cần tick Hosting).
2. Firebase hiện đoạn `firebaseConfig = {...}`. Copy từng giá trị vào file **`.env`** ở thư mục gốc:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=coaching-nhu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=coaching-nhu
VITE_FIREBASE_STORAGE_BUCKET=coaching-nhu.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_ADMIN_EMAILS=email-admin-cua-ban@gmail.com
```

> Các giá trị này **không phải bí mật** (Firebase web config vốn là public), commit `.env` lên GitHub không sao. Dữ liệu được bảo vệ bằng Firestore Rules ở bước 2.4.

### 2.3. Bật đăng nhập & tạo tài khoản admin
1. Menu trái **Build → Authentication** → **Get started**.
2. Tab **Sign-in method** → chọn **Email/Password** → bật **Enable** → **Save**.
3. Tab **Users** → **Add user** → nhập email + mật khẩu admin (email này phải trùng `VITE_ADMIN_EMAILS`).
4. (Khuyến nghị) Tab **Settings → User actions** → **bỏ tick "Enable create (sign-up)"** để người lạ không tự tạo tài khoản được.

### 2.4. Tạo Firestore Database & dán Rules
1. Menu trái **Build → Firestore Database** → **Create database**.
2. Chọn location **`asia-southeast1` (Singapore)** → chọn **Production mode** → **Create**.
3. Mở file `firestore.rules` trong project, **đổi `admin@example.com` thành email admin của bạn**.
4. Trong Firestore → tab **Rules** → xoá hết nội dung cũ → dán toàn bộ nội dung `firestore.rules` → **Publish**.

### 2.5. Thử
```bash
npm run dev
```
Vào http://localhost:5173/admin → đăng nhập → bấm **Tạo dữ liệu mẫu** hoặc **Thêm sản phẩm**. Mở `/shop` sẽ thấy sản phẩm cập nhật ngay.

---

## 3. (Tuỳ chọn, khuyến nghị) Lưu ảnh bằng Cloudinary — miễn phí

Mặc định ảnh upload được **nén (~100–150KB/ảnh) và lưu thẳng vào Firestore** — chạy được ngay, đủ cho shop nhỏ (mỗi sản phẩm ~5 ảnh).
Nếu shop có nhiều sản phẩm/ảnh, nên dùng Cloudinary để trang tải nhanh hơn (Firebase Storage giờ yêu cầu gói trả phí nên không dùng):

1. Đăng ký https://cloudinary.com (free, không cần thẻ).
2. Dashboard → copy **Cloud name**.
3. **Settings (⚙️) → Upload → Upload presets → Add upload preset** → **Signing mode: Unsigned** → Save → copy tên preset.
4. Điền vào `.env`:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=ten-cloud
   VITE_CLOUDINARY_UPLOAD_PRESET=ten-preset
   ```

Ngoài ra trong form admin luôn có thể **dán link ảnh** (https://...) thay vì upload.

---

## 4. Deploy lên GitHub Pages

Đã có sẵn workflow `.github/workflows/deploy.yml`: mỗi lần push lên `main` sẽ tự build & deploy.

1. **Quan trọng — làm trước khi push:** vào repo trên GitHub → **Settings → Pages** → mục **Build and deployment → Source** chọn **GitHub Actions**.
   (Nếu vẫn để "Deploy from a branch", GitHub sẽ phục vụ file source chưa build → trang trắng.)
2. Commit & push:
   ```bash
   git add .
   git commit -m "Chuyển sang React + thêm Shop & Admin"
   git push
   ```
3. Xem tiến trình ở tab **Actions**. Xong sẽ chạy tại `https://<username>.github.io/<tên-repo>/`
   (VD: https://nhuh5677.github.io/coaching/, trang admin: https://nhuh5677.github.io/coaching/admin).

> Workflow tự lấy tên repo làm đường dẫn gốc, nên đổi tên repo vẫn chạy đúng.
> Nếu dùng tên miền riêng / repo `<username>.github.io`: sửa dòng `VITE_BASE` trong workflow thành `/`.

---

## Cấu trúc thư mục

```
src/
  pages/
    Home/        Trang HLV (Home.jsx, HeroCanvas.jsx — sân 3D three.js, home.css)
    Shop/        Shop.jsx (lưới), ProductDetail.jsx, ProductCard.jsx, shop.css
    Admin/       Admin.jsx (kiểm tra đăng nhập), LoginForm, Dashboard, ProductForm, admin.css
  components/    SiteNav, Toast, Icons, ProductImage
  lib/
    config.js    SĐT Zalo, TikTok, Facebook, tỉ giá USD, danh mục, size  ← sửa thông tin shop ở đây
  i18n/          vi.js, en.js — toàn bộ câu chữ 2 ngôn ngữ; index.jsx — context đổi ngôn ngữ
    firebase.js  Khởi tạo Firebase
    products.js  Đọc/ghi Firestore
    images.js    Upload Cloudinary / nén ảnh
    useAuth.js   Đăng nhập admin
firestore.rules  Quy tắc bảo mật (dán vào Firebase Console)
```

## Cấu trúc dữ liệu Firestore — collection `products`

| Trường | Kiểu | Ví dụ |
|---|---|---|
| `name` | string | "Áo thi đấu Smash Pro" |
| `nameEn` | string | "Smash Pro Match Jersey" (tuỳ chọn) |
| `category` | `ao` \| `quan` \| `vay` \| `bo` \| `phukien` | "ao" |
| `gender` | `nam` \| `nu` \| `unisex` | "nam" |
| `price` | number | 189000 |
| `originalPrice` | number \| null | 250000 (giá gốc để hiện % giảm) |
| `sizes` | string[] | ["S","M","L"] |
| `images` | string[] | link ảnh, ảnh đầu là ảnh bìa |
| `description` | string | |
| `descriptionEn` | string | bản tiếng Anh (tuỳ chọn) |
| `inStock` | boolean | true |
| `createdAt`, `updatedAt` | timestamp | |
