/**
 * ============================================
 * PROFESSIONAL PORTFOLIO - MAIN JAVASCRIPT
 * Author: Alex Morgan
 * Version: 1.0.0
 * ============================================
 */

'use strict';

// ============================================
// DOM CONTENT LOADED - MAIN INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Loader.init();
    ThemeManager.init();
    Navigation.init();
    CustomCursor.init();
    ScrollAnimations.init();
    TypeWriter.init();
    CounterAnimation.init();
    SkillBars.init();
    ProjectFilter.init();
    TestimonialsSlider.init();
    ContactForm.init();
    BackToTop.init();
    SmoothScroll.init();
    
    // Update current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// ============================================
// LOADER MODULE
// ============================================
const Loader = {
    loader: null,
    
    init() {
        this.loader = document.getElementById('loader');
        if (!this.loader) return;
        
        // Hide loader when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 500);
        });
        
        // Fallback: hide loader after 3 seconds
        setTimeout(() => {
            this.hide();
        }, 3000);
    },
    
    hide() {
        if (this.loader) {
            this.loader.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 500);
        }
    }
};

// ============================================
// THEME MANAGER MODULE
// ============================================
const ThemeManager = {
    toggle: null,
    theme: 'light',
    
    init() {
        this.toggle = document.getElementById('theme-toggle');
        if (!this.toggle) return;
        
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.applyTheme(this.theme);
        
        // Toggle event listener
        this.toggle.addEventListener('click', () => {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.applyTheme(this.theme);
            this.saveTheme();
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.theme);
            }
        });
    },
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.toggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    },
    
    saveTheme() {
        localStorage.setItem('theme', this.theme);
    }
};

// ============================================
// NAVIGATION MODULE
// ============================================
const Navigation = {
    header: null,
    navToggle: null,
    navMenu: null,
    navLinks: null,
    
    init() {
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (!this.header) return;
        
        // Scroll event for header background
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Mobile menu toggle
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
            
            // Close menu when pressing Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                    this.closeMenu();
                }
            });
        }
        
        // Active link on scroll
        this.setActiveLink();
        window.addEventListener('scroll', () => this.setActiveLink(), { passive: true });
    },
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    },
    
    toggleMenu() {
        const isOpen = this.navMenu.classList.contains('active');
        this.navMenu.classList.toggle('active');
        this.navToggle.setAttribute('aria-expanded', !isOpen);
        document.body.classList.toggle('menu-open', !isOpen);
    },
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    },
    
    setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
};

// ============================================
// CUSTOM CURSOR MODULE
// ============================================
const CustomCursor = {
    cursor: null,
    follower: null,
    
    init() {
        // Only initialize on desktop with hover capability
        if (window.innerWidth < 1024 || !matchMedia('(hover: hover)').matches) return;
        
        this.cursor = document.getElementById('cursor');
        this.follower = document.getElementById('cursor-follower');
        
        if (!this.cursor || !this.follower) return;
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;
        
        // Update mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Animate cursor with requestAnimationFrame
        const animateCursor = () => {
            // Cursor follows mouse directly
            cursorX = mouseX;
            cursorY = mouseY;
            
            // Follower has slight delay
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            this.cursor.style.left = `${cursorX}px`;
            this.cursor.style.top = `${cursorY}px`;
            this.follower.style.left = `${followerX}px`;
            this.follower.style.top = `${followerY}px`;
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
        
        // Add hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('active');
                this.follower.classList.add('active');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('active');
                this.follower.classList.remove('active');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.follower.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.follower.style.opacity = '1';
        });
    }
};

// ============================================
// SCROLL ANIMATIONS MODULE
// ============================================
const ScrollAnimations = {
    init() {
        const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right');
        
        if (!animatedElements.length) return;
        
        // Create Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
};

// ============================================
// TYPEWRITER MODULE
// ============================================
const TypeWriter = {
    element: null,
    words: ['Frontend Developer', 'React Developer', 'JavaScript Developer', 'Problem Solver'],
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    typeSpeed: 100,
    deleteSpeed: 50,
    pauseTime: 2000,
    
    init() {
        this.element = document.getElementById('typed-text');
        if (!this.element) return;
        
        this.type();
    },
    
    type() {
        const currentWord = this.words[this.wordIndex];
        
        if (this.isDeleting) {
            // Remove character
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            // Add character
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        // Determine typing speed
        let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        // If word is complete
        if (!this.isDeleting && this.charIndex === currentWord.length) {
            speed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            speed = 500;
        }
        
        setTimeout(() => this.type(), speed);
    }
};

// ============================================
// COUNTER ANIMATION MODULE
// ============================================
const CounterAnimation = {
    init() {
        const counters = document.querySelectorAll('[data-count]');
        
        if (!counters.length) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    },
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
};

// ============================================
// SKILL BARS MODULE
// ============================================
const SkillBars = {
    init() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (!skillBars.length) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute('data-progress');
                    entry.target.style.width = `${progress}%`;
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
};

// ============================================
// PROJECT FILTER MODULE
// ============================================
const ProjectFilter = {
    filterButtons: null,
    projects: null,
    
    init() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projects = document.querySelectorAll('.project-card');
        
        if (!this.filterButtons.length || !this.projects.length) return;
        
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.filterProjects(btn));
        });
    },
    
    filterProjects(activeBtn) {
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        
        const filter = activeBtn.getAttribute('data-filter');
        
        this.projects.forEach(project => {
            const category = project.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                project.classList.remove('hidden');
                project.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                project.classList.add('hidden');
            }
        });
    }
};

