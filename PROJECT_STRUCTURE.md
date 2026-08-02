# Cấu trúc project Hanoi Food Review

## Cây thư mục

```text
webReviewHaNoi/
├── index.html                     # Trang chủ và feed review
├── pages/                         # Các trang chức năng
│   ├── auth.html                  # Đăng nhập và đăng ký hợp nhất
│   ├── login.html                 # Trang chuyển hướng tới auth?mode=login
│   ├── register.html              # Trang chuyển hướng tới auth?mode=register
│   ├── create-post.html           # Form tạo review
│   ├── edit-post.html             # Form sửa review
│   ├── post-detail.html           # Chi tiết review và bình luận
│   ├── my-posts.html              # Review của người dùng hiện tại
│   ├── explore.html               # Tìm kiếm, lọc, sắp xếp review
│   ├── saved.html                 # Review đã lưu
│   ├── tasks.html                 # Quản lý kế hoạch đi quán
│   ├── profile.html               # Hồ sơ người dùng
│   └── statistics.html            # Thống kê và quản lý dữ liệu
├── assets/
│   ├── css/                       # Style chung và style theo trang
│   ├── js/                        # JavaScript thuần theo module
│   ├── images/                    # Logo, avatar, banner, ảnh review
│   └── report/                    # Ảnh minh họa responsive cho báo cáo
├── docs/                          # Tài liệu báo cáo và bảo vệ
├── README.md                      # Hướng dẫn tổng quan
├── TEST_CASE.md                   # Danh sách acceptance test
└── CHANGELOG.md                   # Lịch sử thay đổi
```

## File CSS

| File | Vai trò |
|---|---|
| `variables.css` | Design token: màu, font, khoảng cách, radius và shadow. |
| `style.css` | Reset, layout khung, sidebar, button, card, modal, toast và component chung. |
| `responsive.css` | Media query dùng chung cho desktop, tablet và mobile. |
| `home.css` | Hero, quick post, feed và sidebar trang chủ. |
| `post.css` | Card review, form review, chi tiết, bình luận và My Posts. |
| `explore.css` | Thanh tìm kiếm, bộ lọc, suggestion và trạng thái rỗng. |
| `auth.css` | Trang đăng nhập/đăng ký hợp nhất. |
| `profile.css` | Header, thống kê và form hồ sơ. |
| `tasks.css` | Dashboard, bộ lọc, card và modal Task. |
| `statistics.css` | KPI, chart grid và khu vực quản lý dữ liệu. |

## File JavaScript

| File | Vai trò |
|---|---|
| `storage.js` | Khai báo key, wrapper LocalStorage, seed data, sinh ID, format thời gian và escape HTML. |
| `app.js` | Menu mobile, footer, skeleton, toast, confirm modal, keyboard và Back to Top. |
| `auth.js` | Đăng ký, đăng nhập, đăng xuất, session giả lập, protected page và UI tài khoản. |
| `validation.js` | Validation dùng lại cho Review và Task. |
| `posts.js` | CRUD Review, bình luận, Like, Save, card, chi tiết và form ảnh. |
| `search.js` | Tìm kiếm không dấu, suggestion, lọc và sắp xếp Explore. |
| `saved.js` | Danh sách, tìm kiếm, sắp xếp và bỏ lưu review. |
| `tasks.js` | CRUD Task, undo xóa, trạng thái, tìm kiếm, lọc, sort và thống kê nhanh. |
| `profile.js` | Hiển thị/cập nhật hồ sơ và đồng bộ tác giả trong post/comment. |
| `statistics.js` | Tổng hợp dữ liệu và tạo/hủy các biểu đồ Chart.js. |
| `export-data.js` | Xuất toàn bộ dữ liệu hoặc riêng Task thành JSON. |

## Nguyên tắc nạp script

`storage.js` phải đứng trước module cần dữ liệu. `auth.js`, `posts.js`, `tasks.js` hoặc module trang được nạp sau đó; `app.js` thường đứng cuối để khởi tạo hành vi giao diện dùng chung. Project dùng global function theo thứ tự script, không dùng ES module hay bundler.
