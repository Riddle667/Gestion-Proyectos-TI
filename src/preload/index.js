import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  getCurrentUser: () => ipcRenderer.invoke('auth:getCurrentUser'),
  backup: () => ipcRenderer.invoke('sync:backup'),
  restore: () => ipcRenderer.invoke('sync:restore')
}

contextBridge.exposeInMainWorld('electronAPI', {
  // ============================
  // 🧾 Facturas (Invoices)
  // ============================
  getInvoices: () => ipcRenderer.invoke('get-invoices'),
  addInvoice: (invoiceData) => ipcRenderer.invoke('add-invoice', invoiceData),
  updateInvoice: (id, invoiceData) => ipcRenderer.invoke('update-invoice', id, invoiceData),
  deleteInvoice: (id) => ipcRenderer.invoke('delete-invoice', id),

  // ============================
  // 📦 Órdenes de compra (Purchase Orders)
  // ============================
  getPurchaseOrders: () => ipcRenderer.invoke('get-purchase-orders'),
  addPurchaseOrder: (orderData) => ipcRenderer.invoke('add-purchase-order', orderData),
  updatePurchaseOrder: (id, orderData) => ipcRenderer.invoke('update-purchase-order', id, orderData),
  deletePurchaseOrder: (id) => ipcRenderer.invoke('delete-purchase-order', id),

  // ============================
  // 🚚 Guías de despacho (Dispatch Guides)
  // ============================
  getDispatchGuides: () => ipcRenderer.invoke('get-dispatch-guides'),
  addDispatchGuide: (guideData) => ipcRenderer.invoke('add-dispatch-guide', guideData),
  updateDispatchGuide: (id, guideData) => ipcRenderer.invoke('update-dispatch-guide', id, guideData),
  deleteDispatchGuide: (id) => ipcRenderer.invoke('delete-dispatch-guide', id),
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
