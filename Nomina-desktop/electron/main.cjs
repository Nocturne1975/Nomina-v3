const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { startLocalApi } = require('./localApi.cjs');
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');
const http = require('http');
const https = require('https');

const isDev = !app.isPackaged;

let apiHandle = null;

function getImageCacheDir() {
  return path.join(app.getPath('userData'), 'image-cache');
}

function hashToFilename(url) {
  const h = crypto.createHash('sha256').update(String(url)).digest('hex');
  return `${h}.img`;
}

async function fileExists(filePath) {
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function downloadToFile(url, destPath) {
  await fsp.mkdir(path.dirname(destPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const client = u.protocol === 'https:' ? https : http;

    const req = client.get(
      {
        protocol: u.protocol,
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          'User-Agent': 'Nomina-desktop',
          Accept: 'image/*,*/*;q=0.8',
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Redirect
          res.resume();
          return downloadToFile(res.headers.location, destPath).then(resolve, reject);
        }

        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }

        const tmpPath = `${destPath}.tmp`;
        const file = fs.createWriteStream(tmpPath);
        res.pipe(file);

        file.on('finish', async () => {
          try {
            file.close();
            await fsp.rename(tmpPath, destPath);
            resolve();
          } catch (e) {
            reject(e);
          }
        });

        file.on('error', async (err) => {
          try {
            file.close();
            await fsp.rm(tmpPath, { force: true });
          } catch {}
          reject(err);
        });
      }
    );

    req.on('error', reject);
    req.end();
  });
}

async function ensureLocalApi() {
  try {
    apiHandle = await startLocalApi({ port: 3000 });
    console.log(`[offline-api] OK sur http://localhost:${apiHandle.port}`);
  } catch (e) {
    if (e && e.code === 'EADDRINUSE') {
      console.log('[offline-api] Port 3000 déjà utilisé, skip.');
      return;
    }
    console.error('[offline-api] Impossible de démarrer:', e);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  if (isDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
    if (process.env.ELECTRON_OPEN_DEVTOOLS === '1') {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

ipcMain.handle('nomina:cacheImage', async (_evt, url) => {
  if (!url || typeof url !== 'string') return null;
  if (!/^https?:\/\//i.test(url)) return null;

  const dir = getImageCacheDir();
  const filename = hashToFilename(url);
  const destPath = path.join(dir, filename);

  if (await fileExists(destPath)) {
    return `file://${destPath.replace(/\\/g, '/')}`;
  }

  // Si offline ou téléchargement échoue, on renvoie null et l’UI gardera l’URL originale.
  try {
    await downloadToFile(url, destPath);
    return `file://${destPath.replace(/\\/g, '/')}`;
  } catch {
    return null;
  }
});

app.whenReady().then(async () => {
  await ensureLocalApi();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  try { apiHandle?.close?.(); } catch {}
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
