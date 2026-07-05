import { Particle, ParticleContainer } from 'pixi.js';
import { CONFIG, MODES } from './config.js';
import { forceFor } from './forces.js';
import { createSpeedPalette, tintForSpeed } from './palette.js';

// 파티클 시뮬레이션. 성능상 파티클 상태(x, y, vx, vy)는 in-place로 갱신한다.
export function createParticleSystem(texture, bounds) {
  const container = new ParticleContainer({
    dynamicProperties: {
      position: true,
      color: true,
      scale: false,
      rotation: false,
      uvs: false,
    },
  });

  const palette = createSpeedPalette();
  const count = CONFIG.particleCount;
  const particles = new Array(count);
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const accel = { ax: 0, ay: 0 };
  let time = 0; // 노이즈 흐름장 시간축

  for (let i = 0; i < count; i++) {
    const p = new Particle({
      texture,
      x: Math.random() * bounds.width,
      y: Math.random() * bounds.height,
      anchorX: 0.5,
      anchorY: 0.5,
      tint: palette[0],
      alpha: 0.85,
    });
    particles[i] = p;
    container.addParticle(p);
  }

  function update(dt, mode, pointer) {
    const applyForce = forceFor(mode);
    const damping = Math.pow(CONFIG.damping, dt * 60);
    const wrap = mode !== MODES.GRAVITY;
    const { width, height } = bounds;
    time += dt;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      applyForce(p, pointer, accel, time);

      vx[i] = (vx[i] + accel.ax * dt) * damping;
      vy[i] = (vy[i] + accel.ay * dt) * damping;
      let x = p.x + vx[i] * dt;
      let y = p.y + vy[i] * dt;

      if (wrap) {
        if (x < 0) x += width;
        else if (x > width) x -= width;
        if (y < 0) y += height;
        else if (y > height) y -= height;
      } else {
        if (x < 0) {
          x = 0;
          vx[i] = -vx[i] * CONFIG.bounceRestitution;
        } else if (x > width) {
          x = width;
          vx[i] = -vx[i] * CONFIG.bounceRestitution;
        }
        if (y > height) {
          y = height;
          vy[i] = -vy[i] * CONFIG.bounceRestitution;
          vx[i] *= 0.92; // 바닥 마찰
        }
      }

      p.x = x;
      p.y = y;
      p.tint = tintForSpeed(palette, Math.hypot(vx[i], vy[i]));
    }
  }

  function explode(cx, cy) {
    const radius = CONFIG.explosionRadius;
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius || dist === 0) continue;
      const power = CONFIG.explosionStrength * (1 - dist / radius);
      vx[i] += (dx / dist) * power;
      vy[i] += (dy / dist) * power;
    }
  }

  function scatter() {
    for (let i = 0; i < count; i++) {
      particles[i].x = Math.random() * bounds.width;
      particles[i].y = Math.random() * bounds.height;
      vx[i] = 0;
      vy[i] = 0;
    }
  }

  return { container, update, explode, scatter, count };
}
