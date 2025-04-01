var isAuthenticated = false;
// Проверка состояния авторизации
function checkAuthState() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        isAuthenticated = true;
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            const userName = userMenu.querySelector('.user-name');
            if (userName) userName.textContent = currentUser.name.split(' ')[0];
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Защита роутов
function protectRoute() {
    const protectedRoutes = ['account.html', 'booking.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedRoutes.includes(currentPage)) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            const redirectUrl = encodeURIComponent(window.location.href);
            window.location.href = `auth.html?redirect=${redirectUrl}`;
        }
    }
}

// Выход из системы
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
    logoutBtn.style.display = 'none'; 
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    protectRoute();
});


function cancelBooking(bookingId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || !bookingId) return false;
    
    // Находим пользователя
    const userIndex = users.findIndex(u => u.id == currentUser.id);
    if (userIndex === -1) return false;
    
    // Удаляем бронирование
    const bookingIndex = users[userIndex].bookings.findIndex(b => b.id == bookingId);
    if (bookingIndex === -1) return false;
    
    // Удаляем бронь (создаем новый массив без этой брони)
    users[userIndex].bookings = [
        ...users[userIndex].bookings.slice(0, bookingIndex),
        ...users[userIndex].bookings.slice(bookingIndex + 1)
    ];
    
    // Сохраняем изменения
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    
    return true;
}

function initAccountPage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const bookingsList = document.getElementById('bookings-list');
    if (!bookingsList) return;
    
    if (!currentUser.bookings || currentUser.bookings.length === 0) {
        bookingsList.innerHTML = '<p class="no-bookings">У вас пока нет бронирований</p>';
        return;
    }
    
    bookingsList.innerHTML = currentUser.bookings.map(booking => `
        <div class="booking-card" data-id="${booking.id}">
            <div class="booking-header">
                <h3 class="booking-title">${booking.tourTitle}</h3>
                <span class="booking-status">${booking.status}</span>
            </div>
            <div class="booking-details">
                <p><strong>Дата:</strong> ${formatDate(booking.date)}</p>
                <p><strong>Участники:</strong> 
                    ${booking.people?.adults || 0} взр., 
                    ${booking.people?.children || 0} дет., 
                    ${booking.people?.pensioners || 0} пенс.
                </p>
                <p><strong>Стоимость:</strong> ${booking.totalPrice.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div class="booking-actions">
                <button class="btn btn--small cancel-booking">Отменить</button>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики для кнопок отмены
    document.querySelectorAll('.cancel-booking').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingId = this.closest('.booking-card').dataset.id;
            if (confirm('Вы действительно хотите отменить это бронирование?')) {
                if (cancelBooking(bookingId)) {
                    initAccountPage(); // Перерисовываем список
                    alert('Бронирование успешно отменено');
                } else {
                    alert('Ошибка при отмене бронирования');
                }
            }
        });
    });
}

// Вспомогательная функция для форматирования даты
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burger');
    const nav = document.querySelector('.nav');
    const logoutBtn = document.getElementById('logout-btn');
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');

    if (isAuthenticated) {
        logoutBtn.style.display = 'block'; // Показываем кнопку "Выйти"
        authButtons.style.display = 'none'; // Скрываем кнопки авторизации
        userMenu.style.display = 'flex'; // Показываем меню пользователя
    } else {
        logoutBtn.style.display = 'none'; // Скрываем кнопку "Выйти"
        authButtons.style.display = 'flex'; // Показываем кнопки авторизации
        userMenu.style.display = 'none'; // Скрываем меню пользователя
    }

    // Добавляем обработчик события для бургер-меню
    burgerBtn.addEventListener('click', function() {
        nav.classList.toggle('active'); // Переключаем класс для отображения/скрытия меню
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var menu = document.querySelector('.nav');
    var currentUrl = window.location.pathname.split('/').pop(); 

    // Удаляем класс 'active' у всех ссылок
    [].forEach.call(menu.querySelectorAll('a'), function(item) {
        item.classList.remove('active');
    });

    // Добавляем класс 'active' к текущей ссылке
    [].forEach.call(menu.querySelectorAll('a'), function(item) {
        if (item.getAttribute('href') === currentUrl) {
            item.classList.add('active');
        }
    });
});