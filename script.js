// script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const slidesContainer = document.getElementById('slidesContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const currentSlideSpan = document.getElementById('currentSlide');
    const totalSlidesSpan = document.getElementById('totalSlides');
    const progressBar = document.getElementById('progressBar');
    const particlesContainer = document.getElementById('particles');

    // Variables
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let isFullscreen = false;
    const animations = ['animate-right', 'animate-left', 'animate-top', 'animate-bottom', 'animate-zoom', 'animate-rotate'];

    // Initialize
    totalSlidesSpan.textContent = totalSlides;
    createParticles();
    updateSlideIndicator();

    // Create floating particles
    function createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position
            const left = Math.random() * 100;
            const size = Math.random() * 3 + 1;
            const delay = Math.random() * 20;
            const duration = Math.random() * 20 + 10;
            const color = Math.random() > 0.5 ? 'var(--primary)' : 'var(--secondary)';
            
            particle.style.left = `${left}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = color;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
        }
    }

    // Get random animation
    function getRandomAnimation() {
        return animations[Math.floor(Math.random() * animations.length)];
    }

    // Navigation Functions
    function goToSlide(index) {
        // Get current and next slides
        const currentSlide = slides[currentSlideIndex];
        const nextSlide = slides[index];
        
        // Update index
        currentSlideIndex = Math.max(0, Math.min(index, totalSlides - 1));
        
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            // Remove all animation classes
            animations.forEach(anim => slide.classList.remove(anim));
        });
        
        // Add animation to next slide
        const animation = getRandomAnimation();
        nextSlide.classList.add(animation);
        
        // Add active class with delay for animation
        setTimeout(() => {
            nextSlide.classList.add('active');
        }, 10);
        
        // Update UI
        updateSlideIndicator();
    }

    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            goToSlide(currentSlideIndex + 1);
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            goToSlide(currentSlideIndex - 1);
        }
    }

    function goToFirstSlide() {
        goToSlide(0);
    }

    function goToLastSlide() {
        goToSlide(totalSlides - 1);
    }

    // Update slide indicator and progress
    function updateSlideIndicator() {
        currentSlideSpan.textContent = currentSlideIndex + 1;
        const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update floating elements position
        updateFloatingElements();
    }

    // Update floating elements
    function updateFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(el => {
            // Randomize animation duration slightly
            const duration = 15 + Math.random() * 10;
            el.style.animationDuration = `${duration}s`;
        });
    }

    // Fullscreen toggle
    function toggleFullscreen() {
        if (!isFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
            isFullscreen = true;
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            isFullscreen = false;
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                nextSlide();
                break;
                
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                prevSlide();
                break;
                
            case 'Home':
                e.preventDefault();
                goToFirstSlide();
                break;
                
            case 'End':
                e.preventDefault();
                goToLastSlide();
                break;
                
            case 'f':
            case 'F':
                e.preventDefault();
                toggleFullscreen();
                break;
                
            case 'Escape':
                if (isFullscreen) {
                    toggleFullscreen();
                }
                break;
                
            // Number keys for direct slide access
            case '1': goToSlide(0); break;
            case '2': goToSlide(1); break;
            case '3': goToSlide(2); break;
            case '4': goToSlide(3); break;
            case '5': goToSlide(4); break;
            case '6': goToSlide(5); break;
            case '7': goToSlide(6); break;
            case '8': goToSlide(7); break;
            case '9': goToSlide(8); break;
            case '0': goToSlide(9); break;
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }

    // Fullscreen change detection
    document.addEventListener('fullscreenchange', () => {
        isFullscreen = !!document.fullscreenElement;
        fullscreenBtn.innerHTML = isFullscreen ? 
            '<i class="fas fa-compress"></i>' : 
            '<i class="fas fa-expand"></i>';
    });

    document.addEventListener('webkitfullscreenchange', () => {
        isFullscreen = !!document.webkitFullscreenElement;
        fullscreenBtn.innerHTML = isFullscreen ? 
            '<i class="fas fa-compress"></i>' : 
            '<i class="fas fa-expand"></i>';
    });

    // Initialize first slide
    window.addEventListener('load', () => {
        // Show only first slide initially
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active', 'animate-zoom');
            } else {
                slide.classList.remove('active');
            }
        });
    });
});
