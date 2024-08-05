const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let dots = [];
const numberOfDots = 300; // Reduced number of dots
const maxDistance = 135; // Increased distance for wider movement

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function createDots() {
    dots = [];
    for (let i = 0; i < numberOfDots; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2.8, // Slower movement
            vy: (Math.random() - 0.5) * 2.8 // Slower movement
        });
    }
}

function updateDots() {
    for (let dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
    }
}

function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(119,245,237,0.19)';
    ctx.lineWidth = 1;

    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(119,245,237,0.55)';
        ctx.fill();
        ctx.closePath();

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
}

function animate() {
    updateDots();
    drawDots();
    requestAnimationFrame(animate);
}

createDots();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createDots();
});
