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
    const isPageFolder = document.body && document.body.dataset.page;

    if (cleanPath.startsWith("assets/") && isPageFolder) {
        return "../" + cleanPath;
    }

    return cleanPath;
}

function getPostPagePrefix() {
    return document.body && document.body.dataset.page ? "" : "pages/";
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
    if (!post.image) {
        return "";
    }

    return `
        <img class="post-image"
            src="${escapeHTML(resolveImageSource(post.image))}"
            alt="Hình ảnh tại ${escapeHTML(post.restaurantName)}"
            loading="lazy"
            decoding="async">
    `;
}

function createPostCard(post) {
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
                    <span>Bình luận</span>
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
    postList.innerHTML = posts.map(createPostCard).join("");
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
            showToast("Bình luận sẽ được hoàn thiện ở giai đoạn tiếp theo", "info");
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
            !image.matches(".post-image, .my-post-image, .post-detail-image")) {
            return;
        }

        const fallback = document.createElement("div");
        fallback.className = `${image.className} image-fallback`;
        fallback.setAttribute("role", "img");
        fallback.setAttribute("aria-label", "Không thể tải ảnh bài viết");

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-image";
        icon.setAttribute("aria-hidden", "true");

        const message = document.createElement("span");
        message.textContent = "Ảnh hiện không khả dụng";

        fallback.append(icon, message);
        image.replaceWith(fallback);
    }, true);
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
        window.location.href = "login.html";
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
    savePosts(posts);
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

    savePosts(posts);
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

function createMyPostCard(post) {
    const imageHTML = post.image
        ? `<img class="my-post-image" src="${escapeHTML(resolveImageSource(post.image))}" alt="Ảnh ${escapeHTML(post.restaurantName)}" loading="lazy" decoding="async">`
        : `<div class="my-post-image-placeholder"><i class="fa-solid fa-utensils"></i></div>`;
    const excerpt = String(post.content || "").length > 150
        ? String(post.content).slice(0, 150) + "..."
        : String(post.content || "");

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
        container.innerHTML = createPostErrorState("Bạn cần đăng nhập để xem bài viết.", "login.html", "Đăng nhập");
        return;
    }

    const posts = getCurrentUserPosts();
    const countElement = document.querySelector("#my-post-count");
    if (countElement) countElement.textContent = posts.length;

    if (posts.length === 0) {
        container.innerHTML = `<div class="empty-state card"><i class="fa-regular fa-pen-to-square"></i><h2>Bạn chưa đăng bài review nào.</h2><a class="button button-primary" href="create-post.html">Tạo bài đầu tiên</a></div>`;
        return;
    }
    container.innerHTML = posts.map(createMyPostCard).join("");
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
    const preview = document.querySelector("#image-preview");
    if (!input || !preview) return;
    const image = preview.querySelector("img");
    const form = input.closest("form");

    input.addEventListener("input", function () {
        if (!input.value.trim()) {
            preview.hidden = true;
            return;
        }
        image.src = resolveImageSource(input.value);
        preview.hidden = false;
    });
    image.addEventListener("error", function () {
        preview.hidden = true;
        image.removeAttribute("src");
    });

    if (form) {
        form.addEventListener("reset", function () {
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
        window.location.href = "login.html";
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
