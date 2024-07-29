document.addEventListener("DOMContentLoaded", () => {
    setElementImage('profile-avatar-bg', `images/avatar_bgs/${userData.avatarBg}.png`, userData.avatarBg);
    setElementImage('profile-avatar-img', `images/avatars/${userData.avatar}.png`, userData.avatar);
    const aboutMe = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis venenatis turpis. Curabitur vel massa ...";

    document.getElementById('username').textContent = userData.username;
    document.getElementById('level-number').textContent = userData.lvl;
    document.getElementById('about-me-text').textContent = aboutMe;

});
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
        tabContent[i].style.display = "none";
    }

    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    if (evt) {
        evt.currentTarget.classList.add("active");
    }
}