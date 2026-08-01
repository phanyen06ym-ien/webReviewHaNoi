"use strict";

/**
 * validation.js
 * Cung cấp các hàm kiểm tra dữ liệu form và hiển thị lỗi tại từng trường.
 */

function validateRequired(value) {
    return String(value ?? "").trim().length > 0;
}

function validateMinLength(value, minLength) {
    return String(value ?? "").trim().length >= minLength;
}

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function validateDeadline(dateValue) {
    if (!validateRequired(dateValue)) {
        return false;
    }

    return dateValue >= getTodayDateString();
}

function showFieldError(inputElement, errorElement, message) {
    if (!inputElement || !errorElement) {
        return;
    }

    inputElement.classList.add("is-invalid");
    inputElement.setAttribute("aria-invalid", "true");
    inputElement.setAttribute("aria-describedby", errorElement.id);
    errorElement.textContent = message;
}

function clearFieldError(inputElement, errorElement) {
    if (!inputElement || !errorElement) {
        return;
    }

    inputElement.classList.remove("is-invalid");
    inputElement.removeAttribute("aria-invalid");
    inputElement.removeAttribute("aria-describedby");
    errorElement.textContent = "";
}

function clearFormErrors(form) {
    if (!form) {
        return;
    }

    form.querySelectorAll(".is-invalid").forEach(function (input) {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
    });

    form.querySelectorAll(".field-error").forEach(function (errorElement) {
        errorElement.textContent = "";
    });
}

function validateTaskField(fieldName) {
    const input = document.querySelector(`#task-${fieldName}`);
    const errorElement = document.querySelector(`#task-${fieldName}-error`);

    if (!input || !errorElement) {
        return false;
    }

    const value = input.value.trim();
    clearFieldError(input, errorElement);

    if (fieldName === "title") {
        if (!validateRequired(value)) {
            showFieldError(input, errorElement, "Vui lòng nhập tiêu đề.");
            return false;
        }
        if (!validateMinLength(value, 3)) {
            showFieldError(input, errorElement, "Tiêu đề phải có ít nhất 3 ký tự.");
            return false;
        }
        if (value.length > 100) {
            showFieldError(input, errorElement, "Tiêu đề không được vượt quá 100 ký tự.");
            return false;
        }
    }

    if (fieldName === "description") {
        if (!validateRequired(value)) {
            showFieldError(input, errorElement, "Vui lòng nhập mô tả.");
            return false;
        }
        if (!validateMinLength(value, 10)) {
            showFieldError(input, errorElement, "Mô tả phải có ít nhất 10 ký tự.");
            return false;
        }
        if (value.length > 500) {
            showFieldError(input, errorElement, "Mô tả không được vượt quá 500 ký tự.");
            return false;
        }
    }

    if (fieldName === "deadline") {
        if (!validateRequired(value)) {
            showFieldError(input, errorElement, "Vui lòng chọn hạn hoàn thành.");
            return false;
        }
        if (!validateDeadline(value)) {
            showFieldError(input, errorElement, "Hạn hoàn thành không được nhỏ hơn ngày hiện tại.");
            return false;
        }
    }

    const selectMessages = {
        priority: "Vui lòng chọn mức độ ưu tiên.",
        category: "Vui lòng chọn loại địa điểm.",
        district: "Vui lòng chọn quận."
    };

    if (selectMessages[fieldName] && !validateRequired(value)) {
        showFieldError(input, errorElement, selectMessages[fieldName]);
        return false;
    }

    return true;
}

function validateTaskForm() {
    const fieldNames = ["title", "description", "deadline", "priority", "category", "district"];
    let isFormValid = true;

    fieldNames.forEach(function (fieldName) {
        if (!validateTaskField(fieldName)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

function validateRating(value) {
    const rating = Number(value);
    return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

function parseHashtags(value) {
    const uniqueHashtags = [];
    const usedHashtags = new Set();

    // Tách bằng dấu phẩy, bỏ dấu #, khoảng trắng, phần tử rỗng và hashtag trùng.
    String(value || "").split(",").forEach(function (tag) {
        const cleanTag = tag.trim().replace(/^#+/, "");
        const normalizedTag = cleanTag.toLocaleLowerCase("vi-VN");

        if (cleanTag && !usedHashtags.has(normalizedTag) && uniqueHashtags.length < 5) {
            usedHashtags.add(normalizedTag);
            uniqueHashtags.push(cleanTag);
        }
    });

    return uniqueHashtags;
}

function validateHashtags(value) {
    const rawTags = String(value || "").split(",")
        .map(function (tag) {
            return tag.trim().replace(/^#+/, "");
        })
        .filter(function (tag) {
            return tag.length > 0;
        });
    const uniqueTags = new Set(rawTags.map(function (tag) {
        return tag.toLocaleLowerCase("vi-VN");
    }));

    return uniqueTags.size <= 5 && rawTags.every(function (tag) {
        return tag.length <= 30;
    });
}

function validateImageFile(file, maximumSize = 2 * 1024 * 1024) {
    if (!file) {
        return true;
    }

    return file.type.startsWith("image/") && file.size <= maximumSize;
}

function getPostFieldConfig(fieldName) {
    const configs = {
        title: { selector: "#post-title", required: "Vui lòng nhập tiêu đề.", min: 5, max: 120 },
        restaurant: { selector: "#restaurant-name", required: "Vui lòng nhập tên quán.", min: 2, max: 100 },
        category: { selector: "#post-category", required: "Vui lòng chọn loại địa điểm." },
        district: { selector: "#post-district", required: "Vui lòng chọn quận." },
        address: { selector: "#post-address", required: "Vui lòng nhập địa chỉ.", min: 5 },
        rating: { selector: "#post-rating", required: "Vui lòng chọn số sao." },
        content: { selector: "#post-content", required: "Vui lòng nhập nội dung review.", min: 10, max: 1500 },
        image: { selector: "#post-image" },
        hashtags: { selector: "#post-hashtags" }
    };

    return configs[fieldName];
}

function validatePostField(fieldName) {
    const config = getPostFieldConfig(fieldName);
    const input = config ? document.querySelector(config.selector) : null;
    const errorElement = document.querySelector(`#post-${fieldName}-error`);

    if (!config || !input || !errorElement) {
        return false;
    }

    const value = input.value.trim();
    clearFieldError(input, errorElement);

    if (config.required && !validateRequired(value)) {
        showFieldError(input, errorElement, config.required);
        return false;
    }
    if (config.min && !validateMinLength(value, config.min)) {
        showFieldError(input, errorElement, `Nội dung phải có ít nhất ${config.min} ký tự.`);
        return false;
    }
    if (config.max && value.length > config.max) {
        showFieldError(input, errorElement, `Nội dung không được vượt quá ${config.max} ký tự.`);
        return false;
    }
    if (fieldName === "rating" && !validateRating(value)) {
        showFieldError(input, errorElement, "Đánh giá phải từ 1 đến 5 sao.");
        return false;
    }
    if (fieldName === "hashtags" && !validateHashtags(value)) {
        showFieldError(input, errorElement, "Tối đa 5 hashtag, mỗi hashtag không quá 30 ký tự.");
        return false;
    }

    return true;
}

function validatePostForm() {
    const fieldNames = [
        "title", "restaurant", "category", "district",
        "address", "rating", "content", "image", "hashtags"
    ];
    let isValid = true;

    fieldNames.forEach(function (fieldName) {
        if (!validatePostField(fieldName)) {
            isValid = false;
        }
    });

    return isValid;
}
