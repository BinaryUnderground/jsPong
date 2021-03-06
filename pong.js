const canvas = document.getElementById("pong");

const ctx = canvas.getContext('2d');

let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let computerScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
computerScore.src = "sounds/computerScore.mp3";
userScore.src = "sounds/userScore.mp3";

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "WHITE"
}

const user = {
    x: 0, 
    y: (canvas.height - 100) / 3, 
    width: 12,
    height: 100,
    score: 0,
    color: "BLUE"
}

const computer = {
    x: canvas.width - 10, 
    y: (canvas.height - 100) / 3, 
    width: 12,
    height: 100,
    score: 0,
    color: "RED"
}

const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 4,
    color: "ORANGE"
}

function drawRectangle(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCurve(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height / 2;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 10;
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRectangle(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px Aachen Bold";
    ctx.fillText(text, x, y);
}

function ballCollision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update() {

    if (ball.x - ball.radius < 0) {
        computer.score++;
        computerScore.play();
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        userScore.play();
        resetBall();

    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    computer.y += ((ball.y - (computer.y + computer.height / 2))) * 0.3;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    let player = (ball.x + ball.radius < canvas.width / 2) ? user : computer;

    if (ballCollision(ball, player)) {
   
        hit.play();
 
        let collidePoint = (ball.y - (player.y + player.height / 2));
  

        collidePoint = collidePoint / (player.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;


        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);


        ball.speed += 0.2;
    }
}

function rendering() {

    drawRectangle(0, 0, canvas.width, canvas.height, "#000");

    drawText(user.score, canvas.width / 4, canvas.height / 5);

    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5);

    drawNet();

    drawRectangle(user.x, user.y, user.width, user.height, user.color);

    drawRectangle(computer.x, computer.y, computer.width, computer.height, computer.color);

    drawCurve(ball.x, ball.y, ball.radius, ball.color);

}

function game() {
    update();
    rendering();
}

let framePerSecond = 60;

let loop = setInterval(game, 1000 / framePerSecond);
