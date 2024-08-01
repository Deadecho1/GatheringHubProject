document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hubId = urlParams.get('hubId');
    if (hubId) {
        await loadHubData(hubId);
    }

    document.getElementById("hub-form").addEventListener('submit', async function (event) {
        event.preventDefault();
        populateHiddenForms();

        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        let userString = localStorage.getItem('userInfo');
        const userObject = JSON.parse(userString);
        formObject.ownerId = userObject.id;

        const response = await fetch('https://gathering-hub-project-backend.onrender.com/api/hubs/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        });

        const data = await response.json();
        if (response.ok) {
            const form = document.getElementById('hub-form');
            form.submit();
            const url = `create-station.html?hubId=${data.id}`;
            window.location.href = url;
        } else {
            alert(data.error);
        }
    });

    await initializePage();
});

async function loadHubData(hubId) {
    try {
        const response = await fetch(`https://gathering-hub-project-backend.onrender.com/api/hubs/${hubId}`);
        const hub = await response.json();
        document.getElementById('create-hub-header').textContent = 'Edit Hub';
        document.getElementById('create-station-btn').textContent = 'Save hub';

        if (response.ok) {
            document.getElementById('name').value = hub.name;
            document.getElementById('address').value = hub.location;
            document.getElementById('phone').value = hub.phone;
            document.getElementById('about').value = hub.about;
            const [opHour, opMin] = hub.openingHour.split(':');
            document.getElementById('op-hour').value = opHour;
            document.getElementById('op-min').value = opMin;
            const [clHour, clMin] = hub.closingHour.split(':');
            document.getElementById('cl-hour').value = clHour;
            document.getElementById('cl-hour').value = clMin;

        } else {
            console.error("Error loading hub data:", hub.error);
        }
    } catch (error) {
        console.error("Error fetching hub data:", error);
    }
}

function populateHiddenForms() {
    const opHour = document.getElementById('op-hour').value.padStart(2, '0');
    const opMin = document.getElementById('op-min').value.padStart(2, '0');
    const opTime = `${opHour}:${opMin}`;
    document.getElementById('op-time').value = opTime;

    const clHour = document.getElementById('cl-hour').value.padStart(2, '0');
    const clMin = document.getElementById('cl-min').value.padStart(2, '0');
    const clTime = `${clHour}:${clMin}`;
    document.getElementById('cl-time').value = clTime;
}

async function initializePage() {
    const images = [
        'images/hubs/1/logo.png',
        'images/hubs/2/logo.png',
        'images/hubs/3/logo.png',
        'images/hubs/4/logo.png',
        'images/hubs/5/logo.png',
    ];
    populateLogoOptions(images);

    try {
        const response = await fetch('https://gathering-hub-project-backend.onrender.com/api/badges/all-badges');
        const data = await response.json();
        populateBadgeOptions(data);
        console.log("GET /badges");
    } catch (error) {
        console.error("Error fetching badges:", error);
    }
}

function populateLogoOptions(images) {
    const logoList = document.querySelector("#logo-list");
    const template = document.querySelector("#logo-option");
    if (!template) return;
    for (let i = 0; i < images.length; i++) {
        let clone = template.content.cloneNode(true);
        const radio = clone.querySelector("input");
        radio.value = images[i];
        radio.id = `logo-${i + 1}`;
        const img = clone.querySelector("img");
        img.src = images[i];
        img.alt = `hub logo`;
        logoList.appendChild(clone);
    }

    let firstChild = logoList.querySelector("input");
    if (firstChild) {
        firstChild.checked = true;
    }
}

function populateBadgeOptions(badgeOptions) {
    const badgeList = document.querySelector("#badge-list");
    const template = document.querySelector("#badge-option");
    if (!template) return;

    for (const [key, value] of Object.entries(badgeOptions)) {
        let clone = template.content.cloneNode(true);
        const radio = clone.querySelector("input");
        radio.value = value.name;
        radio.id = `badge-${key}`;
        const img = clone.querySelector("img");
        img.src = `images/badges/${value.name}.png`;
        img.alt = `badge ${value.name}`;
        badgeList.appendChild(clone);
    }

    let firstChild = badgeList.querySelector("input");
    if (firstChild) {
        firstChild.checked = true;
    }
}