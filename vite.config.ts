import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        babel: {
          plugins: [],
        },
      }),
      tailwindcss(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            GOOGLE_MAPS_API_KEY: env.VITE_GOOGLE_MAPS_API_KEY,
          },
        },
      }),
    ],
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
