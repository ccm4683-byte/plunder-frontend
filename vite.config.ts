import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),          // 리액트 필수
    tailwindcss(),    // 디자인 유지 (지우면 안됨!)
    tsconfigPaths(),  // 경로 설정 유지 (지우면 안됨!)
  ],
});