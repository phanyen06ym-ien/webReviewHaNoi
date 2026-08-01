# Test Cases — Hanoi Food Review v1.0.0

> Cột “Thực tế” và “Kết quả” được để sẵn để nhóm ghi nhận khi chạy acceptance test trên Chrome, Edge và Firefox.

| ID | Module | Bước kiểm thử | Kết quả mong đợi | Thực tế | Kết quả |
|---|---|---|---|---|---|
| TC-001 | Seed | Mở lần đầu với LocalStorage trống | Tạo đúng users, posts, tasks, saved và theme | Chưa ghi | Chưa chạy |
| TC-002 | Seed | Refresh sau khi đã sửa dữ liệu | Seed không ghi đè dữ liệu | Chưa ghi | Chưa chạy |
| TC-003 | Auth | Đăng nhập bằng username admin | Đăng nhập thành công | Chưa ghi | Chưa chạy |
| TC-004 | Auth | Đăng nhập bằng email admin | Đăng nhập thành công | Chưa ghi | Chưa chạy |
| TC-005 | Auth | Đăng nhập sai password | Hiện lỗi, không tạo session | Chưa ghi | Chưa chạy |
| TC-006 | Auth | Đăng ký username trùng khác hoa thường | Từ chối đăng ký | Chưa ghi | Chưa chạy |
| TC-007 | Auth | Đăng ký email trùng khác hoa thường | Từ chối đăng ký | Chưa ghi | Chưa chạy |
| TC-008 | Auth | Đăng ký dữ liệu hợp lệ | User mới được lưu | Chưa ghi | Chưa chạy |
| TC-009 | Auth | Kiểm tra current user | Session không chứa password | Chưa ghi | Chưa chạy |
| TC-010 | Auth | Logout rồi refresh | Session bị xóa, UI về khách | Chưa ghi | Chưa chạy |
| TC-011 | Auth | Mở protected page khi chưa login | Chuyển tới login | Chưa ghi | Chưa chạy |
| TC-012 | Auth | Truyền redirect URL bên ngoài | Không chuyển ra website ngoài | Chưa ghi | Chưa chạy |
| TC-013 | Profile | Sửa fullname và avatar | User và bài cũ được đồng bộ | Chưa ghi | Chưa chạy |
| TC-014 | Profile | Đổi email trùng user khác | Hiện lỗi validation | Chưa ghi | Chưa chạy |
| TC-015 | Profile | Sửa field lỗi thành hợp lệ | Lỗi biến mất realtime | Chưa ghi | Chưa chạy |
| TC-016 | Review | Tạo bài hợp lệ | Bài xuất hiện và có ID duy nhất | Chưa ghi | Chưa chạy |
| TC-017 | Review | Submit thiếu trường bắt buộc | Không lưu, hiện lỗi | Chưa ghi | Chưa chạy |
| TC-018 | Review | Nhập hashtag có #, rỗng và trùng | Lưu hashtag sạch, duy nhất | Chưa ghi | Chưa chạy |
| TC-019 | Review | Chọn rating từ 1–5 | Lưu dạng number và render đúng sao | Chưa ghi | Chưa chạy |
| TC-020 | Review | Mở edit với ID hợp lệ | Form điền đúng bài | Chưa ghi | Chưa chạy |
| TC-021 | Review | Lưu edit | Cập nhật bài cũ, không tạo bài mới | Chưa ghi | Chưa chạy |
| TC-022 | Review | Edit bài có likes/save | Giữ likes, saved và createdAt | Chưa ghi | Chưa chạy |
| TC-023 | Review | User khác mở edit | Bị từ chối quyền | Chưa ghi | Chưa chạy |
| TC-024 | Review | Mở detail với ID sai | Hiện trạng thái phù hợp, không lỗi console | Chưa ghi | Chưa chạy |
| TC-025 | Review | Xóa bài rồi hủy confirm | Bài vẫn còn | Chưa ghi | Chưa chạy |
| TC-026 | Review | Xóa bài và xác nhận | Bài mất khỏi UI và storage | Chưa ghi | Chưa chạy |
| TC-027 | Review | Click icon trong Like | Action vẫn chạy | Chưa ghi | Chưa chạy |
| TC-028 | Review | Like rồi refresh | Trạng thái và số like được giữ | Chưa ghi | Chưa chạy |
| TC-029 | Saved | Save bài rồi refresh | Bài có trong Saved | Chưa ghi | Chưa chạy |
| TC-030 | Saved | Unsave tại trang Saved | Card biến mất, count cập nhật | Chưa ghi | Chưa chạy |
| TC-031 | Saved | Xóa một bài đã lưu | ID cũ không còn trong Saved | Chưa ghi | Chưa chạy |
| TC-032 | Explore | Search không dấu | Tìm thấy nội dung tiếng Việt có dấu | Chưa ghi | Chưa chạy |
| TC-033 | Explore | Search tên quán | Trả đúng bài | Chưa ghi | Chưa chạy |
| TC-034 | Explore | Search hashtag | Trả đúng bài | Chưa ghi | Chưa chạy |
| TC-035 | Explore | Kết hợp search/category/district/rating | Kết quả thỏa tất cả điều kiện | Chưa ghi | Chưa chạy |
| TC-036 | Explore | Reset filter | Bộ lọc về mặc định và render lại | Chưa ghi | Chưa chạy |
| TC-037 | Explore | Sort bài | Mảng gốc trong storage không đổi thứ tự | Chưa ghi | Chưa chạy |
| TC-038 | Task | Tạo task | Task có ID duy nhất và được lưu | Chưa ghi | Chưa chạy |
| TC-039 | Task | Sửa task | Task cũ được cập nhật | Chưa ghi | Chưa chạy |
| TC-040 | Task | Toggle Done rồi refresh | Trạng thái được giữ | Chưa ghi | Chưa chạy |
| TC-041 | Task | Xóa task rồi hủy confirm | Task vẫn còn | Chưa ghi | Chưa chạy |
| TC-042 | Task | Xóa task và xác nhận | Task bị xóa, thống kê cập nhật | Chưa ghi | Chưa chạy |
| TC-043 | Task | Deadline hôm nay | Không báo quá hạn | Chưa ghi | Chưa chạy |
| TC-044 | Task | Search khác hoa thường | Trả đúng kết quả | Chưa ghi | Chưa chạy |
| TC-045 | Task | Kết hợp search/filter/sort | Kết quả đúng, storage không đổi thứ tự | Chưa ghi | Chưa chạy |
| TC-046 | Task | Clear All và refresh | Danh sách vẫn rỗng | Chưa ghi | Chưa chạy |
| TC-047 | Statistics | Mở trang có Chart.js | Mỗi canvas có một chart đúng tỷ lệ | Chưa ghi | Chưa chạy |
| TC-048 | Statistics | Rating thiếu một mức | Chart vẫn hiện mức đó bằng 0 | Chưa ghi | Chưa chạy |
| TC-049 | Statistics | Bài thuộc nhiều năm | Monthly chart tách năm và sắp đúng | Chưa ghi | Chưa chạy |
| TC-050 | Statistics | Export JSON | Có metadata và đủ storage key | Chưa ghi | Chưa chạy |
| TC-051 | Statistics | Import file không phải JSON | Từ chối trước khi ghi storage | Chưa ghi | Chưa chạy |
| TC-052 | Statistics | Export JSON | Có posts, comments, tasks và users không chứa password | Chưa ghi | Chưa chạy |
| TC-053 | Statistics | Import hợp lệ và xác nhận | Dữ liệu/UI cập nhật | Chưa ghi | Chưa chạy |
| TC-054 | Statistics | Hủy import | Không thay đổi dữ liệu | Chưa ghi | Chưa chạy |
| TC-055 | UI | Ảnh không tồn tại | Hiện fallback, không có broken icon | Chưa ghi | Chưa chạy |
| TC-056 | UI | Dùng Tab qua trang | Focus rõ, thứ tự hợp lý | Chưa ghi | Chưa chạy |
| TC-057 | UI | Mở confirm và nhấn Escape | Modal đóng, focus được trả lại | Chưa ghi | Chưa chạy |
| TC-058 | UI | Mở menu mobile và chọn link | Menu đóng đúng | Chưa ghi | Chưa chạy |
| TC-059 | Responsive | Kiểm tra 320/375/390/414px | Không overflow ngang | Chưa ghi | Chưa chạy |
| TC-060 | Responsive | Kiểm tra 768/992/1200/1440px | Layout và chart không méo | Chưa ghi | Chưa chạy |
| TC-061 | Browser | Chạy Chrome | Không error/warning/rejection | Chưa ghi | Chưa chạy |
| TC-062 | Browser | Chạy Edge | Chức năng chính hoạt động | Chưa ghi | Chưa chạy |
| TC-063 | Browser | Chạy Firefox | Chức năng chính hoạt động | Chưa ghi | Chưa chạy |
