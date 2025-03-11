gsap.registerPlugin(ScrollTrigger);

let currentSection = 0;
let isAnimating = false;
const sections = [];
let sectionCount = 0;

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-item a');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
    if (mainNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});


const initFullPageScroll = () => {
    
    const sectionElements = document.querySelectorAll('section[data-scroll-section]');
    sectionCount = sectionElements.length;
    
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
    
    updateSectionIndicators();
    
    document.removeEventListener('wheel', handleSectionScroll);
    
    document.addEventListener('wheel', handleSectionScroll, { passive: false });
    
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                navigateToSection(currentSection + 1);
            } else {
                navigateToSection(currentSection - 1);
            }
        }
    }, { passive: true });
    
    // Handle resize
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
                updateSectionIndicators();
            }
        }
    }
};

const createSectionIndicators = () => {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'section-indicators';
    document.body.appendChild(indicatorsContainer);
    
    sections.forEach((section, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'section-indicator';
        if (index === 0) {
            indicator.classList.add('active');
        }
        
        indicator.addEventListener('click', () => {
            navigateToSection(index);
        });
        
        indicatorsContainer.appendChild(indicator);
    });
};

const handleSectionScroll = (e) => {
    if (isAnimating) return;
    
    e.preventDefault();
    
    if (window.scrollTimeout) {
        clearTimeout(window.scrollTimeout);
    }
    
    window.scrollTimeout = setTimeout(() => {
        const delta = e.deltaY;
        
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
    
    updateSectionIndicators(targetIndex);
    
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
        ensureAboutSectionVisible(targetSectionElement);
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
                ensureAboutSectionVisible(sections[currentSection]);
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
    
    animateElementsOut(currentSectionElement, timeline, direction);
    
    animateElementsIn(targetSectionElement, timeline, direction);
};

const createTransitionOverlay = () => {
    const overlay = document.createElement('div');
    overlay.className = 'section-transition';
    document.body.appendChild(overlay);
    
    gsap.set(overlay, {
        y: '100%',
        willChange: 'transform'
    });
    
    return overlay;
};

const specialTransitionOut = (section, timeline, direction, isSection1to2) => {
    if (isSection1to2) {
        const heroTitle = section.querySelector('.hero-title');
        const heroLines = section.querySelectorAll('.hero-title .line');
        const heroSubtitle = section.querySelector('.hero-subtitle');
        const heroFooter = section.querySelector('.hero-footer');
        const scrollIndicator = section.querySelector('.scroll-indicator');
        const scrollCube = section.querySelector('.scroll-cube');
        
        timeline.to(heroLines, {
            y: -30 * direction,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out'
        }, 0);
        
        timeline.to(heroSubtitle, {
            y: -20 * direction,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.out'
        }, 0.05);
        
        timeline.to(heroFooter, {
            y: 20 * direction,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        }, 0.1);
        
        if (scrollCube) {
            timeline.to(scrollCube, {
                scale: 0,
                rotation: 180,
                opacity: 0,
                duration: 0.4,
                ease: 'back.in(1.7)'
            }, 0.15);
        }
        
        timeline.to(scrollIndicator, {
            y: 20 * direction,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        }, 0.15);
    } else {
        const globeCanvas = section.querySelector('#globe-canvas');
        const previewPopups = section.querySelectorAll('.preview-popup');
        const globeInfo = section.querySelector('.globe-info');
        const sectionHeader = section.querySelector('.section-header');
        const globeIntro = section.querySelector('.globe-intro');
        const globeContainer = section.querySelector('.globe-container');
        
        timeline.to(sectionHeader, {
            y: -20 * direction,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        }, 0);
        
        timeline.to(globeIntro, {
            y: -15 * direction,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out' 
        }, 0.05);
        
        timeline.to(globeInfo, {
            y: 15 * direction,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        }, 0.1);
        
        timeline.to(previewPopups, {
            scale: 0.95,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out'
        }, 0.15);
    }
    
    return timeline;
};

const specialTransitionIn = (section, timeline, direction, isSection1to2) => {
    if (isSection1to2) {
        const heroTitle = section.querySelector('.hero-title');
        const heroLines = section.querySelectorAll('.hero-title .line');
        const heroSubtitle = section.querySelector('.hero-subtitle');
        const heroFooter = section.querySelector('.hero-footer');
        const scrollIndicator = section.querySelector('.scroll-indicator');
        const scrollCube = section.querySelector('.scroll-cube');
        const heroContent = section.querySelector('.hero-content');
        
        gsap.set(heroLines, { opacity: 0, y: 20 * direction });
        gsap.set(heroSubtitle, { opacity: 0, y: 15 * direction });
        gsap.set(heroFooter, { opacity: 0, y: 15 * direction });
        gsap.set(scrollIndicator, { opacity: 0 });
        if (scrollCube) {
            gsap.set(scrollCube, { opacity: 0, scale: 0, rotation: -180 });
        }
        
        gsap.set(heroContent, { 
            opacity: 0.95,
            clearProps: "left,top,xPercent,yPercent,x,scale"
        });
        
        timeline.to(heroContent, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, 0);
        
        timeline.to(heroLines, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out'
        }, 0.05);
        
        timeline.to(heroSubtitle, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, 0.25);
        
        timeline.to(heroFooter, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, 0.3);
        
        if (scrollCube) {
            timeline.to(scrollCube, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: 'back.out(1.7)'
            }, 0.4);
        }
        
        timeline.to(scrollIndicator, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        }, 0.4);
    } else {
        const globeCanvas = section.querySelector('#globe-canvas');
        const previewPopups = section.querySelectorAll('.preview-popup');
        const globeInfo = section.querySelector('.globe-info');
        const sectionHeader = section.querySelector('.section-header');
        const globeIntro = section.querySelector('.globe-intro');
        const globeContainer = section.querySelector('.globe-container');
        
        gsap.set(sectionHeader, { opacity: 0, y: -20 * direction });
        gsap.set(globeIntro, { opacity: 0, y: -15 * direction });
        gsap.set(globeInfo, { opacity: 0, y: 15 * direction });
        gsap.set(previewPopups, { opacity: 0, scale: 0.95 });
        gsap.set(globeContainer, { opacity: 0.95, scale: 0.99 });
        
        timeline.to(globeContainer, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, 0);
        
        timeline.to(sectionHeader, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, 0.05);
        
        timeline.to(globeIntro, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, 0.15);
        
        timeline.to(globeInfo, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, 0.25);
        
        timeline.to(previewPopups, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out'
        }, 0.35);
    }
    
    return timeline;
};

