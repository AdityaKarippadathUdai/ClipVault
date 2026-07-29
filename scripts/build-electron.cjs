const path = require('node:path');
const fs = require('node:fs');
const { build } = require('esbuild');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'dist-electron');

fs.mkdirSync(outDir, { recursive: true });

async function buildEntry(entry, outfile, format) {
  await build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: 'node',
    target: 'node20',
    format,
    sourcemap: false,
    external: ['electron', 'better-sqlite3'],
  });
}

(async () => {
  try {
    await Promise.all([
      buildEntry(path.join(rootDir, 'electron/main.ts'), path.join(outDir, 'main.js'), 'esm'),
      buildEntry(path.join(rootDir, 'electron/preload.ts'), path.join(outDir, 'preload.js'), 'cjs'),
    ]);
    console.log('Electron entrypoints built successfully');
  } catch (error) {
    console.error('Failed to build Electron entrypoints:', error);
    process.exit(1);
  }
})();
