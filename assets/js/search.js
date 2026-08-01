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
    if (!normalizedKeyword) return [...posts];

    return posts.map(function (post, index) {
        const restaurantName = normalizeText(post.restaurantName);
        const title = normalizeText(post.title);
        const hashtags = normalizeText(Array.isArray(post.hashtags)
            ? post.hashtags.map(function (tag) { return `#${tag} ${tag}`; }).join(" ")
            : post.hashtags);
        const district = normalizeText(post.district);
        const category = normalizeText(post.category);
        const content = normalizeText(post.content);
        const author = normalizeText(post.authorName || post.author);
        let relevance = 0;

        if (restaurantName === normalizedKeyword) relevance = 700;
        else if (restaurantName.startsWith(normalizedKeyword)) relevance = 600;
        else if (restaurantName.includes(normalizedKeyword)) relevance = 550;
        else if (title.includes(normalizedKeyword)) relevance = 500;
        else if (hashtags.includes(normalizedKeyword)) relevance = 400;
        else if (district.includes(normalizedKeyword) || category.includes(normalizedKeyword)) relevance = 300;
        else if (content.includes(normalizedKeyword)) relevance = 200;
        else if (author.includes(normalizedKeyword)) relevance = 100;

        return { post, relevance, index };
    }).filter(function (result) {
        return result.relevance > 0;
    }).sort(function (first, second) {
        return second.relevance - first.relevance || first.index - second.index;
    }).map(function (result) {
        return result.post;
    });
}

function buildSearchSuggestions(posts) {
    const uniqueSuggestions = new Map();

    posts.forEach(function (post) {
        const values = [
            post.restaurantName,
            post.title,
            ...(Array.isArray(post.hashtags) ? post.hashtags.map(function (tag) { return `#${tag}`; }) : []),
            post.district,
            post.category
        ];
        values.forEach(function (value) {
            const label = String(value || "").trim();
            const normalizedLabel = normalizeText(label);
            if (label && normalizedLabel && !uniqueSuggestions.has(normalizedLabel)) {
                uniqueSuggestions.set(normalizedLabel, label);
            }
        });
    });

    return Array.from(uniqueSuggestions, function (entry) {
        return { normalized: entry[0], label: entry[1] };
    });
}

function getMatchingSuggestions(suggestions, keyword, limit = 8) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) return [];

    return suggestions.filter(function (suggestion) {
        return suggestion.normalized.includes(normalizedKeyword);
    }).sort(function (first, second) {
        const firstStarts = first.normalized.startsWith(normalizedKeyword);
        const secondStarts = second.normalized.startsWith(normalizedKeyword);
        if (firstStarts !== secondStarts) return firstStarts ? -1 : 1;
        return first.label.localeCompare(second.label, "vi");
    }).slice(0, limit);
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

    const commentCounts = getCommentCountsByPostId();
    container.innerHTML = posts.map(function (post) {
        return createPostCard(post, commentCounts);
    }).join("");
}

function updateExploreResultCount(filteredCount, totalCount, hasControls) {
    const countElement = document.querySelector("#explore-result-count");
    if (countElement) {
        countElement.textContent = hasControls
            ? `Tìm thấy ${filteredCount} bài review`
            : `Hiển thị tất cả ${totalCount} bài review`;
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
    if (!normalizeText(keyword) || sortType !== "newest") {
        filteredPosts = sortExplorePosts(filteredPosts, sortType);
    }
    renderExplorePosts(filteredPosts);
    const hasControls = Boolean(normalizeText(keyword))
        || category !== "all" || district !== "all" || rating !== "all";
    updateExploreResultCount(filteredPosts.length, allPosts.length, hasControls);
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

function initializeSearchSuggestions(searchInput) {
    const suggestionList = document.querySelector("#explore-search-suggestions");
    if (!suggestionList) return;
    const suggestions = buildSearchSuggestions(getPosts());
    let visibleSuggestions = [];
    let activeIndex = -1;

    function closeSuggestions() {
        visibleSuggestions = [];
        activeIndex = -1;
        suggestionList.hidden = true;
        suggestionList.replaceChildren();
        searchInput.setAttribute("aria-expanded", "false");
        searchInput.removeAttribute("aria-activedescendant");
    }

    function setActiveSuggestion(index) {
        const options = suggestionList.querySelectorAll("[role='option']");
        if (!options.length) return;
        activeIndex = (index + options.length) % options.length;
        options.forEach(function (option, optionIndex) {
            const isActive = optionIndex === activeIndex;
            option.classList.toggle("is-active", isActive);
            option.setAttribute("aria-selected", String(isActive));
        });
        searchInput.setAttribute("aria-activedescendant", options[activeIndex].id);
        options[activeIndex].scrollIntoView({ block: "nearest" });
    }

    function chooseSuggestion(index) {
        const suggestion = visibleSuggestions[index];
        if (!suggestion) return;
        searchInput.value = suggestion.label;
        closeSuggestions();
        applyExploreFilters();
    }

    function renderSuggestions() {
        visibleSuggestions = getMatchingSuggestions(suggestions, searchInput.value);
        activeIndex = -1;
        suggestionList.replaceChildren();
        if (!visibleSuggestions.length) {
            closeSuggestions();
            return;
        }
        visibleSuggestions.forEach(function (suggestion, index) {
            const option = document.createElement("button");
            option.type = "button";
            option.className = "search-suggestion";
            option.id = `explore-suggestion-${index}`;
            option.dataset.suggestionIndex = String(index);
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", "false");
            option.textContent = suggestion.label;
            suggestionList.appendChild(option);
        });
        suggestionList.hidden = false;
        searchInput.setAttribute("aria-expanded", "true");
    }

    const renderSuggestionsDebounced = typeof debounce === "function"
        ? debounce(renderSuggestions, 250)
        : renderSuggestions;
    searchInput.addEventListener("input", renderSuggestionsDebounced);
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSuggestions();
            return;
        }
        if (suggestionList.hidden || !visibleSuggestions.length) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setActiveSuggestion(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
        } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            chooseSuggestion(activeIndex);
        }
    });
    suggestionList.addEventListener("click", function (event) {
        const option = event.target.closest("[data-suggestion-index]");
        if (option) chooseSuggestion(Number(option.dataset.suggestionIndex));
    });
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".explore-search-box")) closeSuggestions();
    });
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
    initializeSearchSuggestions(searchInput);
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
