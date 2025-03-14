// Section indicators to handle section navigation dots

const SectionIndicators = (() => {
    const create = () => {
        const existingContainer = document.querySelector('.section-indicators');
        
        if (existingContainer) {
            existingContainer.innerHTML = '';
            
            existingContainer.classList.remove('mobile', 'desktop');
            if (Viewport.isMobile()) {
                existingContainer.classList.add('mobile');
            } else {
                existingContainer.classList.add('desktop');
            }
            
            sections.forEach((section, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'section-indicator';
                indicator.setAttribute('data-index', index);
                
                if (index === 0) {
                    indicator.classList.add('active');
                }
                
                indicator.addEventListener('click', () => {
                    if (Viewport.isMobile()) {
                        const targetSection = sections[index];
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
                        FullpageScroll.navigateToSection(index);
                    }
                });
                
                existingContainer.appendChild(indicator);
            });
        } else {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'section-indicators';
            
            if (Viewport.isMobile()) {
                indicatorsContainer.classList.add('mobile');
            } else {
                indicatorsContainer.classList.add('desktop');
            }
            
            document.body.appendChild(indicatorsContainer);
            
            sections.forEach((section, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'section-indicator';
                indicator.setAttribute('data-index', index);
                
                if (index === 0) {
                    indicator.classList.add('active');
                }
                
                indicator.addEventListener('click', () => {
                    if (Viewport.isMobile()) {
                        const targetSection = sections[index];
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
                        FullpageScroll.navigateToSection(index);
                    }
                });
                
                indicatorsContainer.appendChild(indicator);
            });
        }
    };
    
    const update = (targetIndex) => {
        const indicators = document.querySelectorAll('.section-indicator');
        if (indicators.length > 0) {
            indicators.forEach((indicator) => {
                indicator.classList.remove('active');
            });

            const activeIndex = targetIndex !== undefined ? targetIndex : currentSection;
            if (indicators[activeIndex]) {
                void indicators[activeIndex].offsetWidth;
                indicators[activeIndex].classList.add('active');
            }
        }
    };
    
    const handleResize = () => {
        create();
        update(currentSection);
    };
    
    const findVisibleSection = () => {
        let activeIndex = 0;
        const viewportMiddle = window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
                activeIndex = index;
            }
        });
        
        return activeIndex;
    };
    
    const init = () => {
        create();
        
        window.addEventListener('resize', () => {
            clearTimeout(window.sectionIndicatorResizeTimer);
            window.sectionIndicatorResizeTimer = setTimeout(handleResize, 250);
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 100);
        });
        
        if (Viewport.isMobile()) {
            setTimeout(() => {
                update(findVisibleSection());
            }, 500);
            
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (!scrollTimeout) {
                    scrollTimeout = setTimeout(() => {
                        update(findVisibleSection());
                        scrollTimeout = null;
                    }, 100);
                }
            });
        }
    };
    
    return {
        init,
        create,
        update,
        handleResize
    };
})(); 