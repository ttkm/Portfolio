// Particle system module for hero section

const ParticleSystem = (() => {
    let lastWindowWidth = window.innerWidth;
    let lastWindowHeight = window.innerHeight;
    let renderer, camera;
    
    const init = () => {
        const heroCanvas = document.querySelector('#hero-canvas');
        if (!heroCanvas) return null;
        
        lastWindowWidth = window.innerWidth;
        lastWindowHeight = window.innerHeight;
        
        const scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, lastWindowWidth / lastWindowHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({
            canvas: heroCanvas,
            antialias: true,
            alpha: true
        });

        renderer.setSize(lastWindowWidth, lastWindowHeight);
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
        const windowHalfX = lastWindowWidth / 2;
        const windowHalfY = lastWindowHeight / 2;

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

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                const heightDiff = Math.abs(newHeight - lastWindowHeight);
                
                // Only resize if width changed or height changed significantly (more than 150px)
                if (newWidth !== lastWindowWidth || heightDiff > 150) {
                    lastWindowWidth = newWidth;
                    lastWindowHeight = newHeight;
                    
                    camera.aspect = lastWindowWidth / lastWindowHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(lastWindowWidth, lastWindowHeight);
                }
            }, 250);
        });

        return {
            fadeOutParticles,
            resetParticles
        };
    };
    
    return {
        init
    };
})(); 