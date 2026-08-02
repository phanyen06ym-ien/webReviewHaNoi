# Câu hỏi vấn đáp Hanoi Food Review

## HTML

### 1. Vì sao dùng semantic HTML?
Semantic giúp trình duyệt, công cụ hỗ trợ và người đọc source hiểu vai trò của `main`, `nav`, `section`, `article`, `aside`, `header`, `footer`.

### 2. Mỗi trang nên có bao nhiêu `h1`?
Thông thường một `h1` mô tả chủ đề chính. Các phần con dùng `h2`, `h3` theo cấp bậc, không chọn heading theo kích thước chữ.

### 3. `meta viewport` có tác dụng gì?
Nó đặt viewport theo chiều rộng thiết bị, giúp media query và kích thước responsive hoạt động đúng trên mobile.

### 4. Vì sao `label for` phải khớp `input id`?
Để click label focus input và screen reader công bố đúng tên trường.

### 5. Tại sao form dùng `novalidate`?
Project chủ động hiển thị validation JavaScript thống nhất. Điều này không có nghĩa bỏ validation; module phải kiểm tra trước khi lưu.

## CSS

### 6. CSS Variables được dùng để làm gì?
Tập trung design token như màu, font, radius, shadow; đổi token có thể cập nhật nhiều component đồng bộ.

### 7. Khi nào dùng Flexbox, khi nào dùng Grid?
Flexbox phù hợp bố cục một chiều; Grid phù hợp bố cục hàng-cột hai chiều như dashboard hoặc chart grid.

### 8. Vì sao tách CSS theo trang?
Giảm tải style không liên quan, dễ tìm code và tách trách nhiệm; `style.css` vẫn giữ component dùng chung.

### 9. Specificity là gì?
Là quy tắc trình duyệt chọn declaration khi nhiều selector cùng áp dụng. Nên dùng class nhất quán và tránh lạm dụng `!important`.

### 10. `box-sizing: border-box` hữu ích thế nào?
Width/height đã bao gồm padding và border, giúp tính kích thước component và responsive dễ dự đoán.

## JavaScript

### 11. Vì sao dùng `"use strict"`?
Strict mode bắt một số lỗi im lặng, hạn chế biến global ngoài ý muốn và làm hành vi JavaScript rõ hơn.

### 12. DOM Manipulation trong project là gì?
JavaScript đọc phần tử, gắn sự kiện, tạo HTML/card và cập nhật text/class/attribute mà không tải lại toàn trang.

### 13. Event delegation là gì?
Gắn một listener ở container/document rồi dùng `event.target.closest()` xác định nút con; phù hợp nội dung render động.

### 14. Vì sao dùng `Number(id)` khi so sánh?
ID từ URL/dataset thường là string, còn dữ liệu lưu có thể là number. Chuẩn hóa tránh sai do khác kiểu.

### 15. `debounce` giải quyết vấn đề gì?
Giảm số lần chạy search/render khi người dùng gõ liên tục, chỉ chạy sau khoảng dừng ngắn.

### 16. Vì sao sort trên `[...posts]`?
`Array.sort()` thay đổi mảng tại chỗ; sao chép trước giúp thứ tự dữ liệu nguồn không bị đổi chỉ vì cách hiển thị.

### 17. `async/await` được dùng ở đâu và vì sao?
Các luồng confirm/delete/logout chờ Promise từ modal xác nhận để code tuần tự và dễ đọc.

### 18. Template string có rủi ro gì?
Dữ liệu người dùng đưa thẳng vào `innerHTML` có thể gây XSS; project dùng `escapeHTML` trước khi chèn.

## LocalStorage

### 19. Vì sao chọn LocalStorage?
Không cần backend, dễ minh họa JSON và persistence sau refresh, phù hợp bài tập front-end.

### 20. LocalStorage lưu được object trực tiếp không?
Không. Phải `JSON.stringify` khi ghi và `JSON.parse` khi đọc.

### 21. `getData` xử lý JSON hỏng thế nào?
Hàm bọc parse trong `try/catch` và trả `defaultValue` nếu không đọc được.

### 22. Seed data tránh ghi đè bằng cách nào?
`seedInitialData` chỉ seed khi `localStorage.getItem(key) === null`, không seed lại mảng rỗng hợp lệ.

### 23. Vì sao Current User không chứa password?
Session chỉ cần dữ liệu công khai để nhận diện UI. Loại password giảm lộ dữ liệu không cần thiết, dù ứng dụng client vẫn không an toàn thật.

### 24. Hạn chế của LocalStorage là gì?
Dung lượng nhỏ, đồng bộ, chỉ theo origin, không có query/transaction mạnh và người dùng có thể sửa bằng DevTools.

## Responsive

### 25. Responsive của project hoạt động thế nào?
Media query thay đổi sidebar/menu, grid, toolbar, spacing và cách xếp form theo chiều rộng viewport.

### 26. Vì sao kiểm thử nhiều breakpoint thay vì chỉ desktop/mobile?
Lỗi thường xuất hiện ở chiều rộng trung gian khi card, filter hoặc text vừa không đủ chỗ.

### 27. Mobile menu cần JavaScript vì sao?
CSS quyết định hiển thị, còn JavaScript quản lý trạng thái mở, overlay, Escape, focus-related attribute và `aria-expanded`.

### 28. Làm sao tránh overflow ngang?
Dùng grid/flex co giãn, wrap, `min-width: 0`, ảnh `max-width: 100%`, và kiểm tra nội dung dài ở viewport nhỏ.

## CRUD

### 29. CRUD là gì?
Create, Read, Update, Delete: bốn thao tác cơ bản quản lý dữ liệu Review và Task.

