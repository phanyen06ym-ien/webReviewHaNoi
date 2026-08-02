# 10. Kịch bản trình bày

## Kịch bản 8-10 phút

1. **Tổng quan (1 phút):** bài toán, người dùng và công nghệ.
2. **Kiến trúc (1 phút):** HTML → JS module → storage wrapper → LocalStorage → render.
3. **Review (2 phút):** tạo, validation, render, sửa/xóa có kiểm tra owner.
4. **Explore (1 phút):** search không dấu, filter kết hợp và sort.
5. **Task (1,5 phút):** CRUD, trạng thái, bộ lọc và Undo.
6. **Auth/Profile (1 phút):** session không password, protected page, đồng bộ tác giả.
7. **Statistics (1 phút):** tổng hợp mảng bằng Array Methods và Chart.js.
8. **Testing/kết luận (0,5 phút):** responsive, test case, giới hạn và hướng mở rộng.

## Luồng demo an toàn

- Đăng nhập bằng tài khoản demo.
- Tạo một review ngắn, mở My Posts, sửa rồi xóa.
- Search từ không dấu tại Explore và bật hai bộ lọc.
- Tạo Task, toggle Done, xóa rồi Undo.
- Mở Statistics và xuất JSON.
- Kết thúc ở sơ đồ kiến trúc, không thao tác DevTools ngoài phần LocalStorage đã chuẩn bị.

## Phân công trình bày

Mỗi thành viên trình bày module mình phụ trách nhưng phải giải thích được `storage.js`, validation và luồng DOM chung. Chuẩn bị sẵn phương án khi CDN Chart.js không tải: trình bày empty state và dữ liệu tổng hợp.

