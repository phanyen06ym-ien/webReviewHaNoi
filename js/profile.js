"use strict";

/**
 * Hiển thị, chỉnh sửa hồ sơ và đồng bộ tên/avatar với bài review cũ.
 */

function getProfileUser() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    return getUsers().find(function (user) { return Number(user.id) === Number(currentUser.id); }) || null;
}

function calculateProfileStatistics() {
    const user = getProfileUser();
    if (!user) return { postCount: 0, savedCount: 0, receivedLikes: 0, completedTaskCount: 0 };
    const posts = typeof getPosts === "function" ? getPosts() : getData(STORAGE_KEYS.POSTS, []);
    const userPosts = posts.filter(function (post) { return Number(post.userId) === Number(user.id); });
    const tasks = typeof getTasks === "function" ? getTasks() : getData(STORAGE_KEYS.TASKS, []);

    return {
        postCount: userPosts.length,
        savedCount: posts.filter(function (post) { return post.isSaved === true; }).length,
        receivedLikes: userPosts.reduce(function (total, post) { return total + (Number(post.likes) || 0); }, 0),
        // Task Giai đoạn 3 là dữ liệu demo dùng chung, chưa gắn userId.
        completedTaskCount: tasks.filter(function (task) { return task.status === "Done"; }).length
    };
}

function setProfileAvatar(element, user) {
    if (!element || !user) return;
    const initial = String(user.fullname || "U").trim().charAt(0).toUpperCase();
    const avatar = typeof resolveAuthAvatar === "function" ? resolveAuthAvatar(user.avatar) : user.avatar;
    if (avatar) {
        element.textContent = "";
        element.style.backgroundImage = `url("${String(avatar).replace(/["\\]/g, "")}")`;
        element.style.backgroundSize = "cover";
        element.style.backgroundPosition = "center";
    } else {
        element.style.backgroundImage = "";
        element.textContent = initial;
    }
}

function renderProfile() {
    const user = getProfileUser();
    if (!user) return;
    const values = {
        "profile-display-name": user.fullname,
        "profile-display-username": "@" + user.username,
        "profile-display-email": user.email,
        "profile-display-bio": user.bio || "Chưa có giới thiệu.",
        "profile-joined-at": new Date(user.joinedAt).toLocaleDateString("vi-VN")
    };
    Object.entries(values).forEach(function (entry) {
        const element = document.querySelector(`#${entry[0]}`);
        if (element) element.textContent = entry[1];
    });
    setProfileAvatar(document.querySelector("#profile-avatar-display"), user);
    setProfileAvatar(document.querySelector("#profile-avatar-preview"), user);

    const statistics = calculateProfileStatistics();
    Object.entries(statistics).forEach(function (entry) {
        const element = document.querySelector(`[data-profile-stat="${entry[0]}"]`);
        if (element) element.textContent = entry[1];
    });
}

function fillProfileForm() {
    const user = getProfileUser();
    if (!user) return;
    document.querySelector("#profile-fullname").value = user.fullname || "";
    document.querySelector("#profile-email").value = user.email || "";
    document.querySelector("#profile-bio").value = user.bio || "";
    document.querySelector("#profile-avatar").value = user.avatar || "";
    const counter = document.querySelector("#profile-bio-counter");
    if (counter) counter.textContent = `${String(user.bio || "").length}/200`;
}

function validateProfileField(fieldName) {
    const input = document.querySelector(`#profile-${fieldName}`);
    const error = document.querySelector(`#profile-${fieldName}-error`);
    if (!input || !error) return false;
    const value = input.value.trim();
    clearFieldError(input, error);
    let message = "";

    if (fieldName === "fullname" && (!value || value.length < 2 || value.length > 80)) {
        message = "Họ tên phải có từ 2 đến 80 ký tự.";
    }
    if (fieldName === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            message = "Email không đúng định dạng.";
        } else {
            const currentUser = getProfileUser();
            const duplicate = getUsers().some(function (user) {
                return Number(user.id) !== Number(currentUser.id)
                    && normalizeAccountValue(user.email) === normalizeAccountValue(value);
            });
            if (duplicate) message = "Email đã được sử dụng bởi tài khoản khác.";
        }
    }
    if (fieldName === "bio" && value.length > 200) message = "Giới thiệu không được vượt quá 200 ký tự.";
    if (message) {
        showFieldError(input, error, message);
        return false;
    }
    return true;
}

