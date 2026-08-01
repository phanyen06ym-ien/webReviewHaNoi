"use strict";

/**
 * Auth giả lập bằng LocalStorage cho mục đích học tập.
 * CẢNH BÁO: password dạng chuỗi trong LocalStorage không an toàn và không được dùng cho hệ thống thật.
 */

function getUsers() {
    const users = getData(STORAGE_KEYS.USERS, []);
    return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
    return saveData(STORAGE_KEYS.USERS, users);
}

function getCurrentUser() {
    return getData(STORAGE_KEYS.CURRENT_USER, null);
}

function createSessionUser(user) {
    if (!user) return null;
    return {
        id: Number(user.id),
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio || "",
        joinedAt: user.joinedAt
    };
}

function setCurrentUser(user) {
    const sessionUser = createSessionUser(user);
    if (!sessionUser) {
        removeData(STORAGE_KEYS.CURRENT_USER);
        return null;
    }
    saveData(STORAGE_KEYS.CURRENT_USER, sessionUser);
    return sessionUser;
}

function normalizeAccountValue(value) {
    return String(value || "").trim().toLocaleLowerCase("vi-VN");
}

function registerUser(userData) {
    const users = getUsers();
    const normalizedUsername = normalizeAccountValue(userData.username);
    const normalizedEmail = normalizeAccountValue(userData.email);

    if (users.some(function (user) { return normalizeAccountValue(user.username) === normalizedUsername; })) {
        return { success: false, field: "username", message: "Username đã tồn tại." };
    }
    if (users.some(function (user) { return normalizeAccountValue(user.email) === normalizedEmail; })) {
        return { success: false, field: "email", message: "Email đã được sử dụng." };
    }

    const newUser = {
        id: generateId(users),
        fullname: String(userData.fullname).trim(),
        username: String(userData.username).trim(),
        email: String(userData.email).trim(),
        // Demo học tập: không lưu password dạng chuỗi như thế này trong ứng dụng thực tế.
        password: String(userData.password),
        avatar: "assets/images/avatars/default-avatar.svg",
        bio: "",
        joinedAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    return { success: true, user: createSessionUser(newUser) };
}

function loginUser(identifier, password) {
    const normalizedIdentifier = normalizeAccountValue(identifier);
    const user = getUsers().find(function (item) {
        return normalizeAccountValue(item.username) === normalizedIdentifier
            || normalizeAccountValue(item.email) === normalizedIdentifier;
    });

    if (!user || String(user.password) !== String(password)) {
        return { success: false, message: "Tên đăng nhập/email hoặc mật khẩu không chính xác." };
    }

    return { success: true, user: setCurrentUser(user) };
}

function getPagePrefix() {
    return document.body && document.body.dataset.page === "home" ? "pages/" : "";
}

function resolveAuthAvatar(avatar) {
    const source = String(avatar || "");
    if (!source || /^(?:data:|https?:|blob:|\/)/i.test(source)) return source;
    if (document.body && document.body.dataset.page !== "home" && source.startsWith("assets/")) {
        return "../" + source;
    }
    return source;
}

async function logoutUser() {
    const shouldLogout = await showConfirmModal({
        title: "Đăng xuất?",
        message: "Bạn sẽ cần đăng nhập lại để sử dụng các trang cá nhân.",
        confirmText: "Đăng xuất",
        danger: false
    });
    if (!shouldLogout) return false;
    removeData(STORAGE_KEYS.CURRENT_USER);
    updateAuthUI();
    if (typeof showToast === "function") showToast("Đăng xuất thành công.", "success");
    window.setTimeout(function () {
        window.location.href = getPagePrefix() + "auth.html?mode=login";
    }, 300);
    return true;
}

function isLoggedIn() {
    const user = getCurrentUser();
    return Boolean(user && Number.isFinite(Number(user.id)));
}

function getSafeRedirect() {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    if (!redirect) return "";
    const cleanRedirect = redirect.trim().replace(/\\/g, "/");
    if (/^(?:https?:)?\/\//i.test(cleanRedirect) || cleanRedirect.includes("..")) return "";
    if (cleanRedirect === "index.html" || /^[a-z0-9-]+\.html(?:\?[^#]*)?(?:#[a-z0-9_-]+)?$/i.test(cleanRedirect)) {
        return cleanRedirect;
    }
    return "";
}

function requireLogin(redirectPage) {
    if (isLoggedIn()) return true;
    const requestedPage = String(
        redirectPage || (window.location.pathname.split("/").pop() + window.location.search) || "index.html"
    ).replace(/\\/g, "/").split("/").pop();
    const pageName = /^[a-z0-9-]+\.html(?:\?[^#]*)?$/i.test(requestedPage) && !requestedPage.includes("..")
        ? requestedPage
        : "index.html";
    const loginPath = getPagePrefix() + "auth.html?mode=login";
    window.location.replace(loginPath + "&redirect=" + encodeURIComponent(pageName));
    return false;
}

function setAvatarElement(element, user) {
    if (!element) return;
    const fallback = String(user && user.fullname || "Khách").trim().charAt(0).toUpperCase() || "K";
    const avatar = resolveAuthAvatar(user && user.avatar);
    element.textContent = fallback;
    element.style.backgroundImage = "";
    if (avatar) {
        const requestId = String(Date.now()) + Math.random();
        element.dataset.avatarRequest = requestId;
        const image = new Image();
        image.onload = function () {
            if (element.dataset.avatarRequest !== requestId) return;
            element.textContent = "";
            element.style.backgroundImage = `url("${String(avatar).replace(/["\\]/g, "")}")`;
            element.style.backgroundSize = "cover";
            element.style.backgroundPosition = "center";
        };
        image.onerror = function () {
            if (element.dataset.avatarRequest !== requestId) return;
            const defaultAvatar = resolveAuthAvatar("assets/images/avatars/default-avatar.svg");
            element.style.backgroundImage = `url("${defaultAvatar}")`;
            element.style.backgroundSize = "cover";
            element.style.backgroundPosition = "center";
            element.textContent = "";
        };
        image.src = avatar;
    }
}

function updateAuthUI() {
    const user = getCurrentUser();
    const sidebarInner = document.querySelector(".left-sidebar .sidebar-inner");
    let accountContainer = document.querySelector(".sidebar-account");
    if (!accountContainer && sidebarInner) {
        accountContainer = document.createElement("div");
        accountContainer.className = "sidebar-account";
        sidebarInner.appendChild(accountContainer);
    }
    if (accountContainer && !accountContainer.querySelector(".auth-sidebar-controls")) {
        accountContainer.querySelectorAll(":scope > a[href*='login'], :scope > a[href*='register'], :scope > [data-auth-action='logout']")
            .forEach(function (legacyControl) { legacyControl.remove(); });
        const prefix = getPagePrefix();
        const controls = document.createElement("div");
        controls.className = "auth-sidebar-controls";
        controls.innerHTML = `
            <div data-auth-visible="guest">
                <a class="button button-primary button-full" href="${prefix}auth.html?mode=login">Đăng nhập</a>
                <span class="auth-link-separator" aria-hidden="true">|</span>
                <a class="auth-register-link" href="${prefix}auth.html?mode=register">Đăng ký</a>
            </div>
            <div data-auth-visible="user" hidden>
                <a class="button button-outline button-full" href="${prefix}profile.html">Hồ sơ</a>
                <button class="auth-logout-link" type="button" data-auth-action="logout">Đăng xuất</button>
            </div>
        `;
        accountContainer.appendChild(controls);
    }

    const sidebarName = document.querySelector("#sidebar-user-name");
    const sidebarUsername = document.querySelector("#sidebar-user-username");
    const sidebarStatus = document.querySelector("#sidebar-user-status");
    const mobileName = document.querySelector("#mobile-user-name");
    const loginLinks = document.querySelectorAll("[data-auth-visible='guest']");
    const userElements = document.querySelectorAll("[data-auth-visible='user']");

    setAvatarElement(document.querySelector("#sidebar-user-avatar"), user);
    const mobileAvatar = document.querySelector("#mobile-user-avatar") || document.querySelector(".mobile-account");
    setAvatarElement(mobileAvatar, user);
    if (mobileAvatar) {
        mobileAvatar.setAttribute("aria-label", user ? `Hồ sơ của ${user.fullname}` : "Đăng nhập");
        if (mobileAvatar.matches("a")) {
            mobileAvatar.href = user ? getPagePrefix() + "profile.html" : getPagePrefix() + "auth.html?mode=login";
        }
    }
    setAvatarElement(document.querySelector("#quick-post-avatar"), user);
    if (sidebarName) sidebarName.textContent = user ? user.fullname : "Khách";
    if (sidebarUsername) sidebarUsername.textContent = user ? "@" + user.username : "";
    if (sidebarStatus) sidebarStatus.textContent = user ? "@" + user.username : "Chưa đăng nhập";
    if (mobileName) mobileName.textContent = user ? user.fullname : "Khách";
    loginLinks.forEach(function (element) { element.hidden = Boolean(user); });
    userElements.forEach(function (element) { element.hidden = !user; });
}

function syncCurrentUserData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    const fullUser = getUsers().find(function (user) { return Number(user.id) === Number(currentUser.id); });
    if (!fullUser) {
        removeData(STORAGE_KEYS.CURRENT_USER);
        return null;
    }
    return setCurrentUser(fullUser);
}

function togglePasswordVisibility(button, input) {
    if (!button || !input) return;
    const shouldShow = input.type === "password";
    input.type = shouldShow ? "text" : "password";
    button.setAttribute("aria-label", shouldShow ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    const icon = button.querySelector("i");
    if (icon) icon.className = shouldShow ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
}

function getAuthField(name) {
    return {
        input: document.querySelector(`#${name}`),
        error: document.querySelector(`#${name}-error`)
    };
}

function validateRegisterField(fieldName) {
    const field = getAuthField(`register-${fieldName}`);
    if (!field.input || !field.error) return false;
    const value = field.input.type === "checkbox" ? field.input.checked : field.input.value.trim();
    clearFieldError(field.input, field.error);
    let message = "";

    if (fieldName === "fullname") {
        if (!value) message = "Vui lòng nhập họ tên.";
        else if (value.length < 2 || value.length > 80) message = "Họ tên phải có từ 2 đến 80 ký tự.";
    } else if (fieldName === "username") {
        if (!value || value.length < 4 || value.length > 30) message = "Username phải có từ 4 đến 30 ký tự.";
        else if (!/^[A-Za-z0-9_]+$/.test(value)) message = "Username chỉ được chứa chữ cái, chữ số và dấu gạch dưới.";
        else if (getUsers().some(function (user) { return normalizeAccountValue(user.username) === normalizeAccountValue(value); })) message = "Username đã tồn tại.";
    } else if (fieldName === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Email không đúng định dạng.";
        else if (getUsers().some(function (user) { return normalizeAccountValue(user.email) === normalizeAccountValue(value); })) message = "Email đã được sử dụng.";
    } else if (fieldName === "password") {
        if (!value || value.length < 6) message = "Mật khẩu phải có ít nhất 6 ký tự.";
        else if (value.length > 50) message = "Mật khẩu không được vượt quá 50 ký tự.";
    } else if (fieldName === "confirm-password") {
        const password = document.querySelector("#register-password");
        if (!value || !password || value !== password.value) message = "Mật khẩu xác nhận không khớp.";
    } else if (fieldName === "agree" && !value) {
        message = "Bạn cần đồng ý với điều khoản sử dụng.";
    }

    if (message) {
        showFieldError(field.input, field.error, message);
        return false;
    }
    return true;
}

function initializeRegisterPage() {
    const form = document.querySelector("#register-form");
    if (!form || form.dataset.initialized === "true") return;
    form.dataset.initialized = "true";
    const fields = ["fullname", "username", "email", "password", "confirm-password", "agree"];
    fields.forEach(function (name) {
        const field = getAuthField(`register-${name}`);
        if (!field.input) return;
        field.input.addEventListener("blur", function () { validateRegisterField(name); });
        field.input.addEventListener(field.input.type === "checkbox" ? "change" : "input", function () {
            if (field.input.classList.contains("is-invalid")) validateRegisterField(name);
            if (name === "password") {
                const confirmPassword = document.querySelector("#register-confirm-password");
                if (confirmPassword && confirmPassword.value && confirmPassword.classList.contains("is-invalid")) {
                    validateRegisterField("confirm-password");
                }
            }
        });
    });
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const valid = fields.map(validateRegisterField).every(Boolean);
        if (!valid) {
            const firstInvalid = form.querySelector(".is-invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        const result = registerUser({
            fullname: document.querySelector("#register-fullname").value,
            username: document.querySelector("#register-username").value,
            email: document.querySelector("#register-email").value,
            password: document.querySelector("#register-password").value
        });
        if (!result.success) {
            validateRegisterField(result.field);
            return;
        }
        if (typeof showToast === "function") showToast("Đăng ký thành công.", "success");
        window.setTimeout(function () { window.location.href = "../index.html"; }, 350);
    });
}

function initializeLoginPage() {
    const form = document.querySelector("#login-form");
    if (!form || form.dataset.initialized === "true") return;
    form.dataset.initialized = "true";
    const identifier = document.querySelector("#login-identifier");
    const password = document.querySelector("#login-password");
    const identifierError = document.querySelector("#login-identifier-error");
    const passwordError = document.querySelector("#login-password-error");
    const message = document.querySelector("#login-message");

    [identifier, password].forEach(function (input) {
        if (!input) return;
        input.addEventListener("input", function () {
            if (input === identifier && input.value.trim()) clearFieldError(identifier, identifierError);
            if (input === password && input.value) clearFieldError(password, passwordError);
            if (message) message.textContent = "";
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearFieldError(identifier, identifierError);
        clearFieldError(password, passwordError);
        if (message) message.textContent = "";
        let valid = true;
        if (!identifier.value.trim()) {
            showFieldError(identifier, identifierError, "Vui lòng nhập username hoặc email.");
            valid = false;
        }
        if (!password.value) {
            showFieldError(password, passwordError, "Vui lòng nhập mật khẩu.");
            valid = false;
        }
        if (!valid) {
            form.querySelector(".is-invalid").focus();
            return;
        }
        const result = loginUser(identifier.value, password.value);
        if (!result.success) {
            if (message) message.textContent = result.message;
            identifier.focus();
            return;
        }
        if (typeof showToast === "function") showToast("Đăng nhập thành công.", "success");
        const redirect = getSafeRedirect();
        window.setTimeout(function () {
            window.location.href = redirect === "index.html" ? "../index.html" : (redirect || "../index.html");
        }, 350);
    });
}

function setAuthMode(mode, shouldFocus = false) {
    const container = document.querySelector("#auth-container");
    if (!container) return;
    const isRegisterMode = mode === "register";
    container.classList.toggle("is-register-mode", isRegisterMode);
    document.title = `${isRegisterMode ? "Đăng ký" : "Đăng nhập"} | Hanoi Food Review`;

    const url = new URL(window.location.href);
    url.searchParams.set("mode", isRegisterMode ? "register" : "login");
    window.history.replaceState({}, "", url);

    container.querySelectorAll(".auth-form-panel").forEach(function (panel) {
        const isActive = panel.classList.contains(isRegisterMode ? "auth-register-panel" : "auth-login-panel");
        panel.setAttribute("aria-hidden", String(!isActive));
        panel.querySelectorAll("input, button").forEach(function (control) {
            if (isActive) control.removeAttribute("tabindex");
            else control.setAttribute("tabindex", "-1");
        });
    });
    container.querySelectorAll(".auth-overlay-panel").forEach(function (panel) {
        const isActive = panel.classList.contains(isRegisterMode ? "auth-overlay-login" : "auth-overlay-register");
        panel.setAttribute("aria-hidden", String(!isActive));
        const switchButton = panel.querySelector("[data-auth-mode]");
        if (switchButton) {
            if (isActive) switchButton.removeAttribute("tabindex");
            else switchButton.setAttribute("tabindex", "-1");
        }
    });

    if (shouldFocus) {
        const target = document.querySelector(isRegisterMode ? "#register-fullname" : "#login-identifier");
        if (target) window.setTimeout(function () { target.focus(); }, 0);
    }
}

function initializeCombinedAuthPage() {
    const container = document.querySelector("#auth-container");
    if (!container || container.dataset.initialized === "true") return;
    container.dataset.initialized = "true";
    initializeLoginPage();
    initializeRegisterPage();
    container.addEventListener("click", function (event) {
        const switchButton = event.target.closest("[data-auth-mode]");
        if (switchButton) setAuthMode(switchButton.dataset.authMode, true);
    });
    const requestedMode = new URLSearchParams(window.location.search).get("mode");
    setAuthMode(requestedMode === "register" ? "register" : "login");
}

function initializeAuthEvents() {
    if (document.body.dataset.authEventsInitialized === "true") return;
    document.body.dataset.authEventsInitialized = "true";
    document.addEventListener("click", function (event) {
        const passwordButton = event.target.closest("[data-password-toggle]");
        if (passwordButton) {
            togglePasswordVisibility(passwordButton, document.querySelector(`#${passwordButton.dataset.target}`));
            return;
        }
        if (event.target.closest("[data-auth-action='logout']")) logoutUser();
    });
}

function initializeAuth() {
    syncCurrentUserData();
    initializeAuthEvents();
    updateAuthUI();
    const pageName = document.body.dataset.page;
    if (pageName === "auth") initializeCombinedAuthPage();
}

document.addEventListener("DOMContentLoaded", initializeAuth);
