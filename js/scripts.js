window.onload = () => {
    fetch('data/user.json')
        .then(response => response.json())
        .then(data => {
            const avatarBgImg = document.getElementById('avatar-bg');
            avatarBgImg.src = `images/avatar_bgs/${data.avatarBg}.png`;
            avatarBgImg.alt = data.avatarBg;

            const avatarImg = document.getElementById('avatar-img');
            avatarImg.src = `images/avatars/${data.avatar}.png`;
            avatarImg.alt = data.avatar;

            const avatarName = document.getElementById('avatar-name');
            let nameP = document.createElement("p");
            nameP.innerText = data.name;
            avatarName.appendChild(nameP);

            const avatarLvl = document.getElementById('avatar-lvl');
            nameP = document.createElement("p");
            nameP.innerText = data.lvl;
            avatarLvl.appendChild(nameP);
        })
        .catch(error => console.error('Error fetching the JSON data:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    var dropdownButton = document.getElementById('sort-select');
    var dropdownMenu = dropdownButton.nextElementSibling;

    var dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var selectedText = item.textContent.trim();
            var selectedValue = item.getAttribute('data-value');

            dropdownButton.querySelector("p").textContent = selectedText;

            dropdownItems.forEach(function(item) {
                item.classList.remove('active');
            });

            item.classList.add('active');
        });
    });
});