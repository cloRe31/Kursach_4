document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelector('.slides'); // Контейнер слайдов
  const progressBars = document.querySelectorAll('.progress-bar .fill'); // Заполнение прогресс-баров
  const progressBarContainers = document.querySelectorAll('.progress-bar'); // Контейнеры прогресс-баров
  const prevButton = document.querySelector('.prev-button'); // Кнопка "Назад"
  const nextButton = document.querySelector('.next-button'); // Кнопка "Вперед"
  
  let currentIndex = 0; // Текущий индекс слайда
  const slideCount = document.querySelectorAll('.slide').length; // Количество слайдов
  const autoSlideInterval = 5000; // Интервал автопереключения (мс)
  let interval; // Хранение интервала автопереключения
  
  let startX = 0; // Начальная точка касания по оси X
  let endX = 0; // Конечная точка касания по оси X

  let lastScroll = 0;
  const nav = document.querySelector('.car_menu');

  const phoneInput = document.getElementById('phone-input');

  nav.classList.add('show');

//Шапка
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll < lastScroll) {
        // Скролл вверх
        nav.classList.add('show');
    } else {
        // Скролл вниз
        nav.classList.remove('show');
    }

    lastScroll = currentScroll;
});

// Функция для перехода к определенному слайду
function goToSlide(index) {
  currentIndex = (index + slideCount) % slideCount; // Зацикливание слайдов
  slides.style.transform = `translateX(-${currentIndex * 100}%)`; // Смещение контейнера слайдов
  resetProgressBars(); // Сброс прогресс-баров
  startProgressBar(currentIndex); // Запуск прогресс-бара текущего слайда
}

// Сброс всех прогресс-баров
function resetProgressBars() {
  progressBars.forEach(bar => {
    bar.style.width = '0'; // Сброс ширины заполнения
    bar.style.transition = 'none'; // Убираем анимацию
  });
}

// Запуск прогресс-бара для текущего слайда
function startProgressBar(index) {
  const bar = progressBars[index];
  setTimeout(() => {
    bar.style.transition = `width ${autoSlideInterval}ms linear`; // Плавная анимация
    bar.style.width = '100%'; // Заполнение до конца
  }, 50); // Небольшая задержка для обновления стилей
}

// Автоматическое переключение слайдов
function startAutoSlide() {
  interval = setInterval(() => {
    goToSlide(currentIndex + 1); // Переход к следующему слайду
  }, autoSlideInterval);
}

// Остановка автоматического переключения
function stopAutoSlide() {
  clearInterval(interval);
}

// Обработчики для кнопок "Назад" и "Вперед"
prevButton.addEventListener('click', () => {
  stopAutoSlide();
  goToSlide(currentIndex - 1);
  startAutoSlide();
});

nextButton.addEventListener('click', () => {
  stopAutoSlide();
  goToSlide(currentIndex + 1);
  startAutoSlide();
});

// Обработчики кликов на прогресс-бары
progressBarContainers.forEach((barContainer, index) => {
  barContainer.addEventListener('click', () => {
    stopAutoSlide();
    goToSlide(index);
    startAutoSlide();
  });
});

// Обработка свайпов для мобильных устройств
slides.addEventListener('touchstart', (e) => {
  stopAutoSlide(); // Остановка автопереключения
  startX = e.touches[0].clientX; // Сохранение начальной точки касания
});

slides.addEventListener('touchmove', (e) => {
  endX = e.touches[0].clientX; // Обновление текущей точки касания
});

slides.addEventListener('touchend', () => {
  const distance = endX - startX; // Разница между начальной и конечной точкой
  if (Math.abs(distance) > 50) { // Если свайп длиннее 50px
    if (distance > 0) {
      // Свайп вправо - переход на предыдущий слайд
      goToSlide(currentIndex - 1);
    } else {
      // Свайп влево - переход на следующий слайд
      goToSlide(currentIndex + 1);
    }
  }
  startAutoSlide(); // Перезапуск автопереключения
});

// Инициализация слайдера
goToSlide(currentIndex); // Переход к начальному слайду
startProgressBar(currentIndex); // Запуск прогресс-бара для первого слайда
startAutoSlide(); // Запуск автоматического переключения

phoneInput.addEventListener('focus', function () {
  if (phoneInput.value === "") {
    phoneInput.value = "+7 ";
  }
  setTimeout(() => phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length), 0); // Ставим курсор в конец
});


//шаблон для ввода телефона
phoneInput.addEventListener('input', function (e) {
  let value = e.target.value;
  let cursorPosition = e.target.selectionStart;

  // Удаляем все нецифровые символы, кроме "+", пробела, "(", ")", и "-"
  value = value.replace(/[^\d+()\s-]/g, "");

  // Форматируем строку только если она начинается с "+7"
  if (value.startsWith("+7")) {
    const digits = value.replace(/\D/g, "").slice(1); // Получаем только цифры после "+7"
    if (digits.length > 0) {
      value = "+7 (" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6, 8) + "-" + digits.slice(8, 10);
    } else {
      value = "+7 ";
    }
  } else {
    value = "+7 "; // Сбрасываем значение, если формат нарушен
  }

  e.target.value = value;

  // Восстанавливаем позицию курсора, если пользователь стирает символы
  if (e.inputType === "deleteContentBackward" || e.inputType === "deleteContentForward") {
    cursorPosition = Math.max(4, cursorPosition); // Запрещаем стирать "+7 "
  } else {
    cursorPosition = e.target.value.length; // Ставим курсор в конец при вводе
  }

  e.target.setSelectionRange(cursorPosition, cursorPosition);
});

const openPopupBtns = document.querySelectorAll('.openPopupBtn');
const popupOverlay = document.getElementById('popupOverlay');
const closePopupBtn = document.getElementById('closePopupBtn');
const applicationForm = document.getElementById('applicationForm');

openPopupBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        popupOverlay.style.display = 'flex';
    });
});

closePopupBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});

applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const inputs = applicationForm.querySelectorAll('input[required]');

    inputs.forEach(input => {
        if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
            input.classList.add('error');
            valid = false;
        } else {
            input.classList.remove('error');
        }
    });

    if (valid) {
        popupOverlay.style.display = 'none';
        applicationForm.reset();
    }
});
})