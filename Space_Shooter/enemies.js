import { asteroidImages } from "./assets.js";

export const enemies = [];

let canvasRef = null;
export function setEnemiesCanvas(canvas) {
  canvasRef = canvas;
}

export let enemySpawnRate = 600;
let enemySpawner = null;

export function startEnemySpawner() {
  if (enemySpawner) clearInterval(enemySpawner);
  enemySpawner = setInterval(spawnEnemy, enemySpawnRate);
}

export function stopEnemySpawner() {
  if (enemySpawner) clearInterval(enemySpawner);
}

export function spawnEnemy() {
  if (!canvasRef) return;
  const size = 32 + Math.random() * 16;
  const x = Math.random() * (canvasRef.width - size);
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

export function updateEnemies(delta) {
  if (!canvasRef) return;
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemies[i].speed * delta * 60;
    if (enemies[i].y > canvasRef.height) enemies.splice(i, 1);
  }
}

export function drawEnemies(ctx) {
  for (const e of enemies) {
    const img = asteroidImages[e.asteroidIndex];
    ctx.drawImage(img, e.x, e.y, e.w, e.h);
  }
}

export function increaseDifficulty() {
  enemies.forEach((e) => (e.speed *= 1.1));
  if (enemySpawnRate > 200) {
    stopEnemySpawner();
    enemySpawnRate *= 0.9;
    startEnemySpawner();
  }
}
