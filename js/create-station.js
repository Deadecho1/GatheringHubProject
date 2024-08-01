let hubId;
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('stationForm');
    const stationList = document.getElementById('station-list');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const stationName = document.getElementById('stationName').value;
        const platform = document.getElementById('platform').value;
        const game = document.getElementById('game').value;
        const maxPlayers = document.getElementById('maxPlayers').value;
        const currPlayers = 0;

        const stationItem = document.createElement('div');
        stationItem.className = 'station-item';
        stationItem.innerHTML = `
            <p><strong>Name:</strong> ${stationName}</p>
            <p><strong>Platform:</strong> ${platform}</p>
            <p><strong>Game:</strong> ${game}</p>
            <p><strong>Max Players:</strong> ${maxPlayers}</p>
            <p><strong>Current Players:</strong> ${currPlayers}</p>
        `;

        stationList.appendChild(stationItem);

        const response = await fetch('https://gathering-hub-project-backend.onrender.com/api/stations/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stationName, platform, game, maxPlayers, currPlayers, hubId })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Station created');
        } else {
            alert(data.error);
        }

        form.reset();
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const platformSelect = document.getElementById('platform');
    const gameSelect = document.getElementById('game');

    const platforms = ["PC", "Xbox", "Switch"];
    const games = ["LoL", "Party_Animals", "SSBU"];

    function populateSelect(selectElement, options) {
        selectElement.innerHTML = '<option value="" disabled selected>Select an option</option>';

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.toLowerCase();
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    }

    populateSelect(platformSelect, platforms);
    populateSelect(gameSelect, games);
});


document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    hubId = urlParams.get('hubId');
});