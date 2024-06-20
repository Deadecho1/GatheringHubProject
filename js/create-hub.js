document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("hub-form").addEventListener('submit', function(event) {
        event.preventDefault();
        const address = document.getElementById('address').value;
        geocodeAddress(address);
    });
});


function geocodeAddress(address) {
    const apiKey = "AIzaSyBn6QDPytcyApXlmHjLg8XCDcNbQfsfH0c";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
            const form = document.getElementById('hub-form');
            form.submit();
        } else {
            alert('The address you entered could not be found. Please enter a valid address.');
        }
      })
      .catch(error => console.error('Error:', error));
}