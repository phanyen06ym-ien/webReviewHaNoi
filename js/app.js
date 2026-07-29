"use strict";

/**
 * app.js
 * Khởi tạo ứng dụng và xử lý menu, tài khoản cùng thông báo giao diện dùng chung.
 */

/**
 * Mở hoặc đóng menu trên màn hình điện thoại.
 * @param {boolean} shouldOpen - true nếu cần mở menu.
 */
function setMobileMenu(shouldOpen) {
    const menuButton = document.querySelector("#menu-button");
    const leftSidebar = document.querySelector("#left-sidebar");
    const menuOverlay = document.querySelector("#menu-overlay");

    if (!menuButton || !leftSidebar || !menuOverlay) {
        return;
    }

    leftSidebar.classList.toggle("open", shouldOpen);
    menuOverlay.classList.toggle("visible", shouldOpen);
    menuOverlay.hidden = !shouldOpen;
    document.body.classList.toggle("menu-open", shouldOpen);
    menuButton.setAttribute("aria-expanded", String(shouldOpen));
    menuButton.setAttribute("aria-label", shouldOpen ? "Đóng menu" : "Mở menu");
}

function initializeMobileMenu() {
    const menuButton = document.querySelector("#menu-button");
    const leftSidebar = document.querySelector("#left-sidebar");
    const menuOverlay = document.querySelector("#menu-overlay");

    if (!menuButton || !leftSidebar || !menuOverlay) {
        return;
    }

    menuButton.addEventListener("click", function () {
        const isOpen = leftSidebar.classList.contains("open");
        setMobileMenu(!isOpen);
    });

    menuOverlay.addEventListener("click", function () {
        setMobileMenu(false);
    });

    leftSidebar.addEventListener("click", function (event) {
        if (event.target.closest("a")) setMobileMenu(false);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMobileMenu(false);
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            setMobileMenu(false);
        }
    });
}

function debounce(callback, delay = 250) {
    let timeoutId;
    return function (...args) {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(function () {
            callback.apply(this, args);
        }.bind(this), delay);
    };
}

function updateFooterYear() {
    const footerYear = document.querySelector("#footer-year");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
}

function initializeUnifiedFooter() {
    const footer = document.querySelector(".site-footer");
    if (!footer || footer.dataset.unified === "true") return;
    footer.dataset.unified = "true";
    const prefix = document.body.dataset.page === "home" ? "pages/" : "";
    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-about">
                <strong><i class="fa-solid fa-bowl-food" aria-hidden="true"></i> Hanoi Food Review</strong>
                <p>Cộng đồng chia sẻ trải nghiệm ẩm thực và quán cà phê tại Hà Nội.</p>
            </div>
            <nav aria-label="Liên kết chân trang">
                <a href="${document.body.dataset.page === "home" ? "index.html" : "../index.html"}">Trang chủ</a>
                <a href="${prefix}explore.html">Khám phá</a>
                <a href="mailto:hello@hanoifoodreview.local">Liên hệ</a>
            </nav>
        </div>
        <p class="footer-copyright">© <span id="footer-year">${new Date().getFullYear()}</span> Hanoi Food Review</p>
    `;
}

function showSkeletonLoading(container, count = 3) {
    if (!container) return;
    container.setAttribute("aria-busy", "true");
    container.innerHTML = Array.from({ length: count }, function () {
        return '<div class="skeleton" aria-hidden="true"></div>';
    }).join("");
}

function clearSkeletonLoading(container) {
    if (container) container.removeAttribute("aria-busy");
}

async function runWithDelayedSkeleton(container, taskCallback, renderResult, count = 3) {
    let skeletonVisible = false;
    const skeletonTimer = window.setTimeout(function () {
        skeletonVisible = true;
        showSkeletonLoading(container, count);
    }, 300);
    try {
        const result = await taskCallback();
        window.clearTimeout(skeletonTimer);
        if (skeletonVisible) container.innerHTML = "";
        clearSkeletonLoading(container);
        if (typeof renderResult === "function") renderResult(result);
        return result;
    } finally {
        window.clearTimeout(skeletonTimer);
        clearSkeletonLoading(container);
    }
}

function showToast(message, type = "info") {
    let toastContainer = document.querySelector("#toast-container");

    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.className = "toast-container";
        toastContainer.setAttribute("aria-live", "polite");
        document.body.appendChild(toastContainer);
    }

    const allowedTypes = ["success", "error", "warning", "info"];
    const toastType = allowedTypes.includes(type) ? type : "info";
    const icons = {
        success: "fa-circle-check",
        error: "fa-circle-xmark",
        warning: "fa-triangle-exclamation",
        info: "fa-circle-info"
    };
    const toast = document.createElement("div");
    toast.className = `toast toast-${toastType}`;
    toast.setAttribute("role", toastType === "error" ? "alert" : "status");
    const icon = document.createElement("i");
    icon.className = `fa-solid ${icons[toastType]}`;
    icon.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.textContent = message;
    const progress = document.createElement("span");
    progress.className = "toast-progress";
    progress.setAttribute("aria-hidden", "true");
    toast.append(icon, text, progress);
    toastContainer.appendChild(toast);

    let remainingTime = 3000;
    let startedAt = Date.now();
    let hideTimeout;
    function hideToast() {
        toast.classList.add("toast-hiding");
        window.setTimeout(function () {
            toast.remove();
        }, 250);
    }
    function startTimer() {
        startedAt = Date.now();
        hideTimeout = window.setTimeout(hideToast, remainingTime);
    }
    toast.addEventListener("mouseenter", function () {
        window.clearTimeout(hideTimeout);
        remainingTime = Math.max(0, remainingTime - (Date.now() - startedAt));
        progress.style.animationPlayState = "paused";
    });
    toast.addEventListener("mouseleave", function () {
        progress.style.animationPlayState = "running";
        startTimer();
    });
    startTimer();
}

function getConfirmModal() {
    let modal = document.querySelector("#app-confirm-modal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "app-confirm-modal";
    modal.className = "confirm-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "confirm-modal-title");
    modal.setAttribute("aria-describedby", "confirm-modal-description");
    modal.innerHTML = `
        <div class="confirm-dialog" tabindex="-1">
            <span class="confirm-icon"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i></span>
            <h2 id="confirm-modal-title"></h2>
            <p id="confirm-modal-description"></p>
            <div class="confirm-actions">
                <button class="button button-outline" type="button" data-confirm-action="cancel">Hủy</button>
                <button class="button button-danger" type="button" data-confirm-action="confirm">Xác nhận</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    function closeModal(confirmed) {
        modal.hidden = true;
        document.body.classList.remove("menu-open");
        if (modal.confirmTrigger) modal.confirmTrigger.focus();
        if (modal.confirmResolver) modal.confirmResolver(confirmed);
        modal.confirmResolver = null;
    }
    modal.addEventListener("click", function (event) {
        const action = event.target.closest("[data-confirm-action]");
        if (action) closeModal(action.dataset.confirmAction === "confirm");
        else if (event.target === modal) closeModal(false);
    });
    modal.closeConfirm = closeModal;
    return modal;
}

