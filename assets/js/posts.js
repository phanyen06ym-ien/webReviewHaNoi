"use strict";

/**
 * posts.js
 * Đọc, hiển thị và xử lý tương tác cơ bản của các bài review.
 */

function getPosts() {
    const posts = getData(STORAGE_KEYS.POSTS, []);
    return Array.isArray(posts) ? posts : [];
}

function savePosts(posts) {
    return saveData(STORAGE_KEYS.POSTS, posts);
}

function getComments() {
    const comments = getData(STORAGE_KEYS.COMMENTS, []);
    return Array.isArray(comments) ? comments : [];
}

function saveComments(comments) {
    return saveData(STORAGE_KEYS.COMMENTS, comments);
}

function getCommentsForPost(postId) {
    return getComments().filter(function (comment) {
        return Number(comment.postId) === Number(postId);
    }).sort(function (firstComment, secondComment) {
        return new Date(secondComment.createdAt) - new Date(firstComment.createdAt);
    });
}

function getCommentCount(postId) {
    return getComments().filter(function (comment) {
        return Number(comment.postId) === Number(postId);
    }).length;
}

function getCommentCountsByPostId() {
    const counts = new Map();
    getComments().forEach(function (comment) {
        const postId = Number(comment.postId);
        counts.set(postId, (counts.get(postId) || 0) + 1);
    });
    return counts;
}

function validateComment(content) {
    const normalizedContent = String(content || "").trim();
    if (!normalizedContent) {
        return { isValid: false, message: "Vui lòng nhập nội dung bình luận." };
    }
    if (normalizedContent.length > 500) {
        return { isValid: false, message: "Bình luận không được vượt quá 500 ký tự." };
    }
    return { isValid: true, value: normalizedContent };
}

function getCurrentUser() {
    return getData(STORAGE_KEYS.CURRENT_USER, null);
}

function getPostById(postId) {
    return getPosts().find(function (post) {
        return Number(post.id) === Number(postId);
    });
}

function normalizeImagePath(imagePath) {
    const cleanPath = String(imagePath || "").trim();
    return cleanPath.startsWith("../assets/") ? cleanPath.slice(3) : cleanPath;
}

function resolveImageSource(imagePath) {
    const cleanPath = normalizeImagePath(imagePath);
    const isPageFolder = document.body && document.body.dataset.page !== "home";

    if (cleanPath.startsWith("assets/") && isPageFolder) {
        return "../" + cleanPath;
    }

    return cleanPath;
}

function getPostPagePrefix() {
    return document.body && document.body.dataset.page === "home" ? "pages/" : "";
}

function createRatingStars(rating) {
    const safeRating = Math.min(5, Math.max(1, Math.round(Number(rating) || 1)));
    let stars = "";

    for (let index = 1; index <= 5; index += 1) {
        const starClass = index <= safeRating ? "filled" : "empty";
        stars += `<i class="fa-solid fa-star ${starClass}" aria-hidden="true"></i>`;
    }

    return stars;
}

function createPostImage(post) {
    const image = post.image || "assets/images/posts/post-placeholder.svg";

    return `
        <img class="post-image"
            src="${escapeHTML(resolveImageSource(image))}"
            alt="Hình ảnh tại ${escapeHTML(post.restaurantName)}"
            loading="lazy"
            decoding="async">
    `;
}

