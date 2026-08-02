# 01. Tổng quan dự án

Hanoi Food Review là ứng dụng front-end cho sinh viên khám phá, đánh giá và lưu địa điểm ăn uống tại Hà Nội. Ứng dụng chạy trong trình duyệt, không có backend và dùng LocalStorage làm kho dữ liệu demo.

## Mục tiêu

- Thực hành HTML semantic, CSS responsive và JavaScript ES6+.
- Xây dựng CRUD Review và Task.
- Áp dụng validation, search, filter, sort và trực quan hóa dữ liệu.
- Tổ chức source theo module để dễ đọc, báo cáo và bảo trì.

## Phạm vi

Người dùng có thể đăng ký/đăng nhập, quản lý review, bình luận, Like/Save, tìm kiếm địa điểm, lập kế hoạch đi quán, cập nhật hồ sơ, xem thống kê và xuất JSON. Authentication và dữ liệu chỉ có giá trị trong browser hiện tại.

## Đối tượng chính

`User`, `Post`, `Comment`, `Task` và danh sách Saved Post ID. Chi tiết trường dữ liệu xem [07_LocalStorage.md](07_LocalStorage.md).

