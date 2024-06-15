let userData;
let abortController;

document.addEventListener('DOMContentLoaded', async function() {
    try {
        abortController = new AbortController();
        await initUser();
        await initList();
        setupDropdown();
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Initialization error:', error);
        }
    }
});

window.addEventListener('beforeunload', () => {
    if (abortController) {
        abortController.abort();
    }
});

async function initUser() {
    try {
        const response = await fetch('data/user.json', { signal: abortController.signal });
        if (!response.ok) {
            throw new Error('Network response error');
        }

        const data = await response.json();
        userData = data;

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
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching the JSON data in initUser:', error);
        }
    }
}

async function initList() {
    try {
        const response = await fetch('data/hubs.json', { signal: abortController.signal });
        if (!response.ok) {
            throw new Error('Network response error');
        }

        const data = await response.json();
        const hubList = document.querySelector("#hub-list");
        const template = document.querySelector("#list-item-template");

        let colorFlag = false;
        data.hubs.forEach(hub => {
            let clone = template.content.cloneNode(true);
            if (colorFlag) {
                clone.querySelector(".list-item").classList.add("list-item-alternate");
            }

            clone.querySelector("h1").textContent = hub.name;

            let hubStatus = clone.querySelector("#hub-status");
            let statusH2 = hubStatus.querySelector("h2");
            if (checkOpenStatus(hub.openingHour, hub.closingHour)) {
                statusH2.textContent = "Open";
                statusH2.classList.add("text-open");
            } else {
                statusH2.textContent = "Closed";
                statusH2.classList.add("text-close");
            }
            hub.attendees.forEach(attendee => {
                let attendeeIcon = document.createElement("div");
                attendeeIcon.classList.add("avatar-icon");
                attendeeIcon.style.backgroundImage = `url("../images/avatars/${attendee.avatar}_zoom.png")`;
                if (userData && userData.friends.includes(attendee.id)) {
                    attendeeIcon.classList.add("friend");
                }
                hubStatus.appendChild(attendeeIcon);
            });

            let locationSection = clone.querySelector("#location");
            let locationText = locationSection.querySelectorAll("h2");
            let distance = distanceInKmBetweenEarthCoordinates(hub.mapCoordinates[0], hub.mapCoordinates[1],
                 userData.mapCoordinates[0], userData.mapCoordinates[1]);
            locationText[0].textContent = `${distance} Km Away`;
            locationText[1].textContent = hub.location;
            locationSection.querySelector("button").onclick = () => openNavigationApp(hub.mapCoordinates[0], hub.mapCoordinates[1]);

            let badge = clone.querySelector(".badge-image");
            badge.src = `images/badges/${hub.badge}.png`;
            badge.alt = `${hub.badge} badge`;
            if (userData && !userData.badges.includes(hub.badge)) {
                badge.classList.add("not-collected");
            }

            let logo = clone.querySelector(".hub-logo");
            logo.style.backgroundImage = `url("images/hubs/${hub.id}/logo.png")`;

            hubList.appendChild(clone);
            colorFlag = !colorFlag;
        });
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching the JSON data in initList:', error);
        }
    }
}

function setupDropdown() {
    let dropdownButton = document.getElementById('sort-select');
    let dropdownMenu = dropdownButton.nextElementSibling;

    let dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function() {
            let selectedText = item.textContent.trim();
            let selectedValue = item.getAttribute('data-value');

            dropdownButton.querySelector("p").textContent = selectedText;

            dropdownItems.forEach(function(item) {
                item.classList.remove('active');
            });

            item.classList.add('active');
        });
    });
}

function checkOpenStatus(openingHour, closingHour){
    const now = new Date();

    const currentTime = addLeadingZero(now.getHours()) + addLeadingZero(now.getMinutes());

    if(closingHour < openingHour){
        let closingHourNum = Number(closingHour);
        closingHourNum += 2400; // adding 24 hours so it counts as next day
        closingHour = String(closingHourNum);
    }

    if(currentTime < closingHour && currentTime > openingHour){
        return true;
    }
    return false;
}

function addLeadingZero(num) {
    return num < 10 ? `0${num}` : String(num);
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2-lat1);
        var dLon = degreesToRadians(lon2-lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

        return (Math.round(earthRadiusKm * c * 100) / 100).toFixed(1);
}

function openNavigationApp(latitude, longitude) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
}