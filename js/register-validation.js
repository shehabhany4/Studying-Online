document.addEventListener('DOMContentLoaded', function () {
    const registerForm  = document.querySelector('form');
    const emailInput    = document.querySelector('input[type="email"]');
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('#password');

    // تنظيف الـ localStorage من البيانات القديمة/الفاسدة
    (function cleanStorage() {
        const users   = JSON.parse(localStorage.getItem('users') || '[]');
        const cleaned = users.filter(u => u && u.username && u.email && u.password);
        localStorage.setItem('users', JSON.stringify(cleaned));
    })();

    /* -------- helpers -------- */
    function createErrorElement(message) {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.style.color = 'red';
        error.style.fontSize = '12px';
        error.style.marginTop = '5px';
        error.style.display = 'block';
        error.textContent = message;
        return error;
    }

    function removeErrors() {
        document.querySelectorAll('.error-message').forEach(e => e.remove());
        document.querySelectorAll('input').forEach(i => i.style.borderColor = '');
    }

    function showError(input, message) {
        input.style.borderColor = 'red';
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

    // ✅ الدالة المصلحة - بتتجاهل أي user فاسد
    function isUserExists(username, email) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.some(function(u) {
            if (!u || !u.username || !u.email) return false;
            return (
                u.username.toLowerCase() === username.toLowerCase() ||
                u.email.toLowerCase()    === email.toLowerCase()
            );
        });
    }

    function saveUser(email, username, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({
            email:        email,
            username:     username,
            password:     password,
            registeredAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
    }

    /* -------- submit -------- */
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        removeErrors();

        let isValid = true;

        const emailError = validateEmail(emailInput.value);
        if (emailError) { showError(emailInput, emailError); isValid = false; }

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