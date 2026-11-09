const callbackForm = document.querySelector('.callback-form-container');
const requestReceivedModal = document.querySelector('#request-received');

const userName = document.querySelector('#callback-form-input-name');
const userEmail = document.querySelector('#callback-form-input-email');
const userPhone = document.querySelector('#callback-form-input-phone');
const requestEmailLink = document.querySelector('#request-email-link');

userPhone.addEventListener('click', function() {
    if (!userPhone.value.trim()) {
        userPhone.value = '+380';
    }
});

userPhone.addEventListener('blur', function() {
    if (userPhone.value === '+380') {
        userPhone.value = '';
    }
});

callbackForm.addEventListener('submit', function(event){
    event.preventDefault();
    let hasError = false;

    if (!userName.value.trim()) {
        userName.classList.add('callback-form-input-error');
        hasError = true;
    } else {
        userName.classList.remove('callback-form-input-error');
    }

    if (!userEmail.value.trim() || !isEmailValid(userEmail.value)) {
        userEmail.classList.add('callback-form-input-error');
        hasError = true;
    } else {
        userEmail.classList.remove('callback-form-input-error');
    }

    if (!userPhone.value.trim() || !isPhoneValid(userPhone.value)) {
        userPhone.classList.add('callback-form-input-error');
        hasError = true;
    } else {
        userPhone.classList.remove('callback-form-input-error');
    }

    if (hasError) {
        return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${userName.value.trim()}`);
    const body = encodeURIComponent(
        `Name: ${userName.value.trim()}\nEmail: ${userEmail.value.trim()}\nPhone: ${userPhone.value.trim()}`
    );
    const mailtoUrl = `mailto:khutornyi3@gmail.com?subject=${subject}&body=${body}`;

    requestEmailLink.href = mailtoUrl;
    openModal(requestReceivedModal, document.activeElement);
    window.location.href = mailtoUrl;
});

function isPhoneValid(phone = '') {
    const regexp = /^(?:\+?38\s*)?\(?0\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/;

    return regexp.test(phone.trim());
}

function isEmailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}