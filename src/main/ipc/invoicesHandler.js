import { ipcMain } from 'electron'
import { getDatabase } from '../database/localDb'

const db = getDatabase()

// Obtener todas las facturas
ipcMain.handle('get-invoices', () => {
  try {
    console.log('🔄 Consultando facturas...')
    const rows = db.prepare('SELECT * FROM Invoice ORDER BY id DESC').all()
    console.log(`✅ Obtenidas ${rows.length} facturas`)
    return rows
  } catch (err) {
    console.error('❌ Error al consultar Invoice:', err)
    throw err
  }
})

// Agregar nueva factura
ipcMain.handle('add-invoice', (event, invoiceData) => {
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
    throw new Error('El número de factura es obligatorio')
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO Invoice
      (invoice_number, date, company_name, net_amount, tax_iva, purchase_order, dispatch_guide)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      invoice_number,
      date,
      company_name,
      net_amount,
      tax_iva,
      purchase_order,
      dispatch_guide
    )

    console.log(`✅ Factura agregada con ID: ${result.lastInsertRowid}`)

    return { id: result.lastInsertRowid, ...invoiceData }
  } catch (err) {
    console.error('❌ Error al agregar factura:', err)
    throw err
  }
})
