document.addEventListener('userDataReady', async function () {
    try {
        const coordinatesData = await fetchData("data/coordinates.json");
        if (coordinatesData) {
            loadAvatarData(coordinatesData.users);
            loadHubData(coordinatesData.hubs);
        }
    } catch (error) {
        console.error('Error during data processing:', error);
    }
});

function loadAvatar(avatarName, playerName, nameColor, screenLeftPercent, screenTopPercent){
    const template = document.querySelector("#avatar-template");
    if (!template) return;

    const map = document.querySelector(".bg-map");
    const clone = template.content.cloneNode(true);
    const container = clone.querySelector(".avatar-container");
    container.style.top = `${screenTopPercent}%`;
    container.style.left = `${screenLeftPercent}%`;

    avatarImg = clone.querySelector("img");
    avatarImg.src = `images/avatars/${avatarName}.png`;
    avatarImg.alt = `${avatarName}`;

    const txt = clone.querySelector("p");
    txt.textContent = playerName;
    txt.style.color = nameColor;
    txt.style.fontWeight = 600;
        
    map.appendChild(clone);
}

async function loadAvatarData(usersCoordinates){
    let usersData = await fetchData('data/users.json');

    if(usersData){
        for (const userid in usersCoordinates) {
            let currentUser = usersData[userid];
            let color = getNameColor(userid);
            loadAvatar(currentUser.avatar, currentUser.name, color, usersCoordinates[userid].latitude, usersCoordinates[userid].longitude);
        }
        color = getNameColor(userData.id);
        loadAvatar(userData.avatar, userData.name, color, 50, 50);
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

function loadHubData(hubs){

}