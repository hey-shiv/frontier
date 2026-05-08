import { app, BrowserWindow, ipcMain, dialog, Notification } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV !== "production";
const WEB_DEV_URL = process.env.WEBSITE_URL ?? "http://localhost:3000";
const WEB_DIST = path.join(__dirname, "../web-dist");

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL(WEB_DEV_URL);
  } else {
    win.loadFile(path.join(WEB_DIST, "index.html"));
  }
}

// --- IPC Handlers ---

// Dialog
ipcMain.handle("dialog:open", async (_, opts) => {
  const result = await dialog.showOpenDialog(opts);
  return result.canceled ? [] : result.filePaths;
});

ipcMain.handle("dialog:save", async (_, opts) => {
  const result = await dialog.showSaveDialog(opts);
  return result.canceled ? null : result.filePath;
});

// File system — path traversal guard: restrict to home dir and userData
const ALLOWED_ROOTS = [app.getPath("home"), app.getPath("userData")];

function isPathAllowed(p: string): boolean {
  const resolved = path.resolve(p);
  // Reject anything with null bytes or traversal components
  if (p.includes("\0") || p.includes("..")) return false;
  return ALLOWED_ROOTS.some((root) => resolved.startsWith(root + path.sep) || resolved === root);
}

ipcMain.handle("fs:read", async (_, filePath: string) => {
  if (!isPathAllowed(filePath)) throw new Error("fs:read — path not allowed");
  return fs.readFile(filePath, "utf-8");
});

ipcMain.handle("fs:write", async (_, filePath: string, data: string) => {
  if (!isPathAllowed(filePath)) throw new Error("fs:write — path not allowed");
  await fs.writeFile(filePath, data, "utf-8");
});

// Notifications
ipcMain.handle("notification:show", (_, title: string, body: string) => {
  new Notification({ title, body }).show();
});

// Window controls
ipcMain.handle("window:minimize", () => win?.minimize());
ipcMain.handle("window:maximize", () => {
  if (win?.isMaximized()) {
    win.unmaximize();
  } else {
    win?.maximize();
  }
});
ipcMain.handle("window:close", () => win?.close());

// --- App lifecycle ---

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
