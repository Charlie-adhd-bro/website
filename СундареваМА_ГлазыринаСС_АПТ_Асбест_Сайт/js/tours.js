// Данные туров
const toursData = [
    {
        id: 1,
        title: "Дорога памяти",
        date: "2025-05-15",
        duration: 2,
        price: 5200,
        seats: 12,
        image: "img/tour-1.jpg",
        description: `Экскурсия по мемориалам Челябинска и Магнитогорска                                 
        <br><br>(трансфер, проживание включены)
        <br><b>Доступны скидки</b>`, 
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
        description: `История Челябинска как центра танкостроения
        <br><b>Доступны скидки</b>`,
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
        description: `<br><br>(трансфер, питание, проживание включены)        
        <br><b>Доступны скидки</b>`,
        places: ["Челябинск", "Златоуст", "Миасс", "Магнитогорск"]
    }
];

// Форматирование даты
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Склонение дней
function getDayText(days) {
    if (days === 1) return 'день';
    if (days >= 2 && days <= 4) return 'дня';
    return 'дней';
}

// Основная функция инициализации
function initToursPage() {
    renderTours(toursData);
    setupFilters();
}

// Отрисовка туров
function renderTours(tours) {
    const toursContainer = document.querySelector('.tours-grid');
    if (!toursContainer) return;

    if (tours.length === 0) {
        toursContainer.innerHTML = `
            <div class="no-tours">
                <p>По выбранным фильтрам туров не найдено</p>
            </div>
        `;
        return;
    }

    toursContainer.innerHTML = tours.map(tour => `
        <div class="tour-card" data-id="${tour.id}">
            <div class="tour-card__image">
                <img src="${tour.image}" alt="${tour.title}" loading="lazy">
                <span class="tour-card__badge">${tour.seats > 0 ? `${tour.seats} мест` : 'Нет мест'}</span>
            </div>
            <div class="tour-card__content">
                <h3 class="tour-card__title">${tour.title}</h3>
                <div class="tour-card__meta">
                    <span class="tour-card__date">${formatDate(tour.date)}</span>
                    <span class="tour-card__duration">${tour.duration} ${getDayText(tour.duration)}</span>
                </div>
                <p class="tour-card__desc">${tour.description}</p>
                <div class="tour-card__footer">
                    <span class="tour-card__price">${tour.price.toLocaleString('ru-RU')} ₽</span>
                    <button class="btn btn--small book-btn" ${tour.seats <= 0 ? 'disabled' : ''}>
                        ${tour.seats > 0 ? 'Забронировать' : 'Нет мест'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Обработчики бронирования
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tourId = this.closest('.tour-card').dataset.id;
            bookTour(tourId);
        });
    });
}

// Настройка фильтров
function setupFilters() {
    const dateFilter = document.getElementById('filter-date');
    const durationFilter = document.getElementById('filter-duration');
    const priceFilter = document.getElementById('filter-price');
    const resetBtn = document.getElementById('reset-filters');

    if (!dateFilter || !durationFilter || !priceFilter || !resetBtn) {
        console.error('Один из элементов фильтров не найден!');
        return;
    }

    resetBtn.addEventListener('click', resetFilters);
    dateFilter.addEventListener('change', filterTours);
    durationFilter.addEventListener('change', filterTours);
    priceFilter.addEventListener('change', filterTours);
}

// Фильтрация туров
function filterTours() {
    const dateValue = document.getElementById('filter-date').value;
    const durationValue = document.getElementById('filter-duration').value;
    const priceValue = document.getElementById('filter-price').value;
    const today = new Date().toISOString().split('T')[0];

    const filteredTours = toursData.filter(tour => {
        // Фильтр по дате
        if (dateValue === 'soon' && tour.date < today) return false;
        if (dateValue === 'may' && !tour.date.startsWith('2025-05')) return false;
        if (dateValue === 'june' && !tour.date.startsWith('2025-06')) return false;

        // Фильтр по длительности
        if (durationValue !== 'all' && tour.duration !== parseInt(durationValue)) return false;

        // Фильтр по цене
        if (priceValue !== 'all' && tour.price > parseInt(priceValue)) return false;

        return true;
    });

    renderTours(filteredTours);
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('filter-date').value = 'all';
    document.getElementById('filter-duration').value = 'all';
    document.getElementById('filter-price').value = 'all';
    renderTours(toursData);
}

// Бронирование тура
function bookTour(tourId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        const currentUrl = window.location.href;
        window.location.href = `auth.html?redirect=${encodeURIComponent(currentUrl)}`;
        return;
    }

    const tour = toursData.find(t => t.id == tourId);
    
    if (!tour || tour.seats <= 0) {
        alert('К сожалению, на этот тур нет свободных мест');
        return;
    }

    window.location.href = `booking.html?id=${tourId}`;
}

// Инициализация
document.addEventListener('DOMContentLoaded', initToursPage);
