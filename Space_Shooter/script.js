import {
  player,
  left,
  right,
  space,
  setupPlayer,
  setupPlayerControls,
  drawPlayer,
} from "./player.js";
import {
  bgLayer1,
  playerImage,
  playerImageMove,
  asteroidImages,
  bulletFrames,
  explosionFrames,
  powerupImage,
  shieldPowerupImage,
  gameOverExplosionFrames, // Dodaj import
} from "./assets.js";
import {
  enemies,
  setEnemiesCanvas,
  startEnemySpawner,
  stopEnemySpawner,
  spawnEnemy,
  updateEnemies,
  drawEnemies,
  increaseDifficulty as increaseEnemiesDifficulty,
  enemySpawnRate,
} from "./enemies.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDiv = document.getElementById("score");
const asteroidsDestroyedDiv = document.getElementById("asteroids-destroyed");

//Player name
const playerNameDiv = document.getElementById("player-name");
const resetPlayerNameBtn = document.getElementById("reset-player-name");

let playerName = localStorage.getItem("playerName");
if (!playerName) {
  playerName = prompt("Podaj swoją nazwę gracza:");
  if (!playerName || playerName.trim() === "") playerName = "Gracz";
  localStorage.setItem("playerName", playerName);
}
playerNameDiv.textContent = "Gracz: " + playerName;

// Dodaj obsługę resetowania nazwy gracza
resetPlayerNameBtn.addEventListener("click", () => {
  const newName = prompt("Podaj nową nazwę gracza:");
  if (newName && newName.trim() !== "") {
    playerName = newName.trim();
    localStorage.setItem("playerName", playerName);
    playerNameDiv.textContent = "Gracz: " + playerName;
  }
});

const explosions = [];
const powerups = [];
const shieldPowerups = [];
let powerupActive = false;
let powerupTimer = 0;
let shieldActive = false;
let shieldTimer = 0;
// State
let score = 0;
let gameOver = false;

let difficultyLevel = 1;
let nextLevelScore = 100;

let asteroidsDestroyed = 0;

let showLevelUp = false;
let levelUpTimer = 0;
let bg1X = 0;

// Player
setupPlayer(canvas);
setupPlayerControls();
setEnemiesCanvas(canvas);
startEnemySpawner();

// Dodaj przełącznik wyciszenia
let isMuted = localStorage.getItem("isMuted") === "true";

// Dodaj przycisk wyciszenia do DOM
const muteBtn = document.createElement("button");
muteBtn.id = "mute-btn";
// Zmień położenie na prawy dolny róg
muteBtn.style.position = "fixed";
muteBtn.style.bottom = "20px";
muteBtn.style.right = "20px";
muteBtn.style.zIndex = 1000;
muteBtn.textContent = isMuted ? "🔇 Wyciszony" : "🔊 Dźwięk";
document.body.appendChild(muteBtn);

function updateMuteBtn() {
  muteBtn.textContent = isMuted ? "🔇 Wyciszony" : "🔊 Dźwięk";
}
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted);
  updateMuteBtn();
});
updateMuteBtn();

// Dodaj dźwięk strzału
const shootSound = new Audio("Sounds/Shooting_01.mp3");
shootSound.volume = 0.07;

// Dodaj dźwięk Level UP
const levelUpSound = new Audio("Sounds/LevelUP.wav");
levelUpSound.volume = 0.5;

// Dodaj dźwięk eksplozji asteroidy
const explosionSound = new Audio("Sounds/Explosion_01.wav");
explosionSound.volume = 0.06;

// Dodaj dźwięk przegranej (gracz trafiony)
const playerExplosionSound = new Audio("Sounds/Explosion_02.wav");
playerExplosionSound.volume = 0.25;

// Bullets
const bullets = [];
function shoot() {
  bullets.push({
    x: player.x + player.w / 2 - 12,
    y: player.y,
    w: 24,
    h: 32,
    speed: 7,
    frameIndex: 0,
    frameTimer: 0,
    frameDelay: 10,
  });
  // Odtwórz dźwięk strzału
  if (!isMuted) {
    try {
      shootSound.currentTime = 0;
      shootSound.play();
    } catch (e) {}
  }
}

let canShoot = true;
let shootCooldown = 0;

function handleShooting(delta) {
  shootCooldown -= delta;
  if (space && shootCooldown <= 0) {
    shoot();
    shootCooldown = player.shooting_speed / 10;
  }
}

// Collision
function isColliding(a, b) {
  const marginX = b.w * 0.2;
  const marginY = b.h * 0.2;
  return (
    a.x < b.x + b.w - marginX &&
    a.x + a.w > b.x + marginX &&
    a.y < b.y + b.h - marginY &&
    a.y + a.h > b.y + marginY
  );
}