### 30. Review Create chạy qua những bước nào?
Submit form → lấy dữ liệu → validation → `createPost` sinh ID/tác giả/thời gian → `savePosts` → render/chuyển trang.

### 31. Update Review giữ dữ liệu nào?
Giữ ID, `createdAt`, lượt Like và trạng thái Save; cập nhật nội dung form và `updatedAt`.

### 32. Delete Review cần kiểm tra gì?
Người dùng đăng nhập, là owner, xác nhận modal; sau đó dọn Post, Comment và Saved ID liên quan.

### 33. Task khác Review ở điểm nào?
Task có deadline, priority, status, category/district, modal edit, toggle Done và Undo delete.

## Chart.js và Statistics

### 34. Dữ liệu biểu đồ đến từ đâu?
`statistics.js` đọc Users, Posts, Comments, Tasks từ LocalStorage rồi dùng hàm count tổng hợp thành labels/values.

### 35. Vì sao destroy chart cũ trước khi tạo lại?
Tránh nhiều Chart instance cùng gắn một canvas, rò bộ nhớ hoặc lỗi canvas đã được sử dụng.

### 36. Biểu đồ theo tháng xử lý thế nào?
Nhóm Post theo khóa `YYYY-MM`, sắp thứ tự thời gian rồi đổi label thành `MM/YYYY`.

### 37. Nếu Chart.js CDN lỗi thì sao?
Source kiểm tra `typeof Chart` và hiện empty message thay vì gây lỗi toàn trang.

## Validation

### 38. Validation client có thay thế server validation không?
Không. Client validation cải thiện UX nhưng có thể bị bỏ qua; hệ thống production phải kiểm tra lại ở server.

### 39. Validation deadline làm gì?
Kiểm tra có giá trị, ngày hợp lệ và không sớm hơn ngày hiện tại theo chuỗi ngày cục bộ.

### 40. Hashtag được chuẩn hóa thế nào?
Tách chuỗi, bỏ dấu `#` đầu, loại rỗng/trùng và kiểm tra giới hạn trước khi lưu.

### 41. Validation ảnh kiểm tra gì?
Định dạng cho phép và dung lượng tối đa; ảnh được preview trước khi lưu.

## Search, Filter, Sort

### 42. Search không dấu hoạt động thế nào?
Unicode NFD → bỏ combining marks → đổi `đ`/`Đ` → lowercase → chuẩn hóa khoảng trắng → so khớp.

### 43. Search relevance ưu tiên gì?
Tên quán chính xác/prefix/contains, sau đó title, hashtag, district/category, content và author.

### 44. Filter kết hợp theo AND hay OR?
Theo AND tuần tự: kết quả phải thỏa search và từng filter category, district, rating đang bật.

### 45. Sort rating và likes làm gì?
So sánh số giảm dần; sort newest/oldest so sánh `createdAt`.

### 46. Suggestion hỗ trợ bàn phím ra sao?
Arrow Up/Down đổi option active, Enter chọn, Escape đóng và ARIA cập nhật option được chọn.

## Project

### 47. Vì sao tách HTML, CSS, JavaScript?
Separation of concerns: cấu trúc, trình bày và hành vi độc lập tương đối, dễ đọc và bảo trì.

### 48. Thứ tự script quan trọng thế nào?
Module gọi global function từ file trước; ví dụ `posts.js` cần `storage.js`, còn `search.js` cần function của `posts.js`.

### 49. Điểm mạnh của kiến trúc hiện tại là gì?
Không cần build, module theo chức năng, dễ mở source để giải thích và phù hợp kiến thức nền tảng.

### 50. Điểm cần cải tiến lớn nhất là gì?
Authentication/storage client không an toàn production và `posts.js` khá lớn; cần backend và module hóa sâu hơn khi mở rộng.

### 51. Export JSON bảo vệ password thế nào?
`getExportData` map Users và loại trường password trước khi tạo payload.

### 52. Project hiện có Import JSON hoàn chỉnh không?
Không. Source runtime hiện tại có export JSON; tài liệu không nên trình bày Import như chức năng đã hoàn thành.

## Git và GitHub

### 53. Git khác GitHub thế nào?
Git là hệ thống quản lý phiên bản phân tán; GitHub là dịch vụ lưu repository và cộng tác dựa trên Git.

### 54. Commit tốt cần gì?
Phạm vi nhỏ, chạy được, message mô tả mục đích và không trộn refactor với thay đổi tính năng không liên quan.

### 55. Vì sao dùng branch?
Branch cô lập công việc từng thành viên/chức năng, giảm ảnh hưởng nhánh chính và hỗ trợ review trước khi merge.

### 56. Merge conflict xử lý thế nào?
Đọc cả hai thay đổi, hiểu ý định, hợp nhất thủ công, chạy test rồi commit kết quả; không chọn một phía máy móc.

### 57. Pull Request có lợi gì?
Hiển thị diff, thảo luận, review chéo, kiểm thử và lưu lịch sử quyết định trước khi nhập nhánh.

### 58. File nào không nên commit?
Secret, token, file tạm, cache và artifact máy cá nhân không phục vụ project; quy tắc được ghi trong `.gitignore` nếu có.

### 59. Trước khi push cần kiểm tra gì?
`git status`, diff của mình, website chạy, test liên quan, không có secret và commit message rõ.

### 60. Khi bảo vệ, lịch sử Git chứng minh điều gì?
Cho thấy quá trình phát triển, phân chia đóng góp, cách sửa lỗi và khả năng làm việc nhóm; không tự động chứng minh chất lượng code.

