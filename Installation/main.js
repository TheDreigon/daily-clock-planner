const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let savesDir;

function createWindow() {
  // Create Saves folder in the same directory as the executable
  const appDir = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
  savesDir = path.join(appDir, 'Saves');
  
  if (!fs.existsSync(savesDir)) {
    fs.mkdirSync(savesDir, { recursive: true });
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#0f172a',
    title: 'Daily Clock Planner'
  });

  mainWindow.loadFile('index.html');
  
  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle save/load
ipcMain.handle('save-file', async (event, data) => {
  const result = await dialog.showSaveDialog({
    defaultPath: path.join(savesDir, `activities_${new Date().toISOString().split('T')[0]}.json`),
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  
  if (!result.canceled) {
    fs.writeFileSync(result.filePath, data);
    return true;
  }
  return false;
});

ipcMain.handle('load-file', async () => {
  const result = await dialog.showOpenDialog({
    defaultPath: savesDir,
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return fs.readFileSync(result.filePaths[0], 'utf8');
  }
  return null;
});