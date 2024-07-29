let userString = localStorage.getItem('userInfo');
const userInfo = JSON.parse(userString);
document.addEventListener('userDataReady', async function () {
    try {
        const coordinatesUserData = await fetchData('http://localhost:3000/api/coordinates/all-users');
        const coordinatesHubData = await fetchData('http://localhost:3000/api/coordinates/all-hubs');
        const usersData = await fetchData('http://localhost:3000/api/users/all-users');

        if (coordinatesUserData && coordinatesHubData && usersData) {
            loadAvatarData(coordinatesUserData, usersData);
            loadHubData(coordinatesHubData, usersData);
        }
    } catch (error) {
        handleError('Error during data processing:', error);
    }
});

function loadMessages(chatInputContainer, chatContainer) {
    fetch("http://localhost:3000/api/chats/all-chats")
        .then(response => response.json())
        .then(data => {
            chatInputContainer.innerHTML = '';
            data.forEach(message => {
                let newMessage = document.createElement("div");
                newMessage.classList.add("message");
                const color = getNameColor(userInfo.id);

                if (message.username === userInfo.username) {
                    newMessage.innerHTML = `<span style="color:${color}">${'Yo'}:</span> ${message.message}`;

                } else {
                    newMessage.innerHTML = `<span style="color:${color}">${username}:</span> ${message.message}`;

                }
                chatInputContainer.appendChild(newMessage);
            });
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(error => {
            console.error("Error fetching messages:", error);
        });
};
document.addEventListener("DOMContentLoaded", () => {
    const chatToggleButton = document.getElementById("chat-toggle-button");
    const chatContainer = document.getElementById("chat-box");
    const chatInputContainer = document.getElementById("message-section");
    const chatForm = document.getElementById("chat-send");
    const chatInput = document.getElementById("chat-input");


    loadMessages(chatInputContainer, chatContainer);

    chatToggleButton.addEventListener("click", () => {
        chatInputContainer.classList.toggle("expanded");
        chatContainer.classList.toggle("expanded");
        chatToggleButton.classList.toggle("rotated");
        chatToggleButton.classList.toggle("expanded");
        chatForm.classList.toggle("visible");
    });

    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();

        let messageText = chatInput.value.trim();


        if (messageText !== "") {
            fetch("http://localhost:3000/api/chats/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: messageText, username: userInfo.username })
            })
                .then(response => response.json())
                .then(data => {

                    let newMessage = document.createElement("div");
                    newMessage.classList.add("message");

                    const username = 'Yo';
                    const color = getNameColor(userInfo.id);

                    newMessage.innerHTML = `<span style="color:${color}">${username}:</span> ${messageText}`;
                    chatInputContainer.insertBefore(newMessage, chatInputContainer.firstChild);

                    chatInput.value = "";
                    chatContainer.scrollTop = 0;


                })
                .catch(error => {
                    console.error("Error sending message:", error);
                });
        }
    });
});

function loadAvatar(playerName, avatarName, nameColor, screenLeftPercent, screenTopPercent, playerId) {
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

        const link = document.createElement('a');
        link.href = `profile.html?id=${playerId}`;
        link.appendChild(container);
        map.appendChild(link);
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
            loadAvatar(currentUser.name, currentUser.avatar, color, userCords.latitude, userCords.longitude, currentUser.id);
            if (userData) {
                color = getNameColor(userData.id);
                loadAvatar(userData.name, userData.avatar, color, 50, 50, currentUser.id);
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

async function loadHubs(verified) {
    const coordinatesUserData = await fetchData('http://localhost:3000/api/coordinates/all-users');
    const coordinatesHubData = await fetchData('http://localhost:3000/api/coordinates/all-hubs');
    const usersData = await fetchData('http://localhost:3000/api/users/all-users');
    const map = document.querySelector(".bg-map");
    if (verified) {
        if (coordinatesUserData && coordinatesHubData && usersData) {
            clearMapElements(map)
            loadAvatarData(coordinatesUserData, usersData);
            loadHubData(coordinatesHubData, usersData);
        }
    }
    else {
        let niceStreetY = 60;
        let niceStreetX = 80;

        for (let hubIndex = 0; hubIndex < hubsData.length; hubIndex++) {
            const hub = coordinatesHubData.find(hub => hub.HubId === Number(hubsData[hubIndex].id));
            if (!hub) {
                loadHubAvatar(hubsData[hubIndex], hubsData[hubIndex].id, usersData, false, niceStreetY, niceStreetX, map);
                niceStreetY -= 10;
            }
        }

    }
}
function clearMapElements(map) {
    const elements = map.querySelectorAll(".hub-avatar-element");
    elements.forEach(element => element.remove());
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

            container.classList.add("hub-avatar-element");
            map.appendChild(clone);
        }

    } catch (error) {
        handleError('Error during hub-avatar loading:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const verifiedSwitch = document.getElementById("verified-switch");
    const modalElement = document.getElementById('confirmation-modal');
    const confirmButton = document.getElementById("confirm-button");
    const cancelButton = document.getElementById("cancel-button");
    let isConfirmed = false;

    verifiedSwitch.addEventListener("change", () => {
        if (isConfirmed) {
            loadHubs(isConfirmed);
            isConfirmed = false;
            return;
        }

        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        confirmButton.onclick = () => {
            modal.hide();
            isConfirmed = true;
            loadHubs(verifiedSwitch.checked);
        };

        cancelButton.onclick = () => {
            modal.hide();
            verifiedSwitch.checked = true;
        };
    });
});
