// Viewport module to handle screen dimensions and responsive adjustments

const Viewport = (() => {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let resizeTimer;
    let currentBreakpoint = viewportWidth <= 768 ? 'mobile' : 'desktop';
    let lastHeight = window.innerHeight;
    let isMobile = window.innerWidth <= 768;
    
    const updateDimensions = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        if (newWidth !== viewportWidth || Math.abs(newHeight - lastHeight) > 100) {
            viewportWidth = newWidth;
            viewportHeight = newHeight;
            lastHeight = newHeight;
            
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
            
            adjustContentSizes(breakpointChanged);
        }
    };
    
    const adjustContentSizes = (breakpointChanged = false) => {
        const heroSection = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (heroSection) {
            if (isMobile) {
                heroSection.style.height = '100dvh';
                heroSection.style.minHeight = '100dvh';
            } else {
                heroSection.style.height = `${viewportHeight}px`;
                heroSection.style.minHeight = `${viewportHeight}px`;
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
                aboutSection.style.minHeight = '100dvh';
            } else {
                aboutSection.style.height = `${viewportHeight}px`;
                aboutSection.style.minHeight = `${viewportHeight}px`;
            }
            
            if (aboutContent && isMobile) {
                aboutContent.style.gap = `${viewportHeight * 0.03}px`;
            }
        }
        
        const contactSection = document.querySelector('#contact.contact');
        
        if (contactSection) {
            if (isMobile) {
                contactSection.style.height = 'auto';
                contactSection.style.minHeight = '100dvh';
            } else {
                contactSection.style.height = `${viewportHeight}px`;
                contactSection.style.minHeight = `${viewportHeight}px`;
            }
        }
        
        if (typeof sections !== 'undefined' && sections.length) {
            sections.forEach(section => {
                if (isMobile) {
                    gsap.set(section, {
                        height: 'auto',
                        minHeight: '100dvh'
                    });
                } else {
                    gsap.set(section, {
                        height: viewportHeight
                    });
                }
            });
        }
    };
    
    const init = () => {
        updateDimensions();
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateDimensions, 250);
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(updateDimensions, 250);
        });
    };
    
    return {
        init,
        updateDimensions,
        adjustContentSizes,
        isMobile: () => isMobile
    };
})(); 