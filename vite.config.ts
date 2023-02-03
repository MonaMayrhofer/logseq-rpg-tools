import reactPlugin from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import logseqDevPlugin from "vite-plugin-logseq";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint({
      lintOnStart: true,
    }),
    logseqDevPlugin(),
    reactPlugin(),
  ],
  // Makes HMR available for development
  build: {
    target: "esnext",
    minify: "esbuild",
  },
});