function createPostCard(post, commentCounts) {
    const authorName = String(post.authorName || "Người dùng");
    const safeRating = Math.min(5, Math.max(1, Math.round(Number(post.rating) || 1)));
    const authorInitial = escapeHTML(authorName.trim().charAt(0).toUpperCase() || "U");
    const categoryIcon = post.category === "Cafe" ? "fa-mug-hot" : "fa-utensils";
    const likedClass = post.likedByCurrentUser ? "active liked" : "";
    const savedClass = post.isSaved ? "active saved" : "";
    const likeIcon = post.likedByCurrentUser ? "fa-solid" : "fa-regular";
    const saveIcon = post.isSaved ? "fa-solid" : "fa-regular";
    const hashtags = Array.isArray(post.hashtags) ? post.hashtags : [];
    const currentUser = getCurrentUser();
    const isOwner = currentUser && Number(currentUser.id) === Number(post.userId);
    const pagePrefix = getPostPagePrefix();
    const displayedHashtags = [];
    const displayedHashtagKeys = new Set();
    const commentCount = commentCounts instanceof Map
        ? (commentCounts.get(Number(post.id)) || 0)
        : getCommentCount(post.id);

    hashtags.forEach(function (hashtag) {
        const cleanHashtag = String(hashtag).trim().replace(/^#+/, "");
        const normalizedHashtag = cleanHashtag.toLocaleLowerCase("vi-VN");

        if (cleanHashtag && !displayedHashtagKeys.has(normalizedHashtag)) {
            displayedHashtagKeys.add(normalizedHashtag);
            displayedHashtags.push(cleanHashtag);
        }
    });

    // map chuyển từng hashtag thành một liên kết HTML.
    const hashtagHTML = displayedHashtags.map(function (hashtag) {
        return `<a href="${pagePrefix}explore.html?hashtag=${encodeURIComponent(hashtag)}">#${escapeHTML(hashtag)}</a>`;
    }).join("");

    return `
        <article class="post-card card" data-post-id="${Number(post.id)}">
            <header class="post-header">
                <span class="post-avatar" aria-hidden="true">${authorInitial}</span>
                <div class="post-author">
                    <strong>${escapeHTML(authorName)}</strong>
                    <span>${escapeHTML(formatDateTime(post.createdAt))} · <i class="fa-solid fa-earth-asia" aria-label="Công khai"></i></span>
                </div>
                <span class="category-badge">
                    <i class="fa-solid ${categoryIcon}" aria-hidden="true"></i>
                    ${escapeHTML(post.category)}
                </span>
            </header>

            <div class="post-content post-body">
                <h3 class="post-title">${escapeHTML(post.title)}</h3>
                <p class="restaurant-name">${escapeHTML(post.restaurantName)}</p>
                <p class="post-location">
                    <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                    ${escapeHTML(post.address)}
                </p>
                <div class="rating-stars" aria-label="${safeRating} trên 5 sao">
                    ${createRatingStars(safeRating)}
                    <span>${safeRating}.0</span>
                </div>
                <p class="post-description">${escapeHTML(post.content)}</p>
                ${createPostImage(post)}
                <div class="post-hashtags">${hashtagHTML}</div>
                <div class="feed-post-links">
                    <a href="${pagePrefix}post-detail.html?id=${Number(post.id)}">Xem chi tiết</a>
                    ${isOwner ? `<a href="${pagePrefix}edit-post.html?id=${Number(post.id)}">Sửa</a>
                    <button type="button" data-action="delete" data-post-id="${Number(post.id)}">Xóa</button>` : ""}
                </div>
            </div>

            <footer class="post-actions">
                <button class="action-button ${likedClass}" type="button"
                    data-action="like" data-post-id="${Number(post.id)}"
                    aria-label="${post.likedByCurrentUser ? "Bỏ thích" : "Thích"} bài ${escapeHTML(post.title)}"
                    aria-pressed="${String(Boolean(post.likedByCurrentUser))}">
                    <i class="${likeIcon} fa-heart" aria-hidden="true"></i>
                    <span>${Number(post.likes) || 0} lượt thích</span>
                </button>
                <button class="action-button" type="button"
                    data-action="comment" data-post-id="${Number(post.id)}"
                    aria-label="Bình luận bài ${escapeHTML(post.title)}">
                    <i class="fa-regular fa-comment" aria-hidden="true"></i>
                    <span>${commentCount} bình luận</span>
                </button>
                <button class="action-button ${savedClass}" type="button"
                    data-action="save" data-post-id="${Number(post.id)}"
                    aria-label="${post.isSaved ? "Bỏ lưu" : "Lưu"} bài ${escapeHTML(post.title)}"
                    aria-pressed="${String(Boolean(post.isSaved))}">
                    <i class="${saveIcon} fa-bookmark" aria-hidden="true"></i>
                    <span>${post.isSaved ? "Đã lưu" : "Lưu"}</span>
                </button>
            </footer>
        </article>
    `;
}

function renderPosts(postsToRender) {
    const postList = document.querySelector("#post-list");

    if (!postList) {
        return;
    }

    const posts = Array.isArray(postsToRender) ? postsToRender : getPosts();

    if (posts.length === 0) {
        postList.innerHTML = `
            <div class="empty-state card">
                <i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>
                <h3>Chưa có bài review nào</h3>
                <p>Hãy trở thành người đầu tiên chia sẻ trải nghiệm.</p>
                <a class="button button-primary" href="pages/create-post.html">Tạo bài review</a>
            </div>
        `;
        return;
    }

    // map tạo HTML cho từng bài, join ghép thành danh sách.
    const commentCounts = getCommentCountsByPostId();
    postList.innerHTML = posts.map(function (post) {
        return createPostCard(post, commentCounts);
    }).join("");
}

function toggleLike(postId) {
    const posts = getPosts();
    const post = posts.find(function (item) {
        return Number(item.id) === Number(postId);
    });

    if (!post) {
        showToast("Không tìm thấy bài viết", "error");
        return;
    }

    post.likedByCurrentUser = !post.likedByCurrentUser;
    post.likes = Math.max(0, Number(post.likes) + (post.likedByCurrentUser ? 1 : -1));
    savePosts(posts);
    renderPosts(posts);
    renderFavoriteRestaurants(posts);
    renderPostDetail(postId);
    if (typeof applyExploreFilters === "function") applyExploreFilters();
    if (typeof applySavedFilters === "function") applySavedFilters();
    showToast(post.likedByCurrentUser ? "Đã thích bài viết" : "Đã bỏ thích bài viết", "success");
}

function toggleSavePost(postId) {
    const posts = getPosts();
    const post = posts.find(function (item) {
        return Number(item.id) === Number(postId);
    });

    if (!post) {
        showToast("Không tìm thấy bài viết", "error");
        return;
    }

    post.isSaved = !post.isSaved;
    savePosts(posts);

    // filter tạo danh sách ID của các bài đang được lưu.
    const savedPostIds = posts.filter(function (item) {
        return item.isSaved;
    }).map(function (item) {
        return item.id;
    });

    saveData(STORAGE_KEYS.SAVED_POSTS, savedPostIds);
    renderPosts(posts);
    renderPostDetail(postId);
    if (typeof applyExploreFilters === "function") applyExploreFilters();
    if (typeof applySavedFilters === "function") applySavedFilters();
    showToast(post.isSaved ? "Đã lưu bài viết" : "Đã bỏ lưu bài viết", "success");
}

async function deletePost(postId) {
    const posts = getPosts();
    const currentUser = getCurrentUser();
    const post = posts.find(function (item) {
        return Number(item.id) === Number(postId);
    });

    if (!post) {
        showToast("Không tìm thấy bài viết", "error");
        return false;
    }
    if (!currentUser || Number(post.userId) !== Number(currentUser.id)) {
        showToast("Bạn không có quyền xóa bài viết này", "error");
        return false;
    }
    const shouldDelete = await showConfirmModal({
        title: "Xóa bài review?",
        message: "Bài viết sẽ bị xóa vĩnh viễn và không thể hoàn tác.",
        confirmText: "Xóa bài",
        danger: true
    });
    if (!shouldDelete) {
        return false;
    }

    const remainingPosts = posts.filter(function (post) {
        return Number(post.id) !== Number(postId);
    });

    savePosts(remainingPosts);
    saveComments(getComments().filter(function (comment) {
        return Number(comment.postId) !== Number(postId);
    }));
    const savedIds = remainingPosts.filter(function (item) {
        return item.isSaved;
    }).map(function (item) {
        return item.id;
    });
    saveData(STORAGE_KEYS.SAVED_POSTS, savedIds);
    renderPosts();
    renderMyPosts();
    if (typeof applyExploreFilters === "function") applyExploreFilters();
    if (typeof applySavedFilters === "function") applySavedFilters();
    showToast("Đã xóa bài review", "success");
    return true;
}

function getTopHashtags(posts) {
    const hashtagCounts = {};
    const hashtagNames = {};

    posts.forEach(function (post) {
        const hashtags = Array.isArray(post.hashtags) ? post.hashtags : [];
        const hashtagsInCurrentPost = new Set();

        hashtags.forEach(function (hashtag) {
            const cleanHashtag = String(hashtag).trim().replace(/^#+/, "");
            const normalizedHashtag = cleanHashtag.toLocaleLowerCase("vi-VN");

            // Một hashtag lặp trong cùng bài chỉ được tính một lần.
            if (!cleanHashtag || hashtagsInCurrentPost.has(normalizedHashtag)) {
                return;
            }

            hashtagsInCurrentPost.add(normalizedHashtag);
            hashtagNames[normalizedHashtag] = hashtagNames[normalizedHashtag] || cleanHashtag;
            hashtagCounts[normalizedHashtag] = (hashtagCounts[normalizedHashtag] || 0) + 1;
        });
    });

    return Object.entries(hashtagCounts)
        .map(function (entry) {
            return { name: hashtagNames[entry[0]], count: entry[1] };
        })
        .sort(function (firstTopic, secondTopic) {
            return secondTopic.count - firstTopic.count;
        })
        .slice(0, 5);
}

function getFavoriteRestaurants(posts) {
    const restaurantGroups = {};

    posts.forEach(function (post) {
        const name = String(post.restaurantName || "").trim();
        const normalizedName = name.toLocaleLowerCase("vi-VN");
        const rating = Number(post.rating);

        if (!name) {
            return;
        }

        if (!restaurantGroups[normalizedName]) {
            restaurantGroups[normalizedName] = {
                name: name,
                district: String(post.district || "Chưa rõ"),
                reviewCount: 0,
                ratingCount: 0,
                totalRating: 0,
                totalLikes: 0
            };
        }

        restaurantGroups[normalizedName].reviewCount += 1;
        restaurantGroups[normalizedName].totalLikes += Math.max(0, Number(post.likes) || 0);

        if (rating >= 1 && rating <= 5) {
            restaurantGroups[normalizedName].ratingCount += 1;
            restaurantGroups[normalizedName].totalRating += rating;
        }
    });

    return Object.values(restaurantGroups)
        .map(function (restaurant) {
            restaurant.averageRating = restaurant.ratingCount > 0
                ? restaurant.totalRating / restaurant.ratingCount
                : 0;
            return restaurant;
        })
        .sort(function (firstRestaurant, secondRestaurant) {
            if (secondRestaurant.averageRating !== firstRestaurant.averageRating) {
                return secondRestaurant.averageRating - firstRestaurant.averageRating;
            }

            return secondRestaurant.totalLikes - firstRestaurant.totalLikes;
        })
        .slice(0, 4);
}

function renderTrendingTopics(postsToUse) {
    const topicContainer = document.querySelector("#trending-topics");

    if (!topicContainer) {
        return;
    }

    const posts = Array.isArray(postsToUse) ? postsToUse : getPosts();
    const topics = getTopHashtags(posts);

    topicContainer.innerHTML = topics.map(function (topic) {
        return `
            <a class="trending-item topic-row" href="pages/explore.html?hashtag=${encodeURIComponent(topic.name)}">
                <span>#${escapeHTML(topic.name)}</span>
                <small>${topic.count} bài viết</small>
            </a>
        `;
    }).join("");
}

function renderFavoriteRestaurants(postsToUse) {
    const restaurantContainer = document.querySelector("#favorite-restaurants");

    if (!restaurantContainer) {
        return;
    }

    const posts = Array.isArray(postsToUse) ? postsToUse : getPosts();
    const restaurants = getFavoriteRestaurants(posts);

    restaurantContainer.innerHTML = restaurants.map(function (restaurant, index) {
        return `
            <li class="favorite-restaurant-item">
                <span class="rank">${index + 1}</span>
                <span>
                    <strong>${escapeHTML(restaurant.name)}</strong>
                    <small>${escapeHTML(restaurant.district)} · ${restaurant.reviewCount} bài</small>
                </span>
                <span class="score">
                    <i class="fa-solid fa-star" aria-hidden="true"></i>
                    ${restaurant.averageRating.toFixed(1)}
                </span>
            </li>
        `;
    }).join("");
}

function initializePostInteractions() {
    if (document.body.dataset.postInteractionsInitialized === "true") {
        return;
    }
    document.body.dataset.postInteractionsInitialized = "true";

    // Event delegation: một sự kiện chung xử lý các nút trong card được render động.
    document.addEventListener("click", async function (event) {
        const actionButton = event.target.closest("[data-action]");

        if (!actionButton) {
            return;
        }

        const postId = Number(actionButton.dataset.postId);
        const action = actionButton.dataset.action;

        if (action === "like") {
            toggleLike(postId);
        }

        if (action === "save") {
            toggleSavePost(postId);
        }

        if (action === "comment") {
            window.location.href = `${getPostPagePrefix()}post-detail.html?id=${postId}#comments`;
        }
        if (action === "delete-comment") {
            await handleDeleteComment(Number(actionButton.dataset.commentId));
        }
        if (action === "delete") {
            const wasDeleted = await deletePost(postId);
            if (wasDeleted && document.body.dataset.page === "post-detail") {
                window.location.href = "my-posts.html";
            }
        }
    });

    document.addEventListener("error", function (event) {
        const image = event.target;
        if (!(image instanceof HTMLImageElement) ||
            !image.matches(".post-image, .my-post-image, .post-detail-image, .comment-avatar-image")) {
            return;
        }

        if (image.dataset.fallbackApplied === "true") {
            image.hidden = true;
            return;
        }
        image.dataset.fallbackApplied = "true";
        if (image.matches(".comment-avatar-image")) {
            image.src = resolveAuthAvatar("assets/images/avatars/default-avatar.svg");
            image.alt = "Ảnh đại diện mặc định";
        } else {
            image.src = resolveImageSource("assets/images/posts/post-placeholder.svg");
            image.alt = "Ảnh minh họa mặc định cho bài review";
        }
    }, true);

    document.addEventListener("submit", function (event) {
        if (event.target.matches("#comment-form")) handleCommentSubmit(event);
    });

    document.addEventListener("input", function (event) {
        if (!event.target.matches("#comment-content")) return;
        const counter = document.querySelector("#comment-character-count");
        const error = document.querySelector("#comment-error");
        if (counter) counter.textContent = `${event.target.value.length}/500`;
        if (error && event.target.value.trim()) error.textContent = "";
    });
}

function createCommentItem(comment, currentUser) {
    const isOwner = currentUser && Number(comment.userId) === Number(currentUser.id);
    const avatar = resolveAuthAvatar(comment.authorAvatar || "assets/images/avatars/default-avatar.svg");
    return `
        <li class="comment-item" data-comment-id="${Number(comment.id)}">
            <img class="comment-avatar-image" src="${escapeHTML(avatar)}" width="42" height="42"
                alt="Ảnh đại diện của ${escapeHTML(comment.authorName)}" loading="lazy">
            <div class="comment-content">
                <header class="comment-header">
                    <span><strong>${escapeHTML(comment.authorName)}</strong>${isOwner ? '<small class="comment-owner-badge">Bạn</small>' : ""}</span>
                    <time datetime="${escapeHTML(comment.createdAt)}">${escapeHTML(formatDateTime(comment.createdAt))}</time>
                </header>
                <p>${escapeHTML(comment.content)}</p>
            </div>
            ${isOwner ? `<button class="comment-delete-button" type="button" data-action="delete-comment"
                data-comment-id="${Number(comment.id)}" aria-label="Xóa bình luận của bạn">
                <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
            </button>` : ""}
        </li>
    `;
}

function createCommentsSection(postId) {
    const currentUser = getCurrentUser();
    const comments = getCommentsForPost(postId);
    const redirect = encodeURIComponent(`post-detail.html?id=${Number(postId)}#comments`);
    const formHTML = currentUser ? `
        <form class="comment-form" id="comment-form" novalidate>
            <img class="comment-avatar-image" src="${escapeHTML(resolveAuthAvatar(currentUser.avatar || "assets/images/avatars/default-avatar.svg"))}"
                width="42" height="42" alt="Ảnh đại diện của ${escapeHTML(currentUser.fullname)}">
            <div class="comment-form-body">
                <label for="comment-content">Chia sẻ cảm nhận của bạn</label>
                <textarea id="comment-content" rows="4" maxlength="500" placeholder="Viết bình luận..." aria-describedby="comment-error comment-character-count"></textarea>
                <div class="comment-form-meta"><p class="field-error" id="comment-error" aria-live="polite"></p><span id="comment-character-count">0/500</span></div>
                <button class="button button-primary" type="submit">Gửi bình luận</button>
            </div>
        </form>
    ` : `
        <div class="comment-login-prompt">
            <p>Bạn cần đăng nhập để bình luận.</p>
            <a class="button button-primary" href="auth.html?mode=login&amp;redirect=${redirect}">Đăng nhập</a>
        </div>
    `;
    const listHTML = comments.length
        ? `<ul class="comment-list">${comments.map(function (comment) { return createCommentItem(comment, currentUser); }).join("")}</ul>`
        : `<p class="comment-empty-state">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận.</p>`;

    return `
        <section class="comments-section card" id="comments" aria-labelledby="comments-title">
            <header class="comments-heading"><h2 id="comments-title">Bình luận</h2><span>${comments.length} bình luận</span></header>
            ${formHTML}
            ${listHTML}
        </section>
    `;
}

function handleCommentSubmit(event) {
    event.preventDefault();
    const currentUser = getCurrentUser();
    const postId = getPostIdFromUrl();
    const textarea = event.target.querySelector("#comment-content");
    const error = event.target.querySelector("#comment-error");
    if (!currentUser || !postId || !textarea) return;
    const validation = validateComment(textarea.value);
    if (!validation.isValid) {
        if (error) error.textContent = validation.message;
        textarea.focus();
        return;
    }
    const comments = getComments();
    comments.push({
        id: generateId(comments),
        postId,
        userId: currentUser.id,
        authorName: currentUser.fullname,
        authorAvatar: currentUser.avatar || "assets/images/avatars/default-avatar.svg",
        content: validation.value,
        createdAt: new Date().toISOString(),
        updatedAt: null
    });
    saveComments(comments);
    renderPostDetail(postId);
    showToast("Đã thêm bình luận.", "success");
}

async function handleDeleteComment(commentId) {
    const currentUser = getCurrentUser();
    const comments = getComments();
    const comment = comments.find(function (item) { return Number(item.id) === Number(commentId); });
    if (!comment || !currentUser || Number(comment.userId) !== Number(currentUser.id)) {
        showToast("Bạn không có quyền xóa bình luận này.", "error");
        return false;
    }
    const shouldDelete = await showConfirmModal({
        title: "Xóa bình luận?",
        message: "Bạn có chắc muốn xóa bình luận này không?",
        confirmText: "Xóa bình luận",
        danger: true
    });
    if (!shouldDelete) return false;
    saveComments(comments.filter(function (item) { return Number(item.id) !== Number(commentId); }));
    renderPostDetail(getPostIdFromUrl());
    showToast("Đã xóa bình luận.", "success");
    return true;
}

function collectPostFormData() {
    return {
        title: document.querySelector("#post-title").value.trim(),
        restaurantName: document.querySelector("#restaurant-name").value.trim(),
        category: document.querySelector("#post-category").value,
        district: document.querySelector("#post-district").value,
        address: document.querySelector("#post-address").value.trim(),
        rating: Number(document.querySelector("#post-rating").value),
        content: document.querySelector("#post-content").value.trim(),
        image: normalizeImagePath(document.querySelector("#post-image").value),
        hashtags: parseHashtags(document.querySelector("#post-hashtags").value)
    };
}

function createPost(postData) {
    const posts = getPosts();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "auth.html?mode=login";
        return null;
    }

    const newPost = {
        id: generateId(posts),
        userId: currentUser.id,
        authorName: currentUser.fullname,
        authorAvatar: currentUser.avatar,
        title: postData.title,
        restaurantName: postData.restaurantName,
        category: postData.category,
        district: postData.district,
        address: postData.address,
        rating: Number(postData.rating),
        content: postData.content,
        image: postData.image,
        hashtags: postData.hashtags,
        likes: 0,
        likedByCurrentUser: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
        updatedAt: null
    };

    posts.unshift(newPost);
    if (!savePosts(posts)) {
        showToast("Không đủ dung lượng để lưu bài. Hãy chọn ảnh nhỏ hơn hoặc xóa bớt dữ liệu.", "error");
        return null;
    }
    showToast("Đã đăng bài review", "success");
    window.setTimeout(function () {
        window.location.href = "my-posts.html";
    }, 350);
    return newPost;
}

function updatePost(postId, postData) {
    const posts = getPosts();
    const currentUser = getCurrentUser();
    const post = posts.find(function (item) {
        return Number(item.id) === Number(postId);
    });

    if (!post || !currentUser || Number(post.userId) !== Number(currentUser.id)) {
        showToast("Bạn không có quyền sửa bài viết này", "error");
        return false;
    }

    post.title = postData.title;
    post.restaurantName = postData.restaurantName;
    post.category = postData.category;
    post.district = postData.district;
    post.address = postData.address;
    post.rating = Number(postData.rating);
    post.content = postData.content;
    post.image = postData.image;
    post.hashtags = postData.hashtags;
    post.updatedAt = new Date().toISOString();

    if (!savePosts(posts)) {
        showToast("Không đủ dung lượng để lưu thay đổi. Hãy chọn ảnh nhỏ hơn.", "error");
        return false;
    }
    showToast("Đã cập nhật bài review", "success");
    window.setTimeout(function () {
        window.location.href = "my-posts.html";
    }, 350);
    return true;
}

function getCurrentUserPosts() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return [];
    }

    return getPosts().filter(function (post) {
        return Number(post.userId) === Number(currentUser.id);
    }).sort(function (firstPost, secondPost) {
        return new Date(secondPost.createdAt) - new Date(firstPost.createdAt);
    });
}

