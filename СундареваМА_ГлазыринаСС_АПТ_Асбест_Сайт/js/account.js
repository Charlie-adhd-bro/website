// Глобальная переменная для отслеживания состояния инициализации
let accountPageInitialized = false;

// Функция инициализации страницы аккаунта
function initAccountPage() {
    if (accountPageInitialized) return;
    accountPageInitialized = true;

    const currentUser  = JSON.parse(localStorage.getItem('currentUser')); 

    // Если пользователь не авторизован - редирект
    if (!currentUser ) {
        window.location.href = 'auth.html?redirect=account.html';
        return;
    }

    // Имитация загрузки
    setTimeout(() => {
        renderAccountData(currentUser );
    }, 800);
}

document.getElementById('logout-btn').addEventListener('click', logout);

// Назначаем обработчик отмены бронирования на контейнер
const bookingsList = document.getElementById('bookings-list');
bookingsList.addEventListener('click', handleDocumentClick);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем страницу
    initAccountPage();
});

// Обработчик кликов 
function handleDocumentClick(e) {
}

// Функция обработки отмены бронирования
function handleCancelBooking(e) {
    const bookingCard = e.target.closest('.booking-card');
    if (!bookingCard) return;

    const bookingId = bookingCard.dataset.id;
    if (!bookingId) return;

    // Подтверждение действия
    if (!confirm('Вы действительно хотите отменить это бронирование?')) {
        return; // Если пользователь нажал "Отмена", выходим из функции
    }

    // Выполняем отмену
    if (cancelBooking(bookingId)) {
        // Обновляем интерфейс
        bookingCard.querySelector('.booking-status').textContent = 'Отменено';
        bookingCard.querySelector('.booking-status').classList.add('cancelled');
        e.target.remove();
    } else {
        alert('Не удалось отменить бронирование. Попробуйте еще раз.');
    }
}

// Функция отмены бронирования (работа с localStorage)
function cancelBooking(bookingId) {
    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser  = JSON.parse(localStorage.getItem('currentUser ')); 

        const userIndex = users.findIndex(u => u.id === currentUser .id);
        if (userIndex === -1) return false;

        const bookingIndex = users[userIndex].bookings.findIndex(b => b.id === Number(bookingId));
        if (bookingIndex === -1) return false;

        // Обновляем статус
        users[userIndex].bookings[bookingIndex].status = 'Отменено';

        // Сохраняем изменения
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser ', JSON.stringify(users[userIndex])); // Убедитесь, что пробелы удалены
        return true ; // возвращаем true в случае успеха
    } catch (error) {
        console.error("Ошибка при отмене бронирования:", error);
        return false; // возвращаем false в случае ошибки
    }
}

function logout() {
    localStorage.removeItem('currentUser ');
    window.location.href = 'index.html';
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.style.display = 'none'; 
    }
}