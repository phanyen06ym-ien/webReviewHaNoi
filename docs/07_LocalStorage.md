# 07. LocalStorage

Project sử dụng bảy key:

1. `hanoi_food_users`
2. `hanoi_food_current_user`
3. `hanoi_food_posts`
4. `hanoi_food_comments`
5. `hanoi_food_tasks`
6. `hanoi_food_saved_posts`
7. `hanoi_food_theme`

`getData` parse JSON có fallback; `saveData` stringify và trả trạng thái thành công; `seedInitialData` chỉ seed key chưa tồn tại. Session không chứa password, nhưng danh sách User vẫn có password dạng rõ vì đây là bài tập front-end.

Schema đầy đủ và sơ đồ luồng xem [LOCAL_STORAGE.md](../LOCAL_STORAGE.md).

