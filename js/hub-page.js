
document.addEventListener('userDataReady', () => {
    try {
        console.log(hubsData);
        const queryString = window.location.search;
        const hubId = new URLSearchParams(queryString)?.get('id');
        const hub = hubsData?.[hubId];

        if (!hubId || !hub) {
            throw "No hub id";
        }

        SetUpPage(hubId, hub);
    } catch (error) {
        handleError(error, "Failed to initialize list");
    }
});

async function SetUpPage(hubId, hub) {
    document.querySelector('h1').textContent = hub.name;
    document.querySelector('h2#address').textContent = hub.location;
    document.querySelector('h2#phone-number').textContent = hub.phone;
    setupLocationButton(hubId);
    setupHubStatus(hub);
    setupHubWorkingHours(hub);
    setupDescription(hub);
    setupStations(hub);
    setupMoreButton();
    updateLogo(`images/hubs/${hubId}/logo.png`);
    updateBadge(hub.badge);
    let imagesPaths = await getImagePaths(hubId);
    updateCarousel(imagesPaths);
}

async function getImagePaths(hubId) {
    let paths = [];
    let i = 1;
    let stop = false;
    
    while (!stop) {
        try {
            const response = await fetch(`images/hubs/${hubId}/image_${i}.jpg`);
            if (response.ok) {
                paths.push(`images/hubs/${hubId}/image_${i}.jpg`);
            } else {
                stop = true;
            }
        } catch (error) {
            stop = true;
        }
        i += 1;
    }
    return paths;
}

function setupHubStatus(hub) {
    let statusH2 = document.getElementById('text-open-close');
    let isOpen = checkOpenStatus(hub.openingHour, hub.closingHour);
    statusH2.textContent = isOpen ? "Open" : "Closed";
    statusH2.classList.add(isOpen ? "text-open" : "text-close");
}

function setupHubWorkingHours(hub){
    let dropdownList = document.querySelector(".info-line > .dropdown > ul");
    let items = dropdownList.getElementsByTagName("li");
    items[0].textContent = "SUN: " + hub.openingHour + "-" + hub.closingHour;
    items[1].textContent = "MON: " + hub.openingHour + "-" + hub.closingHour;
    items[2].textContent = "TUE: " + hub.openingHour + "-" + hub.closingHour;
    items[3].textContent = "WED: " + hub.openingHour + "-" + hub.closingHour;
    items[4].textContent = "THU: " + hub.openingHour + "-" + hub.closingHour;
    items[5].textContent = "FRI: " + hub.openingHour + "-" + hub.closingHour;
    items[6].textContent = "SAT: " + hub.openingHour + "-" + hub.closingHour;
}

function setupDescription(hub){
    let description = document.querySelector("#content");
    description.textContent = hub.about;
    description.dataset.fullText = hub.about;
}

async function setupStations(hub){
    const list = document.querySelector(".stations-list");
    const card = document.querySelector("#station-card-template");
    const response = await fetch("data/users.json");
    const usersData = await response.json();
    if (!card) return;

    hub.stations.forEach(station => {
        let cardClone = card.content.cloneNode(true);
        let stationName = cardClone.querySelector("#station-name");
        stationName.textContent = station.stationID;
        let stationCapacity = cardClone.querySelector(".player-number");
        stationCapacity.textContent = station.currPlayers + "/" + station.maxPlayers + " players";
        let gameImage = cardClone.querySelector(".station > img");

        if(station.game != ""){
            gameImage.src = `images/games/game_logos/${station.game}.jpg`;
            gameImage.alt = `${station.game} game logo`;
        }

        let platform = cardClone.querySelector(".company-logo > img");
        platform.src = `images/games/platforms/${station.platform}.png`;
        platform.alt = `${station.platform} logo`;

        let attendeeSection = cardClone.querySelector(".avatar-present");
        station.players.forEach(player => {
            let attendeeIcon = document.createElement("div");
            attendeeIcon.classList.add("avatar-icon");
            attendeeIcon.style.backgroundImage = `url("images/avatars/${usersData[player].avatar}_zoom.png")`;
            if (userData && userData.friends.includes(player)) {
                attendeeIcon.classList.add("friend");
            }
            attendeeSection.appendChild(attendeeIcon);
        });
        
        list.appendChild(cardClone);
    });

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


document.addEventListener('DOMContentLoaded', () => {
     const backButton = document.getElementById('x-icon');

     backButton.addEventListener('click', () => {
         history.back();
     });
});

function setupLocationButton(hubId){
    const button = document.querySelector(".location-icon");
    button.addEventListener('click', () => {
        const latitude = hubsData[hubId].mapCoordinates[0];
        const longitude = hubsData[hubId].mapCoordinates[1]; 
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(url, '_blank');
    });
}

function updateLogo(logoPath) {
    const logoElement = document.querySelector('.hub-page-logo');
    if (logoElement) {
        logoElement.src = logoPath;
    }
}

 function updateBadge(badge) {
     const badgeElement = document.querySelector('.badge-image');
     if (badgeElement) {
        badgeElement.src = `images/badges/${badge}.png`;
        if (userData && !userData.badges.includes(badge)) {
            badgeElement.classList.add("not-collected");
        }
    }
}


function updateCarousel(imagePaths) {
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = ''; 
    imagePaths.forEach((path, index) => {
        const activeClass = index === 0 ? 'active' : '';
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${activeClass}`;
        const img = document.createElement('img');
        console.log(path);
        img.src = path;
        img.className = 'd-block w-100';
        img.style.objectFit = "contain";
        img.style.borderRadius = "15px";
        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
    });
}

function setupMoreButton()
{
    const moreButton = document.getElementById('more-link');
    const content = document.getElementById('content');
    const maxLength = 100;

    if (content.textContent.length > maxLength) {
        moreButton.style.display = 'block';
        content.textContent = content.textContent.slice(0, maxLength) + '...';
    } else {
        moreButton.style.display = 'none';
    }

    moreButton.addEventListener('click', () => {
        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            content.classList.add('expanded');
            content.textContent = content.dataset.fullText; 
            moreButton.textContent = "Less";
        } else {
            content.classList.remove('expanded');
            content.classList.add('collapsed');
            content.textContent = content.dataset.fullText.slice(0, maxLength) + '...';
            moreButton.textContent = 'More';
        }
    });
}
