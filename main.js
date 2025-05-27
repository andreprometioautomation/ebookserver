const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let nextProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL('http://localhost:3000');
}

function startNextServer() {
  // Ejecuta "next dev" como proceso hijo
  nextProcess = spawn('npx', ['next', 'dev'], {
    shell: true,
    cwd: path.join(__dirname), // carpeta donde está tu app Next.js
    stdio: 'inherit',
  });

  // Escucha salida para saber cuándo está listo (opcional)
  nextProcess.stdout && nextProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    if (output.includes('ready - started server on')) {
      createWindow();
    }
  });

  // Maneja si el proceso Next falla o cierra
  nextProcess.on('exit', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    app.quit();
  });
}

app.whenReady().then(() => {
  startNextServer();
});

app.on('window-all-closed', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});