import { defineConfig } from "vite";
import path from "node:path";

/* One file, three baked into it, landing where the hub serves it from. A page
   that wants an array should need one script tag and nothing else — an import
   map for three is a thing the person pasting this does not have. */
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, "src/index.js"),
      formats: ["es"],
      fileName: () => "rayl-array.js",
    },
    outDir: path.resolve(import.meta.dirname, "../assets/array"),
    emptyOutDir: false,
    target: "es2020",
    reportCompressedSize: true,
  },
});
