document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('#password');
    
    // إضافة رسائل الخطأ
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
    
    // إزالة رسائل الخطأ القديمة
    function removeErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
        
        document.querySelectorAll('input').forEach(input => {
            input.style.borderColor = '';
        });
    }
    
    // التحقق من البريد الإلكتروني
    function validateEmail(email) {
        if (!email.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return null;
    }
    
    // التحقق من اسم المستخدم
    function validateUsername(username) {
        if (!username.trim()) {
            return 'User name is required';
        }
        if (username.length < 3) {
            return 'User name must be at least 3 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'User name can only contain letters, numbers, and underscores';
        }
        return null;
    }
    
    // التحقق من كلمة المرور
    function validatePassword(password) {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return null;
    }
    
    // التحقق من وجود المستخدم
    function isUserExists(username, email) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => 
            user.username.toLowerCase() === username.toLowerCase() || 
            user.email.toLowerCase() === email.toLowerCase()
        );
    }
    
    // حفظ المستخدم
    function saveUser(email, username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({
            email: email,
            username: username,
            password: password,
            registeredAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // عند إرسال الفورم
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        removeErrors();
        
        let isValid = true;
        
        // التحقق من البريد الإلكتروني
        const emailError = validateEmail(emailInput.value);
        if (emailError) {
            emailInput.style.borderColor = 'red';
            emailInput.parentElement.appendChild(createErrorElement(emailError));
            isValid = false;
        }
        
        // التحقق من اسم المستخدم
        const usernameError = validateUsername(usernameInput.value);
        if (usernameError) {
            usernameInput.style.borderColor = 'red';
            usernameInput.parentElement.appendChild(createErrorElement(usernameError));
            isValid = false;
        }
        
        // التحقق من كلمة المرور
        const passwordError = validatePassword(passwordInput.value);
        if (passwordError) {
            passwordInput.style.borderColor = 'red';
            passwordInput.parentElement.querySelector('.password-field').appendChild(createErrorElement(passwordError));
            isValid = false;
        }
        
        // التحقق من وجود المستخدم مسبقاً
        if (isValid && isUserExists(usernameInput.value, emailInput.value)) {
            alert('This username or email is already registered!');
            isValid = false;
        }
        
        // إذا كان كل شيء صحيح
        if (isValid) {
            saveUser(emailInput.value, usernameInput.value, passwordInput.value);
            
            // تسجيل دخول تلقائي
            localStorage.setItem('currentUser', usernameInput.value);
            
            alert('Registration successful!');
            window.location.href = 'landing.html';
        }
    });
    
    // إزالة الخطأ عند الكتابة
    [emailInput, usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = this.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
                this.style.borderColor = '';
            }
        });
    });
});