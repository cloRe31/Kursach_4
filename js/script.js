document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.querySelector('.slides'); // Контейнер слайдов
  const slideItems = document.querySelectorAll('.slide');
  const progressBars = document.querySelectorAll('.progress-bar .fill'); // Заполнение прогресс-баров
  const progressBarContainers = document.querySelectorAll('.progress-bar'); // Контейнеры прогресс-баров
  const prevButton = document.querySelector('.prev-button'); // Кнопка "Назад"
  const nextButton = document.querySelector('.next-button'); // Кнопка "Вперед"
  const nav = document.querySelector('.car_menu');

  let currentIndex = 0; // Текущий индекс слайда
  const slideCount = slideItems.length; // Количество слайдов
  const autoSlideInterval = 5000; // Интервал автопереключения (мс)
  let interval; // Хранение интервала автопереключения
  let startX = 0; // Начальная точка касания по оси X
  let endX = 0; // Конечная точка касания по оси X
  let lastScroll = 0;

  if (nav) {
    nav.classList.add('show');
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll < lastScroll) {
        nav.classList.add('show');
      } else {
        nav.classList.remove('show');
      }

      lastScroll = currentScroll;
    });
  }

  if (!slidesContainer || !slideCount) {
    return;
  }

  // Функция для перехода к определенному слайду
  function goToSlide(index) {
    currentIndex = (index + slideCount) % slideCount; // Зацикливание слайдов
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`; // Смещение контейнера слайдов
    resetProgressBars(); // Сброс прогресс-баров
    startProgressBar(currentIndex); // Запуск прогресс-бара текущего слайда
  }

  // Сброс всех прогресс-баров
  function resetProgressBars() {
    progressBars.forEach((bar) => {
      bar.style.width = '0'; // Сброс ширины заполнения
      bar.style.transition = 'none'; // Убираем анимацию
    });
  }

  // Запуск прогресс-бара для текущего слайда
  function startProgressBar(index) {
    if (!progressBars.length) {
      return;
    }
    const bar = progressBars[index];
    if (!bar) {
      return;
    }
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

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(currentIndex - 1);
      startAutoSlide();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(currentIndex + 1);
      startAutoSlide();
    });
  }

  // Обработчики кликов на прогресс-бары
  progressBarContainers.forEach((barContainer, index) => {
    barContainer.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(index);
      startAutoSlide();
    });
  });

  // Обработка свайпов для мобильных устройств
  slidesContainer.addEventListener('touchstart', (e) => {
    stopAutoSlide(); // Остановка автопереключения
    startX = e.touches[0].clientX; // Сохранение начальной точки касания
  });

  slidesContainer.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX; // Обновление текущей точки касания
  });

  slidesContainer.addEventListener('touchend', () => {
    const distance = endX - startX; // Разница между начальной и конечной точкой
    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
    }
    startAutoSlide(); // Перезапуск автопереключения
  });

  // Инициализация слайдера
  goToSlide(currentIndex); // Переход к начальному слайду
  startProgressBar(currentIndex); // Запуск прогресс-бара для первого слайда
  startAutoSlide(); // Запуск автоматического переключения
});
})
