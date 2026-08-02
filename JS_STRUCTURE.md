# Cấu trúc JavaScript

Project dùng JavaScript ES6+ thuần, strict mode và các file global theo thứ tự `<script>`. Bảng dưới là catalog function theo source hiện tại.

## `storage.js` - dữ liệu dùng chung

| Function | Chức năng | Trang sử dụng |
|---|---|---|
| `getData`, `saveData`, `removeData` | Đọc/ghi/xóa JSON LocalStorage có fallback. | Tất cả module dữ liệu |
| `generateId` | ID lớn nhất + 1. | Review, Comment, Task, User |
| `getInitialUsers`, `getInitialPosts`, `getInitialTasks` | Tạo dữ liệu mẫu. | Khởi động ứng dụng |
| `seedInitialData` | Seed key thiếu và migration dữ liệu nhỏ. | Các trang nạp storage |
| `formatDateTime` | Hiển thị thời gian tương đối tiếng Việt. | Review, Comment |
| `escapeHTML` | Encode ký tự đặc biệt chống chèn HTML. | Các module render dữ liệu động |

## `app.js` - UI dùng chung

| Function | Chức năng | Trang sử dụng |
|---|---|---|
| `setMobileMenu`, `initializeMobileMenu` | Mở/đóng sidebar mobile, overlay, Escape và resize. | Mọi trang đầy đủ |
| `debounce` | Trì hoãn callback nhập liệu. | Explore, Saved, Task |
| `updateFooterYear`, `initializeUnifiedFooter` | Năm footer và liên kết footer thống nhất. | Mọi trang |
| `showSkeletonLoading`, `clearSkeletonLoading`, `runWithDelayedSkeleton` | Trạng thái chờ render. | Feed |
| `showToast` | Toast theo loại, action và thời lượng. | CRUD/interaction |
| `getConfirmModal`, `showConfirmModal` | Confirm bất đồng bộ, quản lý focus. | Delete/Clear/Logout |
| `initializeGlobalKeyboard` | Đóng modal/menu bằng Escape. | Toàn site |
| `initializeBackToTop` | Hiện nút theo scroll và cuộn lên. | Trang dài |
| `updateCurrentUserUI`, `initializeApp` | Đồng bộ UI tài khoản và bootstrap chung. | Toàn site |

## `auth.js` - tài khoản

`getUsers`, `saveUsers`, `getCurrentUser`, `createSessionUser`, `setCurrentUser`, `normalizeAccountValue`, `registerUser`, `loginUser`, `getPagePrefix`, `resolveAuthAvatar`, `logoutUser`, `isLoggedIn`, `getSafeRedirect`, `requireLogin`, `setAvatarElement`, `updateAuthUI`, `syncCurrentUserData`, `togglePasswordVisibility`, `getAuthField`, `validateRegisterField`, `initializeRegisterPage`, `initializeLoginPage`, `setAuthMode`, `initializeCombinedAuthPage`, `initializeAuthEvents`, `initializeAuth`.

Các function trên xử lý CRUD User mức đăng ký, session giả lập, redirect an toàn, validation form và trạng thái UI. Dùng ở Auth và mọi trang cần xác thực.

## `validation.js` - validation tái sử dụng

`validateRequired`, `validateMinLength`, `getTodayDateString`, `validateDeadline`, `showFieldError`, `clearFieldError`, `clearFormErrors`, `validateTaskField`, `validateTaskForm`, `validateRating`, `parseHashtags`, `validateHashtags`, `validateImageFile`, `getPostFieldConfig`, `validatePostField`, `validatePostForm`.

Function trả boolean/object validation, hiển thị lỗi cạnh field và làm sạch hashtag. Dùng tại Task, Create Review và Edit Review.

## `posts.js` - Review và Comment

### Truy cập dữ liệu

`getPosts`, `savePosts`, `getComments`, `saveComments`, `getCommentsForPost`, `getCommentCount`, `getCommentCountsByPostId`, `getCurrentUser`, `getPostById`.

### Render và tiện ích

`normalizeImagePath`, `resolveImageSource`, `getPostPagePrefix`, `createRatingStars`, `createPostImage`, `createPostCard`, `renderPosts`, `getTopHashtags`, `getFavoriteRestaurants`, `renderTrendingTopics`, `renderFavoriteRestaurants`, `createCommentItem`, `createCommentsSection`, `createMyPostCard`, `renderMyPosts`, `createPostErrorState`, `renderPostDetail`.

### Tương tác và CRUD

