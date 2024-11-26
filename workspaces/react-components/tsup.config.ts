import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/tour.ts"],
  clean: true,
  format: ["cjs", "esm"],
  minify: true,
  dts: true,
  platform: "browser",
  banner: {
    js: '"use client"',
  },
  loader: {
    ".css": "local-css",
  },
});
