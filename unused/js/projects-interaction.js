// Projects interaction module

const ProjectsInteraction = (() => {
    const init = () => {
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
    
    return {
        init
    };
})(); 