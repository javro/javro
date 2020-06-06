import { BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

export function setMainWindow(window: BrowserWindow | null) {
  mainWindow = window;
}

export function getMainWindow(): Electron.BrowserWindow | null {
  return mainWindow;
}
