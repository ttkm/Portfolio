// About section module to handle about section functionality

const AboutSection = (() => {
    const ensureVisible = (section) => {
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
    
    const initCanvas = () => {
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
    
    return {
        ensureVisible,
        initCanvas
    };
})(); 