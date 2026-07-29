const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  try {
    await import('tsx/esm');
    const entryUrl = pathToFileURL(path.join(__dirname, 'main.ts'));
    await import(entryUrl.href);
  } catch (error) {
    console.error('Failed to start ClipVault Electron app:', error);
    process.exit(1);
  }
})();
