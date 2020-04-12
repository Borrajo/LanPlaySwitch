import { BrowserWindow } from 'electron';
import { join } from 'path';
export default class App {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow: typeof BrowserWindow;

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            App.application.quit();
        }
    }

    private static onClose() {
        // Dereference the window object. 
        App.mainWindow = null;
    }
    private static onActivate() {
        if (App.BrowserWindow.getAllWindows().length === 0) {
            App.onReady()

        }
    }

    private static onReady() {
        App.mainWindow = new App.BrowserWindow({
            width: 460,
            height: 600,
            darkTheme: false,
            fullscreenable: false,
            resizable: false,
            autoHideMenuBar: true,
            maximizable: false,
            webPreferences: {
                nodeIntegration: true,
            },
        });
        App.mainWindow
            .loadFile(join(__dirname, `dist/index.html`));
        App.mainWindow.on('closed', App.onClose);
        // App.mainWindow.webContents.openDevTools();
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        // we pass the Electron.App object and the  
        // Electron.BrowserWindow into this function 
        // so this class has no dependencies. This 
        // makes the code easier to write tests for 
        App.BrowserWindow = browserWindow;
        App.application = app;
        App.application.on('window-all-closed', App.onWindowAllClosed);
        App.application.on('ready', App.onReady);
        App.application.on('activate', App.onActivate);
    }
}