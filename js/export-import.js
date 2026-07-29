"use strict";

/**
 * Xuất, nhập và khôi phục dữ liệu ứng dụng bằng file JSON.
 * File backup đầy đủ có password demo trong users; không chia sẻ file công khai.
 */

const MAX_IMPORT_FILE_SIZE = 2 * 1024 * 1024;

function getExportData() {
    return {
        appName: "Hanoi Food Review",
        version: "1.0",
        exportedAt: new Date().toISOString(),
        data: {
            users: getData(STORAGE_KEYS.USERS, []),
            currentUser: getData(STORAGE_KEYS.CURRENT_USER, null),
            posts: getData(STORAGE_KEYS.POSTS, []),
            tasks: getData(STORAGE_KEYS.TASKS, []),
            savedPosts: getData(STORAGE_KEYS.SAVED_POSTS, []),
            theme: getData(STORAGE_KEYS.THEME, "light")
        }
    };
}

function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const url = URL.createObjectURL(new Blob([json], { type: "application/json;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function exportDataToJSON() {
    const date = new Date().toISOString().slice(0, 10);
    downloadJSON(getExportData(), `hanoi-food-review-backup-${date}.json`);
    showToast("Đã xuất file sao lưu JSON.", "success");
}

function exportPostsToJSON() {
    downloadJSON({ exportedAt: new Date().toISOString(), posts: getData(STORAGE_KEYS.POSTS, []) }, "hanoi-food-review-posts.json");
}

function exportTasksToJSON() {
    downloadJSON({ exportedAt: new Date().toISOString(), tasks: getData(STORAGE_KEYS.TASKS, []) }, "hanoi-food-review-tasks.json");
}

function readJSONFile(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            try {
                resolve(JSON.parse(reader.result));
            } catch (error) {
                reject(new Error("File JSON không đúng cú pháp."));
            }
        });
        reader.addEventListener("error", function () { reject(new Error("Không thể đọc file đã chọn.")); });
        reader.readAsText(file, "UTF-8");
    });
}

function hasValidUniqueIds(items) {
    const ids = items.map(function (item) { return Number(item && item.id); });
    return ids.every(function (id) { return Number.isInteger(id) && id > 0; }) && new Set(ids).size === ids.length;
}

function validateImportData(importedData) {
    if (!importedData || typeof importedData !== "object" || Array.isArray(importedData)) {
        return { valid: false, message: "Dữ liệu nhập phải là một object JSON." };
    }
    const data = importedData.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return { valid: false, message: "File JSON không có thuộc tính data hợp lệ." };
    }
    for (const field of ["users", "posts", "tasks", "savedPosts"]) {
        if (data[field] !== undefined && !Array.isArray(data[field])) {
            return { valid: false, message: `${field} phải là một mảng.` };
        }
    }
    if (data.currentUser !== undefined && data.currentUser !== null
        && (typeof data.currentUser !== "object" || Array.isArray(data.currentUser))) {
        return { valid: false, message: "currentUser phải là object hoặc null." };
    }
    if (data.theme !== undefined && typeof data.theme !== "string") {
        return { valid: false, message: "theme phải là một chuỗi." };
    }
    for (const field of ["users", "posts", "tasks"]) {
        if (data[field] && !hasValidUniqueIds(data[field])) {
            return { valid: false, message: `${field} chứa ID không hợp lệ hoặc bị trùng.` };
        }
    }
    if (data.currentUser) {
        const currentUserId = Number(data.currentUser.id);
        const userIds = new Set((data.users || []).map(function (user) { return Number(user.id); }));
        if (!Number.isInteger(currentUserId) || currentUserId <= 0 || !userIds.has(currentUserId)) {
            return { valid: false, message: "currentUser không khớp với danh sách users." };
        }
    }
    const postIds = new Set((data.posts || []).map(function (post) { return Number(post.id); }));
    if ((data.savedPosts || []).some(function (id) { return !Number.isInteger(Number(id)) || !postIds.has(Number(id)); })) {
        return { valid: false, message: "savedPosts chứa ID bài viết không hợp lệ." };
    }
    return { valid: true, message: "" };
}

function createBackupBeforeImport() {
    return {
        users: getData(STORAGE_KEYS.USERS, []),
        currentUser: getData(STORAGE_KEYS.CURRENT_USER, null),
        posts: getData(STORAGE_KEYS.POSTS, []),
        tasks: getData(STORAGE_KEYS.TASKS, []),
        savedPosts: getData(STORAGE_KEYS.SAVED_POSTS, []),
        theme: getData(STORAGE_KEYS.THEME, "light")
    };
}

function restoreBackup(backup) {
    saveData(STORAGE_KEYS.USERS, backup.users);
    saveData(STORAGE_KEYS.POSTS, backup.posts);
    saveData(STORAGE_KEYS.TASKS, backup.tasks);
    saveData(STORAGE_KEYS.SAVED_POSTS, backup.savedPosts);
    saveData(STORAGE_KEYS.THEME, backup.theme);
    if (backup.currentUser) saveData(STORAGE_KEYS.CURRENT_USER, backup.currentUser);
    else removeData(STORAGE_KEYS.CURRENT_USER);
}

