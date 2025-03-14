// Navigation module to handle menu and navigation functionality

const Navigation = (() => {
    const init = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.nav-item a');
        
        menuToggle?.removeEventListener('click', handleMenuToggle);
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
        navLinks.forEach(link => link.removeEventListener('click', handleNavClick));
        
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', handleMenuToggle);
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            navLinks.forEach(link => link.addEventListener('click', handleNavClick));
        }
    };
    
    const handleMenuToggle = (event) => {
        event.stopPropagation();
        
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.classList.toggle('nav-open');
        
        Viewport.updateDimensions();
        
        if (mainNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 * (index + 1));
            });
            
            const navFooter = document.querySelector('.nav-footer');
            if (navFooter) {
                navFooter.style.opacity = '0';
                navFooter.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    navFooter.style.opacity = '1';
                    navFooter.style.transform = 'translateY(0)';
                }, 500);
            }
        } else {
            document.body.style.overflow = '';
            
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.style.opacity = '';
                item.style.transform = '';
            });
            
            const navFooter = document.querySelector('.nav-footer');
            if (navFooter) {
                navFooter.style.opacity = '';
                navFooter.style.transform = '';
            }
        }
    };
    
    const handleNavClick = (event) => {
        event.preventDefault();
        
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';

        const targetId = event.currentTarget.getAttribute('href');
        const targetIndex = Array.from(sections).findIndex(section => section.id === targetId.substring(1));
        
        if (targetIndex !== -1) {
            FullpageScroll.navigateToSection(targetIndex);
        }
    };
    
    const handleClickOutside = (event) => {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (mainNav.classList.contains('active') && 
            !menuToggle.contains(event.target) && 
            !mainNav.contains(event.target)) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        }
    };
    
    const handleEscapeKey = (event) => {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (event.key === 'Escape' && mainNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        }
    };
    
    const initResponsive = () => {
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
    
    return {
        init,
        initResponsive,
        handleMenuToggle,
        handleNavClick,
        handleClickOutside,
        handleEscapeKey
    };
})(); 