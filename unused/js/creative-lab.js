// Creative lab module for globe visualization

const CreativeLab = (() => {
    // Initialize creative lab
    const init = () => {
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
        camera.position.z = 180;
        
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true,
            alpha: true 
        });
        renderer.setSize(containerRect.width, containerRect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const earthGeometry = new THREE.SphereGeometry(90, 64, 64);
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg'),
            bumpMap: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_normal_2048.jpg'),
            bumpScale: 2.5,
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

        // Update renderer size
        const updateRendererSize = () => {
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
        };
        
        // Add resize event listeners
        window.addEventListener('resize', updateRendererSize);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateRendererSize, 100);
        });
        
        // Update preview positions
        const updatePreviewPositions = () => {
            const previewPopups = document.querySelectorAll('.preview-popup');
            
            stylePreviewData.forEach((preview, index) => {
                const phi = (90 - preview.lat) * (Math.PI / 180);
                const theta = (preview.lng + 180) * (Math.PI / 180);
                
                const x = 90 * Math.sin(phi) * Math.cos(theta);
                const y = 90 * Math.cos(phi);
                const z = 90 * Math.sin(phi) * Math.sin(theta);
                
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
                        const xOffset = (xPercent - 50) * 0.15 - 5;
                        const yOffset = (yPercent - 50) * 0.08 - 8;
                        
                        popup.style.left = `${xPercent + xOffset}%`;
                        popup.style.top = `${yPercent + yOffset}%`;
                        
                        const visibility = Math.max(0.7, Math.min(1, dot * 2));
                        popup.style.opacity = visibility.toString();
                        popup.style.transform = `scale(${1.1 + (visibility * 0.1)})`;
                        popup.style.pointerEvents = 'auto';
                        popup.classList.add('active');
                        popup.style.zIndex = "10";
                    } else {
                        if (preview.style === "creative") {
                            const xOffset = (xPercent - 50) * 0.15 + 6;
                            const yOffset = (yPercent - 50) * 0.08 + 4;
                            
                            popup.style.left = `${xPercent + xOffset}%`;
                            popup.style.top = `${yPercent + yOffset}%`;
                        } else {
                            const xOffset = (xPercent - 50) * 0.15;
                            const yOffset = (yPercent - 50) * 0.08;
                            
                            popup.style.left = `${xPercent + xOffset}%`;
                            popup.style.top = `${yPercent + yOffset}%`;
                        }
                        
                        const visibility = Math.max(0, Math.min(1, dot * 2));
                        
                        if (dot > 0) {
                            popup.style.opacity = visibility.toString();
                            popup.style.transform = `scale(${0.85 + (visibility * 0.15)}) translateY(${15 - (visibility * 15)}px)`;
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
                        
                        const depth = (1 - Math.abs(dot)) * 0.15;
                        popup.style.zIndex = Math.floor(visibility * 10).toString();
                    }
                }
            });
        };
        
        // Animation loop
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

        // Add click handlers to preview popups
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

        // Initialize renderer
        updateRendererSize();

        // Set initial positions
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
        
        // Add mouse and touch interaction
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
        
        // Touch events
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
    
    // Public API
    return {
        init
    };
})(); 