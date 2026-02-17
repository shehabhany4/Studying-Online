document.addEventListener('DOMContentLoaded', function () {
    const registerForm  = document.querySelector('form');
    const emailInput    = document.querySelector('input[type="email"]');
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('#password');

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
        // الـ password input جوه .password-field فنضيف الخطأ بعد الـ .password-field مش جوه الـ input
        const container = input.closest('.password-field') || input.parentElement;
        container.appendChild(createErrorElement(message));
        input.addEventListener('input', function () {
            const err = container.querySelector('.error-message');
            if (err) err.remove();
            this.style.borderColor = '';
        }, { once: true });
    }

    /* -------- validation -------- */
    function validateEmail(v) {
        if (!v.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
        return null;
    }

    function validateUsername(v) {
        if (!v.trim()) return 'User name is required';
        if (v.length < 3) return 'User name must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'Letters, numbers and underscores only';
        return null;
    }

    function validatePassword(v) {
        if (!v) return 'Password is required';
        if (v.length < 6) return 'Password must be at least 6 characters';
        return null;
    }

    function isUserExists(username, email) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(u =>
            u.username.toLowerCase() === username.toLowerCase() ||
            u.email.toLowerCase()    === email.toLowerCase()
        );
    }

    function saveUser(email, username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ email, username, password, registeredAt: new Date().toISOString() });
        localStorage.setItem('users', JSON.stringify(users));
    }

    /* -------- submit -------- */
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        removeErrors();

        let isValid = true;

        const emailError    = validateEmail(emailInput.value);
        if (emailError)    { showError(emailInput,    emailError);    isValid = false; }

        const usernameError = validateUsername(usernameInput.value);
        if (usernameError) { showError(usernameInput, usernameError); isValid = false; }

        const passwordError = validatePassword(passwordInput.value);
        if (passwordError) { showError(passwordInput, passwordError); isValid = false; }

        if (!isValid) return;

        if (isUserExists(usernameInput.value, emailInput.value)) {
            showError(usernameInput, 'This username or email is already registered!');
            return;
        }

        saveUser(emailInput.value, usernameInput.value, passwordInput.value);
        localStorage.setItem('currentUser', usernameInput.value);
        window.location.href = 'landing.html';
    });
});