function saveImportedData(data) {
    // Session chỉ giữ thông tin công khai, kể cả khi file import chứa password.
    const safeCurrentUser = data.currentUser ? {
        id: Number(data.currentUser.id),
        fullname: data.currentUser.fullname,
        username: data.currentUser.username,
        email: data.currentUser.email,
        avatar: data.currentUser.avatar,
        bio: data.currentUser.bio || "",
        joinedAt: data.currentUser.joinedAt
    } : null;
    const operations = [
        saveData(STORAGE_KEYS.USERS, data.users || []),
        saveData(STORAGE_KEYS.POSTS, data.posts || []),
        saveData(STORAGE_KEYS.TASKS, data.tasks || []),
        saveData(STORAGE_KEYS.SAVED_POSTS, data.savedPosts || []),
        saveData(
            STORAGE_KEYS.THEME,
            data.theme !== undefined ? data.theme : getData(STORAGE_KEYS.THEME, "light")
        )
    ];
    if (safeCurrentUser) operations.push(saveData(STORAGE_KEYS.CURRENT_USER, safeCurrentUser));
    else removeData(STORAGE_KEYS.CURRENT_USER);
    return operations.every(Boolean);
}

function importData(importedData) {
    const validation = validateImportData(importedData);
    if (!validation.valid) return validation;
    const backup = createBackupBeforeImport();
    try {
        if (!saveImportedData(importedData.data)) throw new Error("Không thể ghi đầy đủ dữ liệu vào LocalStorage.");
        return { valid: true, message: "Nhập dữ liệu thành công." };
    } catch (error) {
        restoreBackup(backup);
        return { valid: false, message: `${error.message} Dữ liệu cũ đã được khôi phục.` };
    }
}

function refreshApplicationAfterImport() {
    if (typeof syncCurrentUserData === "function") syncCurrentUserData();
    if (typeof updateAuthUI === "function") updateAuthUI();
    if (typeof refreshStatisticsPage === "function") refreshStatisticsPage();
}

async function handleImportFile(event) {
    const input = event.currentTarget;
    const file = input.files && input.files[0];
    try {
        if (!file) return;
        const isJSON = file.type === "application/json" || file.name.toLocaleLowerCase().endsWith(".json");
        if (!isJSON) throw new Error("Vui lòng chọn file JSON.");
        if (file.size > MAX_IMPORT_FILE_SIZE) throw new Error("File JSON không được vượt quá 2MB.");
        const importedData = await readJSONFile(file);
        const validation = validateImportData(importedData);
        if (!validation.valid) throw new Error(validation.message);
        const shouldImport = await showConfirmModal({
            title: "Nhập và thay thế dữ liệu?",
            message: "Dữ liệu trong file sẽ thay thế toàn bộ dữ liệu ứng dụng hiện tại.",
            confirmText: "Nhập dữ liệu",
            danger: true
        });
        if (!shouldImport) return;
        const result = importData(importedData);
        if (!result.valid) throw new Error(result.message);
        showToast(result.message, "success");
        refreshApplicationAfterImport();
    } catch (error) {
        showToast(error.message || "Không thể nhập dữ liệu.", "error");
    } finally {
        input.value = "";
    }
}

async function resetToSampleData() {
    const shouldReset = await showConfirmModal({
        title: "Khôi phục dữ liệu mẫu?",
        message: "Dữ liệu hiện tại sẽ bị xóa và thay thế bằng dữ liệu mẫu.",
        confirmText: "Khôi phục",
        danger: true
    });
    if (!shouldReset) return;
    [
        STORAGE_KEYS.USERS, STORAGE_KEYS.CURRENT_USER, STORAGE_KEYS.POSTS,
        STORAGE_KEYS.TASKS, STORAGE_KEYS.SAVED_POSTS, STORAGE_KEYS.THEME
    ].forEach(removeData);
    seedInitialData();
    showToast("Đã khôi phục dữ liệu mẫu.", "success");
    refreshApplicationAfterImport();
}

function initializeDataManagement() {
    const page = document.querySelector("[data-page='statistics']");
    if (!page || page.dataset.dataManagementInitialized === "true") return;
    const exportButton = document.querySelector("#export-json-button");
    const importButton = document.querySelector("#import-json-button");
    const importInput = document.querySelector("#import-json-input");
    const resetButton = document.querySelector("#reset-sample-data-button");
    if (!exportButton || !importButton || !importInput) return;
    page.dataset.dataManagementInitialized = "true";
    exportButton.addEventListener("click", exportDataToJSON);
    importButton.addEventListener("click", function () { importInput.click(); });
    importInput.addEventListener("change", handleImportFile);
    if (resetButton) resetButton.addEventListener("click", resetToSampleData);
}
