const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let dots = [];
const numberOfDots = 100; // Number of dots
const maxDistance = 180; // Maximum distance for connecting dots

// Configuration for electric dots
const config = {
    numElectricDots: 1, // Number of yellow dots per line
    dotSize: 0.7,          // Size of the electric dot
    dotSpeed: 1         // Speed of the electric dot movement
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let electricDots = []; // Array to hold moving yellow dots

// Generate initial dots
function createDots() {
    dots = [];
    for (let i = 0; i < numberOfDots; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5, // Slower movement
            vy: (Math.random() - 0.5) * 0.5 // Slower movement
        });
    }
}

// Update dot positions
function updateDots() {
    for (let dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
    }
}

// Create electric dots along lines
function createElectricDots() {
    electricDots = []; // Reset electric dots
    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
            const otherDot = dots[j];
            const distance = Math.hypot(dot.x - otherDot.x, dot.y - otherDot.y);

            if (distance < maxDistance) {
                for (let k = 0; k < config.numElectricDots; k++) {
                    const progress = k / (config.numElectricDots - 1);
                    const x = dot.x + (otherDot.x - dot.x) * progress;
                    const y = dot.y + (otherDot.y - dot.y) * progress;

                    electricDots.push({
                        x: x,
                        y: y,
                        startX: dot.x,
                        startY: dot.y,
                        endX: otherDot.x,
                        endY: otherDot.y,
                        progress: Math.random(), // Random starting point
                        direction: Math.random() > 0.5 ? 1 : -1 // Random direction
                    });
                }
            }
        }
    }
}

// Update electric dot positions
function updateElectricDots() {
    for (let electricDot of electricDots) {
        const dx = electricDot.endX - electricDot.startX;
        const dy = electricDot.endY - electricDot.startY;
        const length = Math.hypot(dx, dy);

        electricDot.progress +=  config.dotSpeed/ length * electricDot.direction;
        if (electricDot.progress > 1 || electricDot.progress < 0) {
            electricDot.direction *= -1; // Change direction when reaching end or start
            electricDot.progress = Math.max(0, Math.min(electricDot.progress, 1)); // Clamp progress
        }

        electricDot.x = electricDot.startX + dx * electricDot.progress;
        electricDot.y = electricDot.startY + dy * electricDot.progress;
    }
}

// Draw dots, lines, and electric dots
function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background dots
    ctx.fillStyle = 'rgba(119,245,237,0.55)';
    for (let dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    // Draw lines between dots
    ctx.strokeStyle = 'rgba(119,245,237,0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
            const otherDot = dots[j];
            const distance = Math.hypot(dot.x - otherDot.x, dot.y - otherDot.y);

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(dot.x, dot.y);
                ctx.lineTo(otherDot.x, otherDot.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    // Draw electric dots
    ctx.fillStyle = 'yellow';
    for (let electricDot of electricDots) {
        ctx.beginPath();
        ctx.arc(electricDot.x, electricDot.y, config.dotSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

// Animation loop
function animate() {
    updateDots();
    createElectricDots(); // Create electric dots initially
    updateElectricDots();
    drawDots();
    requestAnimationFrame(animate);
}

createDots();
animate();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createDots();
});
