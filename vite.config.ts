import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Default: a normal split build with relative paths, so sections load
    // their code on demand. `SINGLEFILE=1 npm run build` produces the old
    // everything-in-one-HTML bundle (used by `build_artifact.py --inline`).
    base: './',
    plugins: [react(), tailwindcss(), ...(process.env.SINGLEFILE ? [viteSingleFile()] : [])],
    build: process.env.SINGLEFILE
      ? { assetsInlineLimit: 100000000, cssCodeSplit: false }
      : { cssCodeSplit: false, assetsInlineLimit: 0 },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
