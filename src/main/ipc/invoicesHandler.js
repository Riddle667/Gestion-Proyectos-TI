import { ipcMain } from 'electron'
import { getDatabase } from '../database/localDb'

const db = getDatabase()

// Obtener todas las facturas
ipcMain.handle('get-invoices', async () => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Consultando facturas...')
    db.all('SELECT * FROM Invoice ORDER BY id DESC', [], (err, rows) => {
      if (err) {
        console.error('❌ Error al consultar Invoice:', err)
        reject(err)
      } else {
        console.log(`✅ Obtenidas ${rows.length} facturas`)
        resolve(rows)
      }
    })
  })
})

// Agregar nueva factura
ipcMain.handle('add-invoice', async (event, invoiceData) => {
  return new Promise((resolve, reject) => {
    const {
      invoice_number,
      date,
      company_name = null,
      net_amount = null,
      tax_iva = null,
      purchase_order = null,
      dispatch_guide = null
    } = invoiceData
    // Validar campo requerido
    if (!invoice_number || !invoice_number.trim()) {
      reject('El número de factura es obligatorio')
      return
    }
    db.run(
      `INSERT INTO Invoice
       (invoice_number, date, company_name, net_amount, tax_iva, purchase_order, dispatch_guide)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [invoice_number, date, company_name, net_amount, tax_iva, purchase_order, dispatch_guide],
      function (err) {
        if (err) {
          console.error('❌ Error al agregar factura:', err)
          reject(err)
        } else {
          console.log(`✅ Factura agregada con ID: ${this.lastID}`)
          resolve({ id: this.lastID, ...invoiceData })
        }
      }
    )
  })
})
