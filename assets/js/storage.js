"use strict";

/**
 * storage.js
 * Cung cấp các hàm dùng chung để đọc, lưu và khởi tạo dữ liệu LocalStorage.
 */

const STORAGE_KEYS = {
    USERS: "hanoi_food_users",
    CURRENT_USER: "hanoi_food_current_user",
    POSTS: "hanoi_food_posts",
    COMMENTS: "hanoi_food_comments",
    TASKS: "hanoi_food_tasks",
    SAVED_POSTS: "hanoi_food_saved_posts",
    THEME: "hanoi_food_theme"
};

function getData(key, defaultValue = []) {
    const storedData = localStorage.getItem(key);

    if (!storedData) {
        return defaultValue;
    }

    try {
        return JSON.parse(storedData);
    } catch {
        return defaultValue;
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch {
        return false;
    }
}

function removeData(key) {
    localStorage.removeItem(key);
}

function generateId(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return 1;
    }

    // map lấy danh sách ID, Math.max tìm ID lớn nhất hiện có.
    const ids = items.map(function (item) {
        return Number(item.id) || 0;
    });

    return Math.max(...ids) + 1;
}

function getInitialUsers() {
    return [
        {
            id: 1,
            fullname: "Nguyễn Minh Anh",
            username: "admin",
            email: "admin@hanoifood.vn",
            // Chỉ lưu password dạng chuỗi để phục vụ bài tập, không an toàn cho hệ thống thật.
            password: "123456",
            avatar: "assets/images/avatars/default-avatar.svg",
            bio: "Người yêu ẩm thực Hà Nội",
            joinedAt: "2026-07-29T10:00:00"
        },
        {
            id: 2,
            fullname: "Trần Hải Yến",
            username: "student",
            email: "student@hanoifood.vn",
            password: "123456",
            avatar: "assets/images/avatars/default-avatar.svg",
            bio: "Thích khám phá quán cà phê và món ngon",
            joinedAt: "2026-07-29T10:05:00"
        }
    ];
}

