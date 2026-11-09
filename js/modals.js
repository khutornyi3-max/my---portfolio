const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
const myVideoBtn = document.querySelector('#my-video-btn');
const myVideoModal = document.querySelector('#my-video-modal');
const video = myVideoModal.querySelector('video');
const videoPlaybackMessage = document.querySelector('#video-playback-message');
const MODAL_ACTIVE_CLASS = 'modal-active';
const BODY_SCROLL_DISABLE_CLASS = 'body-scroll-disable';

let lastFocusedElement = null;

document.querySelectorAll('.modal').forEach((modal) => {
    modal.setAttribute('aria-hidden', 'true');
});

document.querySelectorAll('.modal-area-bgd').forEach((modal) => {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });
});

document.querySelectorAll('.modal-area-content').forEach((content) => {
    content.addEventListener('click', (event) => event.stopPropagation());
});

document.querySelectorAll('.modal-close-btn').forEach((button) => {
    button.addEventListener('click', hideModal);
});

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        openModal(document.querySelector('#mobile-menu'), mobileMenuBtn);
    });
}

if (myVideoBtn) {
    myVideoBtn.addEventListener('click', () => {
        openModal(myVideoModal, myVideoBtn);
        videoPlaybackMessage.hidden = true;

        const playback = video.play();
        if (playback && typeof playback.catch === 'function') {
            playback.catch((error) => {
                videoPlaybackMessage.hidden = false;
                if (error.name !== 'NotAllowedError') {
                    console.error('Unable to play the introduction video.', error);
                }
            });
        }
    });
}

video.addEventListener('error', () => {
    videoPlaybackMessage.hidden = false;
    console.error('Unable to load the introduction video.', video.error);
});

document.addEventListener('keydown', (event) => {
    const activeModal = document.querySelector(`.${MODAL_ACTIVE_CLASS}`);
    if (event.key === 'Escape') {
        hideModal();
        return;
    }

    if (event.key !== 'Tab' || !activeModal) {
        return;
    }

    const focusableElements = activeModal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements.length) {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && (document.activeElement === firstElement || !activeModal.contains(document.activeElement))) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && (document.activeElement === lastElement || !activeModal.contains(document.activeElement))) {
        event.preventDefault();
        firstElement.focus();
    }
});

document.querySelectorAll('#mobile-menu .mobile-menu-item').forEach((item) => {
    item.addEventListener('click', () => {
        window.setTimeout(hideModal, 150);
    });
});

function openModal(modal, trigger) {
    if (!modal) {
        return;
    }

    const activeModal = document.querySelector(`.${MODAL_ACTIVE_CLASS}`);
    if (activeModal && activeModal !== modal) {
        hideModal();
    }

    lastFocusedElement = trigger || document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add(MODAL_ACTIVE_CLASS);
    document.body.classList.add(BODY_SCROLL_DISABLE_CLASS);
    if (modal.id === 'mobile-menu') {
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    const closeButton = modal.querySelector('.modal-close-btn');
    if (closeButton) {
        closeButton.focus();
    }
}

function hideModal() {
    const modal = document.querySelector(`.${MODAL_ACTIVE_CLASS}`);
    if (!modal) {
        return;
    }

    modal.classList.remove(MODAL_ACTIVE_CLASS);
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove(BODY_SCROLL_DISABLE_CLASS);
    if (modal.id === 'mobile-menu') {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    if (modal === myVideoModal) {
        video.pause();
        if (video.readyState > 0) {
            video.currentTime = 0;
        }
        videoPlaybackMessage.hidden = true;
    }

    if (lastFocusedElement && lastFocusedElement.isConnected) {
        lastFocusedElement.focus();
    }
    lastFocusedElement = null;
}
