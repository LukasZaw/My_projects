const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDiv = document.getElementById("score");

// State
let score = 0;
let gameOver = false;

// Player
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  w: 40,
  h: 40,
  speed: 6,
  color: "#0ff",
};

// Controls
let left = false,
  right = false,
  space = false;
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") left = true;
  if (e.code === "ArrowRight") right = true;
  if (e.code === "Space") space = true;
});
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") left = false;
  if (e.code === "ArrowRight") right = false;
  if (e.code === "Space") space = false;
});

// Bullets
const bullets = [];
function shoot() {
  bullets.push({
    x: player.x + player.w / 2 - 3,
    y: player.y,
    w: 6,
    h: 16,
    speed: 7,
  });
}
let canShoot = true;
function handleShooting() {
  if (space && canShoot) {
    shoot();
    canShoot = false;
    setTimeout(() => (canShoot = true), 300);
  }
}

// Enemies
const enemies = [];
function spawnEnemy() {
  const size = 36;
  const x = Math.random() * (canvas.width - size);
  enemies.push({
    x,
    y: -size,
    w: size,
    h: size,
    speed: 1 + Math.random() * 2,
    color: "#f33",
  });
}
setInterval(spawnEnemy, 900);

// Collision
function isColliding(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

// Main loop
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.moveTo(player.x + player.w / 2, player.y);
  ctx.lineTo(player.x, player.y + player.h);
  ctx.lineTo(player.x + player.w, player.y + player.h);
  ctx.closePath();
  ctx.fill();
}

function drawBullets() {
  ctx.fillStyle = "#ff0";
  for (const b of bullets) {
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
}

function drawEnemies() {
  for (const e of enemies) {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = "#fff";
    ctx.fillRect(e.x + e.w / 2 - 4, e.y + 8, 8, 8); // "cockpit"
  }
}

function update() {
  if (gameOver) return;

  // Move player
  if (left) player.x -= player.speed;
  if (right) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

  // Bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y + bullets[i].h < 0) bullets.splice(i, 1);
  }

  // Enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemies[i].speed;
    if (enemies[i].y > canvas.height) enemies.splice(i, 1);
  }

  // Bullet-enemy collision
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (isColliding(enemies[i], bullets[j])) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        scoreDiv.textContent = "Wynik: " + score;
        break;
      }
    }
  }

  // Enemy-player collision
  for (const e of enemies) {
    if (isColliding(e, player)) {
      gameOver = true;
      setTimeout(() => {
        alert("Koniec gry! Twój wynik: " + score);
        window.location.reload();
      }, 100);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
}

function loop() {
  handleShooting();
  update();
  draw();
  if (!gameOver) requestAnimationFrame(loop);
}

loop();