function createMyPostCard(post, commentCounts) {
    const imageHTML = post.image
        ? `<img class="my-post-image" src="${escapeHTML(resolveImageSource(post.image))}" alt="Ảnh ${escapeHTML(post.restaurantName)}" loading="lazy" decoding="async">`
        : `<div class="my-post-image-placeholder"><i class="fa-solid fa-utensils"></i></div>`;
    const excerpt = String(post.content || "").length > 150
        ? String(post.content).slice(0, 150) + "..."
        : String(post.content || "");
    const commentCount = commentCounts instanceof Map
        ? (commentCounts.get(Number(post.id)) || 0)
        : getCommentCount(post.id);

    return `
        <article class="my-post-card" data-post-id="${Number(post.id)}">
            ${imageHTML}
            <div class="my-post-content">
                <h2>${escapeHTML(post.title)}</h2>
                <p class="my-post-restaurant">${escapeHTML(post.restaurantName)}</p>
                <div class="my-post-meta">
                    <span>${createRatingStars(post.rating)}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${escapeHTML(post.address)}</span>
                    <span>Đăng ${escapeHTML(formatDateTime(post.createdAt))}</span>
                    <span><i class="fa-regular fa-comment"></i> ${commentCount} bình luận</span>
                    ${post.updatedAt ? `<span class="updated-label">Đã cập nhật ${escapeHTML(formatDateTime(post.updatedAt))}</span>` : ""}
                </div>
                <p class="my-post-excerpt">${escapeHTML(excerpt)}</p>
                <div class="my-post-actions">
                    <a class="button button-outline" href="post-detail.html?id=${Number(post.id)}">Xem chi tiết</a>
                    <a class="button button-outline" href="edit-post.html?id=${Number(post.id)}">Sửa</a>
                    <button class="button button-delete" type="button" data-action="delete" data-post-id="${Number(post.id)}">Xóa</button>
                </div>
            </div>
        </article>
    `;
}

