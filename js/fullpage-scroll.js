// Fullpage scroll module to handle section transitions

const FullpageScroll = (() => {
    let currentSection = 0;
    let isAnimating = false;
    let sections = [];
    let sectionCount = 0;
    let isInitialized = false;
    let isMobileView = window.innerWidth <= 768;
    
    let wheelHandler = null;
    let touchStartHandler = null;
    let touchMoveHandler = null;
    let touchEndHandler = null;
    let keyDownHandler = null;
    let scrollHandler = null;
    
    const init = () => {
        isMobileView = window.innerWidth <= 768;
        
        sections = Array.from(document.querySelectorAll('section[data-scroll-section]'));
        sectionCount = sections.length;
        
        if (sectionCount === 0) return;
        
        removeAllEventListeners();
        
        if (isMobileView) {
            setupMobileSections();
        } else {
            setupDesktopSections();
        }
    };
    
    const removeAllEventListeners = () => {
        if (wheelHandler) {
            document.removeEventListener('wheel', wheelHandler, { passive: false });
            wheelHandler = null;
        }
        
        if (touchStartHandler) {
            document.removeEventListener('touchstart', touchStartHandler);
            touchStartHandler = null;
        }
        
        if (touchMoveHandler) {
            document.removeEventListener('touchmove', touchMoveHandler);
            touchMoveHandler = null;
        }
        
        if (touchEndHandler) {
            document.removeEventListener('touchend', touchEndHandler);
            touchEndHandler = null;
        }
        
        if (keyDownHandler) {
            document.removeEventListener('keydown', keyDownHandler);
            keyDownHandler = null;
        }
        
        if (scrollHandler) {
            window.removeEventListener('scroll', scrollHandler);
            scrollHandler = null;
        }
    };
    
    const setupDesktopSections = () => {
        console.log('Setting up desktop fullpage scroll');
        
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        sections.forEach((section, index) => {
            gsap.set(section, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                minHeight: '100vh',
                opacity: index === currentSection ? 1 : 0,
                visibility: index === currentSection ? 'visible' : 'hidden',
                zIndex: index === currentSection ? 2 : 1,
                pointerEvents: index === currentSection ? 'auto' : 'none',
                display: 'flex'
            });
            
            if (index === currentSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        setupDesktopEventHandlers();
        
        updateSectionIndicators();
        
        const initialHash = window.location.hash;
        if (initialHash) {
            const targetSection = document.querySelector(initialHash);
            if (targetSection) {
                const targetIndex = sections.indexOf(targetSection);
                if (targetIndex !== -1 && targetIndex !== currentSection) {
                    navigateToSection(targetIndex, true);
                }
            }
        }
        
        isInitialized = true;
    };
    
    const setupMobileSections = () => {
        console.log('Setting up mobile sections');
        
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.scrollBehavior = 'smooth';
        
        sections.forEach((section) => {
            gsap.set(section, {
                position: 'relative',
                top: 'auto',
                left: 'auto',
                width: '100%',
                height: 'auto',
                minHeight: '100svh',
                minHeight: 'calc(var(--vh, 1vh) * 100)',
                opacity: 1,
                visibility: 'visible',
                zIndex: 'auto',
                pointerEvents: 'auto',
                display: 'flex',
                clearProps: 'transform,transition'
            });
            
            const animatedElements = section.querySelectorAll('[data-scroll]');
            animatedElements.forEach(el => {
                gsap.set(el, {
                    clearProps: 'all'
                });
            });
            
            const content = section.querySelector('.hero-content, .about-content, .contact-content');
            if (content) {
                gsap.set(content, {
                    opacity: 1,
                    visibility: 'visible',
                    clearProps: 'transform'
                });
            }
            
            section.classList.add('active');
        });
        
        setupMobileNavigation();
        
        setupMobileScrollDetection();
        
        const initialHash = window.location.hash;
        if (initialHash) {
            setTimeout(() => {
                const targetSection = document.querySelector(initialHash);
                if (targetSection) {
                    const offset = 80;
                    const targetPosition = targetSection.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    };
    
    const setupMobileNavigation = () => {
        const navLinks = document.querySelectorAll('.nav-item a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const menuToggle = document.querySelector('.menu-toggle');
                const mainNav = document.querySelector('.main-nav');
                
                if (menuToggle && menuToggle.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    if (mainNav) mainNav.classList.remove('active');
                    document.body.classList.remove('nav-open');
                    document.body.style.overflow = '';
                }
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offset = 80;
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 50);
                }
            });
        });
        
        const sectionIndicators = document.querySelectorAll('.section-indicator');
        sectionIndicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const targetIndex = parseInt(indicator.getAttribute('data-index'));
                if (targetIndex >= 0 && targetIndex < sections.length) {
                    const targetSection = sections[targetIndex];
                    const offset = 80;
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    const setupMobileScrollDetection = () => {
        scrollHandler = () => {
            if (!isMobileView) return;
            
            const viewportMiddle = window.innerHeight / 2;
            let activeIndex = 0;
            
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
                    activeIndex = index;
                }
            });
            
            updateSectionIndicators(activeIndex);
        };
        
        window.addEventListener('scroll', scrollHandler);
    };
    
    const setupDesktopEventHandlers = () => {
        wheelHandler = (e) => {
            if (isMobileView || isAnimating) return;
            
            e.preventDefault();
            
            if (window.wheelTimeout) {
                clearTimeout(window.wheelTimeout);
            }
            
            const delta = e.deltaY;
            
            window.wheelTimeout = setTimeout(() => {
                if (delta > 0) {
                    navigateDown();
                } else {
                    navigateUp();
                }
            }, 50);
        };
        
        document.addEventListener('wheel', wheelHandler, { passive: false });
        
        let touchStartY = 0;
        let touchEndY = 0;
        
        touchStartHandler = (e) => {
            if (isMobileView || isAnimating) return;
            touchStartY = e.touches[0].clientY;
        };
        
        touchMoveHandler = (e) => {
            if (isMobileView || isAnimating) {
                return;
            }
            
            touchEndY = e.touches[0].clientY;
            
            if ((currentSection === 0 && touchEndY > touchStartY) || 
                (currentSection === sections.length - 1 && touchEndY < touchStartY)) {
                e.preventDefault();
            }
        };
        
        touchEndHandler = () => {
            if (isMobileView || isAnimating) return;
            
            const touchDiff = touchStartY - touchEndY;
            const threshold = 50;
            
            if (Math.abs(touchDiff) > threshold) {
                if (touchDiff > 0) {
                    navigateDown();
                } else {
                    navigateUp();
                }
            }
        };
        
        document.addEventListener('touchstart', touchStartHandler, { passive: true });
        document.addEventListener('touchmove', touchMoveHandler, { passive: false });
        document.addEventListener('touchend', touchEndHandler, { passive: true });
        
        keyDownHandler = (e) => {
            if (isMobileView || isAnimating) return;
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    navigateDown();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    navigateUp();
                    break;
                case 'Home':
                    e.preventDefault();
                    navigateToSection(0);
                    break;
                case 'End':
                    e.preventDefault();
                    navigateToSection(sectionCount - 1);
                    break;
            }
        };
        
        document.addEventListener('keydown', keyDownHandler);
        
        const sectionIndicators = document.querySelectorAll('.section-indicator');
        sectionIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (isMobileView || isAnimating) return;
                navigateToSection(index);
            });
        });
    };
    
    const navigateUp = () => {
        if (currentSection > 0) {
            navigateToSection(currentSection - 1);
        }
    };
    
    const navigateDown = () => {
        if (currentSection < sectionCount - 1) {
            navigateToSection(currentSection + 1);
        }
    };
    
    const navigateToSection = (index, immediate = false) => {
        if (index < 0 || index >= sectionCount) return;
        if (index === currentSection && !immediate) return;
        if (isMobileView) {
            const targetSection = sections[index];
            const offset = 80;
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            return;
        }
        
        isAnimating = true;
        
        const prevSection = sections[currentSection];
        const nextSection = sections[index];
        
        if (nextSection.id) {
            history.replaceState(null, '', `#${nextSection.id}`);
        }
        
        if (immediate) {
            if (prevSection) {
                gsap.set(prevSection, {
                    opacity: 0,
                    visibility: 'hidden',
                    zIndex: 1,
                    pointerEvents: 'none'
                });
                prevSection.classList.remove('active');
            }
            
            gsap.set(nextSection, {
                opacity: 1,
                visibility: 'visible',
                zIndex: 2,
                pointerEvents: 'auto'
            });
            nextSection.classList.add('active');
            
            currentSection = index;
            isAnimating = false;
            
            updateSectionIndicators();
        } else {
            gsap.to(prevSection, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.set(prevSection, {
                        visibility: 'hidden',
                        zIndex: 1,
                        pointerEvents: 'none'
                    });
                    prevSection.classList.remove('active');
                }
            });
            
            gsap.set(nextSection, {
                visibility: 'visible',
                zIndex: 2,
                pointerEvents: 'auto',
                display: 'flex'
            });
            
            gsap.fromTo(nextSection, 
                { opacity: 0 },
                { 
                    opacity: 1, 
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => {
                        nextSection.classList.add('active');
                        currentSection = index;
                        isAnimating = false;
                        updateSectionIndicators();
                    }
                }
            );
        }
        
        updateSectionIndicators(index);
    };
    
    const updateSectionIndicators = (index = currentSection) => {
        const indicators = document.querySelectorAll('.section-indicator');
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    };
    
    const resetScroll = () => {
        isMobileView = window.innerWidth <= 768;
        
        removeAllEventListeners();
        
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.scrollBehavior = 'smooth';
        
        sections.forEach((section) => {
            gsap.set(section, {
                clearProps: 'all',
                position: 'relative',
                top: 'auto',
                left: 'auto',
                width: '100%',
                height: 'auto',
                opacity: 1,
                visibility: 'visible',
                zIndex: 'auto',
                pointerEvents: 'auto'
            });
            
            gsap.killTweensOf(section);
            
            section.classList.add('active');
            
            const animatedElements = section.querySelectorAll('[data-scroll], .fade-up, .hero-content, .about-content, .contact-content');
            animatedElements.forEach(el => {
                gsap.killTweensOf(el);
                gsap.set(el, { clearProps: 'all', opacity: 1, visibility: 'visible' });
            });
        });
        
        currentSection = 0;
        isAnimating = false;
        
        setupMobileSections();
    };
    
    return {
        init,
        resetScroll,
        navigateToSection,
        navigateUp,
        navigateDown
    };
})(); 