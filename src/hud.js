import { MODE_LABELS } from './config.js';

// 좌상단 HUD: 모드 목록, 파티클 수, FPS 표시
export function createHud(particleCount) {
  const el = document.getElementById('hud');
  let fps = 0;

  function render(mode) {
    const modeLines = Object.entries(MODE_LABELS)
      .map(([key, label]) =>
        key === mode ? `<span class="active">▸ ${label}</span>` : `  ${label}`,
      )
      .join('\n');
    el.innerHTML =
      `${modeLines}\n\n` +
      `클릭: 폭발 / Space: 재배치\n` +
      `particles: ${particleCount.toLocaleString()}\n` +
      `fps: ${fps}`;
  }

  function setFps(value, mode) {
    fps = Math.round(value);
    render(mode);
  }

  return { render, setFps };
}