const animateElementsOut = (section, timeline, direction) => {
    const fadeElements = section.querySelectorAll('.fade-up');
    const titleElements = section.querySelectorAll('.section-title, .hero-title, .hero-subtitle');
    const contentElements = section.querySelectorAll('.hero-content, .about-content, .contact-content, .globe-container');
    
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
            
        case 'work':
            const globeCanvas = section.querySelector('#globe-canvas');
            const previewPopups = section.querySelectorAll('.preview-popup');
            
            timeline.to(previewPopups, {
                scale: 0.8,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: 'back.in'
            }, 0);
            timeline.to(globeCanvas, {
                scale: 0.9,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, 0.1);
            timeline.to(titleElements, {
                y: -30 * direction,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in'
            }, 0);
            break;
            
        case 'about':
            const aboutVisual = section.querySelector('.about-visual');
            
            timeline.to(titleElements, {
                y: -30 * direction,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in'
            }, 0);
            timeline.to(contentElements, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, 0.1);
            timeline.to(aboutVisual, {
                x: 50 * direction,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, 0.1);
            break;
            
        case 'contact':
            const contactForm = section.querySelector('.contact-form');
            const contactText = section.querySelector('.contact-text');
            
            timeline.to(titleElements, {
                y: -30 * direction,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in'
            }, 0);
            timeline.to(contactText, {
                x: -50 * direction,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, 0.1);
            timeline.to(contactForm, {
                x: 50 * direction,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, 0.1);
            break;
            
        default:
            timeline.to([titleElements, contentElements, fadeElements], {
                y: -30 * direction,
                opacity: 0,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power2.in'
            }, 0);
    }
    
    return timeline;
};

const animateElementsIn = (section, timeline, direction) => {
    const fadeElements = section.querySelectorAll('.fade-up');
    const titleElements = section.querySelectorAll('.section-title, .hero-title, .hero-subtitle');
    const contentElements = section.querySelectorAll('.hero-content, .about-content, .contact-content, .globe-container');
    
    gsap.set([fadeElements, titleElements, contentElements], { 
        opacity: 0,
        y: 30 * direction
    });
    
    switch(section.id) {
        case 'home':
            const heroLines = section.querySelectorAll('.hero-title .line');
            const heroSubtitle = section.querySelector('.hero-subtitle');
            const heroFooter = section.querySelector('.hero-footer');
            
            gsap.set(heroLines, { opacity: 0, y: 50 });
            gsap.set(heroSubtitle, { opacity: 0, y: 30 });
            gsap.set(heroFooter, { opacity: 0 });
            
            timeline.to(heroLines, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            }, 0.2);
            
            timeline.to(heroSubtitle, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.6);
            
            timeline.to(heroFooter, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.8);
            break;
            
        case 'work':
            const globeCanvas = section.querySelector('#globe-canvas');
            const previewPopups = section.querySelectorAll('.preview-popup');
            const globeInfo = section.querySelector('.globe-info');
            
            gsap.set(globeCanvas, { opacity: 0, scale: 0.8 });
            gsap.set(previewPopups, { opacity: 0, scale: 0.8 });
            gsap.set(globeInfo, { opacity: 0, y: 30 });
            gsap.set(titleElements, { opacity: 0, y: -30 });
            
            timeline.to(titleElements, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            }, 0.2);
            
            timeline.to(globeCanvas, {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'elastic.out(0.8, 0.6)'
            }, 0.4);
            
            timeline.to(previewPopups, {
                opacity: 1,
                scale: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: 'back.out(1.7)'
            }, 0.6);
            
            timeline.to(globeInfo, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            }, 0.8);
            break;
            
        case 'about':
            const aboutElements = ensureAboutSectionVisible(section);
            const { aboutText, aboutVisual, skillsContainer, aboutTitle, aboutNumber } = aboutElements;
  
            gsap.set(aboutTitle, { opacity: 0, y: -30 });
            gsap.set(aboutNumber, { opacity: 0 });
            gsap.set(aboutText, { opacity: 0, y: 30 });
            gsap.set(aboutVisual, { opacity: 0, x: 50 });
            gsap.set(skillsContainer, { opacity: 0, y: 30 });
            
            timeline.to(aboutTitle, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            }, 0.2);
            
            timeline.to(aboutNumber, {
                opacity: 0.3,
                duration: 0.7,
                ease: 'power2.out'
            }, 0.2);
            
            timeline.to(aboutText, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            }, 0.4);
            
            timeline.to(aboutVisual, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.5);
            
            timeline.to(skillsContainer, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            }, 0.6);
            
            timeline.call(() => {
                ensureAboutSectionVisible(section);
            }, null, 1.0);
            
            break;
            
        case 'contact':
            const contactForm = section.querySelector('.contact-form');
            const contactText = section.querySelector('.contact-text');
            const contactLinks = section.querySelectorAll('.contact-link');
            
            gsap.set(titleElements, { opacity: 0, y: -30 });
            gsap.set(contactText, { opacity: 0, x: -50 });
            gsap.set(contactForm, { opacity: 0, x: 50 });
            gsap.set(contactLinks, { opacity: 0, y: 20 });
            
            timeline.to(titleElements, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            }, 0.2);
            
            timeline.to(contactText, {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'power2.out'
            }, 0.4);
            
            timeline.to(contactLinks, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            }, 0.5);
            
            timeline.to(contactForm, {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'power2.out'
            }, 0.6);
            break;
            
        default:
            timeline.to(titleElements, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: 'power2.out'
            }, 0.2);
            
            timeline.to(contentElements, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: 'power2.out'
            }, 0.4);
            
            timeline.to(fadeElements, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.05,
                ease: 'power2.out'
            }, 0.6);
    }
    
    return timeline;
};

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';

        const targetId = link.getAttribute('href');
        const targetIndex = Array.from(sections).findIndex(section => section.id === targetId.substring(1));
        
        if (targetIndex !== -1) {
            navigateToSection(targetIndex);
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
    }
});