function validateProfileForm() {
    return ["fullname", "email", "bio"].map(validateProfileField).every(Boolean);
}

function updateUserPostsAuthorInfo(user) {
    const posts = getData(STORAGE_KEYS.POSTS, []);
    const updatedPosts = posts.map(function (post) {
        if (Number(post.userId) === Number(user.id)) {
            return { ...post, authorName: user.fullname, authorAvatar: user.avatar };
        }
        return post;
    });
    saveData(STORAGE_KEYS.POSTS, updatedPosts);
}

function updateProfile(profileData) {
    const currentUser = getCurrentUser();
    const users = getUsers();
    const user = users.find(function (item) { return Number(item.id) === Number(currentUser && currentUser.id); });
    if (!user) return { success: false, message: "Không tìm thấy tài khoản." };
    const duplicateEmail = users.some(function (item) {
        return Number(item.id) !== Number(user.id)
            && normalizeAccountValue(item.email) === normalizeAccountValue(profileData.email);
    });
    if (duplicateEmail) return { success: false, field: "email", message: "Email đã được sử dụng bởi tài khoản khác." };

    user.fullname = profileData.fullname.trim();
    user.email = profileData.email.trim();
    user.bio = profileData.bio.trim();
    user.avatar = profileData.avatar.trim() || "assets/images/avatars/default-avatar.svg";
    saveUsers(users);
    setCurrentUser(user);
    updateUserPostsAuthorInfo(user);
    renderProfile();
    fillProfileForm();
    updateAuthUI();
    return { success: true, user: createSessionUser(user) };
}

function handleProfileSubmit(event) {
    event.preventDefault();
    if (!validateProfileForm()) {
        const firstInvalid = event.currentTarget.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
    }
    const result = updateProfile({
        fullname: document.querySelector("#profile-fullname").value,
        email: document.querySelector("#profile-email").value,
        bio: document.querySelector("#profile-bio").value,
        avatar: document.querySelector("#profile-avatar").value
    });
    if (!result.success) {
        if (result.field) {
            showFieldError(document.querySelector(`#profile-${result.field}`), document.querySelector(`#profile-${result.field}-error`), result.message);
        }
        return;
    }
    showToast("Đã cập nhật hồ sơ.", "success");
}

function initializeProfilePage() {
    const page = document.querySelector("[data-page='profile']");
    const form = document.querySelector("#profile-form");
    if (!page || !form || form.dataset.initialized === "true") return;
    if (!isLoggedIn()) {
        requireLogin("profile.html");
        return;
    }
    form.dataset.initialized = "true";
    renderProfile();
    fillProfileForm();
    ["fullname", "email", "bio"].forEach(function (name) {
        const input = document.querySelector(`#profile-${name}`);
        input.addEventListener("blur", function () { validateProfileField(name); });
        input.addEventListener("input", function () {
            if (name === "bio") document.querySelector("#profile-bio-counter").textContent = `${input.value.length}/200`;
            if (input.classList.contains("is-invalid")) validateProfileField(name);
        });
    });
    const avatarInput = document.querySelector("#profile-avatar");
    avatarInput.addEventListener("input", function () {
        const preview = document.querySelector("#profile-avatar-preview");
        const user = { fullname: document.querySelector("#profile-fullname").value, avatar: avatarInput.value.trim() };
        setProfileAvatar(preview, user);
    });
    form.addEventListener("submit", handleProfileSubmit);
}

document.addEventListener("DOMContentLoaded", function () {
    if (document.body.dataset.page === "profile") initializeProfilePage();
});
