var temporaryQueryStringHub;
let userString = localStorage.getItem('userInfo');
const userInfo = JSON.parse(userString);
let defaultLocation = {
    "coords": {
        "latitude": 32.0681777049327,
        "longitude": 34.803421411031955
    }
};

document.addEventListener('userDataReady', () => {
    try {
        setupDropdown();
        if (window.location.search) {
            addHubFromQuery();
        }
        populateHubList(hubsData);
        showPosition(defaultLocation);
        //setLocation(); disabled until full release
    } catch (error) {
        handleError(error, "Failed to initialize list");
    }
});

function setupDropdown() {
    let dropdownButton = document.getElementById('sort-select');
    if (!dropdownButton) return;

    let dropdownMenu = dropdownButton.nextElementSibling;
    let dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            updateDropdown(dropdownButton, dropdownItems, item);
        });
    });
}

function updateDropdown(button, items, selectedItem) {
    button.innerHTML = `<i class="menu-burger-icon"></i>${selectedItem.textContent.trim()}<i class="down-arrow-icon"></i>`;
    items.forEach(item => item.classList.remove('active'));
    selectedItem.classList.add('active');
}

function populateHubList(hubs) {
    const hubList = document.querySelector("#hub-list");
    const template = document.querySelector("#list-item-template");
    if (!template) return;

    let colorFlag = false;
    for (let hubIndex = 0; hubIndex < hubs.length; hubIndex++) {
        let clone = template.content.cloneNode(true);
        setupHubItem(clone, hubs[hubIndex], hubs[hubIndex].id, colorFlag);

        if (userInfo.role === 'admin' || userInfo.id !== hubs[hubIndex].ownerId) {
            const trashButton = clone.querySelector('.trash-button');
            if (trashButton) {
                trashButton.style.display = 'none';
            }
        }

        hubList.appendChild(clone);
        colorFlag = !colorFlag;
    }

    const trashButtons = hubList.querySelectorAll('.trash-button');
    trashButtons.forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

function handleDelete(event) {
    const listItem = event.target.closest('.list-item');
    if (listItem) {
        lstParse = listItem.id.split("-");
        itemId = lstParse[lstParse.length - 1];
        delete hubsData[itemId];

        console.log(`DELETE /hubs/${itemId}`);

        listItem.remove();
    }
}

function setupHubItem(hubSection, hub, hubId, colorFlag) {
    hubSection.firstElementChild.setAttribute("id", `item-${hubId}`);
    if (colorFlag) {
        hubSection.querySelector(".list-item").classList.add("list-item-alternate");
    }
    const links = hubSection.firstElementChild.getElementsByTagName("a");
    for (const link of links) {
        link.href = `hub-page.html?id=${hubId}`;
    }
    hubSection.querySelector("h1").textContent = hub.name;
    setupHubStatus(hubSection.querySelector("#hub-status"), hub);
    setupHubLocation(hubSection.querySelector("#location"), hub);
    setupHubBadge(hubSection.querySelector(".badge-image"), hub);
    if (hubId < 6) {
        hubSection.querySelector(".hub-logo").style.backgroundImage = `url("images/hubs/${hubId}/logo.png")`;

    } else {
        hubSection.querySelector(".hub-logo").style.backgroundImage = `url("${hub.logo}")`;
    }
}

function setupHubStatus(hubStatus, hub) {
    let statusH2 = hubStatus.querySelector("h2");
    let isOpen = checkOpenStatus(hub.openingHour, hub.closingHour);
    statusH2.textContent = isOpen ? "Open" : "Closed";
    statusH2.classList.add(isOpen ? "text-open" : "text-close");

    setAttendees(hubStatus, hub);
}

async function setAttendees(hubStatus, hub) {
    const response = await fetch('http://localhost:3000/api/users/all-users');
    const usersData = await response.json();


    hub.attendees.slice(0, 3).forEach(attendee => {
        let attendeeIcon = document.createElement("div");
        attendeeIcon.classList.add("avatar-icon");
        attendeeIcon.style.backgroundImage = `url("images/avatars/${usersData[attendee.id].avatar}_zoom.png")`;
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

function checkOpenStatus(openingHour, closingHour) {
    const now = new Date();
    const currentTime = addLeadingZero(now.getHours()) + addLeadingZero(now.getMinutes());

    if (closingHour < openingHour) {
        closingHour = String(Number(closingHour) + 2400);
    }

    return currentTime < closingHour && currentTime > openingHour;
}


/* THIS SUCKS AND IS TEMPORARY BECAUSE NO DATABASE*/
function addHubFromQuery() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let hubParams = {
        name: "",
        address: "",
        openingHour: "",
        closingHour: "",
        phone: "",
        rating: "",
        logo: "",
        badge: ""
    };

    urlParams.forEach((value, key) => {
        hubParams[key] = value;
    });

    temporaryQueryStringHub = {
        "name": hubParams.name,
        "badge": hubParams.badge,
        "openingHour": hubParams.openingHour,
        "closingHour": hubParams.closingHour,
        "location": hubParams.address,
        "phone": hubParams.phone,
        "rating": hubParams.rating,
        "attendees": []
    }

    const hubList = document.querySelector("#hub-list");
    const template = document.querySelector("#list-item-template");
    if (!template) return;
    let clone = template.content.cloneNode(true);

    setupHubItem(clone, temporaryQueryStringHub, 0, true);
    clone.querySelector(".hub-logo").style.backgroundImage = `url("images/hubs/${hubParams.logo}/logo.png")`;
    hubList.appendChild(clone);
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

function showPosition(position) {
    const { latitude, longitude } = position.coords;
    setHubsDistance(latitude, longitude);
}

function setHubsDistance(lat, long) {
    if (!document.getElementById("hub-list")) {
        return;
    }
    for (let hubIndex = 0; hubIndex < hubsData.length; hubIndex++) {
        hub = hubsData[hubIndex];
        const distance = distanceInKmBetweenEarthCoordinates(lat, long, hub.mapCoordinates[0], hub.mapCoordinates[1]);
        const hubSection = document.getElementById(`item-${hub.id}`);
        hubSection.querySelector("#location h2").innerText = `${distance} Km Away`;
    }
}

// currently not working because of key issues, will work on full release 
/*
function setLocation() {
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
*/