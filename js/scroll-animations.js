// Scroll animations

const ScrollAnimations = (() => {
    const init = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        if (Viewport.isMobile()) {
            initMobileScrollAnimations();
        } else {
            console.log('Desktop scroll animations initialized');
        }
    };
    
    const initMobileScrollAnimations = () => {
        console.log('Mobile scroll animations initialized');
        
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        const fadeElements = document.querySelectorAll('.fade-up, .section-title, .hero-title, .hero-subtitle');
        
        fadeElements.forEach(element => {
            gsap.set(element, { 
                opacity: 0,
                y: 30
            });
            
            ScrollTrigger.create({
                trigger: element,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(element, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out'
                    });
                }
            });
        });
        
        const contentSections = document.querySelectorAll('.about-content, .contact-content');
        
        contentSections.forEach(section => {
            const parent = section.closest('section');
            
            if (parent) {
                const contentElements = section.children;
                
                gsap.set(contentElements, { 
                    opacity: 0,
                    y: 30
                });
                
                ScrollTrigger.create({
                    trigger: parent,
                    start: 'top 60%',
                    onEnter: () => {
                        gsap.to(contentElements, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        });
        
        const aboutVisual = document.querySelector('.about-visual');
        if (aboutVisual) {
            gsap.set(aboutVisual, { 
                opacity: 0,
                x: 50
            });
            
            ScrollTrigger.create({
                trigger: aboutVisual,
                start: 'top 70%',
                onEnter: () => {
                    gsap.to(aboutVisual, {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: 'power2.out'
                    });
                }
            });
        }
        
        const contactForm = document.querySelector('.contact-form');
        const contactText = document.querySelector('.contact-text');
        
        if (contactForm && contactText) {
            gsap.set(contactText, { 
                opacity: 0,
                x: -50
            });
            
            gsap.set(contactForm, { 
                opacity: 0,
                x: 50
            });
            
            ScrollTrigger.create({
                trigger: contactText.closest('section'),
                start: 'top 60%',
                onEnter: () => {
                    gsap.to(contactText, {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: 'power2.out'
                    });
                    
                    gsap.to(contactForm, {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        delay: 0.2
                    });
                }
            });
        }
    };
    
    return {
        init,
        initMobileScrollAnimations
    };
})(); 