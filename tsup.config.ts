import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cloud/index.ts"],
  clean: true,
  format: ["cjs", "esm", "iife"],
  globalName: "FlowsJS",
  minify: true,
  dts: true,
});
