/* ============================================
   ElectraDrive EV - JavaScript Interactions
   Professional 3D Animation Website
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initPreloader();
    initNavbar();
    initSmoothScroll();
    initVideoPlayer();
    initTechCards();
    initScrollAnimations();
    init3DEffects();
});

/* Preloader */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 1000);
    });
}

/* Navbar Scroll Effect */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');

    // Scroll effect
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            // Add mobile menu logic here if needed
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

/* Video Carousel with Auto-Play Animation */
function initVideoPlayer() {
    const slides = document.querySelectorAll('.video-slide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carousel = document.querySelector('.video-carousel');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoPlayInterval;
    let isHovering = false;
    const AUTO_PLAY_DELAY = 6000; // 6 seconds per slide

    // Function to show a specific slide with animation
    function showSlide(index, direction = 'next') {
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[index];

        // Pause all videos
        slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });

        // Animate out current slide
        if (currentSlide && currentIndex !== index) {
            currentSlide.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
            setTimeout(() => {
                currentSlide.classList.remove('active', 'slide-out-left', 'slide-out-right');
            }, 500);
        }

        // Animate in next slide
        nextSlide.classList.add('active', direction === 'next' ? 'slide-in-right' : 'slide-in-left');
        setTimeout(() => {
            nextSlide.classList.remove('slide-in-right', 'slide-in-left');
        }, 500);

        // Auto-play video on active slide
        const activeVideo = nextSlide.querySelector('video');
        if (activeVideo) {
            activeVideo.play().catch(() => { });
        }

        // Update thumbnails with animation
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
            if (i === index) {
                thumb.style.transform = 'translateY(-5px) scale(1.05)';
            } else {
                thumb.style.transform = '';
            }
        });

        // Update dots with progress animation
        dots.forEach((dot, i) => {
            dot.classList.remove('active', 'animating');
            if (i === index) {
                dot.classList.add('active', 'animating');
            }
        });

        currentIndex = index;
    }

    // Next slide with animation direction
    function nextSlide() {
        const newIndex = (currentIndex + 1) % slides.length;
        showSlide(newIndex, 'next');
        resetAutoPlay();
    }

    // Previous slide with animation direction
    function prevSlide() {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(newIndex, 'prev');
        resetAutoPlay();
    }

    // Auto-play functionality
    function startAutoPlay() {
        if (!isHovering) {
            autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
        }
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Thumbnail clicks
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            const direction = index > currentIndex ? 'next' : 'prev';
            showSlide(index, direction);
            resetAutoPlay();
        });
    });

    // Dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const direction = index > currentIndex ? 'next' : 'prev';
            showSlide(index, direction);
            resetAutoPlay();
        });
    });

    // Pause auto-play on hover
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            isHovering = true;
            stopAutoPlay();
        });

        carousel.addEventListener('mouseleave', () => {
            isHovering = false;
            startAutoPlay();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left = next
            } else {
                prevSlide(); // Swipe right = prev
            }
        }
    }

    // Initialize first slide and start auto-play
    showSlide(0, 'next');
    startAutoPlay();
}



/* Technology Cards Interaction */
function initTechCards() {
    const techCards = document.querySelectorAll('.tech-card');
    const hotspots = document.querySelectorAll('.hotspot');

    // Card click interaction
    techCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active from all cards
            techCards.forEach(c => c.classList.remove('active'));
            // Add active to clicked card
            card.classList.add('active');

            // Highlight corresponding hotspot
            const target = card.dataset.target;
            hotspots.forEach(hotspot => {
                if (hotspot.dataset.info === target) {
                    hotspot.classList.add('active');
                } else {
                    hotspot.classList.remove('active');
                }
            });
        });
    });

    // Hotspot hover interaction
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('mouseenter', () => {
            const info = hotspot.dataset.info;
            techCards.forEach(card => {
                if (card.dataset.target === info) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        });
    });
}

/* Scroll Animations with Intersection Observer */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate children with stagger
                const children = entry.target.querySelectorAll('[data-animate]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section-container').forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.classList.add('animate-on-scroll');
        observer.observe(card);
    });

    // Observe spec categories
    document.querySelectorAll('.spec-category').forEach(spec => {
        spec.classList.add('animate-on-scroll');
        observer.observe(spec);
    });
}

/* 3D Tilt Effects */
function init3DEffects() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Parallax effect on hero
    const heroVideo = document.getElementById('heroVideo');

    if (heroVideo) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            heroVideo.style.transform = `translateY(${rate}px)`;
        });
    }

    // Mouse move parallax on tech image
    const techImage = document.getElementById('techImage');

    if (techImage) {
        const container = techImage.closest('.tech-image-container');

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            techImage.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
        });

        container.addEventListener('mouseleave', () => {
            techImage.style.transform = 'scale(1) translate(0, 0)';
        });
    }
}

/* Add animation styles dynamically */
const animationStyles = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hotspot.active .hotspot-dot {
        background: #00ff88;
        transform: translate(-50%, -50%) scale(1.5);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

/* Utility: Throttle function for performance */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* Utility: Debounce function */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

console.log('ElectraDrive Website Initialized ⚡');
