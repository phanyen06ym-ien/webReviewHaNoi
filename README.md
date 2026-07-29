# Hanoi Food Review

> Release **v1.0.0** — 29/07/2026

Ứng dụng web front-end giúp sinh viên khám phá, đánh giá và lưu lại các quán ăn, quán cà phê tại Hà Nội. Dự án được xây dựng cho môn Cơ sở lập trình Web và chạy hoàn toàn trên trình duyệt, không cần backend.

## Mục tiêu

- Thực hành HTML semantic, CSS responsive và JavaScript thuần.
- Xây dựng CRUD hoàn chỉnh với LocalStorage.
- Áp dụng validation, authentication giả lập, tìm kiếm, lọc và trực quan hóa dữ liệu.
- Đảm bảo giao diện dễ sử dụng trên desktop, tablet và mobile.

## Tính năng

- Đăng ký, đăng nhập, đăng xuất và chỉnh sửa hồ sơ.
- Tạo, xem, sửa, xóa, thích và lưu bài review.
- Tìm kiếm không phân biệt dấu, lọc kết hợp và sắp xếp bài viết.
- Quản lý kế hoạch đi quán: CRUD, hoàn thành, tìm kiếm, lọc và sắp xếp.
- Thống kê bài viết, rating, quận, tháng và trạng thái task bằng Chart.js.
- Xuất, nhập, sao lưu và khôi phục dữ liệu JSON.
- Responsive, keyboard navigation, toast, confirm modal và fallback ảnh.

## Công nghệ

- HTML5 semantic
- CSS3, Grid, Flexbox, custom properties
- JavaScript ES6+
- LocalStorage
- Chart.js
- Font Awesome và Google Fonts

## Cấu trúc thư mục

```text
webReviewHaNoi/
├── assets/
│   ├── icons/
│   └── images/
│       ├── avatars/
│       ├── posts/
│       └── restaurants/
├── css/
│   ├── variables.css
│   ├── style.css
│   ├── responsive.css
│   └── *.css
├── js/
│   ├── storage.js
│   ├── validation.js
│   ├── posts.js
│   ├── tasks.js
│   ├── auth.js
│   ├── profile.js
│   ├── statistics.js
│   ├── search.js
│   ├── saved.js
│   ├── export-import.js
│   └── app.js
├── pages/
├── index.html
├── TEST_CASE.md
├── CHANGELOG.md
└── LICENSE
```

`style.css` hiện đóng vai trò base, component và layout dùng chung; các file CSS còn lại chỉ chứa giao diện đặc thù từng trang.

## Hướng dẫn chạy

1. Clone project:

   ```bash
   git clone <repository-url>
   ```

2. Mở thư mục project bằng Visual Studio Code.
3. Cài extension **Live Server**.
4. Nhấp phải `index.html`, chọn **Open with Live Server**.
5. Truy cập địa chỉ Live Server hiển thị, thường là `http://127.0.0.1:5500`.

Không cần cài package, database hoặc backend. Không nên mở trực tiếp bằng `file://` vì một số trình duyệt hạn chế tài nguyên cục bộ.

## Tài khoản demo

| Vai trò | Username  | Password |
| ------- | --------- | -------- |
| Admin   | `admin`   | `123456` |
| Student | `student` | `123456` |

Có thể đăng nhập bằng username hoặc email tương ứng.

## LocalStorage

| Key                       | Nội dung                             |
| ------------------------- | ------------------------------------ |
| `hanoi_food_users`        | Danh sách người dùng                 |
| `hanoi_food_current_user` | Phiên đăng nhập, không chứa password |
| `hanoi_food_posts`        | Bài review                           |
| `hanoi_food_tasks`        | Kế hoạch đi quán                     |
| `hanoi_food_saved_posts`  | ID bài đã lưu                        |
| `hanoi_food_theme`        | Thiết lập giao diện                  |

Dữ liệu mẫu chỉ được seed khi key chưa tồn tại. Clear All ghi mảng rỗng thay vì xóa key để dữ liệu mẫu không tự xuất hiện lại.

## Responsive

Giao diện được thiết kế cho các mốc kiểm thử 320, 375, 390, 414, 768, 992, 1200 và 1440px. Sidebar chuyển thành menu mobile, biểu đồ giữ tỷ lệ và nội dung dài được giới hạn để tránh overflow ngang.

## Screenshots

Các placeholder dưới đây có thể được thay bằng ảnh chụp trước khi thuyết trình:

- Trang chủ: `docs/screenshots/home.png`
- Explore: `docs/screenshots/explore.png`
- Review Detail: `docs/screenshots/review-detail.png`
- Task: `docs/screenshots/tasks.png`
- Profile: `docs/screenshots/profile.png`
- Statistics: `docs/screenshots/statistics.png`

## Thành viên

- Sinh viên: Phan Hai Yen
  Nguyen Dac Manh
  Tran Thach Thiet
  Nguyen Van Thien
- Môn học: Cơ sở lập trình Web

## Known issues

- Không có backend; dữ liệu chỉ tồn tại trong trình duyệt hiện tại.
- Password được lưu dạng rõ trong LocalStorage để phục vụ bài tập, không phù hợp production.
- Upload ảnh chỉ là mô phỏng bằng đường dẫn hoặc dữ liệu cục bộ có giới hạn kích thước.
- Chart.js, Font Awesome và Google Fonts cần kết nối mạng; UI có fallback khi Chart.js không tải.
- Import/export có thể chứa dữ liệu demo và không thay thế cơ chế backup production.

## Giấy phép

Phát hành theo [MIT License](LICENSE).
