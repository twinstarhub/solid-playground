import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig((env) => ({
  plugins: [solidPlugin(), WindiCSS()],
  define: {
    'process.env.BABEL_TYPES_8_BREAKING': 'true',
    'process.env.NODE_DEBUG': 'false',
    ...(env.command == 'build' ? {} : { global: 'globalThis' }),
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
    rollupOptions: {
      output: {
        manualChunks: {},
      },
    },
  },
}));
