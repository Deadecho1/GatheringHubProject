
document.addEventListener('userDataReady', () => {
    try {
        console.log('hubsData:', hubsData);
        // window.location.reload();
        SetUpPage();
        
        
    } catch (error) {
        handleError(error, "Failed to initialize list");
    }
});

function SetUpPage() {
    document.querySelector('h1').textContent = hubsData[4].name;
    document.querySelector('h2#address').textContent = hubsData[4].location;
    document.querySelector('h2#phone-number').textContent = hubsData[4].phone;
    setupHubStatus(hubsData[4]);
    
}


function setupHubStatus(hub) {
    let statusH2 = document.getElementById('text-open-close');
    let isOpen = checkOpenStatus(hub.openingHour, hub.closingHour);
    statusH2.textContent = isOpen ? "Open" : "Closed";
    statusH2.classList.add(isOpen ? "text-open" : "text-close");
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

document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('x-icon');

    backButton.addEventListener('click', () => {
        history.back();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.getElementsByClassName('location-icon');

    Array.from(navButtons).forEach(button => {
        button.addEventListener('click', () => {
            const latitude = hubsData[4].mapCoordinates[0]; // Replace with the actual latitude
            const longitude = hubsData[4].mapCoordinates[1]; // Replace with the actual longitude
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            window.open(url, '_blank');
        });
    });
});

