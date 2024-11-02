document.addEventListener('DOMContentLoaded', function () {
    // Loader handling
    window.addEventListener('load', function () {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
            document.body.classList.remove('loading');
        }
        // Trigger post animations
        animatePosts();
    });

    // Post animation on scroll
    function animatePosts() {
        const posts = document.querySelectorAll('.post');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        posts.forEach(post => observer.observe(post));
    }

    // Modal animations
    function setupModals() {
        const modals = document.querySelectorAll('.modal');
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const closeButtons = document.querySelectorAll('.modal-close');

        function showModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                setTimeout(() => modal.classList.add('show'), 10);
            }
        }

        function hideModal(modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }

        if (loginBtn) loginBtn.addEventListener('click', () => showModal('loginModal'));
        if (signupBtn) signupBtn.addEventListener('click', () => showModal('signupModal'));

        closeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const modal = this.closest('.modal');
                hideModal(modal);
            });
        });
    }

    // Floating images hover effect
    function setupFloatingImages() {
        const floatingImages = document.querySelectorAll('.floating-image');
        floatingImages.forEach((img, index) => {
            img.style.setProperty('--i', index);
            img.addEventListener('mouseover', function () {
                this.style.animationPlayState = 'paused';
            });
            img.addEventListener('mouseout', function () {
                this.style.animationPlayState = 'running';
            });
        });
    }

    // Initialize all animations
    setupModals();
    setupFloatingImages();
});