const magneticElements = document.querySelectorAll('a, button, [data-magnetic], .preview-popup, .section-indicator');
const magnetStrength = 0.3;

const initHeroAnimation = () => {
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

const initParticleSystem = () => {
    const heroCanvas = document.querySelector('#hero-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: heroCanvas,
        antialias: true,
        alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 15000;
    const posArray = new Float32Array(particlesCount * 3);
    const opacityArray = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 10;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 10;
        opacityArray[i / 3] = 1.0;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacityArray, 1));

    const particlesMaterial = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: `
            attribute float opacity;
            varying float vOpacity;
            void main() {
                vOpacity = opacity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 2.0;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vOpacity;
            void main() {
                gl_FragColor = vec4(0.392, 1.0, 0.855, vOpacity * 0.8);
            }
        `
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const fadeOutParticles = (duration = 1.0) => {
        const opacityAttribute = particlesGeometry.attributes.opacity;
        const particlesPerFrame = Math.ceil(particlesCount / (duration * 60));

        let currentParticle = 0;
        
        const fadeInterval = setInterval(() => {
            for(let i = 0; i < particlesPerFrame && currentParticle < particlesCount; i++) {
                opacityAttribute.array[currentParticle] = 0;
                currentParticle++;
            }
            
            opacityAttribute.needsUpdate = true;
            
            if(currentParticle >= particlesCount) {
                clearInterval(fadeInterval);
            }
        }, 1000/60);
    };

    const resetParticles = () => {
        const opacityAttribute = particlesGeometry.attributes.opacity;
        for(let i = 0; i < particlesCount; i++) {
            opacityAttribute.array[i] = 1.0;
        }
        opacityAttribute.needsUpdate = true;
    };

    const clock = new THREE.Clock();
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        particlesMesh.rotation.y += 0.01 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.01 * (targetY - particlesMesh.rotation.x);
        particlesMesh.rotation.z += 0.001;

        const positions = particlesMesh.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            positions[i + 1] = Math.sin(elapsedTime + x) * 0.1;
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return {
        fadeOutParticles,
        resetParticles
    };
};

