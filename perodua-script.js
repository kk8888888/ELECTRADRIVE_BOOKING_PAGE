/* ============================================
   ElectraDrive EV - Perodua Style JavaScript
   Clean interactions for automotive website
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initModelCards();
    initFormValidation();
    initHeroVideoCarousel();
});

/* Hero Slide Carousel (Mixed Media) */
function initHeroVideoCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (!slides.length) return;

    let currentIndex = 0;
    const AUTO_SWITCH_DELAY = 8000; // 8 seconds

    function showSlide(index) {
        // Stop all slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (slide.tagName === 'VIDEO') {
                slide.pause();
            }
        });

        // Update indicators
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });

        // Show current slide
        slides[index].classList.add('active');

        // If it's a video, play it
        if (slides[index].tagName === 'VIDEO') {
            slides[index].currentTime = 0;
            slides[index].play().catch(() => { });
        }

        currentIndex = index;
    }

    // Set first slide as active
    showSlide(0);

    // Indicator clicks
    indicators.forEach((ind, index) => {
        ind.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-switch slides
    setInterval(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }, AUTO_SWITCH_DELAY);
}

/* Navbar Scroll Effect */

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menuToggle');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
        }
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
        });
    }
}

/* Smooth Scroll */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* Model Cards Interaction */
function initModelCards() {
    const modelCards = document.querySelectorAll('.model-card');

    modelCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(-8px)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(0)';
            }
        });

        // Click to select (Move the red border)
        card.addEventListener('click', () => {
            // Remove featured class from all cards
            modelCards.forEach(c => c.classList.remove('featured'));
            // Add to clicked card
            card.classList.add('featured');
            // Reset transforms for other cards
            modelCards.forEach(c => {
                if (!c.classList.contains('featured')) {
                    c.style.transform = 'translateY(0)';
                }
            });
        });
    });
}

/* Form Validation */
function initFormValidation() {
    const form = document.querySelector('.cta-form');

    if (form) {
        const submitBtn = form.querySelector('.btn');

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const inputs = form.querySelectorAll('.form-input');
            let isValid = true;

            inputs.forEach(input => {
                if (input.tagName === 'INPUT' && !input.value.trim()) {
                    input.style.border = '2px solid #ff4444';
                    isValid = false;
                } else {
                    input.style.border = 'none';
                }
            });

            if (isValid) {
                submitBtn.textContent = 'Booking Submitted!';
                submitBtn.style.background = '#00C853';

                setTimeout(() => {
                    alert('Thank you for your booking! Our team will contact you within 24 hours.');
                    inputs.forEach(input => {
                        if (input.tagName === 'INPUT') input.value = '';
                        if (input.tagName === 'SELECT') input.selectedIndex = 0;
                    });
                    submitBtn.textContent = 'Submit Booking';
                    submitBtn.style.background = '';
                }, 500);
            }
        });
    }
}

/* Scroll Animations */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.model-card, .service-card, .tech-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

/* Scroll-Triggered Video Preview */
const videoObserverOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    });
}, videoObserverOptions);

// Observe all scroll-triggered videos
document.querySelectorAll('.scroll-video').forEach(video => {
    videoObserver.observe(video);
});

console.log('ElectraDrive Perodua-Style Website Loaded 🚗');
