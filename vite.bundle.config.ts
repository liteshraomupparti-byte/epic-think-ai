import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  publicDir: false,
  build: {
    outDir: "public/intro",
    emptyOutDir: false,
    lib: {
      entry: fileURLToPath(new URL("./src/introEntry.ts", import.meta.url)),
      name: "EpicThinkIntroModule",
      fileName: () => "epic-think-intro.bundle.js",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "epic-think-intro.bundle.css";
          }
          return "[name].[ext]";
        },
      },
    },
  },
});
