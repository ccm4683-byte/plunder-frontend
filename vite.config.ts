import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),          // 핵심: 이제 일반 리액트 앱으로 동작합니다.
    tailwindcss(),    // 디자인(Tailwind) 유지
    tsconfigPaths(),  // 경로 설정 유지
  ],
});