document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
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
    
    // التحقق من اسم المستخدم
    function validateUsername(username) {
        if (!username.trim()) {
            return 'User name is required';
        }
        return null;
    }
    
    // التحقق من كلمة المرور
    function validatePassword(password) {
        if (!password) {
            return 'Password is required';
        }
        return null;
    }
    
    // التحقق من بيانات المستخدم
    function checkUserCredentials(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(user => 
            user.username.toLowerCase() === username.toLowerCase() && 
            user.password === password
        );
    }
    
    // عند إرسال الفورم
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        removeErrors();
        
        let isValid = true;
        
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
            passwordInput.parentElement.appendChild(createErrorElement(passwordError));
            isValid = false;
        }
        
        // إذا كانت الحقول ممتلئة
        if (isValid) {
            const user = checkUserCredentials(usernameInput.value, passwordInput.value);
            
            if (user) {
                // حفظ المستخدم الحالي
                localStorage.setItem('currentUser', user.username);
                
                alert('Login successful! Welcome ' + user.username);
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password. Please register first if you don\'t have an account.');
                usernameInput.style.borderColor = 'red';
                passwordInput.style.borderColor = 'red';
            }
        }
    });
    
    // إزالة الخطأ عند الكتابة
    usernameInput.addEventListener('input', function() {
        if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
            this.nextElementSibling.remove();
            this.style.borderColor = '';
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
            this.nextElementSibling.remove();
            this.style.borderColor = '';
        }
    });
});