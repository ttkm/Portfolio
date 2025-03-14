// Animations module to handle all animations and transitions

const Animations = (() => {
    const animateElementsOut = (section, timeline, direction) => {
        const fadeElements = section.querySelectorAll('.fade-up');
        const titleElements = section.querySelectorAll('.section-title, .hero-title, .hero-subtitle');
        const contentElements = section.querySelectorAll('.hero-content, .about-content, .contact-content');
        
        switch(section.id) {
            case 'home':
                timeline.to(titleElements, {
                    y: -30 * direction,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.in'
                }, 0);
                timeline.to(contentElements, {
                    y: -50 * direction,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in'
                }, 0.1);
                break;
                
            case 'about':
                timeline.to(titleElements, {
                    y: -30 * direction,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.in'
                }, 0);
                timeline.to(contentElements, {
                    y: -50 * direction,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in'
                }, 0.1);
                break;
                
            case 'contact':
                timeline.to(titleElements, {
                    y: -30 * direction,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.in'
                }, 0);
                timeline.to(contentElements, {
                    y: -50 * direction,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in'
                }, 0.1);
                break;
                
            default:
                timeline.to(titleElements, {
                    y: -30 * direction,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.in'
                }, 0);
                timeline.to(contentElements, {
                    y: -50 * direction,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in'
                }, 0.1);
                break;
        }
        
        timeline.to(fadeElements, {
            y: -20 * direction,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.in'
        }, 0);
    };
    
    const animateElementsIn = (section, timeline, direction) => {
        const fadeElements = section.querySelectorAll('.fade-up');
        const titleElements = section.querySelectorAll('.section-title, .hero-title, .hero-subtitle');
        const contentElements = section.querySelectorAll('.hero-content, .about-content, .contact-content');
        
        switch(section.id) {
            case 'home':
                timeline.fromTo(titleElements, {
                    y: 30 * direction,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out'
                }, 0.2);
                
                timeline.fromTo(contentElements, {
                    y: 50 * direction,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                }, 0.3);
                break;
                
            case 'about':
                timeline.fromTo(titleElements, {
                    y: 30 * direction,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out'
                }, 0.2);
                
                timeline.fromTo(contentElements, {
                    y: 50 * direction,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                }, 0.3);
                break;
                
            case 'contact':
                timeline.fromTo(titleElements, {
                    y: 30 * direction,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out'
                }, 0.2);
                
                timeline.fromTo(contentElements, {
                    y: 50 * direction,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                }, 0.3);
                break;
                
            default:
                timeline.fromTo(titleElements, {
                    y: 30 * direction,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out'
                }, 0.2);
                
                timeline.fromTo(contentElements, {
                    y: 50 * direction,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                }, 0.3);
                break;
        }
        
        timeline.fromTo(fadeElements, {
            y: 20 * direction,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out'
        }, 0.2);
    };
    
    const initHero = () => {
        const heroTitle = document.querySelector('.hero-title');
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent) {
            gsap.set(heroContent, {
                opacity: 1,
                clearProps: "left,top,xPercent,yPercent,x,scale"
            });
        }
        
        if (heroTitle) {
            const splitType = new SplitType(heroTitle, { types: 'chars' });
            
            gsap.from(splitType.chars, {
                opacity: 0,
                y: 100,
                rotateX: -90,
                stagger: 0.02,
                duration: 1,
                ease: 'power4.out'
            });
            
            gsap.from('.hero-subtitle', {
                opacity: 0,
                y: 20,
                duration: 1,
                delay: 0.5
            });
            
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
    
    const initScrollAnimations = () => {
        console.log('Setting up section animations');
    };
    
    return {
        animateElementsOut,
        animateElementsIn,
        initHero,
        initScrollAnimations
    };
})(); 