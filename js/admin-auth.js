document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');
            
            try {
                const response = await fetch('/.netlify/functions/admin-auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    localStorage.setItem('adminLoggedIn', 'true');
                    window.location.href = 'index.html';
                } else {
                    errorElement.textContent = result.message || 'Login failed';
                }
            } catch (error) {
                errorElement.textContent = 'An error occurred during login';
                console.error('Login error:', error);
            }
        });
    }
    
    // Auto-redirect to login if not authenticated
    if (!window.location.pathname.includes('login.html') && !localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
    }
});