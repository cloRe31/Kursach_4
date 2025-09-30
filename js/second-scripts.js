document.addEventListener('DOMContentLoaded', () => {

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



});