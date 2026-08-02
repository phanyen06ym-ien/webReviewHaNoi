# 08. Kiểm thử

## Phạm vi

- Seed và độ bền dữ liệu sau refresh.
- Authentication, redirect và protected page.
- CRUD Review, Comment, Saved và quyền owner.
- Search không dấu, filter kết hợp và sort không làm đổi mảng gốc.
- CRUD Task, deadline, status, clear all và undo.
- Statistics, export JSON và trạng thái thiếu Chart.js.
- Accessibility cơ bản, responsive và tương thích trình duyệt.

## Tài sản kiểm thử

- `TEST_CASE.md`: 63 acceptance test được định nghĩa để nhóm ghi Actual và Result.
- `assets/report/`: ảnh minh họa các viewport phục vụ báo cáo responsive.
- Project hiện không chứa test runner tự động; các test case được thực hiện bằng trình duyệt.

## Quy trình đề xuất

1. Chạy website qua HTTP bằng Live Server.
2. Chạy smoke test trên browser mục tiêu.
3. Thực hiện test CRUD với dữ liệu riêng.
4. Kiểm tra refresh và LocalStorage.
5. Kiểm tra 320/768/1440px và keyboard.
6. Ghi Actual/Result vào `TEST_CASE.md`, lưu bằng chứng khi có lỗi.