const initScrollAnimations = () => {
    console.log('Setting up section animations');
};

const initProjectsInteraction = () => {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const projectItems = document.querySelectorAll('.project-item');
    const detailsToggles = document.querySelectorAll('.details-toggle');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            
            projectItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        onStart: () => {
                            item.style.display = 'block';
                        }
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        y: 30,
                        scale: 0.95,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
    
    detailsToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const projectItem = toggle.closest('.project-item');
            
            projectItem.classList.toggle('details-open');
            
            toggle.textContent = projectItem.classList.contains('details-open') ? 'Hide Details' : 'Details';
        });
    });
    
    if ('ontouchstart' in window) {
        projectItems.forEach(item => {
            const overlay = item.querySelector('.project-overlay');
            
            item.addEventListener('touchstart', () => {
                projectItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('touch-active')) {
                        otherItem.classList.remove('touch-active');
                    }
                });
                
                item.classList.toggle('touch-active');
            }, { passive: true });
        });
    }
};

const initResponsiveNav = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    const checkViewport = () => {
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile-view');
            
            document.addEventListener('click', (e) => {
                if (mainNav.classList.contains('active') && 
                    !mainNav.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.classList.remove('nav-open');
                    document.body.style.overflow = '';
                }
            });
        } else {
            document.body.classList.remove('mobile-view');
        }
    };
    
    checkViewport();
    
    window.addEventListener('resize', checkViewport);
};

