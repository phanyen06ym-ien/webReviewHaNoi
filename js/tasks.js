"use strict";

/**
 * tasks.js
 * Quản lý toàn bộ chức năng CRUD của kế hoạch khám phá quán.
 */

function getTasks() {
    const tasks = getData(STORAGE_KEYS.TASKS, []);
    return Array.isArray(tasks) ? tasks : [];
}

function saveTasks(tasks) {
    return saveData(STORAGE_KEYS.TASKS, tasks);
}

function getTaskById(taskId) {
    return getTasks().find(function (task) {
        return Number(task.id) === Number(taskId);
    });
}

function refreshTaskPage() {
    applyTaskFilters();
    updateTaskStatistics();
}

function createTask(taskData) {
    const tasks = getTasks();
    const newTask = {
        id: generateId(tasks),
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        priority: taskData.priority,
        status: "Pending",
        category: taskData.category,
        district: taskData.district,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks(tasks);
    closeTaskModal();
    refreshTaskPage();
    showToast("Đã thêm kế hoạch thành công", "success");
}

function updateTask(taskId, taskData) {
    const tasks = getTasks();
    const task = tasks.find(function (item) {
        return Number(item.id) === Number(taskId);
    });

    if (!task) {
        showToast("Không tìm thấy kế hoạch cần sửa", "error");
        return;
    }

    task.title = taskData.title;
    task.description = taskData.description;
    task.deadline = taskData.deadline;
    task.priority = taskData.priority;
    task.category = taskData.category;
    task.district = taskData.district;

    saveTasks(tasks);
    closeTaskModal();
    refreshTaskPage();
    showToast("Đã cập nhật kế hoạch", "success");
}

async function deleteTask(taskId) {
    const task = getTaskById(taskId);

    if (!task) {
        showToast("Không tìm thấy kế hoạch cần xóa", "error");
        return;
    }

    const shouldDelete = await showConfirmModal({
        title: "Xóa kế hoạch?",
        message: "Kế hoạch này sẽ bị xóa vĩnh viễn và không thể hoàn tác.",
        confirmText: "Xóa kế hoạch",
        danger: true
    });

    if (!shouldDelete) {
        return;
    }

    const remainingTasks = getTasks().filter(function (item) {
        return Number(item.id) !== Number(taskId);
    });

    saveTasks(remainingTasks);
    refreshTaskPage();
    showToast("Đã xóa kế hoạch", "success");
}

function toggleTaskStatus(taskId) {
    const tasks = getTasks();
    const task = tasks.find(function (item) {
        return Number(item.id) === Number(taskId);
    });

    if (!task) {
        showToast("Không tìm thấy kế hoạch", "error");
        return;
    }

    task.status = task.status === "Done" ? "Pending" : "Done";
    saveTasks(tasks);
    refreshTaskPage();
    showToast(task.status === "Done" ? "Đã hoàn thành kế hoạch" : "Đã chuyển về Pending", "success");
}

function openTaskModal(taskId = null) {
    const modal = document.querySelector("#task-modal");
    const form = document.querySelector("#task-form");
    const modalTitle = document.querySelector("#task-modal-title");
    const deadlineInput = document.querySelector("#task-deadline");

    if (!modal || !form || !modalTitle || !deadlineInput) {
        return;
    }

    form.reset();
    clearFormErrors(form);
    deadlineInput.min = getTodayDateString();

    if (taskId === null) {
        document.querySelector("#task-id").value = "";
        modalTitle.textContent = "Thêm kế hoạch";
    } else {
        const task = getTaskById(taskId);

        if (!task) {
            showToast("Không tìm thấy kế hoạch cần sửa", "error");
            return;
        }

        document.querySelector("#task-id").value = task.id;
        document.querySelector("#task-title").value = task.title;
        document.querySelector("#task-description").value = task.description;
        deadlineInput.value = task.deadline;
        document.querySelector("#task-priority").value = task.priority;
        document.querySelector("#task-category").value = task.category;
        document.querySelector("#task-district").value = task.district;
        modalTitle.textContent = "Sửa kế hoạch";
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");
    window.setTimeout(function () {
        document.querySelector("#task-title").focus();
    }, 0);
}

function closeTaskModal() {
    const modal = document.querySelector("#task-modal");
    const form = document.querySelector("#task-form");

    if (!modal || !form) {
        return;
    }

    modal.hidden = true;
    form.reset();
    document.querySelector("#task-id").value = "";
    clearFormErrors(form);
    document.body.classList.remove("modal-open");
}

function handleTaskSubmit(event) {
    event.preventDefault();

    if (!validateTaskForm()) {
        const firstInvalidInput = document.querySelector("#task-form .is-invalid");
        if (firstInvalidInput) {
            firstInvalidInput.focus();
        }
        return;
    }

    const taskData = {
        title: document.querySelector("#task-title").value.trim(),
        description: document.querySelector("#task-description").value.trim(),
        deadline: document.querySelector("#task-deadline").value,
        priority: document.querySelector("#task-priority").value,
        category: document.querySelector("#task-category").value,
        district: document.querySelector("#task-district").value
    };
    const taskId = Number(document.querySelector("#task-id").value);

    if (taskId) {
        updateTask(taskId, taskData);
    } else {
        createTask(taskData);
    }
}

function formatTaskDate(dateValue) {
    if (!dateValue) {
        return "Chưa có ngày";
    }

    const dateParts = dateValue.slice(0, 10).split("-");
    if (dateParts.length !== 3) {
        return "Ngày không hợp lệ";
    }

    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}

function createTaskCard(task) {
    const isDone = task.status === "Done";
    const allowedPriorities = ["Low", "Medium", "High"];
    const safePriority = allowedPriorities.includes(task.priority) ? task.priority : "Low";
    const priorityClass = safePriority.toLowerCase();
    const statusClass = isDone ? "done" : "pending";
    const safeTitle = escapeHTML(task.title);

    return `
        <article class="task-card ${isDone ? "task-done" : ""}" data-task-id="${Number(task.id)}">
            <div class="task-card-header">
                <div>
                    <h3 class="task-title">${safeTitle}</h3>
                    <p class="task-description">${escapeHTML(task.description)}</p>
                </div>
                <span class="priority-badge priority-${priorityClass}">${safePriority}</span>
            </div>
            <div class="task-meta">
                <span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${escapeHTML(formatTaskDate(task.deadline))}</span>
                <span><i class="fa-solid fa-tag" aria-hidden="true"></i> ${escapeHTML(task.category)}</span>
                <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHTML(task.district)}</span>
                <span class="status-badge status-${statusClass}">
                    <i class="fa-solid ${isDone ? "fa-circle-check" : "fa-clock"}" aria-hidden="true"></i>
                    ${escapeHTML(task.status)}
                </span>
                <span><i class="fa-regular fa-calendar-plus" aria-hidden="true"></i> Tạo ${escapeHTML(formatDateTime(task.createdAt))}</span>
            </div>
            <div class="task-actions">
                <button class="task-action-button task-toggle-button" type="button"
                    data-action="toggle" data-task-id="${Number(task.id)}"
                    aria-label="${isDone ? "Hoàn tác" : "Đánh dấu hoàn thành"} kế hoạch ${safeTitle}">
                    <i class="fa-solid ${isDone ? "fa-rotate-left" : "fa-check"}" aria-hidden="true"></i>
                    ${isDone ? "Hoàn tác" : "Đánh dấu hoàn thành"}
                </button>
                <button class="task-action-button task-edit-button" type="button"
                    data-action="edit" data-task-id="${Number(task.id)}"
                    aria-label="Sửa kế hoạch ${safeTitle}">
                    <i class="fa-regular fa-pen-to-square" aria-hidden="true"></i> Sửa
                </button>
                <button class="task-action-button task-delete-button" type="button"
                    data-action="delete" data-task-id="${Number(task.id)}"
                    aria-label="Xóa kế hoạch ${safeTitle}">
                    <i class="fa-regular fa-trash-can" aria-hidden="true"></i> Xóa
                </button>
            </div>
        </article>
    `;
}

function renderTasks(tasksToRender) {
    const taskList = document.querySelector("#task-list");

    if (!taskList) {
        return;
    }

    const tasks = Array.isArray(tasksToRender) ? tasksToRender : getTasks();
    const hasFilters = getTaskFilterValues().hasActiveFilters;

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state card">
                <i class="fa-regular fa-calendar-xmark" aria-hidden="true"></i>
                <h3>${hasFilters ? "Không tìm thấy kết quả phù hợp" : "Bạn chưa có kế hoạch khám phá quán nào."}</h3>
                <p>${hasFilters ? "Hãy thử thay đổi từ khóa hoặc bộ lọc." : "Tạo kế hoạch đầu tiên để bắt đầu hành trình ẩm thực."}</p>
                <button class="button button-primary" type="button" data-action="${hasFilters ? "reset" : "add"}">
                    ${hasFilters ? "Đặt lại bộ lọc" : "Thêm kế hoạch đầu tiên"}
                </button>
            </div>
        `;
        return;
    }

    taskList.innerHTML = tasks.map(createTaskCard).join("");
}

function searchTasks(tasks, keyword) {
    const normalizedKeyword = String(keyword || "").trim().toLocaleLowerCase("vi-VN");

    if (!normalizedKeyword) {
        return tasks;
    }

    return tasks.filter(function (task) {
        const title = String(task.title || "").toLocaleLowerCase("vi-VN");
        const description = String(task.description || "").toLocaleLowerCase("vi-VN");
        return title.includes(normalizedKeyword) || description.includes(normalizedKeyword);
    });
}

function filterTasks(tasks, filters) {
    return tasks.filter(function (task) {
        const matchesStatus = !filters.status || task.status === filters.status;
        const matchesPriority = !filters.priority || task.priority === filters.priority;
        const matchesCategory = !filters.category || task.category === filters.category;
        const matchesDistrict = !filters.district || task.district === filters.district;
        return matchesStatus && matchesPriority && matchesCategory && matchesDistrict;
    });
}

function sortTasks(tasks, sortType) {
    const sortedTasks = [...tasks];

    sortedTasks.sort(function (firstTask, secondTask) {
        if (sortType === "deadline-desc") {
            return String(secondTask.deadline).localeCompare(String(firstTask.deadline));
        }
        if (sortType === "newest") {
            return new Date(secondTask.createdAt) - new Date(firstTask.createdAt);
        }
        if (sortType === "oldest") {
            return new Date(firstTask.createdAt) - new Date(secondTask.createdAt);
        }
        return String(firstTask.deadline).localeCompare(String(secondTask.deadline));
    });

    return sortedTasks;
}

function getTaskFilterValues() {
    const searchInput = document.querySelector("#task-search");
    const statusInput = document.querySelector("#filter-status");
    const priorityInput = document.querySelector("#filter-priority");
    const categoryInput = document.querySelector("#filter-category");
    const districtInput = document.querySelector("#filter-district");
    const sortInput = document.querySelector("#sort-deadline");

    const values = {
        keyword: searchInput ? searchInput.value : "",
        status: statusInput ? statusInput.value : "",
        priority: priorityInput ? priorityInput.value : "",
        category: categoryInput ? categoryInput.value : "",
        district: districtInput ? districtInput.value : "",
        sortType: sortInput ? sortInput.value : "deadline-asc"
    };

    values.hasActiveFilters = Boolean(
        values.keyword.trim() || values.status || values.priority || values.category || values.district
    );
    return values;
}

function applyTaskFilters() {
    const allTasks = getTasks();
    const values = getTaskFilterValues();
    let visibleTasks = searchTasks(allTasks, values.keyword);

    visibleTasks = filterTasks(visibleTasks, values);
    visibleTasks = sortTasks(visibleTasks, values.sortType);
    renderTasks(visibleTasks);

    const resultCount = document.querySelector("#task-result-count");
    if (resultCount) {
        resultCount.textContent = `Hiển thị ${visibleTasks.length}/${allTasks.length} kế hoạch`;
    }
}

function resetTaskFilters() {
    const filterIds = [
        "task-search",
        "filter-status",
        "filter-priority",
        "filter-category",
        "filter-district"
    ];

    filterIds.forEach(function (id) {
        const input = document.querySelector(`#${id}`);
        if (input) {
            input.value = "";
        }
    });

    const sortInput = document.querySelector("#sort-deadline");
    if (sortInput) {
        sortInput.value = "deadline-asc";
    }

    applyTaskFilters();
}

