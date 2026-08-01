"use strict";

/**
 * saved.js
 * Hiển thị, tìm kiếm và sắp xếp các bài review đã lưu.
 */

function getSavedPosts() {
    return getPosts().filter(function (post) {
        return post.isSaved === true;
    });
}

function filterSavedPosts(posts, keyword) {
    return searchPosts(posts, keyword);
}

function sortSavedPosts(posts, sortType) {
    const sortedPosts = [...posts];

    sortedPosts.sort(function (firstPost, secondPost) {
        if (sortType === "rating-desc") {
            return Number(secondPost.rating) - Number(firstPost.rating);
        }
        if (sortType === "likes-desc") {
            return Number(secondPost.likes) - Number(firstPost.likes);
        }
        return new Date(secondPost.createdAt) - new Date(firstPost.createdAt);
    });

    return sortedPosts;
}

function renderSavedPosts(postsToRender) {
    const container = document.querySelector("#saved-post-list");
    if (!container) return;

    const posts = Array.isArray(postsToRender) ? postsToRender : getSavedPosts();
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="search-empty-state card">
                <i class="fa-regular fa-bookmark" aria-hidden="true"></i>
                <h3>Bạn chưa lưu bài viết nào</h3>
                <p>Hãy khám phá và lưu lại những địa điểm bạn yêu thích.</p>
                <a class="button button-primary" href="explore.html">Khám phá ngay</a>
            </div>
        `;
        return;
    }

    const commentCounts = getCommentCountsByPostId();
    container.innerHTML = posts.map(function (post) {
        return createPostCard(post, commentCounts);
    }).join("");
}

function updateSavedPostCount(count) {
    const countElement = document.querySelector("#saved-post-count");
    if (countElement) countElement.textContent = `Bạn đã lưu ${count} bài viết`;
}

function applySavedFilters() {
    const container = document.querySelector("#saved-post-list");
    const searchInput = document.querySelector("#saved-search");
    const sortInput = document.querySelector("#saved-sort");
    if (!container || !searchInput || !sortInput) return;

    const savedPosts = getSavedPosts();
    const keyword = searchInput.value;
    const sortType = sortInput.value;
    let visiblePosts = filterSavedPosts(savedPosts, keyword);

    visiblePosts = sortSavedPosts(visiblePosts, sortType);
    renderSavedPosts(visiblePosts);
    updateSavedPostCount(savedPosts.length);
}

function removeSavedPost(postId) {
    const post = getPostById(postId);
    if (!post || !post.isSaved) return;
    toggleSavePost(postId);
}

function initializeSavedPage() {
    const page = document.querySelector("[data-page='saved']");
    if (!page || page.dataset.savedInitialized === "true") return;
    const searchInput = document.querySelector("#saved-search");
    const sortInput = document.querySelector("#saved-sort");
    const postList = document.querySelector("#saved-post-list");
    if (!searchInput || !sortInput || !postList) return;

    page.dataset.savedInitialized = "true";

    const handleSavedSearch = typeof debounce === "function"
        ? debounce(applySavedFilters, 250)
        : applySavedFilters;
    searchInput.addEventListener("input", handleSavedSearch);
    sortInput.addEventListener("change", applySavedFilters);
    applySavedFilters();
}
