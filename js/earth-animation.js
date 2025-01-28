let scene, camera, renderer, earth, magneticField;
let scrollProgress = 0;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#earth-animation'),
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Create Earth
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const texture = new THREE.TextureLoader().load('assets/earth-texture.jpg');
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: new THREE.TextureLoader().load('assets/earth-bump.jpg'),
        bumpScale: 0.3
    });
    
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    
    // Add magnetic field visualization
    createMagneticField();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 10, 25);
    scene.add(pointLight);
    
    camera.position.z = 15;
    
    // Initialize scroll animation
    initScrollAnimation();
    
    animate();
}

function createMagneticField() {
    // Create magnetic field lines using custom geometry
    // This will be implemented with curved lines representing the magnetic field
}

function initScrollAnimation() {
    ScrollTrigger.create({
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
            scrollProgress = self.progress;
            updateCameraPosition();
        }
    });
}

function updateCameraPosition() {
    // Transform camera from Earth-centric to Solar perspective based on scroll
    const targetZ = 15 + (scrollProgress * 30);
    camera.position.z = targetZ;
    camera.lookAt(scene.position);
}

function animate() {
    requestAnimationFrame(animate);
    
    earth.rotation.y += 0.001;
    if (magneticField) {
        magneticField.rotation.y += 0.0005;
    }
    
    renderer.render(scene, camera);
}

init(); 