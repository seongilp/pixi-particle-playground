import { MODES } from './config.js';

// 포인터 위치와 모드 전환/폭발/재배치 입력을 관리한다.
export function createInput(canvas, { onExplode, onScatter, onModeChange }) {
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let mode = MODES.ATTRACT;

  const KEY_TO_MODE = {
    1: MODES.ATTRACT,
    2: MODES.VORTEX,
    3: MODES.GRAVITY,
    4: MODES.REPEL,
    5: MODES.NOISE,
  };

  canvas.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  canvas.addEventListener('pointerdown', (e) => {
    onExplode?.(e.clientX, e.clientY);
  });

  window.addEventListener('keydown', (e) => {
    const next = KEY_TO_MODE[e.key];
    if (next && next !== mode) {
      mode = next;
      onModeChange?.(mode);
      return;
    }
    if (e.code === 'Space') {
      onScatter?.();
    }
  });

  return {
    pointer,
    getMode: () => mode,
  };
}