function getInitialPosts() {
    return [
        {
            id: 1,
            userId: 2,
            authorName: "Trần Hải Yến",
            authorAvatar: "assets/images/avatars/default-avatar.svg",
            title: "Không gian học tập yên tĩnh tại Hà Đông",
            restaurantName: "The Coffee House Hà Đông",
            category: "Cafe",
            district: "Hà Đông",
            address: "Tô Hiệu, Hà Đông, Hà Nội",
            rating: 4,
            content: "Không gian rộng, có nhiều ổ cắm và phù hợp học nhóm vào buổi chiều.",
            image: "assets/images/posts/cafe-study.jpg",
            hashtags: ["CafeHaNoi", "HaDong", "CafeHocTap"],
            likes: 12,
            likedByCurrentUser: false,
            isSaved: false,
            createdAt: "2026-07-29T08:30:00",
            updatedAt: null
        },
        {
            id: 2,
            userId: 1,
            authorName: "Nguyễn Minh Anh",
            authorAvatar: "assets/images/avatars/default-avatar.svg",
            title: "Bún chả phố cổ thơm mùi than hoa",
            restaurantName: "Bún chả Đắc Kim",
            category: "Food",
            district: "Hoàn Kiếm",
            address: "Hàng Mành, Hoàn Kiếm, Hà Nội",
            rating: 5,
            content: "Thịt nướng thơm, nước chấm vừa vị và suất ăn khá đầy đặn cho một buổi trưa.",
            image: "assets/images/posts/bun-cha.jpg",
            hashtags: ["BunCha", "HoanKiem", "AnNgonHaNoi"],
            likes: 28,
            likedByCurrentUser: true,
            isSaved: false,
            createdAt: "2026-07-28T12:15:00",
            updatedAt: null
        },
        {
            id: 3,
            userId: 2,
            authorName: "Trần Hải Yến",
            authorAvatar: "assets/images/avatars/default-avatar.svg",
            title: "Địa chỉ ăn đêm ấm bụng ở Đống Đa",
            restaurantName: "Cháo sườn Huyền Anh",
            category: "Food",
            district: "Đống Đa",
            address: "Ngõ Huyện, Đống Đa, Hà Nội",
            rating: 4,
            content: "Cháo mịn, sườn mềm và quẩy giòn, quán mở muộn nên rất tiện cho những hôm học về khuya.",
            image: "assets/images/posts/chao-suon.jpg",
            hashtags: ["AnDemHaNoi", "DongDa", "QuanSinhVien"],
            likes: 19,
            likedByCurrentUser: false,
            isSaved: true,
            createdAt: "2026-07-27T22:10:00",
            updatedAt: null
        },
        {
            id: 4,
            userId: 1,
            authorName: "Nguyễn Minh Anh",
            authorAvatar: "assets/images/avatars/default-avatar.svg",
            title: "Ngắm hoàng hôn tại cafe rooftop Thanh Xuân",
            restaurantName: "Trill Rooftop Cafe",
            category: "Cafe",
            district: "Thanh Xuân",
            address: "Ngụy Như Kon Tum, Thanh Xuân, Hà Nội",
            rating: 5,
            content: "Không gian thoáng, nhiều góc chụp ảnh và đồ uống dễ uống, phù hợp đi cùng bạn bè.",
            image: "assets/images/posts/rooftop-cafe.jpg",
            hashtags: ["CafeHaNoi", "ThanhXuan", "CafeSongAo"],
            likes: 35,
            likedByCurrentUser: false,
            isSaved: false,
            createdAt: "2026-07-26T17:45:00",
            updatedAt: null
        },
        {
            id: 5,
            userId: 2,
            authorName: "Trần Hải Yến",
            authorAvatar: "assets/images/avatars/default-avatar.svg",
            title: "Bát phở nóng cho sáng cuối tuần",
            restaurantName: "Phở Cuốn Hương Mai",
            category: "Food",
            district: "Ba Đình",
            address: "Ngũ Xã, Ba Đình, Hà Nội",
            rating: 4,
            content: "Nước dùng trong và thơm, thịt mềm, phục vụ nhanh dù quán khá đông vào buổi sáng.",
            image: "assets/images/posts/pho-cuon.jpg",
            hashtags: ["PhoHaNoi", "BaDinh", "AnNgonHaNoi"],
            likes: 22,
            likedByCurrentUser: false,
            isSaved: false,
            createdAt: "2026-07-25T07:20:00",
            updatedAt: null
        },
        {
            id: 6,
            userId: 1,
            authorName: "Nguyễn Minh Anh",
            authorAvatar: "assets/images/avatars/default-avatar.svg",
            title: "Tiệm bánh nhỏ xinh gần trường đại học",
            restaurantName: "Artemis Pastry",
            category: "Food",
            district: "Cầu Giấy",
            address: "Trần Thái Tông, Cầu Giấy, Hà Nội",
            rating: 5,
            content: "Bánh trình bày đẹp, vị ngọt vừa phải và có khu vực ngồi lại khá yên tĩnh, sáng sủa.",
            image: "assets/images/posts/pastry-cafe.jpg",
            hashtags: ["TiemBanh", "CauGiay", "QuanSinhVien"],
            likes: 31,
            likedByCurrentUser: false,
            isSaved: true,
            createdAt: "2026-07-24T15:00:00",
            updatedAt: null
        }
    ];
}

function getInitialTasks() {
    return [
        {
            id: 1,
            title: "Trải nghiệm quán cafe mới",
            description: "Đến quán để đánh giá không gian, đồ uống và chất lượng phục vụ.",
            deadline: "2026-08-10",
            priority: "High",
            status: "Pending",
            category: "Cafe",
            district: "Hà Đông",
            createdAt: "2026-07-29T10:00:00"
        },
        {
            id: 2,
            title: "Thử bún chả phố cổ",
            description: "Ghé quán vào buổi trưa để thử bún chả và ghi lại mức giá.",
            deadline: "2026-08-12",
            priority: "Medium",
            status: "Pending",
            category: "Food",
            district: "Hoàn Kiếm",
            createdAt: "2026-07-29T10:10:00"
        },
        {
            id: 3,
            title: "Review quán ăn đêm",
            description: "Kiểm tra giờ mở cửa và trải nghiệm các món ăn đêm nổi bật.",
            deadline: "2026-08-15",
            priority: "Low",
            status: "Done",
            category: "Food",
            district: "Đống Đa",
            createdAt: "2026-07-29T10:20:00"
        },
        {
            id: 4,
            title: "Ngắm hoàng hôn ở rooftop",
            description: "Đến sớm để chọn chỗ ngồi và đánh giá khung cảnh vào lúc hoàng hôn.",
            deadline: "2026-08-18",
            priority: "High",
            status: "Pending",
            category: "Cafe",
            district: "Thanh Xuân",
            createdAt: "2026-07-29T10:30:00"
        },
        {
            id: 5,
            title: "Khám phá tiệm bánh mới",
            description: "Thử hai loại bánh bán chạy và ghi chú về không gian của tiệm.",
            deadline: "2026-08-20",
            priority: "Medium",
            status: "Done",
            category: "Food",
            district: "Cầu Giấy",
            createdAt: "2026-07-29T10:40:00"
        }
    ];
}

