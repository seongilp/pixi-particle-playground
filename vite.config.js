import { defineConfig } from 'vite';

// GitHub Pages는 https://<user>.github.io/<repo>/ 경로로 서빙되므로
// 상대 경로 base를 써서 어느 경로에서든 동작하게 한다.
export default defineConfig({
  base: './',
});
