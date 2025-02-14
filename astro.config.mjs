import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: vercel(),
  resolve: {
    alias: {
      crypto: 'crypto-browserify',  // Polyfill para `crypto` en el navegador
    },
  },
});