function seedInitialData() {
    if (localStorage.getItem(STORAGE_KEYS.USERS) === null) {
        saveData(STORAGE_KEYS.USERS, getInitialUsers());
    }

    if (localStorage.getItem(STORAGE_KEYS.POSTS) === null) {
        saveData(STORAGE_KEYS.POSTS, getInitialPosts());
    }

    if (localStorage.getItem(STORAGE_KEYS.TASKS) === null) {
        saveData(STORAGE_KEYS.TASKS, getInitialTasks());
    }

    if (localStorage.getItem(STORAGE_KEYS.COMMENTS) === null) {
        saveData(STORAGE_KEYS.COMMENTS, []);
    }

    if (localStorage.getItem(STORAGE_KEYS.SAVED_POSTS) === null) {
        saveData(STORAGE_KEYS.SAVED_POSTS, [3, 6]);
    }

    const users = getData(STORAGE_KEYS.USERS, []);
    let usersChanged = false;
    users.forEach(function (user) {
        if (!user.joinedAt) {
            user.joinedAt = "2026-07-29T10:00:00";
            usersChanged = true;
        }
    });
    if (usersChanged) {
        saveData(STORAGE_KEYS.USERS, users);
    }

    const seededPostImages = [
        "assets/images/posts/cafe-study.jpg",
        "assets/images/posts/bun-cha.jpg",
        "assets/images/posts/chao-suon.jpg",
        "assets/images/posts/rooftop-cafe.jpg",
        "assets/images/posts/pho-cuon.jpg",
        "assets/images/posts/pastry-cafe.jpg"
    ];
    const posts = getData(STORAGE_KEYS.POSTS, []);
    let postsChanged = false;
    posts.forEach(function (post) {
        const seededImage = seededPostImages[Number(post.id) - 1];
        if (seededImage && post.image === "assets/images/posts/post-placeholder.svg") {
            post.image = seededImage;
            postsChanged = true;
        }
    });
    if (postsChanged) {
        saveData(STORAGE_KEYS.POSTS, posts);
    }

    // Phiên đăng nhập chỉ giữ thông tin công khai, tuyệt đối không sao chép password.
    const currentUser = getData(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser && Object.prototype.hasOwnProperty.call(currentUser, "password")) {
        const { password, ...safeCurrentUser } = currentUser;
        saveData(STORAGE_KEYS.CURRENT_USER, safeCurrentUser);
    }

    if (localStorage.getItem(STORAGE_KEYS.THEME) === null) {
        saveData(STORAGE_KEYS.THEME, "light");
    }
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    if (Number.isNaN(date.getTime())) {
        return "Không rõ thời gian";
    }

    const differenceInSeconds = Math.max(0, Math.floor((now - date) / 1000));
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInSeconds < 60) {
        return "Vừa xong";
    }

    if (differenceInMinutes < 60) {
        return differenceInMinutes + " phút trước";
    }

    if (differenceInHours < 24) {
        return differenceInHours + " giờ trước";
    }

    if (differenceInDays < 7) {
        return differenceInDays + " ngày trước";
    }

    return date.toLocaleDateString("vi-VN");
}

function escapeHTML(value) {
    // Chuyển dữ liệu người dùng thành text để không thể chèn thẻ HTML nguy hiểm.
    const unsafeText = String(value ?? "");
    const specialCharacters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return unsafeText.replace(/[&<>"']/g, function (character) {
        return specialCharacters[character];
    });
}