const initCreativeLab = () => {
    const stylePreviewData = [
        { style: "minimalist", lat: 40.7128, lng: -74.0060, name: "Minimalist Design" },
        { style: "creative", lat: 51.5074, lng: -0.1278, name: "Creative Portfolio" },
        { style: "ecommerce", lat: 35.6762, lng: 139.6503, name: "E-Commerce Design" },
        { style: "dashboard", lat: -33.9249, lng: 18.4241, name: "Dashboard UI" },
        { style: "germany", lat: 52.5200, lng: 13.4050, name: "My Coding Mentor" }
    ];

    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;
    
    const container = canvas.parentElement;
    const containerRect = container.getBoundingClientRect();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, containerRect.width / containerRect.height, 0.1, 1000);
    camera.position.z = 200;
    
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(containerRect.width, containerRect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const earthGeometry = new THREE.SphereGeometry(80, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg'),
        bumpMap: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_normal_2048.jpg'),
        bumpScale: 2,
        specularMap: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_specular_2048.jpg'),
        specular: new THREE.Color(0x333333),
        shininess: 15
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    const glowGeometry = new THREE.SphereGeometry(82, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(0.7 - dot(vNormal, vNormel), 2.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying float intensity;
            void main() {
                vec3 glow = vec3(0.2, 0.6, 1.0) * intensity;
                gl_FragColor = vec4(glow, 1.0);
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);
    
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    function updateRendererSize() {
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
        
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            camera.position.z = 250;
        } else {
            camera.position.z = 200;
        }

        renderer.render(scene, camera);
        
        updatePreviewPositions();
    }
    
    window.addEventListener('resize', updateRendererSize);
    
    window.addEventListener('orientationchange', () => {
        setTimeout(updateRendererSize, 100);
    });
    
    const updatePreviewPositions = () => {
        const previewPopups = document.querySelectorAll('.preview-popup');
        
        stylePreviewData.forEach((preview, index) => {
            const phi = (90 - preview.lat) * (Math.PI / 180);
            const theta = (preview.lng + 180) * (Math.PI / 180);
            
            const x = 80 * Math.sin(phi) * Math.cos(theta);
            const y = 80 * Math.cos(phi);
            const z = 80 * Math.sin(phi) * Math.sin(theta);
            
            const position = new THREE.Vector3(x, y, z);
            
            position.applyMatrix4(earth.matrixWorld);
            const projected = position.clone();
            projected.project(camera);
            
            const xPercent = (projected.x + 1) * 50;
            const yPercent = (-projected.y + 1) * 50;
            
            const dot = position.clone().normalize().dot(camera.position.clone().normalize());
            
            const popup = document.querySelector(`.preview-popup[data-style="${preview.style}"]`);
            
            if (popup) {
                if (preview.style === "germany") {
                    const xOffset = (xPercent - 50) * 0.2 - 5; 
                    const yOffset = (yPercent - 50) * 0.1 - 10;
                    
                    popup.style.left = `${xPercent + xOffset}%`;
                    popup.style.top = `${yPercent + yOffset}%`;
                    
                    const visibility = Math.max(0.7, Math.min(1, dot * 2));
                    popup.style.opacity = visibility.toString();
                    popup.style.transform = `scale(${1.15 + (visibility * 0.1)})`;
                    popup.style.pointerEvents = 'auto';
                    popup.classList.add('active');
                    popup.style.zIndex = "10";
                } else {
                    if (preview.style === "creative") {
                        const xOffset = (xPercent - 50) * 0.2 + 8; 
                        const yOffset = (yPercent - 50) * 0.1 + 5;
                        
                        popup.style.left = `${xPercent + xOffset}%`;
                        popup.style.top = `${yPercent + yOffset}%`;
                    } else {
                        const xOffset = (xPercent - 50) * 0.2; 
                        const yOffset = (yPercent - 50) * 0.1;
                        
                        popup.style.left = `${xPercent + xOffset}%`;
                        popup.style.top = `${yPercent + yOffset}%`;
                    }
                    
                    const visibility = Math.max(0, Math.min(1, dot * 2));
                    
                    if (dot > 0) {
                        popup.style.opacity = visibility.toString();
                        popup.style.transform = `scale(${0.8 + (visibility * 0.2)}) translateY(${20 - (visibility * 20)}px)`;
                        popup.style.pointerEvents = 'auto';
                        
                        if (visibility > 0.7) {
                            popup.classList.add('active');
                        } else {
                            popup.classList.remove('active');
                        }
                    } else {
                        popup.classList.remove('active');
                        popup.style.opacity = '0';
                        popup.style.pointerEvents = 'none';
                    }
                    
                    const depth = (1 - Math.abs(dot)) * 0.2;
                    popup.style.zIndex = Math.floor(visibility * 10).toString();
                }
            }
        });
    };
    
    const animate = () => {
        requestAnimationFrame(animate);
        
        earth.rotation.y += 0.001;
        glowMesh.rotation.y += 0.001;

        updatePreviewPositions();

        glowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
            camera.position, glowMesh.position
        );
        
        renderer.render(scene, camera);
    };
    
    animate();

    const previewPopups = document.querySelectorAll('.preview-popup');
    previewPopups.forEach(popup => {
        popup.addEventListener('click', () => {
            const style = popup.getAttribute('data-style');
            console.log(`Clicked on ${style} design`);
            
            previewPopups.forEach(p => p.classList.remove('selected'));
            popup.classList.add('selected');
            
            const locationTitle = document.querySelector('.location-title');
            const locationDescription = document.querySelector('.location-description');
            const globeInfo = document.querySelector('.globe-info');
            const globeCategories = document.querySelector('.globe-categories');
            
            if (globeInfo) {
                globeInfo.style.backgroundColor = '';
                globeInfo.style.boxShadow = '';
                globeInfo.style.border = '';
                globeInfo.classList.remove('germany-active');
            }
            
            if (globeCategories) {
                globeCategories.style.display = '';
            }
            
            if (locationTitle && locationDescription) {
                stylePreviewData.forEach(previewData => {
                    if (previewData.style === style) {
                        locationTitle.textContent = previewData.name;
                        
                        if (style === 'germany') {
                            if (globeInfo) {
                                globeInfo.classList.add('germany-active');
                                
                                // Hide the categories
                                if (globeCategories) {
                                    globeCategories.style.display = 'none';
                                }
                                
                                locationTitle.innerHTML = '<span style="color: white; font-weight: bold; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); font-size: 1.2rem;">My Beloved Friend and Mentor</span>';
                                locationDescription.innerHTML = `
                                    <div style="display: flex; flex-direction: column; gap: 15px;">
                                        <p style="margin: 0; color: white; line-height: 1.5; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">My friend from Germany introduced me to coding and inspired my journey as a developer. She taught me the fundamentals of JavaScript, HTML, CSS and more. She continues to be both a friend and mentor in my career and personal life.</p>
                                        <div style="display: flex; gap: 10px; margin-top: 5px;">
                                            <a href="#" style="display: inline-block; padding: 8px 15px; background-color: rgba(255, 255, 255, 0.2); color: white; text-decoration: none; border-radius: 4px; font-size: 0.9rem; transition: all 0.3s ease; border: 1px solid rgba(255, 255, 255, 0.3); text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);">Visit Portfolio</a>
                                            <a href="#" style="display: inline-block; padding: 8px 15px; background-color: rgba(255, 255, 255, 0.2); color: white; text-decoration: none; border-radius: 4px; font-size: 0.9rem; transition: all 0.3s ease; border: 1px solid rgba(255, 255, 255, 0.3); text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);">Connect</a>
                                        </div>
                                    </div>
                                `;
                            }
                        } else {
                            switch(style) {
                                case 'minimalist':
                                    locationDescription.textContent = "Clean, elegant designs with a focus on simplicity and functionality.";
                                    break;
                                case 'creative':
                                    locationDescription.textContent = "Bold, artistic designs that showcase creativity and innovation.";
                                    break;
                                case 'ecommerce':
                                    locationDescription.textContent = "User-friendly shopping experiences with conversion-focused design.";
                                    break;
                                case 'dashboard':
                                    locationDescription.textContent = "Data visualization interfaces that make complex information accessible.";
                                    break;
                                default:
                                    locationDescription.textContent = "Explore various design styles and digital solutions I can create for your next project.";
                            }
                        }
                    }
                });
            }
        });
    });

    updateRendererSize();

    setTimeout(() => {
        updatePreviewPositions();
        
        const previewPopups = document.querySelectorAll('.preview-popup');
        previewPopups.forEach(popup => {
            popup.style.opacity = '1';
            popup.classList.add('active');
            popup.style.pointerEvents = 'auto';
            
            const style = popup.getAttribute('data-style');
            switch(style) {
                case 'minimalist':
                    popup.style.left = '30%';
                    popup.style.top = '30%';
                    break;
                case 'creative':
                    popup.style.left = '70%';
                    popup.style.top = '30%';
                    break;
                case 'ecommerce':
                    popup.style.left = '30%';
                    popup.style.top = '70%';
                    break;
                case 'dashboard':
                    popup.style.left = '70%';
                    popup.style.top = '70%';
                    break;
            }
        });
    }, 500);
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            
            earth.rotation.y += deltaMove.x * 0.005;
            earth.rotation.x += deltaMove.y * 0.005;
            glowMesh.rotation.y = earth.rotation.y;
            glowMesh.rotation.x = earth.rotation.x;
            
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    let touchStartPosition = { x: 0, y: 0 };
    
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartPosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const deltaMove = {
                x: e.touches[0].clientX - touchStartPosition.x,
                y: e.touches[0].clientY - touchStartPosition.y
            };
            
            earth.rotation.y += deltaMove.x * 0.005;
            earth.rotation.x += deltaMove.y * 0.005;
            glowMesh.rotation.y = earth.rotation.y;
            glowMesh.rotation.x = earth.rotation.x;
            
            touchStartPosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
    });
};

