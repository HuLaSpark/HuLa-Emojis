import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (file: string) => path.resolve(__dirname, file);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { "@": resolve("src") } },
});
