# Báo cáo đề xuất cải tiến

Không có vấn đề nào trong bảng này được tự động sửa.

| Vấn đề | File/vị trí | Nguyên nhân | Đề xuất |
|---|---|---|---|
| Password lưu dạng rõ | `storage.js`, `auth.js` | Bài tập không có backend. | Khi phát triển thật, dùng backend, HTTPS và password hashing; không lưu password ở browser. |
| Authentication chỉ ở client | `auth.js` | LocalStorage không phải ranh giới bảo mật. | Dùng server session/token và authorization phía server. |
| State Like dùng `likedByCurrentUser` trên Post | `posts.js` | Mô hình demo một browser, không tách theo user. | Nếu mở rộng nhiều user, dùng mảng userId hoặc bảng quan hệ riêng. |
| Saved vừa có `isSaved`, vừa có danh sách ID | `posts.js`, `saved.js`, `storage.js` | Tương thích dữ liệu cũ. | Chọn một nguồn sự thật sau khi có migration rõ ràng. |
| Global function phụ thuộc thứ tự script | Tất cả JS/HTML | Không dùng ES module/bundler. | Giữ cho môn học; nếu mở rộng, chuyển dần sang ES Modules và import rõ ràng. |
| `posts.js` lớn | `assets/js/posts.js` | Review, Comment, render, form và interaction chung file. | Sau môn học, tách `post-data`, `post-render`, `post-form`, `comments` kèm test hồi quy. |
| Nhiều HTML minify theo dòng | Một số file `pages/*.html` | Format thủ công không đồng nhất. | Chạy formatter trong commit riêng; kiểm tra visual diff để tránh thay đổi ngoài ý muốn. |
| Hai `h1` trong Auth DOM | `pages/auth.html` | Hai panel cùng tồn tại, một panel bị ẩn. | Dùng một heading động hoặc hạ panel phụ xuống `h2`. |
| Trang redirect tối giản | `pages/login.html`, `pages/register.html` | Giữ URL cũ. | Thêm nội dung fallback và meta description nếu cần chấm HTML tĩnh. |
| CDN là điểm phụ thuộc mạng | Font Awesome, Google Fonts, Chart.js | Dễ triển khai, không cần build. | Self-host asset nếu yêu cầu chạy hoàn toàn offline. |
| Không có unit test JS độc lập | Project/testing | Hiện tập trung acceptance/browser test. | Thêm test pure function cho normalize, filter, validation và statistics. |
| Import/backup được nhắc trong tài liệu cũ nhưng source export hiện hành chủ yếu là tải JSON | `export-data.js`, tài liệu cũ | Chức năng/tài liệu có thể lệch phiên bản. | Chỉ trình bày chức năng đã kiểm chứng; bổ sung import trong một yêu cầu thay đổi riêng nếu giảng viên bắt buộc. |
| README cũ tham chiếu `BAO_CAO_BAO_VE.md` nhưng file không tồn tại | README phiên bản trước | Tài liệu đã đổi cấu trúc. | README mới trỏ tới thư mục `docs/`. |

