
import { app, BrowserWindow, ipcMain } from 'electron';
import App from './app';
import { Communication } from './communication';

App.main(app, BrowserWindow);

new Communication(ipcMain);