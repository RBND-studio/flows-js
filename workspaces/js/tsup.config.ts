import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/core/index.ts"],
  clean: true,
  format: ["cjs", "esm", "iife"],
  globalName: "flows",
  minify: true,
  dts: true,
});
