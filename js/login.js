document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('https://gathering-hub-project-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.href = 'home.html';
        } else {
            alert(data.error);

        }
    } catch (error) {
        alert("Error");
        console.error('Error:', error);
    }
});