function renderMyPosts() {
    const container = document.querySelector("#my-post-list");
    if (!container) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
        container.innerHTML = createPostErrorState("Bạn cần đăng nhập để xem bài viết.", "auth.html?mode=login", "Đăng nhập");
        return;
    }

    const posts = getCurrentUserPosts();
    const countElement = document.querySelector("#my-post-count");
    if (countElement) countElement.textContent = posts.length;

    if (posts.length === 0) {
        container.innerHTML = `<div class="empty-state card"><i class="fa-regular fa-pen-to-square"></i><h2>Bạn chưa đăng bài review nào.</h2><a class="button button-primary" href="create-post.html">Tạo bài đầu tiên</a></div>`;
        return;
    }
    const commentCounts = getCommentCountsByPostId();
    container.innerHTML = posts.map(function (post) {
        return createMyPostCard(post, commentCounts);
    }).join("");
}

function createPostErrorState(message, href = "../index.html", label = "Về trang chủ") {
    return `<div class="error-state card"><i class="fa-regular fa-circle-xmark"></i><h2>${escapeHTML(message)}</h2><a class="button button-primary" href="${href}">${label}</a></div>`;
}

function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const postId = Number(params.get("id"));
    return Number.isInteger(postId) && postId > 0 ? postId : null;
}

