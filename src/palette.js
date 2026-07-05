import { CONFIG } from './config.js';

// 속도에 따라 파랑 → 시안 → 흰색으로 변하는 팔레트를 미리 계산한다.
// 매 프레임 3만 개 파티클의 색을 계산해야 하므로 룩업 테이블을 쓴다.
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function colorAt(t) {
  // t: 0(느림) ~ 1(빠름)
  const stops = [
    { t: 0.0, r: 0x3b, g: 0x5b, b: 0xdb },
    { t: 0.5, r: 0x4d, g: 0xd0, b: 0xe1 },
    { t: 1.0, r: 0xff, g: 0xff, b: 0xff },
  ];
  let lo = stops[0];
  let hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const span = hi.t - lo.t || 1;
  const k = (t - lo.t) / span;
  const r = Math.round(lerp(lo.r, hi.r, k));
  const g = Math.round(lerp(lo.g, hi.g, k));
  const b = Math.round(lerp(lo.b, hi.b, k));
  return (r << 16) | (g << 8) | b;
}

export function createSpeedPalette() {
  const steps = CONFIG.paletteSteps;
  const table = new Array(steps);
  for (let i = 0; i < steps; i++) {
    table[i] = colorAt(i / (steps - 1));
  }
  return table;
}

export function tintForSpeed(palette, speed) {
  const t = Math.min(speed / CONFIG.speedForMaxColor, 1);
  const idx = Math.min((t * (palette.length - 1)) | 0, palette.length - 1);
  return palette[idx];
}
