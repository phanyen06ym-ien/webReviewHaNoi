# Changelog

Mọi thay đổi đáng chú ý của Hanoi Food Review được ghi lại tại đây.

## [Unreleased]

### Changed

- Sắp xếp CSS và JavaScript vào `assets/css` và `assets/js` theo cấu trúc yêu cầu môn Cơ sở lập trình Web.
- Cập nhật đường dẫn tài nguyên mà không thay đổi chức năng hoặc giao diện.
- Thêm tài liệu đối chiếu yêu cầu và kịch bản báo cáo/bảo vệ.

### Fixed

- Sửa đường dẫn nút bình luận và trang chi tiết khi thao tác từ trang chủ.
- Sửa cách phân giải đường dẫn ảnh bài viết giữa trang chủ và thư mục `pages`.

## [1.0.0] - 2026-07-29

### Added

- Layout responsive với sidebar desktop và menu mobile.
- CRUD Review và CRUD Task bằng LocalStorage.
- Like, Save, My Posts, Explore, search, filter và sort.
- Auth giả lập, protected pages và cập nhật profile.
- Statistics bằng Chart.js.
- Export, import, backup và khôi phục dữ liệu.
- Toast, confirm modal, empty state, skeleton, fallback ảnh và Back to Top.
- README, test case và giấy phép MIT.

### Fixed

- ID trùng, sai kiểu dữ liệu, seed ghi đè và mất trạng thái sau refresh.
- XSS trong dữ liệu render động và click icon trong button.
- Search tiếng Việt, filter kết hợp, rating và thống kê sai.
- Redirect không an toàn, quyền sửa/xóa bài và đồng bộ profile.
- Chart bị tạo lặp, import không an toàn và dữ liệu Saved cũ.
- Đường dẫn tài nguyên, overflow mobile và lỗi ảnh demo.

### Changed

- Chuẩn hóa design token, typography, button, card, shadow và radius.
- Thêm strict mode cho toàn bộ JavaScript.
- Giảm render/event listener dư và debounce tìm kiếm.
- Chuẩn hóa accessibility và responsive từ 320px đến 1440px.
