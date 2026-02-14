// ===================================
// AD POPUP FUNCTIONALITY
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Ad Popup Elements
    const adOverlay = document.getElementById('adOverlay');
    const skipButton = document.getElementById('skipButton');
    const countdownElement = document.getElementById('countdown');
    
    // Ad Popup Timer
    if (adOverlay && skipButton && countdownElement) {
        let countdown = 5;
        
        // Countdown timer
        const countdownInterval = setInterval(function() {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                skipButton.disabled = false;
                skipButton.querySelector('#skipText').textContent = 'Skip Ad';
                skipButton.style.cursor = 'pointer';
            }
        }, 1000);
        
        // Skip button click handler
        skipButton.addEventListener('click', function() {
            if (!skipButton.disabled) {
                adOverlay.classList.add('hidden');
            }
        });
    }
    
    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }
    
    // ===================================
    // HERO SEARCH FUNCTIONALITY
    // ===================================
    const heroSearchButton = document.getElementById('heroSearchButton');
    const heroSearchInput = document.getElementById('heroSearch');
    
    if (heroSearchButton && heroSearchInput) {
        heroSearchButton.addEventListener('click', function() {
            const searchTerm = heroSearchInput.value.trim();
            if (searchTerm) {
                // Store search term and redirect to directory
                sessionStorage.setItem('searchTerm', searchTerm);
                window.location.href = 'directory.html';
            } else {
                window.location.href = 'directory.html';
            }
        });
        
        // Allow Enter key to trigger search
        heroSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                heroSearchButton.click();
            }
        });
    }
    
    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ===================================
    // BACK TO TOP BUTTON
    // ===================================
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe step cards
    document.querySelectorAll('.step-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe feature items
    document.querySelectorAll('.feature-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
});