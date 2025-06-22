import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  backup: () => ipcRenderer.invoke('sync:backup'),
  restore: () => ipcRenderer.invoke('sync:restore')
}

contextBridge.exposeInMainWorld('electronAPI', {
  getPurchaseOrders: () => ipcRenderer.invoke('get-purchase-orders'),
  addPurchaseOrder: (orderNumber) => ipcRenderer.invoke('add-purchase-order', orderNumber)
})

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
