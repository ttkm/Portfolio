// Main JavaScript file that initializes all modules

let currentSection = 0;
let isAnimating = false;
const sections = [];
let sectionCount = 0;
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let resizeTimer;

let lastWidth = window.innerWidth;
let wasMobile = window.innerWidth <= 768;
let hasInitializedMobile = false;

const isMobile = () => {
    return window.innerWidth <= 768;
};

document.addEventListener('DOMContentLoaded', () => {
    Viewport.init();
    Navigation.init();
    Navigation.initResponsive();
    
    document.querySelectorAll('section.section').forEach(section => {
        sections.push(section);
    });
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const currentIsMobile = isMobile();
            const wasDesktopBeforeResize = !wasMobile;
            
            Viewport.updateDimensions();
            Navigation.init();
            
            if (wasDesktopBeforeResize && currentIsMobile) {
                console.log('Transitioning from desktop to mobile');
                if (typeof FullpageScroll !== 'undefined' && FullpageScroll.resetScroll) {
                    FullpageScroll.resetScroll();
                }
                applyMobileStyles();
                enableMobileScrolling();
            } else if (wasMobile && !currentIsMobile) {
                console.log('Transitioning from mobile to desktop');
                resetMobileStyles();
                if (typeof FullpageScroll !== 'undefined' && FullpageScroll.init) {
                    FullpageScroll.init();
                }
            } else {
                if (currentIsMobile) {
                    applyMobileStyles();
                } else {
                    if (typeof FullpageScroll !== 'undefined' && FullpageScroll.init) {
                        FullpageScroll.init();
                    }
                }
            }
            
            wasMobile = currentIsMobile;
        }, 250);
    });
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            Viewport.updateDimensions();
            Navigation.init();
            
            if (isMobile()) {
                applyMobileStyles();
            } else {
                resetMobileStyles();
            }
        }, 100);
    });
});

const resetMobileStyles = () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.removeAttribute('style');
        
        const heroTitle = heroContent.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.removeAttribute('style');
            const titleScale = Math.min(Math.max(window.innerWidth / 1200, 0.7), 1.2);
            heroTitle.style.transform = `scale(${titleScale})`;
            heroTitle.style.transformOrigin = 'left top';
            
            const lines = heroTitle.querySelectorAll('.line');
            lines.forEach(line => {
                line.removeAttribute('style');
            });
        }
        
        const heroSubtitle = heroContent.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.removeAttribute('style');
            const subtitleScale = Math.min(Math.max(window.innerWidth / 1200, 0.8), 1.1);
            heroSubtitle.style.transform = `scale(${subtitleScale})`;
            heroSubtitle.style.transformOrigin = 'left top';
        }
    }
    
    document.body.style.overflow = 'hidden';
    
    document.body.offsetHeight;
};

const enableMobileScrolling = () => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.scrollBehavior = 'smooth';
    
    document.body.style.scrollbarWidth = 'none';
    document.body.style.msOverflowStyle = 'none';
    document.documentElement.style.scrollbarWidth = 'none';
    document.documentElement.style.msOverflowStyle = 'none';
    
    setTimeout(() => {
        window.scrollTo(0, 0);
        
        document.body.offsetHeight;

        document.querySelectorAll('section.section').forEach(section => {
            section.style.position = 'relative';
            section.style.top = 'auto';
            section.style.left = 'auto';
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.zIndex = 'auto';
            section.style.scrollbarWidth = 'none';
            section.style.msOverflowStyle = 'none';
            
            const animatedElements = section.querySelectorAll('[data-scroll]');
            animatedElements.forEach(el => {
                if (typeof gsap !== 'undefined') {
                    gsap.killTweensOf(el);
                    gsap.set(el, { clearProps: 'all' });
                }
            });
        });
        
        applyMobileStyles();
        
        if (typeof FullpageScroll !== 'undefined') {
            if (FullpageScroll.resetScroll) {
                FullpageScroll.resetScroll();
            }
            
            setupMobileHashNavigation();
        }
        
        hasInitializedMobile = true;
    }, 50);
};