function showConfirmModal(options = {}) {
    const modal = getConfirmModal();
    if (modal.confirmResolver) modal.closeConfirm(false);
    modal.querySelector("#confirm-modal-title").textContent = options.title || "Xác nhận thao tác";
    modal.querySelector("#confirm-modal-description").textContent = options.message || "Bạn có muốn tiếp tục không?";
    const confirmButton = modal.querySelector("[data-confirm-action='confirm']");
    confirmButton.textContent = options.confirmText || "Xác nhận";
    confirmButton.classList.toggle("button-danger", options.danger !== false);
    modal.confirmTrigger = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("menu-open");
    window.setTimeout(function () { modal.querySelector(".confirm-dialog").focus(); }, 0);
    return new Promise(function (resolve) {
        modal.confirmResolver = resolve;
    });
}

function initializeGlobalKeyboard() {
    document.addEventListener("keydown", function (event) {
        const modal = document.querySelector("#app-confirm-modal");
        if (event.key === "Escape" && modal && !modal.hidden && modal.closeConfirm) {
            modal.closeConfirm(false);
            return;
        }
        if (event.key === "Tab" && modal && !modal.hidden) {
            const focusable = Array.from(modal.querySelectorAll("button"));
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}

function initializeBackToTop() {
    const button = document.createElement("button");
    button.className = "icon-button button-primary back-to-top";
    button.type = "button";
    button.setAttribute("aria-label", "Lên đầu trang");
    button.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(button);
    const updateVisibility = function () {
        button.classList.toggle("visible", window.scrollY > 450);
    };
    window.addEventListener("scroll", updateVisibility, { passive: true });
    button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    updateVisibility();
}

function updateCurrentUserUI() {
    const currentUser = typeof getCurrentUser === "function"
        ? getCurrentUser()
        : getData(STORAGE_KEYS.CURRENT_USER, null);
    const sidebarAvatar = document.querySelector("#sidebar-user-avatar");
    const sidebarName = document.querySelector("#sidebar-user-name");
    const sidebarStatus = document.querySelector("#sidebar-user-status");
    const quickPostAvatar = document.querySelector("#quick-post-avatar");

    if (!currentUser) {
        return;
    }

    const fullName = String(currentUser.fullname || "Người dùng");
    const userInitial = fullName.trim().charAt(0).toUpperCase() || "U";

    if (sidebarAvatar) {
        sidebarAvatar.textContent = userInitial;
    }

    if (quickPostAvatar) {
        quickPostAvatar.textContent = userInitial;
    }

    if (sidebarName) {
        sidebarName.textContent = fullName;
    }

    if (sidebarStatus) {
        sidebarStatus.textContent = currentUser.username ? "@" + currentUser.username : "Tài khoản";
    }
}

function initializeApp() {
    if (document.body.dataset.appInitialized === "true") return;
    document.body.dataset.appInitialized = "true";

    seedInitialData();
    if (document.body.dataset.requireAuth === "true" && typeof isLoggedIn === "function" && !isLoggedIn()) {
        if (typeof requireLogin === "function") {
            const currentPage = window.location.pathname.split("/").pop() + window.location.search;
            requireLogin(currentPage);
        }
        return;
    }

    if (typeof updateAuthUI === "function") {
        updateAuthUI();
    } else {
        updateCurrentUserUI();
    }
    initializeUnifiedFooter();
    updateFooterYear();
    initializeMobileMenu();
    initializeGlobalKeyboard();
    initializeBackToTop();

    if (typeof initializePostInteractions === "function") {
        initializePostInteractions();
    }
    if (typeof renderPosts === "function") {
        renderPosts();
        renderTrendingTopics();
        renderFavoriteRestaurants();
    }
    if (typeof initializePostPage === "function") {
        initializePostPage();
    }
    if (typeof initializeTaskPage === "function") {
        initializeTaskPage();
    }
    if (typeof initializeExplorePage === "function") {
        initializeExplorePage();
    }
    if (typeof initializeSavedPage === "function") {
        initializeSavedPage();
    }
}

document.addEventListener("DOMContentLoaded", initializeApp);
