
const initMobileGlobe = () => {
    const globeContainer = document.querySelector('.globe-container');
    if (!globeContainer) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let isTouching = false;

    globeContainer.addEventListener('touchstart', (e) => {
        isTouching = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        
        e.preventDefault();
    }, { passive: false });

    globeContainer.addEventListener('touchmove', (e) => {
        if (!isTouching) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;

        if (window.earth) {
            window.earth.rotation.y += deltaX * 0.005;
            window.earth.rotation.x += deltaY * 0.005;
        }

        touchStartX = touchX;
        touchStartY = touchY;
        
        e.preventDefault();
    }, { passive: false });

    globeContainer.addEventListener('touchend', () => {
        isTouching = false;
    });
};

const initMobileAnimations = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });

    document.querySelectorAll('.visible').forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });
};

const initMobileHero = () => {
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroFooter = document.querySelector('.hero-footer');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!heroSection) return;

    const updateViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        const height = window.innerHeight;
        heroSection.style.height = `${height}px`;
        heroSection.style.minHeight = `${height}px`;
        
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isLandscape) {
            if (heroContent) {
                heroContent.style.paddingTop = '0';
                heroContent.style.paddingBottom = '0';
            }
            
            if (heroFooter) {
                heroFooter.style.position = 'relative';
                heroFooter.style.bottom = 'auto';
                heroFooter.style.marginTop = '2rem';
            }
            
            if (scrollIndicator) {
                scrollIndicator.style.display = 'none';
            }
        } else {
            if (heroContent) {
                const paddingTop = Math.max(height * 0.25, 80);
                heroContent.style.paddingTop = `${paddingTop}px`;
            }
            
            if (heroFooter) {
                heroFooter.style.position = 'absolute';
                
                const footerBottom = Math.max(height * 0.05, 20);
                heroFooter.style.bottom = `${footerBottom}px`;
            }
            
            if (scrollIndicator && heroFooter) {
                const indicatorBottom = Math.max(height * 0.2, 80);
                scrollIndicator.style.bottom = `${indicatorBottom}px`;
                scrollIndicator.style.display = 'flex';
                scrollIndicator.style.zIndex = '3';
            }
        }
    };

    window.addEventListener('orientationchange', () => {
        setTimeout(updateViewportHeight, 100);
    });

    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(updateViewportHeight, 150);
    });

    window.addEventListener('scroll', () => {
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(updateViewportHeight, 150);
    });

    updateViewportHeight();

    gsap.from('.hero-title .line', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out'
    });

    gsap.from('.hero-footer', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out'
    });
};

const initMobileResponsiveness = () => {
    const updateLayout = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        const heroSection = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        const heroFooter = document.querySelector('.hero-footer');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (heroSection) {
            const height = window.innerHeight;
            heroSection.style.height = `${height}px`;
            heroSection.style.minHeight = `${height}px`;
            
            const isLandscape = window.innerWidth > window.innerHeight;
            const isSmallScreen = window.innerWidth <= 480;
            
            if (isLandscape) {
                if (heroContent) {
                    heroContent.style.paddingTop = '0';
                }
                
                if (heroFooter) {
                    heroFooter.style.position = 'relative';
                    heroFooter.style.bottom = 'auto';
                    heroFooter.style.marginTop = '2rem';
                }
                
                if (scrollIndicator) {
                    scrollIndicator.style.display = 'none';
                }
            } else {
                if (heroContent) {
                    const paddingTop = Math.max(height * 0.25, 80);
                    heroContent.style.paddingTop = `${paddingTop}px`;
                }
                
                if (heroFooter) {
                    heroFooter.style.position = 'absolute';
                    
                    let footerBottom;
                    if (isSmallScreen) {
                        footerBottom = Math.max(height * 0.05, 20);
                    } else {
                        footerBottom = Math.max(height * 0.05, 20);
                    }
                    
                    heroFooter.style.bottom = `${footerBottom}px`;
                }
                
                if (scrollIndicator) {
                    let indicatorBottom;
                    if (isSmallScreen) {
                        indicatorBottom = Math.max(height * 0.25, 100);
                    } else {
                        indicatorBottom = Math.max(height * 0.2, 80);
                    }
                    
                    scrollIndicator.style.bottom = `${indicatorBottom}px`;
                    scrollIndicator.style.display = 'flex';
                    scrollIndicator.style.zIndex = '3';
                }
            }
        }

        // Update globe section gradient
        const globeSection = document.querySelector('.globe-section');
        if (globeSection) {
            globeSection.style.background = 'linear-gradient(180deg, rgba(0,0,0,1) 0%, var(--color-bg) 30%)';
        }

        const globeContainer = document.querySelector('.globe-container');
        if (globeContainer) {
            const width = window.innerWidth;
            if (width <= 480) {
                globeContainer.style.height = '250px';
            } else if (width <= 768) {
                globeContainer.style.height = '300px';
            }
        }
    };

    window.addEventListener('orientationchange', () => {
        setTimeout(updateLayout, 100);
    });

    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(updateLayout, 150);
    });

    window.addEventListener('scroll', () => {
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(updateLayout, 150);
    });
    
    updateLayout();
};

const initMobile = () => {
    document.body.removeAttribute('data-scroll-container');
    document.querySelector('main')?.removeAttribute('data-scroll');
    document.querySelectorAll('[data-scroll-section]').forEach(el => {
        el.removeAttribute('data-scroll-section');
    });
    document.querySelectorAll('[data-scroll]').forEach(el => {
        el.removeAttribute('data-scroll');
    });
    document.querySelectorAll('[data-scroll-speed]').forEach(el => {
        el.removeAttribute('data-scroll-speed');
    });

    document.body.classList.add('mobile-view');

    initMobileGlobe();
    initMobileAnimations();
    initMobileHero();
    initMobileResponsiveness();
};

const checkMobile = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && !document.body.classList.contains('mobile-view')) {
        initMobile();
    } else if (!isMobile && document.body.classList.contains('mobile-view')) {
        window.location.reload();
    }
};

document.addEventListener('DOMContentLoaded', checkMobile);
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(checkMobile, 250);
}); 