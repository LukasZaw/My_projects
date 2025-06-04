function createLayer(size, blur, opacity, blend, z) {
  const layer = document.createElement("div");
  layer.style.position = "fixed";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = z || "-1";
  layer.style.width = size + "px";
  layer.style.height = size + "px";
  layer.style.borderRadius = "50%";
  layer.style.filter = `blur(${blur}px)`;
  layer.style.opacity = opacity;
  layer.style.mixBlendMode = blend || "lighten";
  layer.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(layer);
  return layer;
}

const layer1 = createLayer(600, 60, 0.7, "lighten", "-2");
const layer2 = createLayer(400, 24, 0.8, "screen", "-1");
const layer3 = createLayer(300, 8, 0.9, "color-dodge", "-1");

let hue = 220,
  angle = 0;
setInterval(() => {
  hue = (hue + 1) % 360;
  angle = (angle + 0.5) % 360;
  layer1.style.background = `radial-gradient(circle at 60% 40%, hsla(${hue},100%,80%,0.22) 0%, hsla(${
    (hue + 60) % 360
  },100%,70%,0.18) 60%, transparent 100%)`;
  layer1.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  layer2.style.background = `radial-gradient(circle at 40% 60%, hsla(${
    (hue + 120) % 360
  },100%,85%,0.25) 0%, hsla(${
    (hue + 180) % 360
  },100%,60%,0.18) 70%, transparent 100%)`;
  layer2.style.transform = `translate(-50%, -50%) rotate(${-angle}deg)`;
  layer3.style.background = `radial-gradient(circle at 50% 50%, hsla(${
    (hue + 240) % 360
  },100%,95%,0.35) 0%, hsla(${
    (hue + 300) % 360
  },100%,80%,0.18) 60%, transparent 100%)`;
  layer3.style.transform = `translate(-50%, -50%) rotate(${angle * 2}deg)`;
}, 30);

let targetX = window.innerWidth / 2,
  targetY = window.innerHeight / 2;
let currentX = targetX,
  currentY = targetY;
document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
  layer1.style.opacity = "0.7";
  layer2.style.opacity = "0.8";
  layer3.style.opacity = "0.9";
});
document.addEventListener("mouseleave", () => {
  layer1.style.opacity = "0";
  layer2.style.opacity = "0";
  layer3.style.opacity = "0";
});
document.addEventListener("mouseenter", () => {
  layer1.style.opacity = "0.7";
  layer2.style.opacity = "0.8";
  layer3.style.opacity = "0.9";
});
function animate() {
  currentX += (targetX - currentX) * 0.12;
  currentY += (targetY - currentY) * 0.12;
  const t = Date.now() * 0.001;
  const scale1 = 1 + 0.08 * Math.sin(t * 1.2);
  const scale2 = 1 + 0.12 * Math.sin(t * 1.2 + 1.2);
  const scale3 = 1 + 0.16 * Math.sin(t * 1.2 + 2.4);
  layer1.style.left = currentX + "px";
  layer1.style.top = currentY + "px";
  layer1.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scale1})`;
  layer2.style.left = currentX + "px";
  layer2.style.top = currentY + "px";
  layer2.style.transform = `translate(-50%, -50%) rotate(${-angle}deg) scale(${scale2})`;
  layer3.style.left = currentX + "px";
  layer3.style.top = currentY + "px";
  layer3.style.transform = `translate(-50%, -50%) rotate(${
    angle * 2
  }deg) scale(${scale3})`;
  requestAnimationFrame(animate);
}
animate();
