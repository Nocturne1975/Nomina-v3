// Preload script. Expose minimal/safe APIs to the renderer.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('NOMINA', {
  apiBaseUrl: 'http://localhost:3000',
  cacheImage: async (url) => {
    try {
      return await ipcRenderer.invoke('nomina:cacheImage', url);
    } catch {
      return null;
    }
  },
});