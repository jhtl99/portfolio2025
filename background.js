const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial resize
resizeCanvas();

// Resize canvas when window is resized
window.addEventListener('resize', resizeCanvas);

// Ball class
class Ball {
    constructor() {
        this.radius = Math.random() * 3;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
    }

    update() {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy = -this.dy;

        // Update position
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#808080';
        ctx.fill();
        ctx.closePath();
    }
}

// Create balls
const balls = [];
const numBalls = 150;
for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball());
}

// Animation function
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw balls
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });

    // Draw lines between nearby balls
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[i].x - balls[j].x;
            const dy = balls[i].y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 200;

            if (distance < maxDistance) {
                const opacity = 1 - (distance / maxDistance);
                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.strokeStyle = `rgba(128, 128, 128, ${opacity * 0.9})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Start animation
animate(); 