function drawBullets() {
  for (const b of bullets) {
    // Rysujemy aktualną klatkę
    ctx.drawImage(bulletFrames[b.frameIndex], b.x, b.y, b.w, b.h);
  }
}

function drawBackground() {
  ctx.drawImage(bgLayer1, 0, bg1X, canvas.width, canvas.height);
  ctx.drawImage(bgLayer1, 0, bg1X - canvas.height, canvas.width, canvas.height);

  bg1X += 1;

  if (bg1X >= canvas.height) bg1X = 0;
}

function drawLevelUp() {
  if (showLevelUp) {
    ctx.save();
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
    ctx.shadowBlur = 30;

    ctx.fillStyle = `rgba(255, 215, 0, ${
      0.5 + 0.5 * Math.sin(performance.now() / 100)
    })`;
    ctx.fillText("LEVEL UP!", canvas.width / 2, canvas.height / 2);

    //"LEVEL UP!"
    ctx.font = "bold 18px Arial";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText(
      `Poziom: ${difficultyLevel}`,
      canvas.width / 2,
      canvas.height / 2 + 25
    );

    ctx.restore();
  }
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

let playerExplosion = null;
let pendingGameOver = false;

function drawPlayerExplosion() {
  if (playerExplosion) {
    const ex = playerExplosion;
    ctx.save();
    ctx.translate(ex.x + ex.w / 2, ex.y + ex.h / 2);
    const scaledW = ex.w * ex.scale;
    const scaledH = ex.h * ex.scale;
    ctx.drawImage(
      gameOverExplosionFrames[ex.frameIndex],
      -scaledW / 2,
      -scaledH / 2,
      scaledW,
      scaledH
    );
    ctx.restore();
  }
}

function increaseDifficulty() {
  difficultyLevel++;
  increaseEnemiesDifficulty();

  //Level UP
  if (!isMuted) {
    try {
      levelUpSound.currentTime = 0;
      levelUpSound.play();
    } catch (e) {}
  }

  showLevelUp = true;
  levelUpTimer = 1.4;
}

function update(delta) {
  if (playerExplosion) {
    playerExplosion.frameTimer++;
    if (playerExplosion.frameTimer >= playerExplosion.frameDelay) {
      playerExplosion.frameIndex++;
      playerExplosion.frameTimer = 0;
      if (playerExplosion.frameIndex >= gameOverExplosionFrames.length) {
        playerExplosion = null;
        if (pendingGameOver) {
          saveScore(playerName, score);
          window.location.reload();
        }
      }
    }
    return;
  }

  if (gameOver) return;

  if (showLevelUp) {
    levelUpTimer -= delta;
    if (levelUpTimer <= 0) {
      showLevelUp = false;
    }
  }

  const moveDist = player.speed * delta * 60;

  if (left) player.x -= moveDist;
  if (right) player.x += moveDist;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

  // Bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed * delta * 60;

    bullets[i].frameTimer += delta * 60;
    if (bullets[i].frameTimer >= bullets[i].frameDelay) {
      bullets[i].frameIndex = (bullets[i].frameIndex + 1) % bulletFrames.length;
      bullets[i].frameTimer = 0;
    }

    if (bullets[i].y + bullets[i].h < 0) {
      bullets.splice(i, 1);
    }
  }

  // Enemies
  updateEnemies(delta);

  // Power-upy
  for (let i = powerups.length - 1; i >= 0; i--) {
    powerups[i].y += powerups[i].speed * delta * 60;
    if (powerups[i].y > canvas.height) {
      powerups.splice(i, 1);
      continue;
    }
    if (
      powerups[i].x < player.x + player.w &&
      powerups[i].x + powerups[i].w > player.x &&
      powerups[i].y < player.y + player.h &&
      powerups[i].y + powerups[i].h > player.y
    ) {
      powerups.splice(i, 1);
      powerupActive = true;
      powerupTimer = 6;
      player.shooting_speed = 2.5;
    }
  }

  // Power-upy
  for (let i = shieldPowerups.length - 1; i >= 0; i--) {
    shieldPowerups[i].y += shieldPowerups[i].speed * delta * 60;
    if (shieldPowerups[i].y > canvas.height) {
      shieldPowerups.splice(i, 1);
      continue;
    }
    if (
      shieldPowerups[i].x < player.x + player.w &&
      shieldPowerups[i].x + shieldPowerups[i].w > player.x &&
      shieldPowerups[i].y < player.y + player.h &&
      shieldPowerups[i].y + shieldPowerups[i].h > player.y
    ) {
      shieldPowerups.splice(i, 1);
      shieldActive = true;
      shieldTimer = 10;
    }
  }

  // Efekt power-upa
  if (powerupActive) {
    powerupTimer -= delta;
    if (powerupTimer <= 0) {
      powerupActive = false;
      player.shooting_speed = 6;
    }
  }

  // Efekt power-upa (tarcza)
  if (shieldActive) {
    shieldTimer -= delta;
    if (shieldTimer <= 0) {
      shieldActive = false;
    }
  }

  // Bullet-enemy collision
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (isColliding(enemies[i], bullets[j])) {
        if (Math.random() < 0.06) {
          powerups.push({
            x: enemies[i].x + enemies[i].w / 2 - 16,
            y: enemies[i].y + enemies[i].h / 2 - 16,
            w: 32,
            h: 32,
            speed: 2.5,
          });
        }
        if (Math.random() < 0.04) {
          shieldPowerups.push({
            x: enemies[i].x + enemies[i].w / 2 - 16,
            y: enemies[i].y + enemies[i].h / 2 - 16,
            w: 32,
            h: 32,
            speed: 2.5,
          });
        }

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

        if (!isMuted) {
          try {
            explosionSound.currentTime = 0;
            explosionSound.play();
          } catch (e) {}
        }

        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        scoreDiv.textContent = "Wynik: " + score;

        asteroidsDestroyed++;
        asteroidsDestroyedDiv.textContent =
          "Zestrzelone asteroidy: " + asteroidsDestroyed;

        if (score >= nextLevelScore) {
          increaseDifficulty();
          nextLevelScore += 140;
        }
        break;
      }
    }
  }

  // Enemy-player collision
  for (const e of enemies) {
    if (isColliding(e, player)) {
      if (shieldActive) continue;

      if (!isMuted) {
        try {
          playerExplosionSound.currentTime = 0;
          playerExplosionSound.play();
        } catch (e) {}
      }

      playerExplosion = {
        x: player.x,
        y: player.y,
        w: player.w,
        h: player.h,
        frameIndex: 0,
        frameTimer: 0,
        frameDelay: 6,
        scale: 1.5,
      };

      gameOver = true;
      pendingGameOver = true;
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

function drawPowerups() {
  for (const p of powerups) {
    ctx.drawImage(powerupImage, p.x, p.y, p.w + 12, p.h);
  }
  for (const p of shieldPowerups) {
    ctx.drawImage(shieldPowerupImage, p.x, p.y, p.w + 12, p.h);
  }
}

// Tarcza
function drawShield() {
  if (shieldActive) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      player.x + player.w / 2,
      player.y + player.h / 2,
      player.w / 2 + 14,
      0,
      2 * Math.PI
    );
    ctx.strokeStyle = "rgba(33, 253, 253, 0.5)";
    ctx.lineWidth = 6;
    ctx.shadowColor = "#0ff";
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();
  }
}

