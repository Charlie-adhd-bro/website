// Данные туров (должны совпадать с tours.js)
const toursData = [
    {
        id: 1,
        title: "Дорога памяти",
        date: "2025-05-15",
        duration: 2,
        price: 5200,
        seats: 12,
        image: "img/tour-1.jpg",
        description: "Экскурсия по мемориалам Челябинска и Магнитогорска",
        places: ["Парк Победы", "Музей военной техники", "Мемориал «Тыл-Фронту»"]
    },
    {
        id: 2,
        title: "Танкоград",
        date: "2025-06-22",
        duration: 1,
        price: 3800,
        seats: 5,
        image: "img/tour-2.jpg",
        description: "История Челябинска как центра танкостроения",
        places: ["ЧТЗ", "Музей ЧТЗ", "Памятник танкистам"]
    },
    {
        id: 3,
        title: "Уральские рубежи",
        date: "2025-09-12",
        duration: 3,
        price: 8900,
        seats: 18,
        image: "img/tour-3.jpg",
        description: "Посещение всех ключевых мемориалов Южного Урала",
        places: ["Челябинск", "Златоуст", "Миасс", "Магнитогорск"]
    }
];

// Инициализация страницы бронирования
function initBookingPage() {
    const bookingContainer = document.getElementById('booking-container');
    if (!bookingContainer) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');

    // Проверка авторизации и наличия тура
    if (!currentUser || !tourId) {
        window.location.href = 'tours.html';
        return;
    }

    const tour = toursData.find(t => t.id == tourId);
    if (!tour) {
        window.location.href = 'tours.html';
        return;
    }

    // Отрисовка формы бронирования
    bookingContainer.innerHTML = `
        <div class="booking-form">
            <h2 class="booking-title">Бронирование тура "${tour.title}"</h2>
            
            <div class="tour-summary">
                <div class="tour-summary__image">
                    <img src="${tour.image}" alt="${tour.title}">
                </div>
                <div class="tour-summary__content">
                    <p><strong>Дата:</strong> ${formatDate(tour.date)}</p>
                    <p><strong>Длительность:</strong> ${tour.duration} ${getDayText(tour.duration)}</p>
                    <p><strong>Места:</strong> ${tour.places.join(', ')}</p>
                </div>
            </div>
            
            <form id="booking-form">
                <h3>Данные участников</h3>
                
                <div class="form-group">
                    <label for="adults">Количество взрослых:</label>
                    <input type="number" id="adults" min="0" value="1" class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="children">Количество детей до 10 лет:</label>
                    <input type="number" id="children" min="0" value="0" class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="pensioners">Количество пенсионеров:</label>
                    <input type="number" id="pensioners" min="0" value="0" class="form-control">
                </div>
                
                <div class="price-calculation">
                    <div class="price-row">
                        <span>Стоимость:</span>
                        <span id="base-price">${tour.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div class="price-row">
                        <span>Скидка:</span>
                        <span id="discount">0 ₽</span>
                    </div>
                    <div class="price-row total">
                        <span>Итого к оплате:</span>
                        <span id="total-price">${tour.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>
                
                <button type="submit" class="btn btn--primary btn--block" style="font-size: 18px">Подтвердить бронирование</button>
            </form>
        </div>
    `;

    // Инициализация калькулятора цены
    initPriceCalculator(tour.price);
    setupBookingForm(tour, currentUser);
}
function initPriceCalculator(basePrice) {
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');
    const pensionersInput = document.getElementById('pensioners');

    if (!adultsInput || !childrenInput || !pensionersInput) return;

    const calculate = () => {
        const adults = parseInt(adultsInput.value) || 0;
        const children = parseInt(childrenInput.value) || 0;
        const pensioners = parseInt(pensionersInput.value) || 0;
        const totalPeople = adults + children + pensioners;

        let discount = 0;
        let discountText = '';

        // Скидка 2% для детей до 10 лет и пенсионеров
        if (children > 0) {
            discount = 0.02; // 2% за каждого ребенка
            discountText += `Дети/пенсионеры: -2% `;
        }
        if (pensioners > 0) {
            discount = 0.02; // 2% за каждого пенсионера
        }

        // Скидка для групп
        if (totalPeople >= 10 && totalPeople <= 20) {
            discount = 0.03; // 3% для группы 10-20 человек
            discountText += `<br>Группа 10-20 чел: -3% `;
        } else if (totalPeople > 20) {
            discount = 0.04; // 4% для группы больше 20 человек
            discountText += `<br>Группа >20 чел: -4% + 1 бесплатно `;
        }

        // Расчет цены
        let total = (adults + children + pensioners) * basePrice * (1 - discount);

        // Если группа >20, один взрослый бесплатно
        if (totalPeople > 20) {
            total -= basePrice; // Один взрослый бесплатно
        }

        // Обновляем отображение
        document.getElementById('discount').innerHTML = `-${(discount * 100).toFixed(0)}%<br> (${discountText})`;
        document.getElementById('total-price').innerHTML = `${Math.round(total).toLocaleString('ru-RU')} ₽`;
    };

    adultsInput.addEventListener('input', calculate);
    childrenInput.addEventListener('input', calculate);
    pensionersInput.addEventListener('input', calculate);
}
// Настройка формы бронирования
function setupBookingForm(tour, currentUser) {
    const form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const adults = parseInt(document.getElementById('adults').value) || 0;
        const children = parseInt(document.getElementById('children').value) || 0;
        const pensioners = parseInt(document.getElementById('pensioners').value) || 0;
        const totalPrice = parseInt(document.getElementById('total-price').textContent.replace(/\D/g, ''));

        // Создаем бронирование
        const booking = {
            id: Date.now(),
            tourId: tour.id,
            tourTitle: tour.title,
            date: tour.date,
            people: {
                adults,
                children,
                pensioners
            },
            totalPrice,
            status: 'Подтверждено',
            createdAt: new Date().toISOString()
        };

        // Обновляем данные пользователя
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
            users[userIndex].bookings = users[userIndex].bookings || [];
            users[userIndex].bookings.push(booking);
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            
            alert(`Бронирование #${booking.id} успешно оформлено!`);
            window.location.href = 'account.html';
        }
    });
}

// Вспомогательные функции
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function getDayText(days) {
    if (days === 1) return 'день';
    if (days >= 2 && days <= 4) return 'дня';
    return 'дней';
}

// Инициализация
document.addEventListener('DOMContentLoaded', initBookingPage);