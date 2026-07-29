"use strict";

/**
 * search.js
 * Tìm kiếm, lọc và sắp xếp bài review trên trang Khám phá.
 */

function normalizeText(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLocaleLowerCase("vi-VN")
        .replace(/\s+/g, " ")
        .trim();
}

function searchPosts(posts, keyword) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) return posts;

    return posts.filter(function (post) {
        const searchableText = [
            post.title,
            post.restaurantName,
            post.content,
            post.address,
            Array.isArray(post.hashtags) ? post.hashtags.join(" ") : ""
        ].map(normalizeText).join(" ");

        return searchableText.includes(normalizedKeyword);
    });
}

function filterPostsByCategory(posts, category) {
    if (!category || category === "all") return posts;
    return posts.filter(function (post) {
        return post.category === category;
    });
}

function filterPostsByDistrict(posts, district) {
    if (!district || district === "all") return posts;
    return posts.filter(function (post) {
        return post.district === district;
    });
}

function filterPostsByRating(posts, ratingValue) {
    if (!ratingValue || ratingValue === "all") return posts;
    const minimumRating = Number(ratingValue);

    return posts.filter(function (post) {
        const rating = Number(post.rating);
        return minimumRating === 5 ? rating === 5 : rating >= minimumRating;
    });
}

function sortExplorePosts(posts, sortType) {
    const sortedPosts = [...posts];

    sortedPosts.sort(function (firstPost, secondPost) {
        if (sortType === "oldest") {
            return new Date(firstPost.createdAt) - new Date(secondPost.createdAt);
        }
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

function renderExplorePosts(posts) {
    const container = document.querySelector("#explore-post-list");
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = `
            <div class="search-empty-state card">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <h3>Không tìm thấy bài review phù hợp</h3>
                <p>Hãy thử thay đổi từ khóa hoặc bộ lọc.</p>
                <button class="button button-primary" type="button" data-explore-action="reset">Đặt lại bộ lọc</button>
            </div>
        `;
        return;
    }

    container.innerHTML = posts.map(createPostCard).join("");
}

function updateExploreResultCount(filteredCount, totalCount) {
    const countElement = document.querySelector("#explore-result-count");
    if (countElement) {
        countElement.textContent = `Hiển thị ${filteredCount}/${totalCount} bài review`;
    }
}

function applyExploreFilters() {
    const container = document.querySelector("#explore-post-list");
    const searchInput = document.querySelector("#explore-search");
    const categoryInput = document.querySelector("#explore-category");
    const districtInput = document.querySelector("#explore-district");
    const ratingInput = document.querySelector("#explore-rating");
    const sortInput = document.querySelector("#explore-sort");
    if (!container || !searchInput || !categoryInput || !districtInput || !ratingInput || !sortInput) return;

    const allPosts = getPosts();
    const keyword = searchInput.value;
    const category = categoryInput.value;
    const district = districtInput.value;
    const rating = ratingInput.value;
    const sortType = sortInput.value;
    let filteredPosts = searchPosts(allPosts, keyword);

    filteredPosts = filterPostsByCategory(filteredPosts, category);
    filteredPosts = filterPostsByDistrict(filteredPosts, district);
    filteredPosts = filterPostsByRating(filteredPosts, rating);
    filteredPosts = sortExplorePosts(filteredPosts, sortType);
    renderExplorePosts(filteredPosts);
    updateExploreResultCount(filteredPosts.length, allPosts.length);
}

function resetExploreFilters() {
    const values = {
        "explore-search": "",
        "explore-category": "all",
        "explore-district": "all",
        "explore-rating": "all",
        "explore-sort": "newest"
    };

    Object.entries(values).forEach(function (entry) {
        const input = document.querySelector(`#${entry[0]}`);
        if (input) input.value = entry[1];
    });
    applyExploreFilters();
}

function renderExploreQuickTags() {
    const container = document.querySelector("#explore-quick-tags");
    if (!container) return;

    container.innerHTML = getTopHashtags(getPosts()).map(function (topic) {
        return `<button class="quick-tag" type="button" data-hashtag="${escapeHTML(topic.name)}">#${escapeHTML(topic.name)}</button>`;
    }).join("");
}

function initializeExplorePage() {
    const page = document.querySelector("[data-page='explore']");
    if (!page || page.dataset.exploreInitialized === "true") return;

    const searchInput = document.querySelector("#explore-search");
    const filterInputs = ["explore-category", "explore-district", "explore-rating", "explore-sort"]
        .map(function (id) {
            return document.querySelector(`#${id}`);
        });
    const resetButton = document.querySelector("#reset-explore-filters");
    const postList = document.querySelector("#explore-post-list");
    const quickTags = document.querySelector("#explore-quick-tags");
    if (!searchInput || filterInputs.some(function (input) { return !input; }) || !resetButton || !postList || !quickTags) return;

    page.dataset.exploreInitialized = "true";
    const params = new URLSearchParams(window.location.search);
    const hashtag = params.get("hashtag");
    if (hashtag) searchInput.value = hashtag;

    const handleSearchInput = typeof debounce === "function"
        ? debounce(applyExploreFilters, 250)
        : applyExploreFilters;
    searchInput.addEventListener("input", handleSearchInput);
    filterInputs.forEach(function (input) {
        input.addEventListener("change", applyExploreFilters);
    });
    resetButton.addEventListener("click", resetExploreFilters);
    postList.addEventListener("click", function (event) {
        if (event.target.closest("[data-explore-action='reset']")) resetExploreFilters();
    });
    quickTags.addEventListener("click", function (event) {
        const tagButton = event.target.closest("[data-hashtag]");
        if (!tagButton) return;
        searchInput.value = tagButton.dataset.hashtag;
        applyExploreFilters();
    });

    renderExploreQuickTags();
    applyExploreFilters();
}
