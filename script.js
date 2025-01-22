document.addEventListener('DOMContentLoaded', () => {
    // Background effects
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    const effectButton = document.getElementById('effectButton');
    const effectMenu = document.querySelector('.effect-menu');
    let currentEffect = 'fireworks'; // Changed from 'snow' to 'fireworks'
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const FIREWORK_SHAPES = [
        "M 0,0 L 5,5 L 0,10 L -5,5 Z",  // Diamond
        "M -5,0 A 5,5 0 1,0 5,0 A 5,5 0 1,0 -5,0",  // Circle
        "M 0,-5 L 4,3 L -4,3 Z"  // Triangle
    ];

    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = {
                x: (Math.random() - 0.5) * 12,
                y: (Math.random() - 0.5) * 12
            };
            this.alpha = 1;
            this.lifetime = Math.random() * 40 + 40;
            this.size = Math.random() * 4 + 3;
            this.shape = FIREWORK_SHAPES[Math.floor(Math.random() * FIREWORK_SHAPES.length)];
            this.rotation = Math.random() * 360;
        }

        update() {
            this.velocity.y += 0.05; // gravity
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 1/this.lifetime;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.scale(this.size / 10, this.size / 10);
            
            ctx.beginPath();
            const path = new Path2D(this.shape);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill(path);
            ctx.filter = 'blur(1px) brightness(1.5)';
            ctx.restore();
        }
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.size = currentEffect === 'snow' ? Math.random() * 3 + 2 : Math.random() * 1 + 1;
            this.speed = currentEffect === 'snow' ? Math.random() * 2 + 1 : Math.random() * 5 + 7;
            this.wind = currentEffect === 'snow' ? Math.random() * 0.5 - 0.25 : 0;
        }

        update() {
            this.y += this.speed;
            this.x += this.wind;

            if (this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            if (currentEffect === 'snow') {
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            } else {
                ctx.rect(this.x, this.y, 0.5, this.size * 4);
            }
            ctx.fill();
        }
    }

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6);
        const colors = [
            '255, 220, 50',    // Bright gold
            '255, 50, 50',     // Red
            '50, 255, 50',     // Green
            '50, 150, 255',    // Blue
            '255, 100, 255'    // Pink
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        for (let i = 0; i < 40; i++) {
            particles.push(new FireworkParticle(x, y, color));
        }
    }

    function createParticles() {
        particles = [];
        let particleCount;
        
        switch(currentEffect) {
            case 'fireworks':
                for (let i = 0; i < 5; i++) createFirework();
                break;
            default:
                particleCount = currentEffect === 'snow' ? 200 : 300;
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (currentEffect === 'fireworks') {
            if (particles.length < 150 && Math.random() < 0.1) {
                createFirework();
            }
            particles = particles.filter(particle => particle.alpha > 0);
        }

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    effectButton.addEventListener('click', (e) => {
        e.stopPropagation();
        effectMenu.classList.toggle('active');
        if (effectMenu.classList.contains('active')) {
            effectButton.style.transform = 'scale(1.1)';
        } else {
            effectButton.style.transform = 'scale(1)';
        }
    });

    document.querySelectorAll('.effect-menu button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentEffect = btn.dataset.effect;
            createParticles();
            effectMenu.classList.remove('active');
            effectButton.style.transform = 'scale(1)';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.effect-toggle')) {
            effectMenu.classList.remove('active');
        }
    });

    createParticles();
    animate();

    // Add hover effect for cards
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add click animation for download buttons
    const downloadBtns = document.querySelectorAll('.download-btn');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Handle downloads in new tabs
    const downloadLinks = {
        theory1: "https://drive.google.com/file/d/1TXNwvdbYQQ_4k8X3A-5rKZIvTj3MbHIn/view?usp=drive_link",
        sim1: "https://drive.google.com/file/d/1rvim5sjtIv5KUosLEzQ0GVn59uOx0TUA/view?usp=sharing"
    };

    document.querySelectorAll('[data-download]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkType = link.getAttribute('data-download');
            const url = downloadLinks[linkType];
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
});
