"use strict";

/**
 * Tính toán số liệu và quản lý các biểu đồ trên trang Statistics.
 */

const chartInstances = {
    category: null,
    district: null,
    rating: null,
    monthlyPosts: null,
    taskStatus: null,
    taskPriority: null,
    taskCategory: null
};

const STATISTIC_COLORS = ["#f4b400", "#ef8f35", "#4aa879", "#5793d2", "#e67b7b", "#9b82c4", "#6db7ad", "#c8a24a"];

function getStatisticsData() {
    return {
        users: getData(STORAGE_KEYS.USERS, []),
        posts: getData(STORAGE_KEYS.POSTS, []),
        comments: getData(STORAGE_KEYS.COMMENTS, []),
        tasks: getData(STORAGE_KEYS.TASKS, [])
    };
}

function calculateOverviewStatistics(data = getStatisticsData()) {
    const posts = Array.isArray(data.posts) ? data.posts : [];
    const users = Array.isArray(data.users) ? data.users : [];
    const tasks = Array.isArray(data.tasks) ? data.tasks : [];
    const comments = Array.isArray(data.comments) ? data.comments : [];

    return {
        totalPosts: posts.length,
        totalUsers: users.length,
        totalLikes: posts.reduce(function (total, post) { return total + (Number(post.likes) || 0); }, 0),
        totalSavedPosts: posts.filter(function (post) { return post.isSaved === true; }).length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(function (task) { return task.status === "Done"; }).length,
        totalComments: comments.length
    };
}

function updateOverviewStatistics() {
    const overview = calculateOverviewStatistics();
    const fields = {
        "total-posts-stat": overview.totalPosts,
        "total-users-stat": overview.totalUsers,
        "total-likes-stat": overview.totalLikes,
        "total-saved-stat": overview.totalSavedPosts,
        "total-tasks-stat": overview.totalTasks,
        "completed-tasks-stat": overview.completedTasks,
        "total-comments-stat": overview.totalComments
    };
    Object.entries(fields).forEach(function (entry) {
        const element = document.querySelector(`#${entry[0]}`);
        if (element) element.textContent = entry[1].toLocaleString("vi-VN");
    });
    return overview;
}

function countByKnownValues(items, field, values) {
    const counts = Object.fromEntries(values.map(function (value) { return [value, 0]; }));
    items.forEach(function (item) {
        if (Object.prototype.hasOwnProperty.call(counts, item[field])) counts[item[field]] += 1;
    });
    return counts;
}

function countPostsByCategory(posts) {
    return countByKnownValues(Array.isArray(posts) ? posts : [], "category", ["Cafe", "Food"]);
}

function countPostsByDistrict(posts) {
    const counts = {};
    (Array.isArray(posts) ? posts : []).forEach(function (post) {
        const district = String(post.district || "").trim();
        if (district) counts[district] = (counts[district] || 0) + 1;
    });
    return counts;
}

function countPostsByRating(posts) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    (Array.isArray(posts) ? posts : []).forEach(function (post) {
        const rating = Number(post.rating);
        if (Number.isInteger(rating) && rating >= 1 && rating <= 5) counts[rating] += 1;
    });
    return counts;
}

function countPostsByMonth(posts) {
    const counts = {};
    (Array.isArray(posts) ? posts : []).forEach(function (post) {
        const date = new Date(post.createdAt);
        if (Number.isNaN(date.getTime())) return;
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        counts[key] = (counts[key] || 0) + 1;
    });
    return Object.fromEntries(Object.entries(counts).sort(function (first, second) {
        return first[0].localeCompare(second[0]);
    }));
}

function countTasksByStatus(tasks) {
    return countByKnownValues(Array.isArray(tasks) ? tasks : [], "status", ["Pending", "Done"]);
}

function countTasksByPriority(tasks) {
    return countByKnownValues(Array.isArray(tasks) ? tasks : [], "priority", ["Low", "Medium", "High"]);
}

function countTasksByCategory(tasks) {
    return countByKnownValues(Array.isArray(tasks) ? tasks : [], "category", ["Cafe", "Food"]);
}

function setChartEmptyState(canvasId, values) {
    const canvas = document.querySelector(`#${canvasId}`);
    if (!canvas) return false;
    const card = canvas.closest(".chart-card");
    const message = card ? card.querySelector(".chart-empty-message") : null;
    const hasData = values.some(function (value) { return Number(value) > 0; });
    canvas.hidden = !hasData;
    if (message) {
        message.hidden = hasData;
        message.textContent = hasData ? "" : "Chưa có dữ liệu để thống kê.";
    }
    return hasData;
}

function commonChartOptions(hasAxes = false) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom", labels: { usePointStyle: true, padding: 16 } },
            tooltip: { callbacks: { label: function (context) { return `${context.label}: ${context.parsed.y ?? context.parsed}`; } } }
        }
    };
    if (hasAxes) {
        options.scales = {
            y: { beginAtZero: true, ticks: { precision: 0 } },
            x: { grid: { display: false } }
        };
    }
    return options;
}

function createChart(instanceName, canvasId, configuration) {
    const canvas = document.querySelector(`#${canvasId}`);
    if (!canvas || typeof Chart === "undefined") return null;
    if (chartInstances[instanceName]) chartInstances[instanceName].destroy();
    chartInstances[instanceName] = new Chart(canvas, configuration);
    return chartInstances[instanceName];
}

