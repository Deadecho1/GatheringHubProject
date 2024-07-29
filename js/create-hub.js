const images = [
    'images/hubs/1/logo.png',
    'images/hubs/2/logo.png',
    'images/hubs/3/logo.png',
    'images/hubs/4/logo.png',
    'images/hubs/5/logo.png',
];
document.addEventListener('DOMContentLoaded', () => {
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

        const response = await fetch('http://localhost:3000/api/hubs/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        });
        const data = await response.json();
        if (response.ok) {
            const form = document.getElementById('hub-form');
            form.submit()
            const url = `create-station.html?hubId=${data.id}`;
            window.location.href = url
        } else {
            alert(data.error);
        }
        ;
    });
});


document.addEventListener('userDataReady', async () => {
    populateLogoOptions(images);
    try {
        const response = await fetch('http://localhost:3000/api/badges/all-badges');
        const data = await response.json();
        populateBadgeOptions(data);
        console.log("GET /badges");
    } catch (error) {
        console.error("Error fetching badges:", error);
    }
});

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

/* temporary, will be replaced with image upload when we have a server */
function populateLogoOptions(images) {
    const logoList = document.querySelector("#logo-list");
    const template = document.querySelector("#logo-option");
    if (!template) return;
    for (let imagesIndex = 0; imagesIndex < images.length; imagesIndex++) {
        let clone = template.content.cloneNode(true);
        clone.querySelector("input").value = images[imagesIndex];
        clone.querySelector("img").src = images[imagesIndex]
        clone.querySelector("img").alt = `hub logo`;
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
        clone.querySelector("input").value = value.name;
        clone.querySelector("img").src = `images/badges/${value.name}.png`;
        clone.querySelector("img").alt = `badge ${value.name}`;
        badgeList.appendChild(clone)
    }

    let firstChild = badgeList.querySelector("input");
    if (firstChild) {
        firstChild.checked = true;
    }
}

// waiting for full release, not usable yet.
/*
function geocodeAddress(address) {
    const apiKey = "tempapikey";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            const lat = location.lat;
            const lng = location.lng;

            document.querySelector('input[name="lat"]').value = lat;
            document.querySelector('input[name="lng"]').value = lng;
        } else {
            console.log(data.status);
            alert('The address you entered could not be found. Please enter a valid address.');
        }
      })
      .catch(error => console.error('Error:', error));
}
*/