const setupMobileHashNavigation = () => {
    document.querySelectorAll('.nav-item a, .section-indicator').forEach(el => {
        el.addEventListener('click', (e) => {
            if (!isMobile()) return;
            
            e.preventDefault();
            
            let targetId;
            let targetSection;
            
            if (el.classList.contains('section-indicator')) {
                const targetIndex = parseInt(el.getAttribute('data-index'));
                if (targetIndex >= 0 && targetIndex < sections.length) {
                    targetSection = sections[targetIndex];
                }
            } else {
                targetId = el.getAttribute('href');
                targetSection = document.querySelector(targetId);
            }
            
            if (targetSection) {
                const offset = 80;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                const menuToggle = document.querySelector('.menu-toggle');
                const mainNav = document.querySelector('.main-nav');
                
                if (menuToggle && menuToggle.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    if (mainNav) mainNav.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            }
        });
    });
};

const applyMobileStyles = () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.position = 'absolute';
        heroContent.style.top = '50%';
        heroContent.style.left = '50%';
        heroContent.style.transform = 'translate(-50%, -50%)';
        heroContent.style.width = '90%';
        heroContent.style.maxWidth = '100%';
        heroContent.style.textAlign = 'center';
        heroContent.style.display = 'flex';
        heroContent.style.flexDirection = 'column';
        heroContent.style.alignItems = 'center';
        heroContent.style.justifyContent = 'center';
        
        const heroTitle = heroContent.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.textAlign = 'center';
            heroTitle.style.width = '100%';
            heroTitle.style.display = 'block';
            heroTitle.style.margin = '0 auto 1.5rem auto';
            heroTitle.style.transform = 'none';
            
            const lines = heroTitle.querySelectorAll('.line');
            lines.forEach(line => {
                line.style.textAlign = 'center';
                line.style.width = '100%';
            });
        }
        
        const heroSubtitle = heroContent.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.style.textAlign = 'center';
            heroSubtitle.style.width = '100%';
            heroSubtitle.style.maxWidth = '100%';
            heroSubtitle.style.margin = '0 auto 2rem auto';
            heroSubtitle.style.transform = 'none';
        }
    }
};

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    if (isMobile()) {
        enableMobileScrolling();
        applyMobileStyles();
        setupMobileHashNavigation();
        
        const setVhProperty = () => {
            const vh = Math.max(window.innerHeight, document.documentElement.clientHeight, document.body.clientHeight) * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVhProperty();
        window.addEventListener('resize', setVhProperty);
        window.addEventListener('orientationchange', () => {
            setVhProperty();
            setTimeout(setVhProperty, 100);
            setTimeout(setVhProperty, 200);
        });
        
        let scrollThrottleTimer;
        window.addEventListener('scroll', () => {
            if (!scrollThrottleTimer) {
                scrollThrottleTimer = setTimeout(() => {
                    setVhProperty();
                    scrollThrottleTimer = null;
                }, 100);
            }
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                setVhProperty();
            }
        });
    } else {
        resetMobileStyles();
    }
    
    if (typeof ParticleSystem !== 'undefined' && ParticleSystem.init) {
        window.particleSystem = ParticleSystem.init();
    }
    
    if (typeof HeroAnimation !== 'undefined' && HeroAnimation.init) {
        HeroAnimation.init();
    }
    
    if (typeof AboutSection !== 'undefined' && AboutSection.initCanvas) {
        AboutSection.initCanvas();
    }
    
    if (document.querySelector('#lottie-container') && typeof lottie !== 'undefined') {
        lottie.loadAnimation({
            container: document.querySelector('#lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets2.lottiefiles.com/packages/lf20_iorpbol0.json'
        });
    }
    
    if (!isMobile()) {
        if (typeof FullpageScroll !== 'undefined' && FullpageScroll.init) {
            FullpageScroll.init();
        }
    }
    
    if (typeof SectionIndicators !== 'undefined' && SectionIndicators.init) {
        SectionIndicators.init();
    }
    
    setTimeout(() => {
        if (typeof ScrollAnimations !== 'undefined' && ScrollAnimations.init) {
            ScrollAnimations.init();
        }
    }, 100);
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = '1';
    }
});

window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    const currentIsMobile = isMobile();
    
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            if (currentIsMobile) {
                const offset = 80;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                const targetIndex = Array.from(document.querySelectorAll('section[data-scroll-section]')).indexOf(targetSection);
                if (targetIndex !== -1 && typeof FullpageScroll !== 'undefined' && FullpageScroll.navigateToSection) {
                    FullpageScroll.navigateToSection(targetIndex);
                }
            }
        }
    }
});

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

function setupCaptcha() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const thankYouMessage = document.querySelector('.thank-you-message');
    const captchaModal = document.querySelector('.captcha-modal');
    const closeCaptchaBtn = document.querySelector('.close-captcha');
    const verifyCaptchaBtn = document.getElementById('verifyCaptcha');
    const captchaAnswer = document.getElementById('captchaAnswer');
    const captchaNum1 = document.getElementById('captchaNum1');
    const captchaNum2 = document.getElementById('captchaNum2');
    
    let correctAnswer;
    let captchaVerified = false;
    let canSubmit = true;
    
    if (submitBtn && captchaModal) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!canSubmit) return;
            
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            
            showCaptcha();
        });
    }
    
    if (closeCaptchaBtn) {
        closeCaptchaBtn.addEventListener('click', function() {
            captchaModal.style.display = 'none';
        });
    }
    
    if (verifyCaptchaBtn && captchaAnswer) {
        verifyCaptchaBtn.addEventListener('click', function() {
            const userAnswer = parseInt(captchaAnswer.value, 10);
            
            if (userAnswer === correctAnswer) {
                captchaVerified = true;
                captchaModal.style.display = 'none';
                submitForm();
            } else {
                captchaAnswer.value = '';
                captchaAnswer.style.borderColor = '#ff6b6b';
                captchaAnswer.placeholder = 'Try again';
                generateCaptcha();
            }
        });
        
        captchaAnswer.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyCaptchaBtn.click();
            }
        });
    }
    
    function showCaptcha() {
        generateCaptcha();
        captchaModal.style.display = 'flex';
        captchaAnswer.value = '';
        captchaAnswer.style.borderColor = '';
        captchaAnswer.focus();
    }
    
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        
        captchaNum1.textContent = num1;
        captchaNum2.textContent = num2;
        
        correctAnswer = num1 + num2;
    }
    
    function submitForm() {
        if (!captchaVerified) return;
        
        canSubmit = false;
        submitBtn.classList.add('cooling-down');
        
        setTimeout(() => {
            contactForm.style.height = contactForm.offsetHeight + 'px';
            
            Array.from(contactForm.querySelectorAll('.form-group, .submit-btn')).forEach(el => {
                el.style.display = 'none';
            });
            
            thankYouMessage.style.display = 'block';
            
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.classList.remove('cooling-down');
                canSubmit = true;
            }, 30000);
        }, 1500);
    }
} 