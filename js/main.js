// Main JavaScript file that initializes all modules

let currentSection = 0;
let isAnimating = false;
const sections = [];
let sectionCount = 0;
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let resizeTimer;

const isMobile = () => {
    return Viewport.isMobile();
};

document.addEventListener('DOMContentLoaded', () => {
    Viewport.init();
    Navigation.init();
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            Viewport.updateDimensions();
            Navigation.init();
            
            if (isMobile()) {
                applyMobileStyles();
            }
        }, 250);
    });
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            Viewport.updateDimensions();
            Navigation.init();
            
            if (isMobile()) {
                applyMobileStyles();
            }
        }, 100);
    });
});

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
    
    const cursor = document.querySelector('.cursor');
    if (cursor) cursor.style.display = 'none';
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        if (isMobile()) {
            applyMobileStyles();
        } else {
            heroContent.style.position = 'relative';
            heroContent.style.left = '0';
            heroContent.style.top = 'auto';
            heroContent.style.transform = 'none';
            heroContent.style.margin = '0';
            heroContent.style.removeProperty('xPercent');
            heroContent.style.removeProperty('yPercent');
        }
    }
    
    if (typeof ParticleSystem !== 'undefined' && ParticleSystem.init) {
        window.particleSystem = ParticleSystem.init();
    }
    
    if (typeof HeroAnimation !== 'undefined' && HeroAnimation.init) {
        HeroAnimation.init();
    }
    
    if (typeof ProjectsInteraction !== 'undefined' && ProjectsInteraction.init) {
        ProjectsInteraction.init();
    }
    
    if (typeof Navigation !== 'undefined' && Navigation.initResponsive) {
        Navigation.initResponsive();
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
    
    if (typeof FullpageScroll !== 'undefined' && FullpageScroll.init) {
        FullpageScroll.init();
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
    
    if (isMobile()) {
        setTimeout(applyMobileStyles, 100);
        
        const setVhProperty = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVhProperty();
        window.addEventListener('resize', setVhProperty);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVhProperty, 100);
        });
        
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash) {
            if (isMobile()) {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    const offset = 80;
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    requestAnimationFrame(() => {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    });
                }
            } else {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    const targetIndex = sections.indexOf(targetSection);
                    if (targetIndex !== -1 && typeof FullpageScroll !== 'undefined' && FullpageScroll.navigateToSection) {
                        FullpageScroll.navigateToSection(targetIndex);
                    }
                }
            }
        }
    });
}); 