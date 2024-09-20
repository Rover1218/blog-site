const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginClose = document.getElementById('loginClose');
const signupClose = document.getElementById('signupClose');

// Function to open a modal
function openModal(modal) {
    modal.style.display = 'block';
}

// Function to close a modal
function closeModal(modal) {
    modal.style.display = 'none';
}

// Open login modal
loginBtn.onclick = function () {
    openModal(loginModal);
};

// Open signup modal
signupBtn.onclick = function () {
    openModal(signupModal);
};

// Close login modal
loginClose.onclick = function () {
    closeModal(loginModal);
};

// Close signup modal
signupClose.onclick = function () {
    closeModal(signupModal);
};

// Close modals when clicking outside the content
window.onclick = function (event) {
    if (event.target === loginModal) {
        closeModal(loginModal);
    } else if (event.target === signupModal) {
        closeModal(signupModal);
    }
};