// Add CSS keyframes for filter animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// TESTIMONIALS SLIDER MODULE
// ============================================
const TestimonialsSlider = {
    track: null,
    cards: null,
    dots: null,
    prevBtn: null,
    nextBtn: null,
    currentIndex: 0,
    cardsToShow: 1,
    autoplayInterval: null,
    
    init() {
        this.track = document.getElementById('testimonials-track');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dotsContainer = document.getElementById('testimonials-dots');
        this.prevBtn = document.getElementById('testimonial-prev');
        this.nextBtn = document.getElementById('testimonial-next');
        
        if (!this.track || !this.cards.length) return;
        
        // Determine cards to show based on screen size
        this.updateCardsToShow();
        window.addEventListener('resize', () => this.updateCardsToShow());
        
        // Create dots
        this.createDots();
        
        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Touch support
        this.addTouchSupport();
        
        // Autoplay
        this.startAutoplay();
        
        // Pause on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.addEventListener('mouseleave', () => this.startAutoplay());
    },
    
    updateCardsToShow() {
        this.cardsToShow = window.innerWidth >= 768 ? 2 : 1;
        this.goToSlide(0);
        this.updateDots();
    },
    
    createDots() {
        if (!this.dotsContainer) return;
        
        const totalDots = Math.ceil(this.cards.length / this.cardsToShow);
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    },
    
    updateDots() {
        const dots = this.dotsContainer?.querySelectorAll('.testimonial-dot');
        if (!dots) return;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    },
    
    goToSlide(index) {
        const maxIndex = Math.ceil(this.cards.length / this.cardsToShow) - 1;
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(this.track).gap) || 24;
        const offset = this.currentIndex * (cardWidth + gap) * this.cardsToShow;
        
        this.track.style.transform = `translateX(-${offset}px)`;
        this.updateDots();
    },
    
    prev() {
        this.goToSlide(this.currentIndex - 1);
    },
    
    next() {
        const maxIndex = Math.ceil(this.cards.length / this.cardsToShow) - 1;
        if (this.currentIndex >= maxIndex) {
            this.goToSlide(0);
        } else {
            this.goToSlide(this.currentIndex + 1);
        }
    },
    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoplay();
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            this.startAutoplay();
        });
    },
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), 5000);
    },
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
};

// ============================================
// CONTACT FORM MODULE
// ============================================
const ContactForm = {
    form: null,
    submitBtn: null,
    
    init() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    },
    
    validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        let isValid = true;
        let errorMessage = '';
        
        // Remove previous error state
        field.classList.remove('error');
        
        // Required check
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Name validation (minimum length)
        if (field.id === 'name' && field.value && field.value.trim().length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        }
        
        // Message validation (minimum length)
        if (field.id === 'message' && field.value && field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }
        
        // Update UI
        if (!isValid) {
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        
        return isValid;
    },
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('.form-input');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            // Focus first error field
            const firstError = this.form.querySelector('.form-input.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }
        
        // Show loading state
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.classList.add('success');
            
            // Reset form after success
            setTimeout(() => {
                this.form.reset();
                this.submitBtn.classList.remove('success');
                this.submitBtn.disabled = false;
            }, 3000);
        }, 2000);
    }
};

// ============================================
// BACK TO TOP MODULE
// ============================================
const BackToTop = {
    button: null,
    
    init() {
        this.button = document.getElementById('back-to-top');
        if (!this.button) return;
        
        // Show/hide button on scroll
        window.addEventListener('scroll', () => this.toggleVisibility(), { passive: true });
        
        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },
    
    toggleVisibility() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
};

// ============================================
// SMOOTH SCROLL MODULE
// ============================================
const SmoothScroll = {
    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ============================================
// INTERSECTION OBSERVER POLYFILL CHECK
// ============================================
if (!('IntersectionObserver' in window)) {
    // Fallback: show all animated elements immediately
    document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right').forEach(el => {
        el.classList.add('animated');
    });
    
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = `${progress}%`;
    });
}

// ============================================
// PERFORMANCE: PASSIVE EVENT LISTENERS
// ============================================
// Already using { passive: true } for scroll events

// ============================================
// KEYBOARD NAVIGATION ENHANCEMENTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Skip link functionality
    if (e.key === 'Tab' && !e.shiftKey) {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink && document.activeElement === document.body) {
            skipLink.focus();
        }
    }
});

