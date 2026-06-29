// Show server error from URL (?error=)
const params = new URLSearchParams(window.location.search);
const serverError = params.get("error");
const errorBox = document.getElementById("error-msg");

if (serverError && errorBox) {
    errorBox.textContent = serverError;
}

// LOGIN VALIDATION
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            e.preventDefault();
            if (errorBox) errorBox.textContent = "Please fill in all fields.";
        }
    });
}

// SIGNUP VALIDATION
const signupForm = document.getElementById("signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            e.preventDefault();
            if (errorBox) errorBox.textContent = "Please fill in all fields.";
        }
    });
}

// LIKE POST
function likePost(postId) {
    fetch("/post/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const btn = document.querySelector(`[data-post-id="${postId}"]`);
            if (btn) btn.textContent = `Like (${data.likes})`;
        } else {
            alert(data.error || "Could not like post.");
        }
    })
    .catch(() => alert("Something went wrong."));
}

// FOLLOW USER
function followUser(userId) {
    fetch("/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const btn = document.querySelector(`[data-user-id="${userId}"]`);
            if (btn) {
                btn.textContent = "Unfollow";
                btn.setAttribute("onclick", `unfollowUser('${userId}')`);
            }
        } else {
            alert(data.error || "Could not follow.");
        }
    })
    .catch(() => alert("Something went wrong."));
}

function unfollowUser(userId) {
    fetch("/user/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const btn = document.querySelector(`[data-user-id="${userId}"]`);
            if (btn) {
                btn.textContent = "Follow";
                btn.setAttribute("onclick", `followUser('${userId}')`);
            }
        } else {
            alert(data.error || "Could not unfollow.");
        }
    })
    .catch(() => alert("Something went wrong."));
}

// CREATE POST
const createPostForm = document.getElementById("create-post-form");
if (createPostForm) {
    createPostForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const content = document.getElementById("post-content").value.trim();
        const image_url = document.getElementById("post-image").value.trim();

        if (!content) return alert("Post can't be empty.");

        fetch("/post/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, image_url })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) location.reload();
            else alert("Failed to create post.");
        })
        .catch(() => alert("Something went wrong."));
    });
}

// COMMENT POST
function commentPost(e, postId) {
    e.preventDefault();
    const input = e.target.querySelector(".comment-input");
    const content = input.value.trim();

    if (!content) return;

    fetch("/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid: postId, content })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) location.reload();
        else alert("Failed to post comment.");
    })
    .catch(() => alert("Something went wrong."));
}