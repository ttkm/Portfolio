// Hero animation module

const HeroAnimation = (() => {
    const isMobile = () => {
        return window.innerWidth <= 768;
    };

    const init = () => {
        const heroTitle = document.querySelector('.hero-title');
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent) {
            if (isMobile()) {
                gsap.set(heroContent, {
                    opacity: 1
                });
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
                heroContent.style.margin = '0';
                heroContent.style.padding = '0';
            } else {
                gsap.set(heroContent, {
                    opacity: 1,
                    clearProps: "left,top,xPercent,yPercent,x,scale"
                });
            }
        }
        
        if (heroTitle) {
            if (isMobile()) {
                gsap.from(heroTitle, {
                    opacity: 0,
                    y: 30,
                    duration: 1,
                    ease: 'power3.out'
                });
                
                heroTitle.style.textAlign = 'center';
                heroTitle.style.width = '100%';
                heroTitle.style.display = 'block';
                heroTitle.style.margin = '0 auto 1.5rem auto';
                heroTitle.style.transform = 'none';
                heroTitle.style.transformOrigin = 'center';
                
                const lines = heroTitle.querySelectorAll('.line');
                lines.forEach(line => {
                    line.style.textAlign = 'center';
                    line.style.width = '100%';
                    line.style.display = 'block';
                    line.style.margin = '0 auto 0.5rem auto';
                });
                
                const subtitle = document.querySelector('.hero-subtitle');
                if (subtitle) {
                    subtitle.style.textAlign = 'center';
                    subtitle.style.width = '100%';
                    subtitle.style.maxWidth = '100%';
                    subtitle.style.margin = '0 auto 2rem auto';
                    subtitle.style.padding = '0 1rem';
                    subtitle.style.display = 'block';
                    subtitle.style.transform = 'none';
                    subtitle.style.transformOrigin = 'center';
                }
            } else {
                if (typeof SplitType !== 'undefined') {
                    const splitType = new SplitType(heroTitle, { types: 'chars' });
                    
                    gsap.from(splitType.chars, {
                        opacity: 0,
                        y: 100,
                        rotateX: -90,
                        stagger: 0.02,
                        duration: 1,
                        ease: 'power4.out'
                    });
                } else {
                    gsap.from(heroTitle, {
                        opacity: 0,
                        y: 50,
                        duration: 1,
                        ease: 'power3.out'
                    });
                }
            }
            
            if (isMobile()) {
                gsap.from('.hero-subtitle', {
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    delay: 0.5,
                    ease: 'power3.out'
                });
            } else {
                gsap.from('.hero-subtitle', {
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    delay: 0.5
                });
            }
            
            gsap.from('.hero-footer > div', {
                opacity: 0,
                y: 20,
                duration: 1,
                delay: 0.8,
                stagger: 0.2
            });
            
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '1';
                
                gsap.from('.scroll-indicator', {
                    scale: 0.5,
                    duration: 1.2,
                    delay: 1.2,
                    ease: 'elastic.out(1, 0.5)'
                });
            }
            
            const scrollCube = document.querySelector('.scroll-cube');
            if (scrollCube) {
                scrollCube.style.display = 'block';
            }
        }
    };
    
    return {
        init
    };
})(); 