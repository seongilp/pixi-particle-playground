import { CONFIG, MODES } from './config.js';

// 각 모드가 파티클 하나에 가하는 가속도(ax, ay)를 out 객체에 채운다.
// 3만 개 × 60fps 핫루프이므로 객체 할당 없이 out을 재사용한다.

function applyAttract(p, pointer, out) {
  const dx = pointer.x - p.x;
  const dy = pointer.y - p.y;
  const rawDist = Math.hypot(dx, dy);
  const dist = Math.max(rawDist, CONFIG.minDistance);
  const a = CONFIG.attractStrength / (dist * 0.02 + 1);
  // 코어 안쪽에서는 밀어내서 파티클이 한 점으로 수렴하지 않게 한다
  const radial = rawDist < CONFIG.coreRadius ? -a * 1.6 : a;
  out.ax = (dx / dist) * radial;
  out.ay = (dy / dist) * radial;
}

function applyVortex(p, pointer, out) {
  const dx = pointer.x - p.x;
  const dy = pointer.y - p.y;
  const rawDist = Math.hypot(dx, dy);
  const dist = Math.max(rawDist, CONFIG.minDistance);
  const nx = dx / dist;
  const ny = dy / dist;
  const falloff = 1 / (dist * 0.008 + 1);
  // 접선 방향(반시계) + 중심 흡인. 코어 안쪽은 밀어내서 링 궤도를 만든다
  const pull = rawDist < CONFIG.coreRadius ? -CONFIG.vortexPull * 2 : CONFIG.vortexPull;
  out.ax = -ny * CONFIG.vortexStrength * falloff + nx * pull * falloff;
  out.ay = nx * CONFIG.vortexStrength * falloff + ny * pull * falloff;
}

function applyGravity(p, pointer, out) {
  const dx = p.x - pointer.x;
  const dy = p.y - pointer.y;
  const dist = Math.max(Math.hypot(dx, dy), CONFIG.minDistance);
  const repel = CONFIG.repelStrength / (dist * 0.05 + 1);
  out.ax = (dx / dist) * repel;
  out.ay = (dy / dist) * repel + CONFIG.gravity;
}

function applyRepel(p, pointer, out) {
  const dx = p.x - pointer.x;
  const dy = p.y - pointer.y;
  const dist = Math.max(Math.hypot(dx, dy), CONFIG.minDistance);
  const a = CONFIG.mouseRepelStrength / (dist * CONFIG.mouseRepelFalloff + 1);
  out.ax = (dx / dist) * a;
  out.ay = (dy / dist) * a;
}

function applyNoise(p, pointer, out, time) {
  // sin/cos 조합으로 만든 유사 노이즈 흐름장. 시간이 흐르면 장이 천천히 뒤틀린다.
  const f = CONFIG.noiseFreq;
  const t = time * CONFIG.noiseTimeScale;
  const angle =
    (Math.sin(p.x * f + t) + Math.cos(p.y * f - t * 0.7)) * Math.PI +
    Math.sin((p.x + p.y) * f * 0.5 + t * 0.3);
  out.ax = Math.cos(angle) * CONFIG.noiseStrength;
  out.ay = Math.sin(angle) * CONFIG.noiseStrength;

  // 마우스 근처는 밀어내서 흐름을 헤치고 다닐 수 있게 한다
  const dx = p.x - pointer.x;
  const dy = p.y - pointer.y;
  const dist = Math.hypot(dx, dy);
  if (dist < CONFIG.noiseMouseRadius && dist > 0) {
    const push = CONFIG.mouseRepelStrength * (1 - dist / CONFIG.noiseMouseRadius);
    out.ax += (dx / dist) * push;
    out.ay += (dy / dist) * push;
  }
}

const FORCE_BY_MODE = {
  [MODES.ATTRACT]: applyAttract,
  [MODES.VORTEX]: applyVortex,
  [MODES.GRAVITY]: applyGravity,
  [MODES.REPEL]: applyRepel,
  [MODES.NOISE]: applyNoise,
};

export function forceFor(mode) {
  return FORCE_BY_MODE[mode] ?? applyAttract;
}
