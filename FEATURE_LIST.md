# Danh sách chức năng

| Nhóm | Chức năng | Trang | JavaScript |
|---|---|---|---|
| Review | Xem feed, chi tiết, tạo, sửa, xóa, My Posts | `index.html`, `create-post.html`, `edit-post.html`, `post-detail.html`, `my-posts.html` | `posts.js`, `validation.js` |
| Review | Like, Save, hashtag, rating, bình luận | Feed và Detail | `posts.js`, `saved.js` |
| Explore | Tìm kiếm không dấu và xếp hạng độ liên quan | `explore.html` | `search.js` |
| Explore | Suggestion bàn phím, lọc category/district/rating, sort | `explore.html` | `search.js` |
| Saved | Tìm kiếm, sort và bỏ lưu | `saved.html` | `saved.js`, `search.js`, `posts.js` |
| Task | CRUD kế hoạch, toggle Done, undo delete, clear all | `tasks.html` | `tasks.js`, `validation.js` |
| Task | Search, filter status/priority/category/district, sort | `tasks.html` | `tasks.js` |
| Authentication | Đăng ký, đăng nhập bằng username/email, đăng xuất | `auth.html` | `auth.js`, `storage.js` |
| Authentication | Session không password, protected page, redirect an toàn | Các trang cá nhân | `auth.js` |
| Profile | Hiển thị, validation, cập nhật avatar/bio/email | `profile.html` | `profile.js` |
| Profile | Đồng bộ tên/avatar tác giả trong post và comment | `profile.html` | `profile.js` |
| Statistics | KPI user/post/comment/task | `statistics.html` | `statistics.js` |
| Statistics | Biểu đồ category, district, rating, month và Task | `statistics.html` | `statistics.js`, Chart.js |
| Data | Export toàn bộ hoặc Task ra JSON | `statistics.html`, `tasks.html` | `export-data.js` |
| Navigation | Sidebar, mobile menu, footer, Back to Top | Mọi trang đầy đủ | `app.js` |
| UI chung | Toast, confirm modal, skeleton, empty state, fallback ảnh | Nhiều trang | `app.js`, `posts.js` |
| Responsive | Desktop, tablet, mobile | Toàn website | CSS media query; JS chỉ điều khiển menu |

## Quy tắc quyền

- Khách xem Home, Explore và Detail; thao tác cá nhân yêu cầu login.
- Chỉ chủ bài viết được sửa/xóa review.
- Profile, My Posts, Saved, Task và Statistics được bảo vệ phía trình duyệt.
- Đây là mô phỏng front-end, không phải bảo mật server.

