import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Separate node_modules into a vendor chunk
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // You can adjust this if the chunk size is still too large
  },
});
