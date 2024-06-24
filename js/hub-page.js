document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('x-icon');

    backButton.addEventListener('click', () => {
        history.back();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/hubs.json')
        .then(response => response.json()) 
        .then(data => {
            const name = data[4].name;
            const address = data[4].location;
            const heading = document.querySelector('h1');
            const hubPageAddress = document.getElementById('address');
            heading.textContent = name;
            hubPageAddress.textContent = address;
        })
    .catch(error => console.error('Error fetching JSON data:', error));
});



