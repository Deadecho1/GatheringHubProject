async function handleDelete(event) {
    const listItem = event.target.closest('.list-item');
    if (listItem) {
        lstParse = listItem.id.split("-");
        itemId = lstParse[lstParse.length - 1];
        delete hubsData[itemId];

        const response = await fetch('https://gathering-hub-project-backend.onrender.com/api/hubs/${itemId}', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            listItem.remove();

        }
        else {
            alert(response.error)
        }
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

function showPosition(position, hubs) {
    const { latitude, longitude } = position.coords;
    setHubsDistance(latitude, longitude, hubs);
}

function setHubsDistance(lat, long, hubs) {
    if (!document.getElementById("hub-list")) {
        return;
    }
    for (let hubIndex = 0; hubIndex < hubs.length; hubIndex++) {
        hub = hubs[hubIndex];
        const mapCoordinates = JSON.parse(hub.mapCoordinates)
        const hubLat = parseFloat(mapCoordinates[0])
        const hubLong = parseFloat(mapCoordinates[1]);
        const distance = distanceInKmBetweenEarthCoordinates(lat, long, hubLat, hubLong);
        const hubSection = document.getElementById(`item-${hub.id}`);
        hubSection.querySelector("#location h2").innerText = `${distance} Km Away`;
    }
}