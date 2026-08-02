# Hanoi Food Review

Ứng dụng web front-end giúp sinh viên khám phá, đánh giá và lưu lại các quán ăn, quán cà phê tại Hà Nội. Project được xây dựng cho môn **Cơ sở Lập trình Web**, chạy hoàn toàn trong trình duyệt và không cần backend.

## Công nghệ

- HTML5 semantic
- CSS3: Variables, Flexbox, Grid, Media Query
- JavaScript ES6+ và DOM API
- LocalStorage và JSON
- Chart.js, Font Awesome và Google Fonts qua CDN

## Tính năng

- Đăng ký, đăng nhập, đăng xuất và cập nhật hồ sơ.
- Tạo, xem, sửa, xóa, Like, Save và bình luận bài review.
- Tìm kiếm tiếng Việt không dấu, suggestion, lọc kết hợp và sắp xếp.
- CRUD kế hoạch đi quán, deadline, priority, status, Undo và bộ lọc.
- Thống kê review/Task bằng Chart.js.
- Xuất dữ liệu toàn hệ thống hoặc riêng Task thành JSON.
- Responsive desktop/tablet/mobile, keyboard navigation, toast, confirm và fallback ảnh.

## Cấu trúc chính

```text
├── index.html
├── pages/                  # Các trang chức năng
├── assets/
│   ├── css/                # CSS chung và theo module
│   ├── js/                 # JavaScript theo module
│   ├── images/             # Hình ảnh runtime
│   └── report/             # Ảnh minh họa báo cáo
├── docs/                   # Bộ tài liệu báo cáo/bảo vệ
├── PROJECT_STRUCTURE.md
├── HTML_REVIEW.md
├── CSS_STRUCTURE.md
├── JS_STRUCTURE.md
├── SYSTEM_FLOW.md
├── LOCAL_STORAGE.md
├── CRUD_FLOW.md
├── FEATURE_LIST.md
├── IMPROVEMENT_REPORT.md
└── VIVA_QUESTION.md
```

Chi tiết từng file xem [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Cài đặt và chạy

1. Clone hoặc tải project về máy.
2. Mở thư mục bằng Visual Studio Code.
3. Cài extension **Live Server**.
4. Nhấp phải `index.html` → **Open with Live Server**.
5. Truy cập URL Live Server cung cấp, thường là `http://127.0.0.1:5500`.

Không cần `npm install`, database hoặc backend. Nên chạy qua HTTP thay vì mở trực tiếp bằng `file://`.

## Tài khoản demo

| Vai trò | Username | Email | Password |
|---|---|---|---|
| Admin | `admin` | `admin@hanoifood.vn` | `123456` |
| Student | `student` | `student@hanoifood.vn` | `123456` |

## LocalStorage

Dữ liệu gồm User, Current User, Post, Comment, Task, Saved Post ID và Theme. Schema chính xác xem [LOCAL_STORAGE.md](LOCAL_STORAGE.md). Dữ liệu chỉ thuộc origin/browser hiện tại và không phù hợp production.

## Kiểm thử

- Acceptance case: [TEST_CASE.md](TEST_CASE.md)
- Tổng quan kiểm thử thủ công: [docs/08_Testing.md](docs/08_Testing.md)

## Tài liệu báo cáo và bảo vệ

Bắt đầu tại [`docs/01_Project_Overview.md`](docs/01_Project_Overview.md), sau đó đọc lần lượt 10 chương. Bộ câu hỏi vấn đáp nằm tại [VIVA_QUESTION.md](VIVA_QUESTION.md). Những điểm chưa chuẩn nhưng chưa được phép sửa nằm tại [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md).

## Screenshot

- [Desktop](assets/report/desktop-home.png)
- [Tablet](assets/report/tablet-home.png)
- [Mobile](assets/report/mobile-home.png)
- [Responsive preview](assets/report/responsive-preview.png)

## Thành viên

- Phan Hải Yến
- Nguyễn Đắc Mạnh
- Trần Thạch Thiết
- Nguyễn Văn Thiên

## Giới hạn

- Authentication chỉ là mô phỏng phía client; password nằm trong LocalStorage để phục vụ bài tập.
- Chart.js, Font Awesome và Google Fonts cần mạng.
- Ảnh upload dạng dữ liệu cục bộ chịu giới hạn dung lượng LocalStorage.
- Source hiện có chức năng **export JSON**; chưa có luồng import JSON hoàn chỉnh trong JavaScript runtime.

## Giấy phép

Phát hành theo [MIT License](LICENSE).
