import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  platform: 'node',
  target: 'node20',
  shims: true,
});
