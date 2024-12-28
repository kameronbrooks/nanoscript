
/*
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  // Provide a named entry so we can control final filenames
  entry: {
    'npm-main': 'src/npm-main.ts', // or wherever your main code resides
  },
  outDir: 'build',

  // We'll produce both CJS and ESM
  format: ['cjs', 'esm'],

  // If you want to run on both Node + modern JS runtimes
  // (or set "target": "esnext" if you know your audience)
  target: 'es2020',

  // Generate types
  dts: {
    entry: 'src/npm-main.ts'
  },

  // Removes old build files before each build
  clean: true,

  // Avoid code splitting so we get single-file outputs
  splitting: false,

  // Optionally create source maps
  sourcemap: true,
  
  // Rename outputs based on their format
  // so .cjs → .js and .esm → .mjs
  outExtension({ format }) {
    if (format === 'cjs') return { js: '.js' }
    if (format === 'esm') return { js: '.mjs' }
    return { js: '.js' } // fallback
  },
})
  */