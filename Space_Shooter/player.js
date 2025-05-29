// Player state and controls
export const player = {
  x: 0,
  y: 0,
  w: 60,
  h: 60,
  speed: 5,
  shooting_speed: 6,
};

export let left = false;
export let right = false;
export let space = false;

export function setupPlayer(canvas) {
  player.x = canvas.width / 2 - 30;
  player.y = canvas.height - 70;
}

export function setupPlayerControls() {
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
}

export function drawPlayer(ctx, playerImage, playerImageMove) {
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
