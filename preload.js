const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
    leerArchivos: (folderPath) => ipcRenderer.invoke('fs:leerArchivos', folderPath)
});
