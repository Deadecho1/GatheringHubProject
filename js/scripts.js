let userData;
let hubsData;
let abortController;
let currentLocation = localStorage.getItem('coords');
const defaultLocation = [32.0681777049327, 34.803421411031955];

const userDataReadyEvent = new Event('userDataReady');

document.addEventListener('DOMContentLoaded', async function () {
    try {
        abortController = new AbortController();
        await initUser();
        await initList();
        setupDropdown();

        document.dispatchEvent(userDataReadyEvent);
    } catch (error) {
        handleError(error, 'Initialization error:');
    }
});

window.addEventListener('beforeunload', () => {
    if (abortController) {
        abortController.abort();
    }
});

async function fetchData(url) {
    try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
            throw new Error('Network response error');
        }
        return response.json();
    } catch (error) {
        handleError(error, `Error fetching data from ${url}:`);
    }
}

async function initUser() {
    userData = await fetchData('data/user.json');
    if (userData) {
        setAvatarData(userData);
    }
}


async function initList() {
    hubsData = await fetchData('data/hubs.json');
    if (hubsData) {
        populateHubList(hubsData.hubs);
        if (currentLocation) {
            showPosition();
        }
        getLocation();
    }
}

function setAvatarData(data) {
    try {
        setElementSrc('avatar-bg', `images/avatar_bgs/${data.avatarBg}.png`, data.avatarBg);
        setElementSrc('avatar-img', `images/avatars/${data.avatar}.png`, data.avatar);
        setElementText('avatar-name', data.name);
        setElementText('avatar-lvl', data.lvl);
    } catch (error) {
        console.error('Error setting avatar data:', error);
    }
}

function setupDropdown() {
    let dropdownButton = document.getElementById('sort-select');
    if (!dropdownButton) return;
    
    let dropdownMenu = dropdownButton.nextElementSibling;
    let dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            updateDropdown(dropdownButton, dropdownItems, item);
        });
    });
}

function populateHubList(hubs) {
    const hubList = document.querySelector("#hub-list");
    const template = document.querySelector("#list-item-template");
    if (!template) return;

    let colorFlag = false;
    hubs.forEach(hub => {
        let clone = template.content.cloneNode(true);
        setupHubItem(clone, hub, colorFlag);
        hubList.appendChild(clone);
        colorFlag = !colorFlag;
    });
}

function setupHubItem(clone, hub, colorFlag) {
    clone.firstElementChild.setAttribute("id", `item-${hub.id}`);
    if (colorFlag) {
        clone.querySelector(".list-item").classList.add("list-item-alternate");
    }
    clone.querySelector("h1").textContent = hub.name;
    setupHubStatus(clone.querySelector("#hub-status"), hub);
    setupHubLocation(clone.querySelector("#location"), hub);
    setupHubBadge(clone.querySelector(".badge-image"), hub);
    clone.querySelector(".hub-logo").style.backgroundImage = `url("images/hubs/${hub.id}/logo.png")`;
}

function setupHubStatus(hubStatus, hub) {
    let statusH2 = hubStatus.querySelector("h2");
    let isOpen = checkOpenStatus(hub.openingHour, hub.closingHour);
    statusH2.textContent = isOpen ? "Open" : "Closed";
    statusH2.classList.add(isOpen ? "text-open" : "text-close");

    hub.attendees.slice(0, 3).forEach(attendee => {
        let attendeeIcon = document.createElement("div");
        attendeeIcon.classList.add("avatar-icon");
        attendeeIcon.style.backgroundImage = `url("images/avatars/${attendee.avatar}_zoom.png")`;
        if (userData && userData.friends.includes(attendee.id)) {
            attendeeIcon.classList.add("friend");
        }
        hubStatus.appendChild(attendeeIcon);
    });

    let extra = hub.attendees.length - 3;
    if (extra > 0) {
        let extraAttendeeText = document.createElement("h2");
        extraAttendeeText.textContent = `+${extra}`;
        extraAttendeeText.style.fontWeight = 600;
        hubStatus.appendChild(extraAttendeeText);
    }
}

function setupHubLocation(locationSection, hub) {
    let locationText = locationSection.querySelectorAll("h2");
    locationText[1].textContent = hub.location;
    locationSection.querySelector("button").onclick = () => openNavigationApp(hub.mapCoordinates[0], hub.mapCoordinates[1]);
}

function setupHubBadge(badge, hub) {
    badge.src = `images/badges/${hub.badge}.png`;
    badge.alt = `${hub.badge} badge`;
    if (userData && !userData.badges.includes(hub.badge)) {
        badge.classList.add("not-collected");
    }
}

function setElementSrc(id, src, alt) {
    const element = document.getElementById(id);
    if (element) {
        element.src = src;
        element.alt = alt;
    }
}

function setElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function updateDropdown(button, items, selectedItem) {
    button.innerHTML = `<i class="menu-burger-icon"></i>${selectedItem.textContent.trim()}<i class="down-arrow-icon"></i>`;
    items.forEach(item => item.classList.remove('active'));
    selectedItem.classList.add('active');
}

function handleError(error, message) {
    if (error.name !== 'AbortError') {
        console.error(message, error);
    }
}

function checkOpenStatus(openingHour, closingHour) {
    const now = new Date();
    const currentTime = addLeadingZero(now.getHours()) + addLeadingZero(now.getMinutes());

    if (closingHour < openingHour) {
        closingHour = String(Number(closingHour) + 2400);
    }

    return currentTime < closingHour && currentTime > openingHour;
}

function addLeadingZero(num) {
    return num < 10 ? `0${num}` : String(num);
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (Math.round(earthRadiusKm * c * 100) / 100).toFixed(1);
}

function openNavigationApp(latitude, longitude) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
}

function getLocation() {
    if (navigator.geolocation) {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const { latitude, longitude } = position.coords;
    setHubsDistance(latitude, longitude);
}

function showError(error) {
    const errorMessages = {
        1: "User denied the request for Geolocation.",
        2: "Location information is unavailable.",
        3: "The request to get user location timed out.",
        0: "An unknown error occurred."
    };
    console.log(errorMessages[error.code] || errorMessages[0]);
    setHubsDistance(defaultLocation[0], defaultLocation[1]);
}

function setHubsDistance(lat, long) {
    if(!document.getElementById("hub-list")){
        return;
    }
    hubsData.hubs.forEach(hub => {
        const distance = distanceInKmBetweenEarthCoordinates(lat, long, hub.mapCoordinates[0], hub.mapCoordinates[1]);
        const hubSection = document.getElementById(`item-${hub.id}`);
        hubSection.querySelector("#location h2").innerText = `${distance} Km Away`;
    });
}