function saveScore(name, score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  const existingIndex = leaderboard.findIndex((entry) => entry.name === name);

  if (existingIndex !== -1) {
    if (score > leaderboard[existingIndex].score) {
      leaderboard[existingIndex].score = score;
    }
  } else {
    leaderboard.push({ name, score });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard.splice(10);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  list.innerHTML = "";

  leaderboard.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} – ${entry.score}`;
    list.appendChild(li);
  });
}

showLeaderboard();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  if (!playerExplosion) {
    drawPlayer(ctx, playerImage, playerImageMove);
    drawShield();
  }
  drawBullets();
  drawEnemies(ctx);
  drawExplosions();
  drawPowerups();
  drawLevelUp();

  drawPlayerExplosion();

  //power-upa
  if (powerupActive) {
    ctx.save();
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#ff0";
    ctx.textAlign = "center";
    ctx.shadowColor = "#ff0";
    ctx.shadowBlur = 10;
    ctx.fillText(
      `Szybkie strzelanie: ${powerupTimer.toFixed(1)}s`,
      canvas.width / 2,
      40
    );
    ctx.restore();
  }
  if (shieldActive) {
    ctx.save();
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#0ff";
    ctx.textAlign = "center";
    ctx.shadowColor = "#0ff";
    ctx.shadowBlur = 10;
    ctx.fillText(`Tarcza: ${shieldTimer.toFixed(1)}s`, canvas.width / 2, 65);
    ctx.restore();
  }
}

let lastTime = 0;

function loop(currentTime = 0) {
  const delta = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  handleShooting(delta);
  update(delta);
  draw();

  if (!gameOver || playerExplosion) {
    requestAnimationFrame(loop);
  }
}

loop();
