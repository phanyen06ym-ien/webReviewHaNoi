# Luồng hệ thống

## Kiến trúc tổng quát

```mermaid
flowchart LR
    U[Người dùng] --> H[HTML semantic]
    H --> E[DOM events]
    E --> V[Validation / business module]
    V --> S[storage.js]
    S <--> L[(LocalStorage)]
    V --> R[Render DOM]
    C[CSS + responsive] --> H
    CDN[Chart.js / Font Awesome / Google Fonts] --> H
```

## Login

Người dùng → form login → chuẩn hóa username/email → tìm user → so sánh password → tạo session không password → lưu `hanoi_food_current_user` → cập nhật UI hoặc redirect an toàn.

## Review

Người dùng → form review → validation → `createPost`/`updatePost` → `hanoi_food_posts` → `renderPosts`, `renderMyPosts` hoặc `renderPostDetail`.

## Task

Người dùng → modal Task → validation → hàm CRUD → `hanoi_food_tasks` → search/filter/sort → `renderTasks` và thống kê nhanh.

## Statistics

Các key LocalStorage → `getStatisticsData` → hàm `count...` → cấu hình dataset → `createChart` → Chart.js render canvas. Trước khi render lại, chart cũ được destroy để tránh trùng instance.

## Sitemap và navigation

```mermaid
flowchart TD
    Home[Trang chủ] --> Explore[Khám phá]
    Home --> Auth[Đăng nhập / Đăng ký]
    Home --> Detail[Chi tiết Review]
    Explore --> Detail
    Auth --> Profile[Hồ sơ]
    Auth --> Create[Tạo Review]
    Auth --> MyPosts[Bài của tôi]
    Auth --> Saved[Đã lưu]
    Auth --> Tasks[Kế hoạch]
    Auth --> Statistics[Thống kê]
    MyPosts --> Edit[Sửa Review]
```

## Cấu trúc module

```mermaid
flowchart TD
    storage.js --> auth.js
    storage.js --> posts.js
    storage.js --> tasks.js
    storage.js --> statistics.js
    validation.js --> posts.js
    validation.js --> tasks.js
    posts.js --> search.js
    posts.js --> saved.js
    storage.js --> profile.js
    app.js --> UI[Hành vi giao diện chung]
```

