# Cấu trúc CSS

## Tổ chức

CSS được chia thành ba tầng: token (`variables.css`), nền tảng/component dùng chung (`style.css`, `responsive.css`) và style theo module (`home.css`, `post.css`, `explore.css`, `auth.css`, `profile.css`, `tasks.css`, `statistics.css`). Mỗi trang chỉ liên kết các file cần thiết.

## Kỹ thuật được áp dụng

- CSS Variables tập trung màu sắc, typography, radius và shadow tại `:root`.
- Flexbox dùng cho navigation, toolbar, form action và các hàng card.
- CSS Grid dùng cho bố cục trang, dashboard Task, thống kê và các vùng nội dung nhiều cột.
- Media Query thay đổi sidebar, menu mobile, số cột, khoảng cách và kích thước component.
- Class theo component như `.button`, `.card`, `.form-control`, `.toast`, `.confirm-modal` giúp tái sử dụng.

## Responsive

Project được kiểm thử tại 320, 375, 390, 414, 768, 992, 1200 và 1440px. Ở màn hình nhỏ, sidebar desktop chuyển thành menu phủ; grid giảm cột; toolbar và form chuyển sang xếp dọc; nội dung dài được wrap để tránh overflow. Chart giữ vùng chứa co giãn. Chi tiết selector và breakpoint hiện hành nằm trong `assets/css/responsive.css` và các media query cục bộ của từng module.

## Quan hệ file - trang

| Trang | CSS đặc thù |
|---|---|
| Trang chủ | `home.css` |
| Explore, Saved | `explore.css`, kết hợp `post.css` khi hiển thị card |
| Create/Edit/Detail/My Posts | `post.css` |
| Auth | `auth.css` |
| Profile | `profile.css` |
| Tasks | `tasks.css` |
| Statistics | `statistics.css` |

Mọi trang đầy đủ đều dùng `style.css` và `responsive.css`. Không nên gộp file trước khi môn học yêu cầu build pipeline vì cấu trúc hiện tại dễ đọc và dễ trình bày.

