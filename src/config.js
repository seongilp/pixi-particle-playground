export const CONFIG = {
  particleCount: 100_000,
  particleRadius: 2,
  background: '#0b0e17',

  // 시뮬레이션 계수
  damping: 0.965, // 프레임당 속도 감쇠
  attractStrength: 1200, // 끌림 모드 가속도
  vortexStrength: 1400, // 소용돌이 접선 가속도
  vortexPull: 260, // 소용돌이 중심 흡인력
  gravity: 900, // 중력 모드 하향 가속도 (px/s^2)
  repelStrength: 1600, // 중력 모드에서 마우스 반발력
  explosionStrength: 900, // 클릭 폭발 초기 속도
  explosionRadius: 320, // 폭발 영향 반경
  minDistance: 40, // 힘 계산 시 최소 거리 (발산 방지)
  coreRadius: 80, // 이 반경 안에서는 밀어내서 한 점 수렴을 막는다
  bounceRestitution: 0.55, // 바닥 반발 계수

  // 반발 모드
  mouseRepelStrength: 2200, // 마우스 반발 가속도
  mouseRepelFalloff: 0.02, // 거리 감쇠 계수

  // 노이즈 필드 모드
  noiseStrength: 750, // 흐름장 가속도
  noiseFreq: 0.0035, // 공간 주파수 (작을수록 큰 소용돌이)
  noiseTimeScale: 0.45, // 흐름장이 변하는 속도
  noiseMouseRadius: 180, // 노이즈 모드에서 마우스가 밀어내는 반경

  // 속도 → 색상 매핑
  speedForMaxColor: 900,
  paletteSteps: 64,
};

export const MODES = {
  ATTRACT: 'attract',
  VORTEX: 'vortex',
  GRAVITY: 'gravity',
  REPEL: 'repel',
  NOISE: 'noise',
};

export const MODE_LABELS = {
  [MODES.ATTRACT]: '1 끌림',
  [MODES.VORTEX]: '2 소용돌이',
  [MODES.GRAVITY]: '3 중력',
  [MODES.REPEL]: '4 반발',
  [MODES.NOISE]: '5 노이즈',
};
