document.addEventListener('userDataReady', async function () {
    try {
        const coordinatesUserData = await fetchData('http://localhost:3000/api/coordinates/all-users');
        const coordinatesHubData = await fetchData('http://localhost:3000/api/coordinates/all-hubs');
        const usersData = await fetchData('http://localhost:3000/api/users/all-users');
        console.log("GET /users");
        console.log("GET /coordinates");
        if (coordinatesUserData && coordinatesHubData && usersData) {
            loadAvatarData(coordinatesUserData, usersData);
            loadHubData(coordinatesHubData, usersData);
        }
    } catch (error) {
        handleError('Error during data processing:', error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("chat-toggle-button").addEventListener("click", () => {
        const chatContainer = document.getElementById("chat-box");
        const toggleButton = document.getElementById("chat-toggle-button");
        const chatInputContainer = document.getElementById("message-section");
        const chatForm = document.getElementById("chat-send");
        const chatInput = document.getElementById("chat-input");

        chatInputContainer.classList.toggle("expanded");
        chatContainer.classList.toggle("expanded");
        toggleButton.classList.toggle("rotated");
        toggleButton.classList.toggle("expanded");
        chatForm.classList.toggle("visible");

        chatForm.addEventListener("submit", (event) => {
            event.preventDefault();

            let messageText = chatInput.value.trim();

            if (messageText !== "") {
                let newMessage = document.createElement("div");
                newMessage.classList.add("message");
                newMessage.textContent = messageText;

                chatInputContainer.insertBefore(newMessage, chatInputContainer.firstChild);

                chatInput.value = "";
                chatContainer.scrollTop = 0;
            }
        });
    });
});

function loadAvatar(playerName, avatarName, nameColor, screenLeftPercent, screenTopPercent) {
    try {
        const template = document.querySelector("#avatar-template");

        const map = document.querySelector(".bg-map");
        const clone = template.content.cloneNode(true);
        const container = clone.querySelector(".avatar-container");
        container.style.top = `${screenTopPercent}%`;
        container.style.left = `${screenLeftPercent}%`;

        let avatarImg = clone.querySelector("img");
        avatarImg.src = `images/avatars/${avatarName}.png`;
        avatarImg.alt = `${avatarName} avatar`;

        const txt = clone.querySelector("p");
        txt.textContent = playerName;
        txt.style.color = nameColor;
        txt.style.fontWeight = 600;

        map.appendChild(clone);
    } catch (error) {
        handleError('Error during avatar loading:', error);
    }

}

async function loadAvatarData(usersCoordinates, usersData) {
    if (usersData) {
        for (let userCordsIndex = 0; userCordsIndex < usersCoordinates.length; userCordsIndex++) {
            var userCords = usersCoordinates[userCordsIndex];
            const currentUser = usersData.find(user => user.id === userCords.UserId);
            let color = getNameColor(userCords.UserId);
            loadAvatar(currentUser.name, currentUser.avatar, color, userCords.latitude, userCords.longitude);
            if (userData) {
                color = getNameColor(userData.id);
                loadAvatar(userData.name, userData.avatar, color, 50, 50);
            }
        }
    }
}

function getNameColor(id) {
    if (!userData) {
        return;
    }
    const red = "#FF0000"
    const green = "#2BFF00"
    const black = "#000000"

    if (userData.id == id) {
        return red;
    }
    else if (userData.friends.includes(Number(id))) {
        return green;
    }
    else {
        return black;
    }
}

function loadHubData(hubsCoordinates, usersData) {
    if (!hubsData) {
        return;
    }
    const map = document.querySelector(".bg-map");
    for (let hubIndex = 0; hubIndex < hubsCoordinates.length; hubIndex++) {
        const hub = hubsData.find(hub => hub.id === Number(hubsCoordinates[hubIndex].HubId));
        loadHubAvatar(hub, hub.id, usersData, false, hubsCoordinates[hubIndex].latitude, hubsCoordinates[hubIndex].longitude, map);

    }

}

function loadHubAvatar(hub, hubId, usersData, isBadgeCollected, screenLeftPercent, screenTopPercent, map) {
    try {
        const template = document.querySelector("#hub-avatar-template");

        const clone = template.content.cloneNode(true);
        const container = clone.querySelector(".avatar-container");

        container.style.top = `${screenTopPercent}%`;
        container.style.left = `${screenLeftPercent}%`;

        const attendeesSection = clone.querySelector("#attendee-section");
        if (hub.attendees) {
            hub.attendees.slice(0, 3).forEach(attendee => {
                let attendeeIcon = document.createElement("div");
                attendeeIcon.classList.add("avatar-icon");
                attendeeIcon.style.backgroundImage = `url("images/avatars/${usersData[attendee.id].avatar}_zoom.png")`;
                if (userData && userData.friends.includes(attendee.id)) {
                    attendeeIcon.classList.add("friend");
                }
                attendeesSection.appendChild(attendeeIcon);
            });
            let extra = hub.attendees.length - 3;
            if (extra > 0) {
                let extraAttendeeText = document.createElement("h2");
                extraAttendeeText.textContent = `+${extra}`;
                extraAttendeeText.style.fontWeight = 600;
                attendeesSection.appendChild(extraAttendeeText);
            }

            const avatarImg = clone.querySelector("img");
            avatarImg.src = `images/hub_avatars/${hub.avatar}.png`;
            avatarImg.alt = `${hub.avatar} hub avatar`;

            const txt = clone.querySelector("p");
            txt.textContent = hub.name;
            txt.style.fontWeight = 600;

            const badgeImg = clone.querySelector("#hub-badge");
            badgeImg.src = `images/badges/${hub.badge}.png`;
            badgeImg.alt = `${hub.badge} badge`;

            const link = clone.querySelector("a");
            link.href = `hub-page.html?id=${hubId}`

            map.appendChild(clone);
        }

    } catch (error) {
        handleError('Error during hub-avatar loading:', error);
    }
}