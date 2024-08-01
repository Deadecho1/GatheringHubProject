document.addEventListener("DOMContentLoaded", async () => {
    const userIdFromUrl = getUserIdFromUrl();
    const currentUserId = userData.id;

    if (Number(userIdFromUrl) === currentUserId) {
        setElementImage('profile-avatar-bg', `images/avatar_bgs/${userData.avatarBg}.png`, userData.avatarBg);
        setElementImage('profile-avatar-img', `images/avatars/${userData.avatar}.png`, userData.avatar);

        document.getElementById('username').textContent = userData.username;
        document.getElementById('level-number').textContent = userData.lvl;
        document.getElementById('about-me-text').textContent = userData.about;
    } else {
        const response = await fetch(`https://gathering-hub-project-backend.onrender.com/api/users/${userIdFromUrl}`);
        const user = await response.json();
        setElementImage('profile-avatar-bg', `images/avatar_bgs/${user.avatarBg}.png`, user.avatarBg);
        setElementImage('profile-avatar-img', `images/avatars/${user.avatar}.png`, user.avatar);

        document.getElementById('username').textContent = user.username;
        document.getElementById('level-number').textContent = user.lvl;
        document.getElementById('about-me-text').textContent = user.about;


        hideEditButtons();
    }


    const addFriendSection = document.getElementById("add-friend-section");
    const addFriendIcon = document.getElementById("add-friend-icon");
    if (Number(userIdFromUrl) !== currentUserId) {
        addFriendSection.style.visibility = "visible";
        addFriendSection.style.height = "50px";

        addFriendSection.addEventListener("click", () => {
            const addFriendText = document.getElementById("add-friend-text");
            addFriendText.innerText = "Friend request sent!";
            addFriendIcon.style.display = "none";
            addFriend(currentUserId, userIdFromUrl);
        });
    }
});

function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function hideEditButtons() {
    document.querySelectorAll('.edit-icon-container').forEach(element => {
        element.style.display = 'none';
    });
}

async function addFriend(userId, friendId) {
    const response = await fetch('https://gathering-hub-project-backend.onrender.com/api/users/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, friendId })
    });
    if (response.ok) {
        const response = await fetch(`https://gathering-hub-project-backend.onrender.com/api/users/${userData.id}`);
        const data = await response.json();
        localStorage.setItem('userInfo', JSON.stringify(data));

    }
}

document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('.tab');

    tabLinks.forEach(tab => {
        tab.addEventListener('click', function (event) {
            const tabName = this.getAttribute('data-tab');
            openTab(event, tabName);
        });
    });

    const defaultTab = document.querySelector('.tab.active');
    if (defaultTab) {
        openTab(null, defaultTab.getAttribute('data-tab'));
    }
});

function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName("tab-content");
    const tabLinks = document.getElementsByClassName("tab");

    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
    }

    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    if (evt) {
        evt.currentTarget.classList.add("active");
    } else {
        tabLinks[0].classList.add("active");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const editIcon = document.getElementById("edit-icon");
    const aboutMeText = document.getElementById("about-me-text");

    editIcon.addEventListener("click", async () => {
        if (!document.querySelector(".editable-textarea")) {
            const textArea = document.createElement("textarea");
            textArea.className = "editable-textarea";
            textArea.value = aboutMeText.innerText;

            aboutMeText.replaceWith(textArea);

            textArea.focus();
            textArea.setSelectionRange(textArea.value.length, textArea.value.length);

            editIcon.src = "images/Icons/white-save.svg";
        } else {
            const textArea = document.querySelector(".editable-textarea");
            const newText = textArea.value;
            await updateUserDescription(newText);
            const newP = document.createElement("p");
            newP.id = "about-me-text";
            newP.innerText = newText;

            textArea.replaceWith(newP);

            editIcon.src = "images/Icons/white-edit.svg";
        }
    });
});

async function updateUserDescription(about) {
    userData.about = about;
    const response = await fetch(`https://gathering-hub-project-backend.onrender.com/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        alert('Error updating description');
    } else {
        localStorage.setItem('userInfo', JSON.stringify(userData));
    }
}