`validateComment`, `toggleLike`, `toggleSavePost`, `deletePost`, `initializePostInteractions`, `handleCommentSubmit`, `handleDeleteComment`, `collectPostFormData`, `createPost`, `updatePost`, `getCurrentUserPosts`, `getPostIdFromUrl`, `setupPostFormValidation`, `setupImagePreview`, `handlePostFormSubmit`, `initializeCreatePostPage`, `initializeEditPostPage`, `initializeMyPostsPage`, `initializePostDetailPage`, `initializePostPage`.

File được dùng ở Home, Explore, Saved, Create/Edit/Detail/My Posts.

## `search.js` - Explore

| Nhóm | Function |
|---|---|
| Chuẩn hóa/search | `normalizeText`, `searchPosts` |
| Suggestion | `buildSearchSuggestions`, `getMatchingSuggestions`, `initializeSearchSuggestions` |
| Filter | `filterPostsByCategory`, `filterPostsByDistrict`, `filterPostsByRating`, `applyExploreFilters`, `resetExploreFilters` |
| Sort/render | `sortExplorePosts`, `renderExplorePosts`, `updateExploreResultCount`, `renderExploreQuickTags`, `initializeExplorePage` |

Search chuẩn hóa Unicode NFD, bỏ dấu, đổi `đ/Đ`, sau đó xếp độ liên quan theo nhà hàng, title, hashtag, district/category, content và author.

## `saved.js` - bài đã lưu

`getSavedPosts`, `filterSavedPosts`, `sortSavedPosts`, `renderSavedPosts`, `updateSavedPostCount`, `applySavedFilters`, `removeSavedPost`, `initializeSavedPage`. Dùng tại `saved.html`.

## `tasks.js` - kế hoạch đi quán

| Nhóm | Function |
|---|---|
| Undo | `clearPendingTaskUndo`, `scheduleTaskUndo`, `undoLastTaskDeletion` |
| Data/CRUD | `getTasks`, `saveTasks`, `getTaskById`, `createTask`, `updateTask`, `deleteTask`, `toggleTaskStatus` |
| Modal/form | `openTaskModal`, `closeTaskModal`, `handleTaskSubmit` |
| Render | `formatTaskDate`, `createTaskCard`, `renderTasks`, `refreshTaskPage`, `updateTaskStatistics` |
| Search/filter/sort | `searchTasks`, `filterTasks`, `sortTasks`, `getTaskFilterValues`, `applyTaskFilters`, `resetTaskFilters` |
| Khác | `clearAllTasks`, `initializeTaskEvents`, `initializeTaskPage` |

## `profile.js` - hồ sơ

`getProfileUser`, `calculateProfileStatistics`, `setProfileAvatar`, `renderProfile`, `fillProfileForm`, `validateProfileField`, `validateProfileForm`, `updateUserPostsAuthorInfo`, `updateUserCommentsAuthorInfo`, `updateProfile`, `handleProfileSubmit`, `initializeProfilePage`.

## `statistics.js` - thống kê

`getStatisticsData`, `calculateOverviewStatistics`, `updateOverviewStatistics`, `countByKnownValues`, `countPostsByCategory`, `countPostsByDistrict`, `countPostsByRating`, `countPostsByMonth`, `countTasksByStatus`, `countTasksByPriority`, `countTasksByCategory`, `setChartEmptyState`, `commonChartOptions`, `createChart`, `createCategoryChart`, `createDistrictChart`, `createRatingChart`, `createMonthlyPostChart`, `createTaskStatusChart`, `createTaskPriorityChart`, `createTaskCategoryChart`, `destroyExistingCharts`, `renderAllCharts`, `updateStatisticsTimestamp`, `refreshStatisticsPage`, `initializeStatisticsPage`.

## `export-data.js` - xuất dữ liệu

`getExportData`, `downloadJSON`, `exportDataToJSON`, `exportTasksToJSON`, `initializeDataExport`. Export users loại password, thêm metadata và tạo Blob tải xuống.

## Event listener chính

- `DOMContentLoaded`: bootstrap app/auth/statistics/profile/export và module trang.
- `submit`: Auth, Review, Comment, Task, Profile.
- `input/change/blur`: validation realtime, search, filter, sort và preview.
- `click`: event delegation cho Like, Save, Delete, suggestion, task action và navigation.
- `keydown`: Escape, Arrow Up/Down, Enter và keyboard modal/menu.
- `scroll/resize`: Back to Top và trạng thái menu responsive.

