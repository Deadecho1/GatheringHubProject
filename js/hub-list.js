var temporaryQueryStringHub;
let hubListTemplate;
let templateList;
let verifiedHubs = [];
let modalConfirmed = false;
let userString = localStorage.getItem('userInfo');
const userInfo = JSON.parse(userString);
let defaultLocation;
let selectedSortOption = 'Distance';
document.addEventListener('userDataReady', async () => {
    try {
        const coordinatesHubData = await fetchData('http://localhost:3000/api/coordinates/all-hubs');
        await loadUserPostition();
        for (let hubIndex = 0; hubIndex < coordinatesHubData.length; hubIndex++) {
            verifiedHubs.push(hubsData.find(hub => hub.id === Number(coordinatesHubData[hubIndex].id)));
        }
        setupDropdown();
        if (window.location.search) {
            addHubFromQuery();
        }
        populateHubList(verifiedHubs);
        showPosition(defaultLocation, verifiedHubs);
        const plusIconElement = document.querySelector('.add-hub-button');

        if (userData.role === 'admin') {
            plusIconElement.classList.add('d-none');
        }
    } catch (error) {
        handleError(error, "Failed to initialize list");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const verifiedSwitch = document.getElementById("verified-switch");
    const modalElement = document.getElementById('confirmation-modal');
    const confirmButton = document.getElementById("confirm-button");
    const cancelButton = document.getElementById("cancel-button");

    verifiedSwitch.addEventListener("change", () => {
        if (modalConfirmed) {
            populateHubList(verifiedHubs);
            showPosition(defaultLocation, verifiedHubs);
            modalConfirmed = false;
            return;
        }

        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        confirmButton.onclick = () => {
            modal.hide();
            modalConfirmed = true;
            populateHubList(hubsData);
            showPosition(defaultLocation, hubsData);
        };

        cancelButton.onclick = () => {
            modal.hide();
            verifiedSwitch.checked = true;
        };
    });
});

function setupDropdown() {
    let dropdownButton = document.getElementById('sort-select');
    const backLinkIcon = document.querySelector('#back-link .actions-icon');


    if (!dropdownButton) return;

    let dropdownMenu = dropdownButton.nextElementSibling;
    let dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {

            selectedSortOption = item.textContent.trim();
            updateDropdown(dropdownButton, dropdownItems, item);
            sortAndPopulateHubList();
        });
    });
    dropdownButton.addEventListener('shown.bs.dropdown', function () {
        backLinkIcon.classList.remove('rotated');
    });

    dropdownButton.addEventListener('hidden.bs.dropdown', function () {
        backLinkIcon.classList.add('rotated');
    });
}

function sortHubs(hubs, option) {
    let sortedHubs;
    switch (option) {
        case 'Distance':
            const { latitude, longitude } = defaultLocation.coords;
            sortedHubs = hubs.sort((a, b) => distanceInKmBetweenEarthCoordinates(latitude, longitude, b.mapCoordinates[0], b.mapCoordinates[1]) - distanceInKmBetweenEarthCoordinates(latitude, longitude, a.mapCoordinates[0], a.mapCoordinates[1]));
            return sortedHubs;
        case 'Friends':
            sortedHubs = hubs.sort((a, b) => b.attendees.filter(player => userData.friends.includes(player.id)).length - a.attendees.filter(player => userData.friends.includes(player.id)).length);
            return sortedHubs;
        case 'Popularity':
            return hubs.sort((a, b) => b.attendees - a.attendees);
    }
}

function sortAndPopulateHubList() {
    let sortedHubs;
    if (!modalConfirmed) {
        sortedHubs = sortHubs(verifiedHubs, selectedSortOption);
    } else {
        sortedHubs = sortHubs(hubsData, selectedSortOption);
    }
    populateHubList(sortedHubs);
    showPosition(defaultLocation, sortedHubs);

}
document.addEventListener('DOMContentLoaded', () => {
    hubListTemplate = document.querySelector("#hub-list");
    templateList = document.querySelector("#list-item-template");
    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("input", handleSearch);


});
function handleSearch() {
    const searchBar = document.getElementById("search-bar");
    const searchTerm = searchBar.value.toLowerCase();
    let filteredHubs;
    if (!modalConfirmed) {

        filteredHubs = verifiedHubs.filter(hub => hub.name.toLowerCase().includes(searchTerm));
    } else {

        filteredHubs = hubsData.filter(hub => hub.name.toLowerCase().includes(searchTerm));
    }

    populateHubList(filteredHubs);
    showPosition(defaultLocation, filteredHubs);
}
function updateDropdown(button, items, selectedItem) {
    button.innerHTML = `<i class="menu-burger-icon"></i>${selectedItem.textContent.trim()}
                        <a id="back-link" href="#" class="link-container">
                            <img src="images/icons/down-chevron.svg" alt="Back" class="actions-icon  rotated">
                        </a>`;
    items.forEach(item => item.classList.remove('active'));
    selectedItem.classList.add('active');
}
function populateHubList(hubs) {
    const hubList = hubListTemplate;
    const template = templateList;

    hubList.innerHTML = '';

    let colorFlag = false;
    for (let hubIndex = 0; hubIndex < hubs.length; hubIndex++) {
        let clone;
        try {
            clone = template.content.cloneNode(true);
        } catch (error) {
            console.error('Error cloning template:', error);
            continue;
        }

        setupHubItem(clone, hubs[hubIndex], hubs[hubIndex].id, colorFlag);

        if (userInfo.role !== 'admin' && userInfo.id !== hubs[hubIndex].ownerId) {
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
async function loadUserPostition() {
    const response = await fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=process.env.GOOGLE_API_KEY', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    const { lat, lng } = data.location;
    defaultLocation = {
        "coords": {
            "latitude": lat,
            "longitude": lng
        }
    }
}


