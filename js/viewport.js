// Viewport module to handle screen dimensions and responsive adjustments

const Viewport = (() => {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let initialHeight = window.innerHeight;
    let resizeTimer;
    let currentBreakpoint = viewportWidth <= 768 ? 'mobile' : 'desktop';
    let isMobile = window.innerWidth <= 768;
    let isScrolling = false;
    let isInitialLoad = true;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const setVhVariable = () => {
        let vh = viewportHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    const lockViewportHeight = () => {
        if (isMobileDevice) {
            // Set locked height
            document.documentElement.style.setProperty('--locked-vh', `${initialHeight}px`);
            
            // Set fixed height on sections to prevent resize on URL bar show/hide
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                if (section.id === 'home') {
                    section.style.height = `${initialHeight}px`;
                    section.style.minHeight = `${initialHeight}px`;
                    section.style.maxHeight = `${initialHeight}px`;
                } else {
                    section.style.minHeight = `${initialHeight}px`;
                }
            });
            
            // Fix navigation height
            const mainNav = document.querySelector('.main-nav');
            if (mainNav) {
                mainNav.style.height = `${initialHeight}px`;
            }
        }
    };
    
    const updateDimensions = () => {
        if (isScrolling) return;
        
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // On initial load, set the height and don't update it unless there's a significant change
        if (isInitialLoad) {
            viewportHeight = initialHeight;
            document.documentElement.style.setProperty('--vh', `${viewportHeight * 0.01}px`);
            document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
            document.documentElement.style.setProperty('--locked-vh', `${initialHeight}px`);
            isInitialLoad = false;
            lockViewportHeight();
            return;
        }
        
        // Only update if width changed or height changed significantly (more than 200px)
        if (newWidth !== viewportWidth || Math.abs(newHeight - initialHeight) > 200) {
            viewportWidth = newWidth;
            viewportHeight = newHeight;
            
            // Only update initialHeight on significant changes
            if (Math.abs(newHeight - initialHeight) > 200 || newWidth !== viewportWidth) {
                initialHeight = newHeight;
                document.documentElement.style.setProperty('--locked-vh', `${initialHeight}px`);
            }
            
            let vh = viewportHeight * 0.01;
            let vw = viewportWidth * 0.01;
            
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            document.documentElement.style.setProperty('--vw', `${vw}px`);
            document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
            document.documentElement.style.setProperty('--viewport-width', `${viewportWidth}px`);
            
            if (viewportWidth <= 480) {
                document.documentElement.style.setProperty('--container-width', 'var(--container-width-sm)');
            } else if (viewportWidth <= 992) {
                document.documentElement.style.setProperty('--container-width', 'var(--container-width-md)');
            } else {
                document.documentElement.style.setProperty('--container-width', 'var(--container-width-lg)');
            }
            
            const newBreakpoint = viewportWidth <= 768 ? 'mobile' : 'desktop';
            const breakpointChanged = currentBreakpoint !== newBreakpoint;
            currentBreakpoint = newBreakpoint;
            isMobile = newBreakpoint === 'mobile';
            
            adjustContentSizes(breakpointChanged);
            lockViewportHeight();
        }
    };
    
    const ignoreUrlBarChanges = () => {
        // Don't update viewport height during scrolling when URL bar shows/hides
        if (initialHeight && Math.abs(window.innerHeight - initialHeight) < 150) {
            document.documentElement.style.setProperty('--vh', `${initialHeight * 0.01}px`);
        }
    };
    
    const adjustContentSizes = (breakpointChanged = false) => {
        const heroSection = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (heroSection) {
            if (isMobile) {
                heroSection.style.height = `${initialHeight}px`;
                heroSection.style.minHeight = `${initialHeight}px`;
                heroSection.style.position = 'relative';
                heroSection.style.top = '0';
                heroSection.style.left = '0';
                heroSection.style.width = '100%';
                heroSection.style.zIndex = '1';
            } else {
                heroSection.style.height = `${viewportHeight}px`;
                heroSection.style.minHeight = `${viewportHeight}px`;
                heroSection.style.position = 'absolute';
            }
            
            if (isMobile) {
                if (heroContent) {
                    heroContent.style.transform = 'translate(-50%, -50%)';
                    heroContent.style.position = 'absolute';
                    heroContent.style.top = '50%';
                    heroContent.style.left = '50%';
                    heroContent.style.width = '90%';
                    heroContent.style.maxWidth = '100%';
                    heroContent.style.textAlign = 'center';
                    
                    const heroTitle = heroContent.querySelector('.hero-title');
                    const heroSubtitle = heroContent.querySelector('.hero-subtitle');
                    
                    if (heroTitle) {
                        heroTitle.style.transform = 'none';
                        heroTitle.style.transformOrigin = 'center';
                        heroTitle.style.textAlign = 'center';
                        heroTitle.style.width = '100%';
                        
                        const lines = heroTitle.querySelectorAll('.line');
                        lines.forEach(line => {
                            line.style.textAlign = 'center';
                            line.style.width = '100%';
                        });
                    }
                    
                    if (heroSubtitle) {
                        heroSubtitle.style.transform = 'none';
                        heroSubtitle.style.transformOrigin = 'center';
                        heroSubtitle.style.textAlign = 'center';
                        heroSubtitle.style.width = '100%';
                        heroSubtitle.style.maxWidth = '100%';
                        heroSubtitle.style.margin = '0 auto 2rem auto';
                    }
                }
            } else {
                if (breakpointChanged && heroContent) {
                    heroContent.removeAttribute('style');
                    
                    const heroTitle = heroContent.querySelector('.hero-title');
                    const heroSubtitle = heroContent.querySelector('.hero-subtitle');
                    
                    if (heroTitle) {
                        heroTitle.removeAttribute('style');
                        
                        const lines = heroTitle.querySelectorAll('.line');
                        lines.forEach(line => {
                            line.removeAttribute('style');
                        });
                    }
                    
                    if (heroSubtitle) {
                        heroSubtitle.removeAttribute('style');
                    }
                }
                
                if (heroContent) {
                    const titleScale = Math.min(Math.max(viewportWidth / 1200, 0.7), 1.2);
                    const subtitleScale = Math.min(Math.max(viewportWidth / 1200, 0.8), 1.1);
                    
                    const heroTitle = heroContent.querySelector('.hero-title');
                    const heroSubtitle = heroContent.querySelector('.hero-subtitle');
                    
                    if (heroTitle) {
                        heroTitle.style.transform = `scale(${titleScale})`;
                        heroTitle.style.transformOrigin = 'left top';
                    }
                    
                    if (heroSubtitle) {
                        heroSubtitle.style.transform = `scale(${subtitleScale})`;
                        heroSubtitle.style.transformOrigin = 'left top';
                    }
                }
            }
        }
        
        const aboutSection = document.querySelector('#about.about');
        const aboutContent = document.querySelector('.about-content');
        
        if (aboutSection) {
            if (isMobile) {
                aboutSection.style.height = 'auto';
                aboutSection.style.minHeight = `${initialHeight}px`;
                aboutSection.style.position = 'relative';
                aboutSection.style.top = 'auto';
                aboutSection.style.left = 'auto';
                aboutSection.style.width = '100%';
            } else {
                aboutSection.style.height = `${viewportHeight}px`;
                aboutSection.style.minHeight = `${viewportHeight}px`;
                aboutSection.style.position = 'absolute';
                aboutSection.style.top = '0';
                aboutSection.style.left = '0';
                aboutSection.style.width = '100%';
            }
            
            if (aboutContent && isMobile) {
                aboutContent.style.gap = `${initialHeight * 0.03}px`;
            }
        }
        
        const contactSection = document.querySelector('#contact.contact');
        
        if (contactSection) {
            if (isMobile) {
                contactSection.style.height = 'auto';
                contactSection.style.minHeight = `${initialHeight}px`;
                contactSection.style.position = 'relative';
                contactSection.style.top = 'auto';
                contactSection.style.left = 'auto';
                contactSection.style.width = '100%';
            } else {
                contactSection.style.height = `${viewportHeight}px`;
                contactSection.style.minHeight = `${viewportHeight}px`;
                contactSection.style.position = 'absolute';
                contactSection.style.top = '0';
                contactSection.style.left = '0';
                contactSection.style.width = '100%';
            }
        }
        
        if (typeof sections !== 'undefined' && sections.length) {
            sections.forEach(section => {
                if (isMobile) {
                    gsap.set(section, {
                        height: 'auto',
                        minHeight: `${initialHeight}px`,
                        position: 'relative',
                        top: 'auto',
                        left: 'auto',
                        width: '100%'
                    });
                } else {
                    gsap.set(section, {
                        height: viewportHeight,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%'
                    });
                }
            });
        }
    };
    
    const init = () => {
        // Set initial values
        setVhVariable();
        updateDimensions();
        
        // Add event listeners
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            isScrolling = true;
            clearTimeout(scrollTimeout);
            
            if (isMobileDevice) {
                ignoreUrlBarChanges();
            }
            
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150);
        }, { passive: true });
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateDimensions();
            }, 250);
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                initialHeight = window.innerHeight;
                document.documentElement.style.setProperty('--locked-vh', `${initialHeight}px`);
                updateDimensions();
                lockViewportHeight();
            }, 500);
        });
        
        // Force a delay to ensure correct mobile heights are captured
        if (isMobileDevice) {
            setTimeout(() => {
                initialHeight = window.innerHeight;
                document.documentElement.style.setProperty('--locked-vh', `${initialHeight}px`);
                updateDimensions();
                lockViewportHeight();
            }, 300);
        }
    };
    
    return {
        init,
        updateDimensions,
        adjustContentSizes,
        isMobile: () => isMobile
    };
})(); 