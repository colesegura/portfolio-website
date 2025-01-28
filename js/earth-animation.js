class EarthAnimation {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#earth-animation'),
            antialias: true,
            alpha: true
        });
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Create Earth
        const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
        const textureLoader = new THREE.TextureLoader();
        
        // Load Earth textures
        Promise.all([
            textureLoader.loadAsync('https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg'),
            textureLoader.loadAsync('https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.jpg'),
            textureLoader.loadAsync('https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.png')
        ]).then(([earthMap, normalMap, specularMap]) => {
            const earthMaterial = new THREE.MeshPhongMaterial({
                map: earthMap,
                normalMap: normalMap,
                specularMap: specularMap,
                normalScale: new THREE.Vector2(0.5, 0.5)
            });

            this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
            this.scene.add(this.earth);

            // Add magnetic field visualization
            this.addMagneticField();
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);

        // Camera position
        this.camera.position.z = 15;

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Start animation
        this.animate();
    }

    addMagneticField() {
        const fieldGeometry = new THREE.BufferGeometry();
        const fieldPoints = [];
        const fieldCurves = 32;
        
        // Create magnetic field lines
        for(let i = 0; i < fieldCurves; i++) {
            const angle = (i / fieldCurves) * Math.PI * 2;
            const radius = 6;
            
            for(let j = 0; j < 100; j++) {
                const t = j / 100;
                const x = Math.cos(angle + t * Math.PI * 2) * radius;
                const y = Math.sin(t * Math.PI * 2) * radius * 1.5;
                const z = Math.sin(angle + t * Math.PI * 2) * radius;
                
                fieldPoints.push(x, y, z);
            }
        }

        fieldGeometry.setAttribute('position', new THREE.Float32BufferAttribute(fieldPoints, 3));
        
        const fieldMaterial = new THREE.LineBasicMaterial({
            color: 0x64ffda,
            transparent: true,
            opacity: 0.3
        });

        this.magneticField = new THREE.LineSegments(fieldGeometry, fieldMaterial);
        this.scene.add(this.magneticField);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.earth) {
            this.earth.rotation.y += 0.001;
        }
        
        if (this.magneticField) {
            this.magneticField.rotation.y -= 0.0005;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Earth animation
document.addEventListener('DOMContentLoaded', () => {
    new EarthAnimation();
}); 