function renderPostDetail(postId) {
    const container = document.querySelector("#post-detail-container");
    if (!container) return;

    const post = getPostById(postId);
    if (!post) {
        container.innerHTML = createPostErrorState("Không tìm thấy bài review.");
        return;
    }

    const currentUser = getCurrentUser();
    const isOwner = currentUser && Number(currentUser.id) === Number(post.userId);
    const hashtags = (Array.isArray(post.hashtags) ? post.hashtags : []).map(function (tag) {
        return `<span>#${escapeHTML(tag)}</span>`;
    }).join("");
    const imageHTML = post.image
        ? `<img class="post-detail-image post-image" src="${escapeHTML(resolveImageSource(post.image))}" alt="Ảnh tại ${escapeHTML(post.restaurantName)}" decoding="async">`
        : "";

    container.innerHTML = `
        <article class="post-detail-card">
            <header class="post-detail-header">
                <div class="post-detail-author"><span class="post-avatar">${escapeHTML(String(post.authorName || "U").charAt(0))}</span><span><strong>${escapeHTML(post.authorName)}</strong><small>${escapeHTML(formatDateTime(post.createdAt))}</small></span></div>
            </header>
            <div class="post-detail-body">
                <div class="post-detail-meta"><span>${escapeHTML(post.category)}</span><span>${escapeHTML(post.district)}</span><span>${createRatingStars(post.rating)}</span></div>
                <h1>${escapeHTML(post.title)}</h1><p class="restaurant-name">${escapeHTML(post.restaurantName)}</p>
                <p class="post-location"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(post.address)}</p>
                <p>${escapeHTML(post.content)}</p>${imageHTML}<div class="post-hashtags">${hashtags}</div>
            </div>
            <div class="post-detail-actions">
                <button class="${post.likedByCurrentUser ? "active" : ""}" type="button" data-action="like" data-post-id="${Number(post.id)}"><i class="${post.likedByCurrentUser ? "fa-solid" : "fa-regular"} fa-heart"></i> ${Number(post.likes) || 0} lượt thích</button>
                <button class="${post.isSaved ? "active" : ""}" type="button" data-action="save" data-post-id="${Number(post.id)}"><i class="${post.isSaved ? "fa-solid" : "fa-regular"} fa-bookmark"></i> ${post.isSaved ? "Đã lưu" : "Lưu"}</button>
            </div>
            ${isOwner ? `<div class="post-owner-actions"><a class="button button-outline" href="edit-post.html?id=${Number(post.id)}">Sửa</a><button class="button button-delete" type="button" data-action="delete" data-post-id="${Number(post.id)}">Xóa</button></div>` : ""}
        </article>
        ${createCommentsSection(post.id)}
    `;
}

