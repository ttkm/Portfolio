// Fullpage scroll module to handle section transitions

const FullpageScroll = (() => {
    const init = () => {
        if (Viewport.isMobile()) {
            setupMobileSections();
            return;
        }
        
        const sectionElements = document.querySelectorAll('section[data-scroll-section]');
        sectionCount = sectionElements.length;
        
        sections.length = 0;
        
        sectionElements.forEach((section, index) => {
            sections.push(section);
            
            gsap.set(section, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: index === 0 ? 1 : 0,
                opacity: index === 0 ? 1 : 0,
                visibility: index === 0 ? 'visible' : 'hidden'
            });
        });
        
        if (typeof SectionIndicators !== 'undefined' && SectionIndicators.update) {
            SectionIndicators.update();
        }
        
        document.removeEventListener('wheel', handleSectionScroll);
        document.addEventListener('wheel', handleSectionScroll, { passive: false });
        
        setupTouchHandling();
        
        const handleResize = () => {
            sections.forEach(section => {
                gsap.set(section, {
                    height: window.innerHeight
                });
            });
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                const targetIndex = sections.indexOf(targetSection);
                if (targetIndex !== -1 && targetIndex !== currentSection) {
                    gsap.set(sections[currentSection], {
                        visibility: 'hidden',
                        opacity: 0,
                        zIndex: 0
                    });
                    
                    gsap.set(targetSection, {
                        visibility: 'visible',
                        opacity: 1,
                        zIndex: 1
                    });
                    
                    currentSection = targetIndex;
                    if (typeof SectionIndicators !== 'undefined' && SectionIndicators.update) {
                        SectionIndicators.update();
                    }
                }
            }
        }
    };
    
    const setupMobileSections = () => {
        console.log('Setting up mobile sections');
        const sectionElements = document.querySelectorAll('section[data-scroll-section]');
        
        sections.length = 0;
        
        sectionElements.forEach((section) => {
            gsap.set(section, {
                position: 'relative',
                top: 'auto',
                left: 'auto',
                width: '100%',
                height: 'auto',
                minHeight: '100vh',
                zIndex: 1,
                opacity: 1,
                visibility: 'visible',
                display: 'block'
            });
            
            sections.push(section);
        });
        
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.scrollBehavior = 'smooth';
        
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const targetSection = document.querySelector(hash);
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
                    
                    requestAnimationFrame(() => {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    });
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
                    
                    requestAnimationFrame(() => {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    });
                }
            });
        });
        
        if (typeof ScrollAnimations !== 'undefined' && ScrollAnimations.initMobileScrollAnimations) {
            ScrollAnimations.initMobileScrollAnimations();
        }
        
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    if (typeof SectionIndicators !== 'undefined' && SectionIndicators.update) {
                        const viewportMiddle = window.innerHeight / 2;
                        let activeIndex = 0;
                        
                        sections.forEach((section, index) => {
                            const rect = section.getBoundingClientRect();
                            if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
                                activeIndex = index;
                            }
                        });
                        
                        SectionIndicators.update(activeIndex);
                    }
                    scrollTimeout = null;
                }, 100);
            }
        });
    };
    
    const handleSectionScroll = (e) => {
        if (isAnimating) return;
        
        e.preventDefault();
        
        if (window.scrollTimeout) {
            clearTimeout(window.scrollTimeout);
        }
        
        const minDeltaThreshold = 10;
        const delta = e.deltaY;
        
        if (Math.abs(delta) < minDeltaThreshold) return;
        
        window.scrollTimeout = setTimeout(() => {
            if (delta > 0) {
                navigateToSection(currentSection + 1);
            } else {
                navigateToSection(currentSection - 1);
            }
        }, 50);
    };
    
    const navigateToSection = (targetIndex) => {
        if (targetIndex < 0 || targetIndex >= sectionCount || targetIndex === currentSection || isAnimating) {
            return;
        }
        
        isAnimating = true;
        
        if (typeof SectionIndicators !== 'undefined' && SectionIndicators.update) {
            SectionIndicators.update(targetIndex);
        }
        
        if (currentSection === 0 && window.particleSystem && window.particleSystem.fadeOutParticles) {
            window.particleSystem.fadeOutParticles(0.4);
        }
        
        if (targetIndex === 0 && window.particleSystem && window.particleSystem.resetParticles) {
            window.particleSystem.resetParticles();
        }
        
        const currentSectionElement = sections[currentSection];
        const targetSectionElement = sections[targetIndex];
        
        gsap.set(targetSectionElement, {
            visibility: 'visible',
            display: 'flex',
            opacity: 0,
            zIndex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh'
        });
        
        const direction = targetIndex > currentSection ? 'down' : 'up';
        
        if (targetIndex === 0) {
            const heroContent = targetSectionElement.querySelector('.hero-content');
            const heroTitle = targetSectionElement.querySelector('.hero-title');
            const heroSubtitle = targetSectionElement.querySelector('.hero-subtitle');
            const heroFooter = targetSectionElement.querySelector('.hero-footer');
            const scrollIndicator = targetSectionElement.querySelector('.scroll-indicator');
            
            if (heroContent) {
                gsap.set(heroContent, { 
                    opacity: 1,
                    clearProps: "left,top,xPercent,yPercent"
                });
            }
            if (heroTitle) gsap.set(heroTitle, { opacity: 1 });
            if (heroSubtitle) gsap.set(heroSubtitle, { opacity: 1 });
            if (heroFooter) gsap.set(heroFooter, { opacity: 1 });
            if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 1 });
        } else if (targetIndex === 2) {
            if (typeof AboutSection !== 'undefined' && AboutSection.ensureVisible) {
                AboutSection.ensureVisible(targetSectionElement);
            }
        }
        
        const timeline = gsap.timeline({
            onComplete: () => {
                gsap.set(currentSectionElement, {
                    visibility: 'hidden',
                    zIndex: 0
                });
                
                currentSection = targetIndex;
                isAnimating = false;
                
                const targetSection = sections[targetIndex];
                if (targetSection && targetSection.id) {
                    history.replaceState(null, null, `#${targetSection.id}`);
                }
                
                gsap.set(sections[currentSection], {
                    visibility: 'visible',
                    display: 'flex',
                    opacity: 1,
                    zIndex: 1
                });
                
                if (currentSection === 2) {
                    if (typeof AboutSection !== 'undefined' && AboutSection.ensureVisible) {
                        AboutSection.ensureVisible(sections[currentSection]);
                    }
                }
            }
        });
        
        timeline.to(currentSectionElement, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut'
        });
        
        timeline.to(targetSectionElement, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.inOut'
        }, '-=0.15');
        
        if (typeof Animations !== 'undefined') {
            if (Animations.animateElementsOut) {
                Animations.animateElementsOut(currentSectionElement, timeline, direction);
            }
            if (Animations.animateElementsIn) {
                Animations.animateElementsIn(targetSectionElement, timeline, direction);
            }
        }
    };
    
    const setupTouchHandling = () => {
        let touchStartY = 0;
        let touchEndY = 0;
        let touchStartTime = 0;
        let touchEndTime = 0;
        let isTouching = false;
        
        document.addEventListener('touchstart', (e) => {
            if (isAnimating) return;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isTouching = true;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!isTouching || isAnimating) return;
            if (currentSection === 0 && e.touches[0].clientY > touchStartY) {
                e.preventDefault();
            } else if (currentSection === sections.length - 1 && e.touches[0].clientY < touchStartY) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (!isTouching || isAnimating) return;
            
            touchEndY = e.changedTouches[0].clientY;
            touchEndTime = Date.now();
            
            const touchDuration = touchEndTime - touchStartTime;
            const diff = touchStartY - touchEndY;
            const velocity = Math.abs(diff) / touchDuration;
            
            if ((Math.abs(diff) > 50 && touchDuration < 300) || Math.abs(diff) > 100 || velocity > 0.5) {
                if (diff > 0) {
                    navigateToSection(currentSection + 1);
                } else {
                    navigateToSection(currentSection - 1);
                }
            }
            
            isTouching = false;
        }, { passive: true });
    };
    
    return {
        init,
        navigateToSection,
        handleSectionScroll,
        setupMobileSections,
        setupTouchHandling
    };
})(); 