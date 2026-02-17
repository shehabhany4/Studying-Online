document.addEventListener('DOMContentLoaded', function () {
    const loginForm     = document.querySelector('form');
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');

    /* -------- helpers -------- */
    function createErrorElement(message) {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.style.cssText = 'color:red;font-size:12px;margin-top:5px;display:block;';
        error.textContent = message;
        return error;
    }

    function removeErrors() {
        document.querySelectorAll('.error-message').forEach(e => e.remove());
        document.querySelectorAll('input').forEach(i => i.style.borderColor = '');
    }

    function showError(input, message) {
        input.style.borderColor = 'red';
        input.parentElement.appendChild(createErrorElement(message));
        input.addEventListener('input', function () {
            const err = this.parentElement.querySelector('.error-message');
            if (err) err.remove();
            this.style.borderColor = '';
        }, { once: true });
    }

    /* -------- validation -------- */
    function validateUsername(v) {
        if (!v.trim()) return 'User name is required';
        return null;
    }

    function validatePassword(v) {
        if (!v) return 'Password is required';
        return null;
    }

    function checkUserCredentials(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(u =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === password
        );
    }

    /* -------- submit -------- */
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        removeErrors();

        let isValid = true;

        const usernameError = validateUsername(usernameInput.value);
        if (usernameError) { showError(usernameInput, usernameError); isValid = false; }

        const passwordError = validatePassword(passwordInput.value);
        if (passwordError) { showError(passwordInput, passwordError); isValid = false; }

        if (!isValid) return;

        const user = checkUserCredentials(usernameInput.value, passwordInput.value);

        if (user) {
            localStorage.setItem('currentUser', user.username);
            window.location.href = 'landing.html';
        } else {
            showError(usernameInput, 'Invalid username or password. Please register first!');
            passwordInput.style.borderColor = 'red';
        }
    });
});