function createCategoryChart(data) {
    const labels = Object.keys(data);
    const values = Object.values(data);
    if (!setChartEmptyState("category-chart", values)) return null;
    return createChart("category", "category-chart", {
        type: "doughnut",
        data: { labels, datasets: [{ label: "Bài review", data: values, backgroundColor: STATISTIC_COLORS.slice(0, 2), borderWidth: 2 }] },
        options: commonChartOptions()
    });
}

function createDistrictChart(data) {
    const topDistricts = Object.entries(data).sort(function (first, second) {
        return second[1] - first[1] || first[0].localeCompare(second[0], "vi");
    }).slice(0, 8);
    const labels = topDistricts.map(function (entry) { return entry[0]; });
    const values = topDistricts.map(function (entry) { return entry[1]; });
    if (!setChartEmptyState("district-chart", values)) return null;
    return createChart("district", "district-chart", {
        type: "bar",
        data: { labels, datasets: [{ label: "Số bài review", data: values, backgroundColor: "#5793d2", borderRadius: 7 }] },
        options: commonChartOptions(true)
    });
}

function createRatingChart(data) {
    const labels = [1, 2, 3, 4, 5].map(function (rating) { return `${rating} sao`; });
    const values = [1, 2, 3, 4, 5].map(function (rating) { return data[rating] || 0; });
    if (!setChartEmptyState("rating-chart", values)) return null;
    return createChart("rating", "rating-chart", {
        type: "bar",
        data: { labels, datasets: [{ label: "Số bài review", data: values, backgroundColor: "#f4b400", borderRadius: 7 }] },
        options: commonChartOptions(true)
    });
}

function createMonthlyPostChart(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (!setChartEmptyState("monthly-post-chart", values)) return null;
    const labels = keys.map(function (key) {
        const [year, month] = key.split("-");
        return `${month}/${year}`;
    });
    return createChart("monthlyPosts", "monthly-post-chart", {
        type: "line",
        data: { labels, datasets: [{ label: "Bài đăng", data: values, borderColor: "#4aa879", backgroundColor: "rgba(74,168,121,.15)", fill: true, tension: .25 }] },
        options: commonChartOptions(true)
    });
}

function createTaskStatusChart(data) {
    const labels = ["Pending", "Done"];
    const values = labels.map(function (label) { return data[label] || 0; });
    if (!setChartEmptyState("task-status-chart", values)) return null;
    return createChart("taskStatus", "task-status-chart", {
        type: "doughnut",
        data: { labels, datasets: [{ label: "Kế hoạch", data: values, backgroundColor: ["#ef8f35", "#4aa879"], borderWidth: 2 }] },
        options: commonChartOptions()
    });
}

function createTaskPriorityChart(data) {
    const labels = ["Low", "Medium", "High"];
    const values = labels.map(function (label) { return data[label] || 0; });
    if (!setChartEmptyState("task-priority-chart", values)) return null;
    return createChart("taskPriority", "task-priority-chart", {
        type: "bar",
        data: { labels, datasets: [{ label: "Kế hoạch", data: values, backgroundColor: ["#5793d2", "#f4b400", "#e67b7b"], borderRadius: 7 }] },
        options: commonChartOptions(true)
    });
}

function createTaskCategoryChart(data) {
    const labels = ["Cafe", "Food"];
    const values = labels.map(function (label) { return data[label] || 0; });
    if (!setChartEmptyState("task-category-chart", values)) return null;
    return createChart("taskCategory", "task-category-chart", {
        type: "bar",
        data: { labels, datasets: [{ label: "Kế hoạch", data: values, backgroundColor: ["#9b82c4", "#ef8f35"], borderRadius: 7 }] },
        options: commonChartOptions(true)
    });
}

function destroyExistingCharts() {
    Object.keys(chartInstances).forEach(function (key) {
        if (chartInstances[key]) {
            chartInstances[key].destroy();
            chartInstances[key] = null;
        }
    });
}

function renderAllCharts() {
    if (typeof Chart === "undefined") {
        document.querySelectorAll(".chart-empty-message").forEach(function (message) {
            message.hidden = false;
            message.textContent = "Không thể tải thư viện biểu đồ. Vui lòng kiểm tra kết nối mạng.";
        });
        return;
    }
    destroyExistingCharts();
    const data = getStatisticsData();
    createCategoryChart(countPostsByCategory(data.posts));
    createDistrictChart(countPostsByDistrict(data.posts));
    createRatingChart(countPostsByRating(data.posts));
    createMonthlyPostChart(countPostsByMonth(data.posts));
    createTaskStatusChart(countTasksByStatus(data.tasks));
    createTaskPriorityChart(countTasksByPriority(data.tasks));
    createTaskCategoryChart(countTasksByCategory(data.tasks));
}

function updateStatisticsTimestamp() {
    const element = document.querySelector("#statistics-updated-at");
    if (element) {
        element.textContent = `Cập nhật lúc ${new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })}`;
    }
}

function refreshStatisticsPage() {
    updateOverviewStatistics();
    renderAllCharts();
    updateStatisticsTimestamp();
}

function initializeStatisticsPage() {
    const page = document.querySelector("[data-page='statistics']");
    if (!page || page.dataset.statisticsInitialized === "true") return;
    if (typeof isLoggedIn === "function" && !isLoggedIn()) {
        requireLogin("statistics.html");
        return;
    }
    page.dataset.statisticsInitialized = "true";
    seedInitialData();
    refreshStatisticsPage();
}

document.addEventListener("DOMContentLoaded", function () {
    if (document.body.dataset.page === "statistics") initializeStatisticsPage();
});
