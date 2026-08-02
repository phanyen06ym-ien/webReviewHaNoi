# 04. Cấu trúc project

Source được chia thành trang (`pages/`), tài nguyên runtime (`assets/`) và tài liệu (`docs/`). CSS và JavaScript tiếp tục chia theo module nghiệp vụ.

```mermaid
flowchart TD
    Root[webReviewHaNoi] --> Index[index.html]
    Root --> Pages[pages]
    Root --> Assets[assets]
    Root --> Docs[docs]
    Assets --> CSS[css]
    Assets --> JS[js]
    Assets --> Images[images]
    JS --> Core[storage.js / app.js / validation.js]
    JS --> Feature[auth / posts / search / saved / tasks / profile / statistics / export]
```

Danh mục từng file và vai trò được duy trì tại [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md).
