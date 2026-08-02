# Đánh giá HTML

Tài liệu này chỉ ghi nhận; không có HTML nào được sửa.

## Điểm tốt

- Các trang chính có `lang="vi"`, UTF-8, viewport, title và description riêng.
- Dùng `main`, `header`, `nav`, `section`, `article`, `aside`, `footer` tương đối rõ.
- Form có `label`, thông báo lỗi `aria-live`, nút có `type`, và validation tùy biến qua `novalidate`.
- Menu mobile có `aria-controls`, `aria-expanded`; icon trang trí thường có `aria-hidden`.
- Mỗi trang nghiệp vụ có một tiêu đề `h1` rõ; nội dung động có empty state.

## Vấn đề và đề xuất

| Vị trí | Nhận xét | Đề xuất để nhóm cân nhắc |
|---|---|---|
| `pages/auth.html` | Hai vùng đăng nhập/đăng ký cùng chứa `h1`; tùy chế độ chỉ một vùng được hiển thị nhưng DOM vẫn có hai heading cấp 1. | Khi được phép sửa, dùng một `h1` động hoặc đổi heading của panel ẩn thành `h2`. |
| `pages/login.html`, `pages/register.html` | Là trang chuyển hướng nên chỉ có cấu trúc tối thiểu, thiếu description và semantic content đầy đủ. | Giữ nếu cần tương thích URL; bổ sung fallback link và description nếu giảng viên chấm HTML tĩnh. |
| Một số trang viết nhiều phần tử trên một dòng | Hợp lệ nhưng khó review source và khó trích dẫn dòng khi báo cáo. | Chỉ format lại HTML trong một commit riêng sau khi kiểm thử snapshot. |
| Icon Font Awesome trong một số liên kết | Một số icon không khai báo `aria-hidden`; tên liên kết vẫn đọc được nhưng có thể tạo thông báo thừa. | Audit icon trang trí và thống nhất `aria-hidden="true"`. |
| Nội dung render bằng template string | Semantic và accessibility cuối cùng phụ thuộc JavaScript. | Duy trì test keyboard, alt ảnh và label động trong acceptance test. |
| CDN Font Awesome, Google Fonts, Chart.js | Khi offline có thể thiếu font/icon/chart. | Giữ fallback hiện có; cân nhắc self-host nếu yêu cầu triển khai offline. |

## Kết luận

HTML đáp ứng tốt phạm vi môn học. Các vấn đề còn lại chủ yếu là tính nhất quán và khả năng audit, không phải lỗi nghiệp vụ.

