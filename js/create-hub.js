// please enable persistent logging to see the post request log
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("hub-form").addEventListener('submit', function(event) {
        event.preventDefault();
        // commented until full release (api key)
        //const address = document.getElementById('address').value;
        //geocodeAddress(address);
        populateHiddenForms();

        // Temporary logging
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        console.log("POST /hubs (body):", formObject);

        const form = document.getElementById('hub-form');
        form.submit()
    });
});

document.addEventListener('userDataReady', () => {
    populateLogoOptions(hubsData);
    fetch("data/badges.json")
        .then(response => response.json())
        .then(data => populateBadgeOptions(data));
    console.log("GET /badges");
});

function populateHiddenForms(){
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
function populateLogoOptions(hubs) {
    const logoList = document.querySelector("#logo-list");
    const template = document.querySelector("#logo-option");
    if (!template) return;

    for (const hubId in hubs) {
        let clone = template.content.cloneNode(true);
        clone.querySelector("input").value = hubId;
        clone.querySelector("img").src = `images/hubs/${hubId}/logo.png`;
        clone.querySelector("img").alt = `hub ${hubId}'s logo`;
        logoList.appendChild(clone);
    }

    let firstChild = logoList.querySelector("input");
    if(firstChild){
        firstChild.checked = true;
    }
}

function populateBadgeOptions(badgeOptions){
    const badgeList = document.querySelector("#badge-list");
    const template = document.querySelector("#badge-option");
    if (!template) return;

    for (const [key, value] of Object.entries(badgeOptions)) {
        let clone = template.content.cloneNode(true);
        clone.querySelector("input").value = value;
        clone.querySelector("img").src = `images/badges/${value}.png`;
        clone.querySelector("img").alt = `badge ${value}`;
        badgeList.appendChild(clone)
    }

    let firstChild = badgeList.querySelector("input");
    if(firstChild){
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