// Handle login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        const messageDiv = document.getElementById('loginMessage');
        
        if (data.success) {
            messageDiv.className = 'alert alert-success';
            messageDiv.textContent = data.message;
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('laporanForm').style.display = 'block';
        } else {
            messageDiv.className = 'alert alert-danger';
            messageDiv.textContent = data.message;
        }
        messageDiv.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    }
});