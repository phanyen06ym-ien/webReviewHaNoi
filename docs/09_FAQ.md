# 09. Câu hỏi thường gặp

## Vì sao không cần cài package để chạy website?

Runtime dùng HTML, CSS và JavaScript thuần; các thư viện giao diện được tải từ CDN.

## Vì sao phải chạy bằng Live Server?

HTTP cho hành vi tài nguyên và URL ổn định hơn `file://`, đồng thời gần môi trường triển khai thật hơn.

## Dữ liệu ở đâu?

Trong LocalStorage của origin hiện tại. Đổi port/origin hoặc xóa dữ liệu browser có thể tạo kho dữ liệu khác.

## Tại sao đây không phải authentication thật?

Mọi mã và dữ liệu đều ở client, người dùng có thể xem hoặc sửa bằng DevTools; không có server xác minh.

## Search tiếng Việt hoạt động thế nào?

`normalizeText` tách dấu Unicode, bỏ combining mark, đổi `đ` thành `d`, hạ chữ thường rồi so khớp và tính relevance.

## Vì sao sort tạo mảng mới?

Để không làm thay đổi thứ tự mảng gốc vừa đọc từ LocalStorage khi chỉ thay đổi cách hiển thị.

## Chart không hiện thì sao?

Kiểm tra mạng/CDN. Source có empty message nếu biến `Chart` không tồn tại.

## Có được dùng dữ liệu này cho production không?

Không. Password rõ, authorization client và giới hạn dung lượng LocalStorage chỉ phù hợp bài tập.

