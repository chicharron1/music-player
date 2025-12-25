const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');

function createWindow() {

    const ventana = new BrowserWindow({
        width: 380,
        height: 580,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    ventana.loadFile('index.html');
    ventana.setMenuBarVisibility(false);

    ipcMain.handle('dialog:openFolder', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(ventana, {
            properties: ['openDirectory']
        });
        if (canceled){
            return null;
        } else {
            return filePaths[0];
        }
    });

    ipcMain.handle('fs:leerArchivos', async (_, carpetaPath) => {
        const archivos = fs.readdirSync(carpetaPath);

        return archivos
        .filter(f => f.endsWith('.mp3') || f.endsWith('.wav'))
        .map(f => {
            const nombre_cancion = path.basename(f, path.extname(f));
            const letraPath = path.join(carpetaPath, `${nombre_cancion}_letra.txt`);

            return {
                nombre: nombre_cancion,
                audio: f,
                ...(fs.existsSync(letraPath) && { letra: letraPath })
            };
        });
    });
}

app.whenReady().then(createWindow);