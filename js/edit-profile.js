document.addEventListener("DOMContentLoaded", () => {
    setElementImage('profile-avatar-bg', `images/avatar_bgs/${userData.avatarBg}.png`, userData.avatarBg);
    setElementImage('profile-avatar-img', `images/avatars/${userData.avatar}.png`, userData.avatar);
    document.querySelectorAll('.edit-avatar').forEach(avatar => {
        avatar.addEventListener('click', function () {
            const selectedAvatar = this.getAttribute('data-avatar');
            setElementImage('profile-avatar-img', `images/avatars/${selectedAvatar}.png`, selectedAvatar);
            updateUserAvatar(selectedAvatar);
        });
    });
    document.querySelectorAll('.edit-avatarBg').forEach(avatar => {
        avatar.addEventListener('click', function () {
            const selectedAvatar = this.getAttribute('data-avatarBg');
            setElementImage('profile-avatar-bg', `images/avatar_bgs/${selectedAvatar}.png`, selectedAvatar);
            updateUserAvatarBg(selectedAvatar);
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('.edit-profile-tab');

    tabLinks.forEach(tab => {
        tab.addEventListener('click', function (event) {
            const tabName = this.getAttribute('data-tab');
            openTab(event, tabName);
        });
    });

    const defaultTab = document.querySelector('.edit-profile-tab.active');
    if (defaultTab) {
        openTab(null, defaultTab.getAttribute('data-tab'));
    }
});

function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName("edit-profile-tab-content");
    const tabLinks = document.getElementsByClassName("edit-profile-tab");

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

async function updateUserAvatar(avatar) {
    userData.avatar = avatar
    const response = await fetch(`http://localhost:3000/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        alert(response.error);
    }
    else {
        localStorage.setItem('userInfo', JSON.stringify(userData));
    }
}
async function updateUserAvatarBg(avatarBg) {
    userData.avatarBg = avatarBg
    const response = await fetch(`http://localhost:3000/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        alert(data.error);
    }
    else {
        localStorage.setItem('userInfo', JSON.stringify(userData));
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const backLink = document.getElementById("back-link");
    backLink.href = `profile.html?id=${userData.id}`;
});

