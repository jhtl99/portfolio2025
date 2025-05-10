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

// Line properties
let line = {
    x1: 0,
    y1: 0,
    x2: canvas.width,
    y2: canvas.height,
    angle: Math.atan2(canvas.height, canvas.width)
};

// Update line properties
function updateLine() {
    line.x2 = canvas.width;
    line.y2 = canvas.height;
    line.angle = Math.atan2(canvas.height, canvas.width);
}

// Initial line update
updateLine();

// Update line when window is resized
window.addEventListener('resize', updateLine);

// Function to determine which side of the line a point is on
function getSideOfLine(x, y) {
    return (y - line.y1) * (line.x2 - line.x1) - (x - line.x1) * (line.y2 - line.y1);
}

// Base Ball class
class BaseBall {
    constructor() {
        this.radius = Math.random() * 3;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#808080';
        ctx.fill();
        ctx.closePath();
    }

    // Check and handle line collision
    checkLineCollision() {
        const side = getSideOfLine(this.x, this.y);
        const nextSide = getSideOfLine(this.x + this.dx, this.y + this.dy);
        
        if (side * nextSide < 0) { // Ball crossed the line
            // Calculate reflection
            const normal = {
                x: -(line.y2 - line.y1),
                y: line.x2 - line.x1
            };
            const len = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= len;
            normal.y /= len;

            const dot = this.dx * normal.x + this.dy * normal.y;
            this.dx -= 2 * dot * normal.x;
            this.dy -= 2 * dot * normal.y;
        }
    }
}

// Ball classes for each side of the line
class TopBall extends BaseBall {
    update() {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy = -this.dy;

        this.checkLineCollision();
        
        // Update position
        this.x += this.dx;
        this.y += this.dy;
    }
}

class BottomBall extends BaseBall {
    update() {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy = -this.dy;

        this.checkLineCollision();
        
        // Update position
        this.x += this.dx;
        this.y += this.dy;
    }
}

// Create balls
const topBalls = [];
const bottomBalls = [];
const numBalls = 50;

for (let i = 0; i < numBalls; i++) {
    const ball = new TopBall();
    if (getSideOfLine(ball.x, ball.y) > 0) {
        topBalls.push(ball);
    } else {
        bottomBalls.push(ball);
    }
}

for (let i = 0; i < numBalls; i++) {
    const ball = new BottomBall();
    if (getSideOfLine(ball.x, ball.y) < 0) {
        bottomBalls.push(ball);
    } else {
        topBalls.push(ball);
    }
}

// Draw the diagonal line
function drawDiagonalLine() {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

// Animation function
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw diagonal line
    drawDiagonalLine();

    // Update and draw all balls
    [...topBalls, ...bottomBalls].forEach(ball => {
        ball.update();
        ball.draw();
    });

    // Draw lines between nearby balls on the same side
    function drawConnections(balls, color) {
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const dx = balls[i].x - balls[j].x;
                const dy = balls[i].y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    ctx.beginPath();
                    ctx.moveTo(balls[i].x, balls[i].y);
                    ctx.lineTo(balls[j].x, balls[j].y);
                    ctx.strokeStyle = `rgba(${color}, ${opacity * 0.8})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }

    // Draw connections for each side with different colors
    drawConnections(topBalls, '255, 192, 203'); // Pink
    drawConnections(bottomBalls, '0, 0, 255'); // Blue

    requestAnimationFrame(animate);
}

// Start animation
animate();