async function clearAllTasks() {
    const tasks = getTasks();

    if (tasks.length === 0) {
        showToast("Danh sách kế hoạch đang trống", "info");
        return;
    }

    const shouldClear = await showConfirmModal({
        title: "Xóa toàn bộ kế hoạch?",
        message: "Tất cả kế hoạch sẽ bị xóa và không thể hoàn tác.",
        confirmText: "Xóa tất cả",
        danger: true
    });

    if (!shouldClear) {
        return;
    }

    // Lưu mảng rỗng thay vì xóa key để seed không tạo lại dữ liệu sau refresh.
    saveTasks([]);
    refreshTaskPage();
    showToast("Đã xóa toàn bộ kế hoạch", "success");
}

function updateTaskStatistics() {
    const tasks = getTasks();
    const pendingCount = tasks.filter(function (task) {
        return task.status === "Pending";
    }).length;
    const doneCount = tasks.filter(function (task) {
        return task.status === "Done";
    }).length;
    const highCount = tasks.filter(function (task) {
        return task.priority === "High";
    }).length;
    const statistics = {
        "total-task-count": tasks.length,
        "pending-task-count": pendingCount,
        "done-task-count": doneCount,
        "high-task-count": highCount
    };

    Object.entries(statistics).forEach(function (entry) {
        const element = document.querySelector(`#${entry[0]}`);
        if (element) {
            element.textContent = entry[1];
        }
    });
}

