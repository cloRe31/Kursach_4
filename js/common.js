document.addEventListener('DOMContentLoaded', () => {
  initPhoneMasks();
  initPopupForm();
});

function initPhoneMasks() {
  const inputs = document.querySelectorAll('input[data-phone-mask]');
  if (!inputs.length) {
    return;
  }

  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      if (input.value.trim() === '') {
        input.value = '+7 ';
      }
      setTimeout(() => {
        if (typeof input.setSelectionRange === 'function') {
          const end = input.value.length;
          input.setSelectionRange(end, end);
        }
      }, 0);
    });

    input.addEventListener('input', (event) => {
      const target = event.target;
      let value = target.value.replace(/[^\d+()\s-]/g, '');
      if (value.startsWith('+7')) {
        const digits = value.replace(/\D/g, '').slice(1);
        if (digits.length > 0) {
          value = '+7 (' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6, 8) + '-' + digits.slice(8, 10);
        } else {
          value = '+7 ';
        }
      } else {
        value = '+7 ';
      }

      target.value = value;
      let cursorPosition = target.selectionStart || target.value.length;

      if (event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward') {
        cursorPosition = Math.max(4, cursorPosition);
      } else {
        cursorPosition = target.value.length;
      }

      if (typeof target.setSelectionRange === 'function') {
        target.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  });
}

function initPopupForm() {
  const overlay = document.getElementById('popupOverlay');
  const openButtons = document.querySelectorAll('.openPopupBtn');
  if (!overlay || !openButtons.length) {
    return;
  }

  const closeButton = document.getElementById('closePopupBtn');
  const form = document.getElementById('applicationForm');
  const notification = document.getElementById('notification');

  const resetNotification = () => {
    if (!notification) {
      return;
    }
    notification.textContent = '';
    notification.classList.remove('success', 'error');
    notification.style.display = 'none';
  };

  const openPopup = () => {
    overlay.style.display = 'flex';
    resetNotification();
  };

  const closePopup = () => {
    overlay.style.display = 'none';
    resetNotification();
  };

  openButtons.forEach((btn) => btn.addEventListener('click', openPopup));
  if (closeButton) {
    closeButton.addEventListener('click', closePopup);
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closePopup();
    }
  });

  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let valid = true;
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach((input) => {
      const isCheckbox = input.type === 'checkbox';
      const value = isCheckbox ? input.checked : input.value.trim();
      if ((isCheckbox && !value) || (!isCheckbox && value === '')) {
        input.classList.add('error');
        valid = false;
      } else {
        input.classList.remove('error');
      }
    });

    if (notification) {
      if (valid) {
        notification.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
        notification.classList.remove('error');
        notification.classList.add('success');
      } else {
        notification.textContent = 'Пожалуйста, заполните обязательные поля.';
        notification.classList.remove('success');
        notification.classList.add('error');
      }
      notification.style.display = 'block';
    }

    if (valid) {
      form.reset();
    }
  });
}