function setupPostFormValidation() {
    const fields = ["title", "restaurant", "category", "district", "address", "rating", "content", "image", "hashtags"];
    fields.forEach(function (fieldName) {
        const config = getPostFieldConfig(fieldName);
        const field = document.querySelector(config.selector);
        if (!field) return;
        field.addEventListener("blur", function () {
            validatePostField(fieldName);
        });
        field.addEventListener(field.tagName === "SELECT" ? "change" : "input", function () {
            if (field.classList.contains("is-invalid")) validatePostField(fieldName);
        });
    });
}

function setupImagePreview() {
    const input = document.querySelector("#post-image");
    const fileInput = document.querySelector("#post-image-file");
    const preview = document.querySelector("#image-preview");
    if (!input || !fileInput || !preview) return;
    const image = preview.querySelector("img");
    const removeButton = document.querySelector("#remove-post-image");
    const errorElement = document.querySelector("#post-image-error");
    const form = input.closest("form");

    function renderPreview() {
        if (!input.value.trim()) {
            preview.hidden = true;
            image.removeAttribute("src");
            return;
        }
        image.src = resolveImageSource(input.value);
        preview.hidden = false;
    }

    function setImageError(message) {
        errorElement.textContent = message || "";
        fileInput.classList.toggle("is-invalid", Boolean(message));
    }

    function optimizeImage(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onerror = function () { reject(new Error("Không thể đọc tệp ảnh.")); };
            reader.onload = function () {
                const sourceImage = new Image();
                sourceImage.onerror = function () { reject(new Error("Tệp đã chọn không phải ảnh hợp lệ.")); };
                sourceImage.onload = function () {
                    const maximumDimension = 1400;
                    const scale = Math.min(1, maximumDimension / Math.max(sourceImage.width, sourceImage.height));
                    const canvas = document.createElement("canvas");
                    canvas.width = Math.max(1, Math.round(sourceImage.width * scale));
                    canvas.height = Math.max(1, Math.round(sourceImage.height * scale));
                    const context = canvas.getContext("2d");
                    context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL("image/webp", .82);
                    if (dataUrl.length > 1400000) {
                        reject(new Error("Ảnh vẫn quá lớn sau khi tối ưu. Vui lòng chọn ảnh nhỏ hơn."));
                        return;
                    }
                    resolve(dataUrl);
                };
                sourceImage.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    input.addEventListener("input", renderPreview);
    fileInput.addEventListener("change", async function () {
        const file = fileInput.files && fileInput.files[0];
        setImageError("");
        if (!file) return;
        const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!supportedTypes.includes(file.type) || !validateImageFile(file)) {
            fileInput.value = "";
            setImageError("Vui lòng chọn ảnh JPG, PNG hoặc WebP không quá 2 MB.");
            return;
        }

        if (form) form.dataset.imageProcessing = "true";
        try {
            input.value = await optimizeImage(file);
            renderPreview();
        } catch (error) {
            fileInput.value = "";
            setImageError(error.message || "Không thể xử lý ảnh đã chọn.");
        } finally {
            if (form) delete form.dataset.imageProcessing;
        }
    });

    if (removeButton) {
        removeButton.addEventListener("click", function () {
            input.value = "";
            fileInput.value = "";
            setImageError("");
            renderPreview();
        });
    }

    image.addEventListener("error", function () {
        preview.hidden = true;
        image.removeAttribute("src");
    });

    if (form) {
        form.addEventListener("reset", function () {
            input.value = "";
            fileInput.value = "";
            setImageError("");
            preview.hidden = true;
            image.removeAttribute("src");
        });

        const cancelLink = document.querySelector(".post-cancel-link");
        if (cancelLink) {
            cancelLink.addEventListener("click", function () {
                form.reset();
            });
        }
    }
}

function handlePostFormSubmit(event, postId = null) {
    event.preventDefault();
    if (event.currentTarget.dataset.imageProcessing === "true") {
        showToast("Ảnh đang được xử lý, vui lòng đợi một chút.", "info");
        return;
    }
    if (!validatePostForm()) {
        const invalidInput = event.currentTarget.querySelector(".is-invalid");
        if (invalidInput) invalidInput.focus();
        return;
    }

    const postData = collectPostFormData();
    if (postId) updatePost(postId, postData);
    else createPost(postData);
}

function initializeCreatePostPage() {
    if (!getCurrentUser()) {
        window.location.href = "auth.html?mode=login";
        return;
    }
    const form = document.querySelector("#post-form");
    form.addEventListener("submit", handlePostFormSubmit);
    setupPostFormValidation();
    setupImagePreview();
}

function initializeEditPostPage() {
    const postId = getPostIdFromUrl();
    const post = postId ? getPostById(postId) : null;
    const currentUser = getCurrentUser();
    const message = document.querySelector("#post-page-message");
    const formContainer = document.querySelector("#post-form-container");

    if (!post || !currentUser || Number(post.userId) !== Number(currentUser.id)) {
        formContainer.hidden = true;
        message.innerHTML = createPostErrorState(post ? "Bạn không có quyền sửa bài viết này." : "Không tìm thấy bài review.", "my-posts.html", "Về bài của tôi");
        return;
    }

    document.querySelector("#post-id").value = post.id;
    document.querySelector("#post-title").value = post.title;
    document.querySelector("#restaurant-name").value = post.restaurantName;
    document.querySelector("#post-category").value = post.category;
    document.querySelector("#post-district").value = post.district;
    document.querySelector("#post-address").value = post.address;
    document.querySelector("#post-rating").value = post.rating;
    document.querySelector("#post-content").value = post.content;
    document.querySelector("#post-image").value = post.image || "";
    document.querySelector("#post-hashtags").value = (post.hashtags || []).join(", ");

    const form = document.querySelector("#post-form");
    form.addEventListener("submit", function (event) {
        handlePostFormSubmit(event, postId);
    });
    setupPostFormValidation();
    setupImagePreview();
    if (post.image) {
        document.querySelector("#post-image").dispatchEvent(new Event("input"));
    }
}

function initializeMyPostsPage() {
    renderMyPosts();
}

function initializePostDetailPage() {
    renderPostDetail(getPostIdFromUrl());
    if (window.location.hash === "#comments") {
        window.setTimeout(function () {
            const commentsSection = document.querySelector("#comments");
            if (commentsSection) commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
    }
}

function initializePostPage() {
    const pageName = document.body.dataset.page;
    const postPages = ["create-post", "edit-post", "my-posts", "post-detail"];

    if (!postPages.includes(pageName) || document.body.dataset.postPageInitialized === "true") {
        return;
    }

    // Tránh gắn trùng listener nếu hàm khởi tạo bị gọi lại.
    document.body.dataset.postPageInitialized = "true";
    if (pageName === "create-post") initializeCreatePostPage();
    if (pageName === "edit-post") initializeEditPostPage();
    if (pageName === "my-posts") initializeMyPostsPage();
    if (pageName === "post-detail") initializePostDetailPage();
}
