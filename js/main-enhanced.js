// PS Devworks - Ultimate Professional JavaScript
// Author: Claude AI | Version: 2.0

'use strict';

// ====================
// CONFIGURATION
// ====================

const CONFIG = {
    particleCount: 40,
    scrollRevealThreshold: 0.15,
    toastDuration: 4000,
    cookieBannerDelay: 2000,
    statsAnimationDuration: 2000
};

// ====================
// UTILITY FUNCTIONS
// ====================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const throttle = (func, delay) => {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
    };
};

const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

// ====================
// PRELOADER
// ====================

window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = $('#preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }, 2000);
});

// ====================
// CUSTOM CURSOR
// ====================

const initCustomCursor = () => {
    if (window.innerWidth < 768) return; // Disable on mobile
    
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    const animateCursor = () => {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // Expand cursor on hover
    $$('a, button, .glass-card, .portfolio-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(1.5)';
            cursorOutline.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorOutline.style.transform = 'scale(1)';
        });
    });
};

if (window.innerWidth >= 768) {
    initCustomCursor();
}

// ====================
// ENHANCED PARTICLES
// ====================

const createParticles = () => {
    const particlesContainer = $('#particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '-10px';
        
        const duration = Math.random() * 15 + 10;
        particle.style.animation = `float ${duration}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        const colors = ['#00eaff', '#8a2be2', '#ff006e'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
    }
};

createParticles();

// ====================
// SCROLL PROGRESS
// ====================

const updateScrollProgress = () => {
    const scrollProgress = $('#scrollProgress');
    if (!scrollProgress) return;
    
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    scrollProgress.style.width = scrolled + '%';
};

window.addEventListener('scroll', throttle(updateScrollProgress, 10));

// ====================
// NAVBAR SCROLL EFFECT
// ====================

const navbar = $('#navbar');

const handleNavbarScroll = () => {
    if (!navbar) return;
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', throttle(handleNavbarScroll, 10));

// ====================
// MOBILE MENU
// ====================

const mobileMenuBtn = $('#mobileMenuBtn');
const mobileMenu = $('#mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close on link click
    $$('.mobile-nav-links .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close on outside click
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ====================
// THEME TOGGLE
// ====================

const themeToggle = $('#themeToggle');

if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('.theme-icon');
        
        if (document.body.classList.contains('light-mode')) {
            icon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
            showToast('Light mode activated', 'success');
        } else {
            icon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
            showToast('Dark mode activated', 'success');
        }
    });
}

// ====================
// STATS COUNTER ANIMATION
// ====================

const animateStats = () => {
    const counters = $$('.counter');
    if (counters.length === 0) return;
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = CONFIG.statsAnimationDuration;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
};

// ====================
// SCROLL REVEAL ANIMATIONS
// ====================

const revealOnScroll = () => {
    const reveals = $$('.reveal-on-scroll, .glass-card, .section-title, .section-subtitle');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = CONFIG.scrollRevealThreshold * window.innerHeight;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed', 'reveal');
        }
    });
};

window.addEventListener('scroll', throttle(revealOnScroll, 100));
window.addEventListener('load', revealOnScroll);

// Stats animation observer
const statsSection = $('.stats-grid');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// ====================
// SMOOTH SCROLL
// ====================

$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = $(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ====================
// ACTIVE NAVIGATION LINK
// ====================

const updateActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = $$('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
};

updateActiveNavLink();

// ====================
// PORTFOLIO FILTER
// ====================

const initPortfolioFilter = () => {
    const filterButtons = $$('.filter-btn');
    const portfolioCards = $$('.portfolio-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            // Filter items with animation
            portfolioCards.forEach((card, index) => {
                setTimeout(() => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px) scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }, index * 50);
            });
        });
    });
};

initPortfolioFilter();

// ====================
// FORM HANDLING
// ====================

const contactForm = $('#contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const email = this.querySelector('input[type="email"]');
        const message = this.querySelector('textarea');
        
        if (!email.value || !message.value) {
            e.preventDefault();
            showToast('Please fill in all required fields', 'error');
            return false;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Form will submit to Formspree
    });
}

// ====================
// TOAST NOTIFICATIONS
// ====================

const showToast = (message, type = 'success') => {
    const existingToast = $('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, CONFIG.toastDuration);
};

// ====================
// BACK TO TOP BUTTON
// ====================

const initBackToTop = () => {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    document.body.appendChild(backToTop);
    
    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    };
    
    window.addEventListener('scroll', throttle(toggleBackToTop, 100));
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

initBackToTop();

// ====================
// COOKIE CONSENT BANNER
// ====================

const initCookieBanner = () => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (cookieConsent) return;
    
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <p class="cookie-text">We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.</p>
            <div class="cookie-buttons">
                <button class="btn-secondary" style="padding: 0.75rem 1.5rem;" id="rejectCookies">Decline</button>
                <button class="btn-primary" style="padding: 0.75rem 1.5rem;" id="acceptCookies">Accept</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    setTimeout(() => banner.classList.add('show'), CONFIG.cookieBannerDelay);
    
    $('#acceptCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 400);
        showToast('Cookie preferences saved', 'success');
    });
    
    $('#rejectCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 400);
        showToast('Cookie preferences saved', 'success');
    });
};

setTimeout(initCookieBanner, 1000);

// ====================
// BUTTON ANIMATIONS
// ====================

$$('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.classList.contains('no-animation')) return;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = e.clientX - rect.left + 'px';
        ripple.style.top = e.clientY - rect.top + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.width = '300px';
            ripple.style.height = '300px';
            ripple.style.opacity = '0';
            ripple.style.transition = 'all 0.6s ease';
        }, 10);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ====================
// PAGE LOAD ANIMATIONS
// ====================

const initPageAnimations = () => {
    // Stagger animation for cards
    const cards = $$('.glass-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('reveal-on-scroll');
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageAnimations);
} else {
    initPageAnimations();
}

// ====================
// PARALLAX EFFECT
// ====================

const initParallax = () => {
    const heroSection = $('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.scrollY;
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }, 10));
};

if (window.innerWidth >= 768) {
    initParallax();
}

// ====================
// LAZY LOADING IMAGES
// ====================

const initLazyLoading = () => {
    const images = $$('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

initLazyLoading();

// ====================
// CONSOLE MESSAGE
// ====================

console.log(
    '%c⚡ PS Devworks - Ultimate Website',
    'color: #00eaff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(0, 234, 255, 0.5);'
);

console.log(
    '%cBuilt with cutting-edge technology\n' +
    'Version: 2.0 | Status: ✓ Loaded Successfully',
    'color: #8a2be2; font-size: 14px;'
);

// ====================
// ERROR HANDLING
// ====================

window.addEventListener('error', (e) => {
    console.error('Error caught:', e.message);
});

// ====================
// PERFORMANCE MONITORING
// ====================

window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`%cPage Load Time: ${pageLoadTime}ms`, 'color: #22c55e; font-weight: bold;');
    }
});

// ====================
// SERVICE WORKER (Optional)
// ====================

if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js').then(() => {
    //     console.log('Service Worker registered');
    // });
}

// ====================
// EXPORT FOR TESTING
// ====================

window.PSDevworks = {
    showToast,
    revealOnScroll,
    updateActiveNavLink,
    animateStats
};
