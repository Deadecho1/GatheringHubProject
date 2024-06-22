document.addEventListener('userDataReady', async function () {
    try {
        const coordinatesData = await fetchData("data/coordinates.json");
        if (coordinatesData) {
            loadAvatarData(coordinatesData.users);
            loadHubData(coordinatesData.hubs);
        }
    } catch (error) {
        handleError('Error during data processing:', error);
    }
});

function loadAvatar(playerName, avatarName, nameColor, screenLeftPercent, screenTopPercent){
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

async function loadAvatarData(usersCoordinates){
    let usersData = await fetchData('data/users.json');

    if(usersData){
        for (const userid in usersCoordinates) {
            let currentUser = usersData[userid];
            let color = getNameColor(userid);
            loadAvatar(currentUser.name, currentUser.avatar, color, usersCoordinates[userid].latitude, usersCoordinates[userid].longitude);
        }
        if(userData){
            color = getNameColor(userData.id);
            loadAvatar(userData.name, userData.avatar, color, 50, 50);
        }
        else{
            console.log("initialization.js missing");
        }
        
    }
}

function getNameColor(id){
    if(!userData){
        return;
    }
    const red = "#FF0000"
    const green = "#2BFF00"
    const black = "#000000"

    if(userData.id == id){
        return red;
    }
    else if(userData.friends.includes(Number(id))){
        return green;
    }
    else{
        return black;
    }
}

function loadHubData(hubsCoordinates){
    if(!hubsData){
        console.log("initialization.js missing in loadHubData");
        return;
    }
    const map = document.querySelector(".bg-map");
    for (const hubId in hubsCoordinates) {
        const hub = hubsData[hubId];
        loadHubAvatar(hub, hubId, false, hubsCoordinates[hubId].latitude, hubsCoordinates[hubId]. longitude, map);
    }
}

function loadHubAvatar(hub, hubId, isBadgeCollected, screenLeftPercent, screenTopPercent, map){
    try {
        const template = document.querySelector("#hub-avatar-template");

        const clone = template.content.cloneNode(true);
        const container = clone.querySelector(".avatar-container");

        container.style.top = `${screenTopPercent}%`;
        container.style.left = `${screenLeftPercent}%`;

        const attendeesSection = clone.querySelector("#attendee-section");
        hub.attendees.slice(0, 3).forEach(attendee => {
            let attendeeIcon = document.createElement("div");
            attendeeIcon.classList.add("avatar-icon");
            attendeeIcon.style.backgroundImage = `url("images/avatars/${attendee.avatar}_zoom.png")`;
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

        map.appendChild(clone);
    } catch (error) {
        handleError('Error during hub-avatar loading:', error);
    }
}