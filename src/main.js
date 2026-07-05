import { Application, Graphics } from 'pixi.js';
import { CONFIG } from './config.js';
import { createParticleSystem } from './particleSystem.js';
import { createInput } from './input.js';
import { createHud } from './hud.js';

async function bootstrap() {
  const app = new Application();
  await app.init({
    resizeTo: window,
    background: CONFIG.background,
    antialias: false,
    preference: 'webgl',
  });
  document.body.appendChild(app.canvas);

  // 원형 파티클 텍스처 생성
  const g = new Graphics().circle(0, 0, CONFIG.particleRadius).fill(0xffffff);
  const texture = app.renderer.generateTexture(g);
  g.destroy();

  const bounds = { width: app.screen.width, height: app.screen.height };
  app.renderer.on('resize', (width, height) => {
    bounds.width = width;
    bounds.height = height;
  });

  const system = createParticleSystem(texture, bounds);
  app.stage.addChild(system.container);

  const hud = createHud(system.count);
  const input = createInput(app.canvas, {
    onExplode: (x, y) => system.explode(x, y),
    onScatter: () => system.scatter(),
    onModeChange: (mode) => hud.render(mode),
  });
  hud.render(input.getMode());

  let hudTimer = 0;
  app.ticker.add((ticker) => {
    const dt = Math.min(ticker.deltaMS / 1000, 1 / 30); // 탭 복귀 시 폭주 방지
    system.update(dt, input.getMode(), input.pointer);

    hudTimer += ticker.deltaMS;
    if (hudTimer > 500) {
      hudTimer = 0;
      hud.setFps(ticker.FPS, input.getMode());
    }
  });
}

bootstrap().catch((err) => {
  console.error('[particle-playground] bootstrap failed:', err);
  document.body.insertAdjacentHTML(
    'beforeend',
    `<pre style="color:#f66;padding:16px">초기화 실패: ${err?.message ?? err}</pre>`,
  );
});
