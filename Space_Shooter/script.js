const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDiv = document.getElementById("score");
const speedDiv = document.getElementById("speed");
const shooting_speedDiv = document.getElementById("shooting-speed");

//Player name
const playerNameDiv = document.getElementById("player-name");

let playerName = localStorage.getItem("playerName");
if (!playerName) {
  playerName = prompt("Podaj swoją nazwę gracza:");
  if (!playerName || playerName.trim() === "") playerName = "Gracz";
  localStorage.setItem("playerName", playerName);
}
playerNameDiv.textContent = "Gracz: " + playerName;

//Loading all images
const bgLayer1 = new Image();
bgLayer1.src = "Images/PixelBackgroundSeamlessVertically.png";

const playerImage = new Image();
playerImage.src = "Images/PlayerBlue_01.png";
const playerImageMove = new Image();
playerImageMove.src = "Images/PlayerBlue_02.png";

const asteroidImages = [new Image(), new Image(), new Image(), new Image()];
asteroidImages[0].src = "Images/Asteroid_01.png";
asteroidImages[2].src = "Images/Asteroid_03.png";
asteroidImages[1].src = "Images/Asteroid_02.png";
asteroidImages[3].src = "Images/Asteroid_04.png";

const bulletFrames = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
];
bulletFrames[0].src = "Images/Bullet_01.png";
bulletFrames[1].src = "Images/Bullet_02.png";
bulletFrames[2].src = "Images/Bullet_03.png";
bulletFrames[3].src = "Images/Bullet_04.png";
bulletFrames[4].src = "Images/Bullet_05.png";
bulletFrames[5].src = "Images/Bullet_06.png";

const explosionFrames = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
];
explosionFrames[0].src = "Images/Explosion_01.png";
explosionFrames[1].src = "Images/Explosion_02.png";
explosionFrames[2].src = "Images/Explosion_03.png";
explosionFrames[3].src = "Images/Explosion_04.png";
explosionFrames[4].src = "Images/Explosion_05.png";
explosionFrames[5].src = "Images/Explosion_06.png";
explosionFrames[6].src = "Images/Explosion_07.png";
explosionFrames[7].src = "Images/Explosion_08.png";
explosionFrames[8].src = "Images/Explosion_09.png";

const explosions = [];

// State
let score = 0;
let gameOver = false;

let bg1X = 0;

// Player
const player = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 70,
  w: 60,
  h: 60,
  speed: 5,
  shooting_speed: 6,
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
    x: player.x + player.w / 2 - 12,
    y: player.y,
    w: 24,
    h: 32,
    speed: 7,
    frameIndex: 0, // Dodaj pole na klatkę animacji
    frameTimer: 0, // Timer do płynniejszej zmiany klatek
    frameDelay: 10, // Co ile pętli zmienia się klatka (możesz dostosować)
  });
}

let canShoot = true;
function handleShooting() {
  if (space && canShoot) {
    shoot();
    canShoot = false;
    setTimeout(() => (canShoot = true), player.shooting_speed * 100);
  }
}

// Enemies
const enemies = [];
function spawnEnemy() {
  const size = 32 + Math.random() * 16;
  const x = Math.random() * (canvas.width - size);
  const asteroidIndex = Math.floor(Math.random() * asteroidImages.length);
  enemies.push({
    x,
    y: -size,
    w: size,
    h: size,
    speed: 1 + Math.random() * 2,
    asteroidIndex,
  });
}
setInterval(spawnEnemy, 400 + Math.random() * 800);

// Collision
function isColliding(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function drawPlayer() {
  ctx.save();
  if (left) {
    ctx.drawImage(playerImageMove, player.x, player.y, player.w, player.h);
  } else if (right) {
    ctx.scale(-1, 1);
    ctx.drawImage(
      playerImageMove,
      -player.x - player.w,
      player.y,
      player.w,
      player.h
    );
  } else {
    ctx.drawImage(playerImage, player.x, player.y, player.w, player.h);
  }
  ctx.restore();
}

function drawBullets() {
  for (const b of bullets) {
    // Rysujemy aktualną klatkę
    ctx.drawImage(bulletFrames[b.frameIndex], b.x, b.y, b.w, b.h);
  }
}

function drawEnemies() {
  for (const e of enemies) {
    const img = asteroidImages[e.asteroidIndex];
    ctx.drawImage(img, e.x, e.y, e.w, e.h);
  }
}

function drawBackground() {
  ctx.drawImage(bgLayer1, 0, bg1X, canvas.width, canvas.height);
  ctx.drawImage(bgLayer1, 0, bg1X - canvas.height, canvas.width, canvas.height);

  bg1X += 1;

  if (bg1X >= canvas.height) bg1X = 0;
}

function drawExplosions() {
  for (const ex of explosions) {
    ctx.save();
    ctx.translate(ex.x + ex.w / 2, ex.y + ex.h / 2);
    const scaledW = ex.w * ex.scale;
    const scaledH = ex.h * ex.scale;
    ctx.drawImage(
      explosionFrames[ex.frameIndex],
      -scaledW / 2,
      -scaledH / 2,
      scaledW,
      scaledH
    );
    ctx.restore();
  }
}

function update() {
  if (gameOver) return;

  // Update UI
  speedDiv.textContent = `Szybkość poruszania: ${player.speed}`;
  shooting_speedDiv.textContent = `Szybkość strzelania: ${player.shooting_speed}`;

  // Move player
  if (left) player.x -= player.speed;
  if (right) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

  // Bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;

    // Animacja
    bullets[i].frameTimer++;
    if (bullets[i].frameTimer >= bullets[i].frameDelay) {
      bullets[i].frameIndex = (bullets[i].frameIndex + 1) % bulletFrames.length;
      bullets[i].frameTimer = 0;
    }

    if (bullets[i].y + bullets[i].h < 0) {
      bullets.splice(i, 1);
    }
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
        explosions.push({
          x: enemies[i].x,
          y: enemies[i].y,
          w: enemies[i].w,
          h: enemies[i].h,
          frameIndex: 0,
          frameTimer: 0,
          frameDelay: 5,
          scale: 0.7 + Math.random() * 0.8,
        });

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
        //alert("Koniec gry! Twój wynik: " + score);

        window.location.reload();
      }, 100);
    }
  }

  // Update explosions
  for (let i = explosions.length - 1; i >= 0; i--) {
    const ex = explosions[i];
    ex.frameTimer++;
    if (ex.frameTimer >= ex.frameDelay) {
      ex.frameIndex++;
      ex.frameTimer = 0;
      if (ex.frameIndex >= explosionFrames.length) {
        explosions.splice(i, 1);
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  drawPlayer();
  drawBullets();
  drawEnemies();
  drawExplosions();
}

function loop() {
  handleShooting();
  update();
  draw();
  if (!gameOver) requestAnimationFrame(loop);
}

loop();