const initExperimentCanvases = () => {

    console.log('Experiment canvases initialization skipped - using simplified layout');
};

const startWebGLExperiment = (targetId) => {
    console.log('WebGL experiment functionality removed in simplified layout');
};

const startMotionExperiment = (targetId) => {
    console.log('Motion experiment functionality removed in simplified layout');
};

const startInteractiveExperiment = (targetId) => {
    console.log('Interactive experiment functionality removed in simplified layout');
};

const startAIExperiment = (targetId) => {
    console.log('AI experiment functionality removed in simplified layout');
};

const stopExperiment = (targetId) => {
    console.log('Stop experiment functionality removed in simplified layout');
};

const initAboutCanvas = () => {
    const aboutCanvas = document.getElementById('about-canvas');
    if (!aboutCanvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, aboutCanvas.clientWidth / aboutCanvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
        canvas: aboutCanvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    const geometry = new THREE.PlaneGeometry(10, 10, 20, 20);
    const material = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const animate = () => {
        requestAnimationFrame(animate);
        
        plane.rotation.x += 0.003;
        plane.rotation.y += 0.002;
        
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = aboutCanvas.clientWidth / aboutCanvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
    });
};

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.display = 'none';
    }
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {

        heroContent.style.position = 'relative';
        heroContent.style.left = '0';
        heroContent.style.top = 'auto';
        heroContent.style.transform = 'none';
        heroContent.style.margin = '0';
        heroContent.style.removeProperty('xPercent');
        heroContent.style.removeProperty('yPercent');
    }
    
    window.particleSystem = initParticleSystem();
    initHeroAnimation();
    initScrollAnimations();
    initProjectsInteraction();
    initResponsiveNav();
    initCreativeLab();
    initAboutCanvas();

    lottie.loadAnimation({
        container: document.querySelector('#lottie-container'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_iorpbol0.json'
    });

    initFullPageScroll();
    initSectionIndicators();
    
    const sectionIndicators = document.querySelectorAll('.section-indicator');
    sectionIndicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const targetIndex = parseInt(indicator.getAttribute('data-index'));
            
            updateSectionIndicators(targetIndex);
            
            navigateToSection(targetIndex);
        });
    });
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = '1';
    }
});

