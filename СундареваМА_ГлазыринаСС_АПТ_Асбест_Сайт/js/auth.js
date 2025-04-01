document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const resetForm = document.getElementById('reset-form');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const forgotPassword = document.getElementById('forgot-password');
    const backToLogin = document.getElementById('back-to-login');
    const authTitle = document.getElementById('auth-title');
    const authAlert = document.getElementById('auth-alert');

    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const isRegister = urlParams.get('register') == 'true';
    const redirectUrl = urlParams.get('redirect') || 'index.html';

    // Инициализация формы (вход/регистрация)
    if (isRegister) {
        showRegisterForm();
    } else {
        showLoginForm();
    }

    // Переключение между формами
    switchToRegister?.addEventListener('click', function(e) {
        e.preventDefault();
        showRegisterForm();
    });

    switchToLogin?.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });

    forgotPassword?.addEventListener('click', function(e) {
        e.preventDefault();
        showResetForm();
    });

    backToLogin?.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });

    // Обработка формы входа
    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Получаем пользователей из LocalStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Сохраняем текущего пользователя
            localStorage.setItem('currentUser', JSON.stringify(user));
            showAlert('Вход выполнен успешно!', 'success');
            
            // Перенаправляем на предыдущую страницу
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        } else {
            showAlert('Неверный email или пароль', 'error');
        }
    });

    // Обработка формы регистрации
    registerForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = {
            id: Date.now(),
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            phone: document.getElementById('reg-phone').value,
            password: document.getElementById('reg-password').value,
            bookings: []
        };

        // Проверяем существующих пользователей
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(u => u.email === user.email)) {
            showAlert('Пользователь с таким email уже существует', 'error');
            return;
        }

        // Сохраняем нового пользователя
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        showAlert('Регистрация прошла успешно!', 'success');
        
        // Перенаправляем после регистрации
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    });

    // Обработка восстановления пароля (демо)
    resetForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('reset-email').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(u => u.email === email)) {
            showAlert('Инструкция по восстановлению отправлена на email', 'success');
            setTimeout(() => {
                showLoginForm();
            }, 1500);
        } else {
            showAlert('Пользователь с таким email не найден', 'error');
        }
    });

    // Функции переключения форм
    function showLoginForm() {
        authTitle.textContent = 'Вход в аккаунт';
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        resetForm.classList.remove('active');
    }

    function showRegisterForm() {
        authTitle.textContent = 'Регистрация';
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        resetForm.classList.remove('active');
    }

    function showResetForm() {
        authTitle.textContent = 'Восстановление пароля';
        resetForm.classList.add('active');
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
    }

    // Показать уведомление
    function showAlert(message, type) {
        authAlert.textContent = message;
        authAlert.style.backgroundColor = type === 'success' ? '#2E7D32' : '#D32F2F';
        authAlert.style.display = 'block';
        
        setTimeout(() => {
            authAlert.style.display = 'none';
        }, 3000);
    }
});

function initInputMasks() {
    // Маска для телефона
    const phoneInput = document.getElementById('reg-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('7') || value.startsWith('8')) {
                value = value.substring(1);
            }
            let formatted = '+7 ';
            if (value.length > 0) formatted += value.substring(0, 3);
            if (value.length > 3) formatted += '-' + value.substring(3, 6);
            if (value.length > 6) formatted += '-' + value.substring(6, 8);
            if (value.length > 8) formatted += '-' + value.substring(8, 10);
            this.value = formatted;
        });
    }

    // Маска для ФИО (только кириллица и пробелы)
    const nameInput = document.getElementById('reg-name');
    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^а-яА-ЯёЁ\s]/g, '');
        });
    }
    //Маска для ввода паспорта
    const input = document.getElementById('passport');
    const errorMessage = document.getElementById('error-message');

    input.addEventListener('input', function (e) {
        let value = this.value.replace(/\D/g, '');

        if (value.length > 2) {
            this.value = value.slice(0, 2) + '-' + value.slice(2, 4);
        } else {
            this.value = value;
        }
        
        if (value.length > 4) {
            this.value += ' ' + value.slice(4, 10);
        }

        if (this.value.length === 10) {
            const series = this.value.slice(0, 2) + this.value.slice(3, 5); // 4 символа
            const number = this.value.slice(6, 12);
            if (series.length === 4 && number.length === 6) {
                errorMessage.innerHTML = '';
            } else {
                errorMessage.innerHTML = 'Неверный формат. Используйте 00-00 000000.';
            }
        } else {
            errorMessage.innerHTML = ''; 
        }
    });

}

document.addEventListener('DOMContentLoaded', initInputMasks);