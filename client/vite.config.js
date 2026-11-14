import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const { BOOKSYNC_API_TARGET } = loadEnv(mode, __dirname, "BOOKSYNC_");
  const proxy = {
    "/api": {
      target: BOOKSYNC_API_TARGET || "http://127.0.0.1:5000",
      changeOrigin: true,
    },
  };

  return {
    plugins: [react()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    server: { port: 5173, strictPort: true, proxy },
    preview: { proxy },
  };
});
