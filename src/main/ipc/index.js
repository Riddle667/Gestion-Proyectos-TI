const { ipcMain } = require('electron')
const { backupToCloud, restoreFromCloud } = require('../services/syncService')

ipcMain.handle('sync:backup', () => {
  return backupToCloud()
})

ipcMain.handle('sync:restore', () => {
  return restoreFromCloud()
})