function initializeTaskEvents() {
    const taskList = document.querySelector("#task-list");
    const taskForm = document.querySelector("#task-form");
    const modal = document.querySelector("#task-modal");

    document.querySelector("#add-task-button").addEventListener("click", function () {
        openTaskModal();
    });
    document.querySelector("#close-task-modal").addEventListener("click", closeTaskModal);
    document.querySelector("#cancel-task-modal").addEventListener("click", closeTaskModal);
    document.querySelector("#clear-all-tasks").addEventListener("click", clearAllTasks);
    document.querySelector("#reset-task-filters").addEventListener("click", resetTaskFilters);
    taskForm.addEventListener("submit", handleTaskSubmit);

    const handleTaskSearch = typeof debounce === "function"
        ? debounce(applyTaskFilters, 250)
        : applyTaskFilters;
    document.querySelector("#task-search").addEventListener("input", handleTaskSearch);
    ["filter-status", "filter-priority", "filter-category", "filter-district", "sort-deadline"]
        .forEach(function (id) {
            document.querySelector(`#${id}`).addEventListener("change", applyTaskFilters);
        });

    ["title", "description", "deadline", "priority", "category", "district"]
        .forEach(function (fieldName) {
            const field = document.querySelector(`#task-${fieldName}`);
            field.addEventListener("blur", function () {
                validateTaskField(fieldName);
            });
            field.addEventListener(field.tagName === "SELECT" ? "change" : "input", function () {
                if (field.classList.contains("is-invalid")) {
                    validateTaskField(fieldName);
                }
            });
        });

    // Event delegation giúp xử lý các card được tạo động bằng JavaScript.
    taskList.addEventListener("click", function (event) {
        const actionButton = event.target.closest("[data-action]");
        if (!actionButton) {
            return;
        }

        const action = actionButton.dataset.action;
        const taskId = Number(actionButton.dataset.taskId);

        if (action === "toggle") toggleTaskStatus(taskId);
        if (action === "edit") openTaskModal(taskId);
        if (action === "delete") deleteTask(taskId);
        if (action === "add") openTaskModal();
        if (action === "reset") resetTaskFilters();
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeTaskModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeTaskModal();
        }
    });

    document.querySelectorAll(".future-feature").forEach(function (button) {
        button.addEventListener("click", function () {
            showToast(`${button.dataset.feature} sẽ hoàn thiện ở giai đoạn tiếp theo`, "info");
        });
    });
}

function initializeTaskPage() {
    const taskPage = document.querySelector("[data-page='tasks']");

    if (!taskPage || taskPage.dataset.tasksInitialized === "true") {
        return;
    }

    // Đánh dấu để tránh gắn trùng event listener nếu hàm vô tình được gọi lần hai.
    taskPage.dataset.tasksInitialized = "true";
    initializeTaskEvents();
    applyTaskFilters();
    updateTaskStatistics();
}