function fadeOutParticles() {
    if (window.particleSystem && window.particleSystem.fadeOutParticles) {
        window.particleSystem.fadeOutParticles(0.4); 
    }
}

const updateSectionIndicators = (targetIndex) => {
    const indicators = document.querySelectorAll('.section-indicator');
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
        });

        const activeIndex = targetIndex !== undefined ? targetIndex : currentSection;
        if (indicators[activeIndex]) {

            void indicators[activeIndex].offsetWidth;
            indicators[activeIndex].classList.add('active');
        }
    }
};

const initSectionIndicators = () => {
    const sectionIndicators = document.querySelectorAll('.section-indicator');
    sectionIndicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const targetIndex = parseInt(indicator.getAttribute('data-index'));
            
            updateSectionIndicators(targetIndex);
            
            navigateToSection(targetIndex);
        });
    });
};

const ensureAboutSectionVisible = (section) => {
    const aboutContent = section.querySelector('.about-content');
    const aboutText = section.querySelector('.about-text');
    const aboutVisual = section.querySelector('.about-visual');
    const skillsContainer = section.querySelector('.skills-container');
    const aboutTitle = section.querySelector('.section-title');
    const aboutNumber = section.querySelector('.section-number');
    
    gsap.set(section, { 
        visibility: 'visible',
        opacity: 1,
        display: 'flex',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh'
    });
    

    if (aboutContent) {
        gsap.set(aboutContent, { 
            display: 'flex', 
            visibility: 'visible',
            opacity: 1
        });
    }
    
    if (aboutText) gsap.set(aboutText, { visibility: 'visible', opacity: 1 });
    if (aboutVisual) gsap.set(aboutVisual, { visibility: 'visible', opacity: 1 });
    if (skillsContainer) gsap.set(skillsContainer, { visibility: 'visible', opacity: 1 });
    if (aboutTitle) gsap.set(aboutTitle, { visibility: 'visible', opacity: 1 });
    if (aboutNumber) gsap.set(aboutNumber, { visibility: 'visible', opacity: 0.3 });
    
    return {
        aboutContent,
        aboutText,
        aboutVisual,
        skillsContainer,
        aboutTitle,
        aboutNumber
    };
};
