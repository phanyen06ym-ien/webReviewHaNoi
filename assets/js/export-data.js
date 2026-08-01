"use strict";

/**
 * Xuất dữ liệu ứng dụng ra JSON. Password và phiên đăng nhập không được đưa vào file.
 */

function getExportData() {
    const safeUsers = getData(STORAGE_KEYS.USERS, []).map(function (user) {
        const { password, ...publicUser } = user;
        return publicUser;
    });

    return {
        appName: "Hanoi Food Review",
        version: "1.1",
        exportedAt: new Date().toISOString(),
        data: {
            users: safeUsers,
            posts: getData(STORAGE_KEYS.POSTS, []),
            comments: getData(STORAGE_KEYS.COMMENTS, []),
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
    downloadJSON(getExportData(), `hanoi-food-review-export-${date}.json`);
    showToast("Đã xuất dữ liệu JSON.", "success");
}

function exportTasksToJSON() {
    downloadJSON({
        exportedAt: new Date().toISOString(),
        tasks: getData(STORAGE_KEYS.TASKS, [])
    }, "hanoi-food-review-tasks.json");
    showToast("Đã xuất danh sách kế hoạch.", "success");
}

function initializeDataExport() {
    const exportButton = document.querySelector("#export-json-button");
    const exportTasksButton = document.querySelector("#export-tasks-button");
    if (exportButton) exportButton.addEventListener("click", exportDataToJSON);
    if (exportTasksButton) exportTasksButton.addEventListener("click", exportTasksToJSON);
}

document.addEventListener("DOMContentLoaded", initializeDataExport);
