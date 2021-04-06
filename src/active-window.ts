import { BrowserWindow } from 'electron';

let activeWindow: BrowserWindow | null = null;

export function setActiveWindow(window: BrowserWindow | null) {
  activeWindow = window;
}

export function getActiveWindow(): Electron.BrowserWindow | null {
  return activeWindow;
}
