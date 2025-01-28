// Add this at the top of main.js
console.log('Main.js loaded');

// Magnetic Field Visualization
class MagneticField {
    constructor() {
        console.log('Initializing MagneticField');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        document.querySelector('.hero-section').appendChild(this.canvas);
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for(let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                size: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 25, 48, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if(p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if(p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#00f7ff';
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
}

class ProjectsGrid {
    constructor() {
        this.projects = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.projects.forEach(project => {
            project.addEventListener('click', () => this.expandProject(project));
        });
    }

    expandProject(project) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        
        // Create modal content based on project data
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${project.querySelector('h3').textContent}</h2>
                    <button class="close-modal">×</button>
                </div>
                <div class="modal-body">
                    <!-- Project details -->
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate modal entrance
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // Handle close
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
    }
}

// Update the initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    try {
        new MagneticField();
        new SmoothScroll();
        new ProjectsGrid();
    } catch (error) {
        console.error('Error initializing components:', error);
    }
});