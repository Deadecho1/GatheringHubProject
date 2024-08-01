document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('https://gathering-hub-project-backend.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, username, password })
        });
        const data = await response.json();
        if (response.ok) {
            window.location.href = 'login.html';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});