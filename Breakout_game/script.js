const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ball
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// Paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Bricks
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
    //console.log(bricks);
  }
}

// Keys
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Ball draw
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff222";
  ctx.fill();
  ctx.closePath();
}

// Paddle draw
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

// Bricks draw
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#000fdf";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Colisions detecion
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        let brickLeft = b.x;
        let brickRight = b.x + brickWidth;
        let brickTop = b.y;
        let brickBottom = b.y + brickHeight;

        if (
          x + ballRadius > brickLeft &&
          x - ballRadius < brickRight &&
          y + ballRadius > brickTop &&
          y - ballRadius < brickBottom
        ) {
          // Sprawdzamy z której strony piłka uderza
          let ballFromLeft = x - dx < brickLeft;
          let ballFromRight = x - dx > brickRight;
          let ballFromTop = y - dy < brickTop;
          let ballFromBottom = y - dy > brickBottom;

          // Odbicie w odpowiednim kierunku
          if (ballFromLeft || ballFromRight) {
            dx = -dx;
          }
          if (ballFromTop || ballFromBottom) {
            dy = -dy;
          }

          b.status = 0;
        }
      }
    }
  }
}

// Update and game drawing
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // wall bounce
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    console.log("Wall bounce");
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius * 1.5) {
    console.log("x bounce");
    if (x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius) {
      dy = -dy;
    } else {
      //alert("Game Over");
      document.location.reload();
    }
  }

  // ball movement
  x += dx;
  y += dy;

  // paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }

  requestAnimationFrame(draw);
}

draw();
