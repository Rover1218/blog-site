const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginClose = document.getElementById('loginClose');
const signupClose = document.getElementById('signupClose');

// Get the toggle links for switching between modals
const openSignupModal = document.getElementById('openSignupModal');
const openLoginModal = document.getElementById('openLoginModal');

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

// Toggle from login modal to signup modal
openSignupModal.onclick = function () {
    closeModal(loginModal); // Close login modal
    openModal(signupModal); // Open signup modal
};

// Toggle from signup modal to login modal
openLoginModal.onclick = function () {
    closeModal(signupModal); // Close signup modal
    openModal(loginModal); // Open login modal
};