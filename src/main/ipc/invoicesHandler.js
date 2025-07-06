import { ipcMain } from 'electron'
import { getDatabase } from '../database/localDb'

const db = getDatabase()

// Obtener todas las facturas
ipcMain.handle('get-invoices', () => {
  try {
    const rows = db
      .prepare(
        `
      SELECT
        Invoice.*,
        PurchaseOrder.purchase_order_number AS purchase_order_number,
        DispatchGuide.dispatch_guide_number AS dispatch_guide_number
      FROM Invoice
      LEFT JOIN PurchaseOrder ON Invoice.purchase_order_id = PurchaseOrder.id
      LEFT JOIN DispatchGuide ON Invoice.dispatch_guide_id = DispatchGuide.id
      ORDER BY Invoice.id DESC
    `
      )
      .all()

    return rows
  } catch (err) {
    console.error('❌ Error al consultar Invoice con joins:', err)
    throw err
  }
})

// Agregar nueva factura
ipcMain.handle('add-invoice', (event, invoiceData) => {
  const {
    invoice_number,
    date,
    end_date,
    company_name = null,
    net_amount = null,
    tax_iva = null,
    paid = false,
    purchase_order_id = null,
    dispatch_guide_id = null
  } = invoiceData

  if (!invoice_number || !invoice_number.trim()) {
    throw new Error('El número de factura es obligatorio')
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO Invoice
      (invoice_number, date, end_date, company_name, net_amount, tax_iva, paid, purchase_order_id, dispatch_guide_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      invoice_number,
      date,
      end_date,
      company_name,
      net_amount,
      tax_iva,
      paid ? 1 : 0,
      purchase_order_id,
      dispatch_guide_id
    )

    return { id: result.lastInsertRowid, ...invoiceData }
  } catch (err) {
    console.error('❌ Error al agregar factura:', err)
    throw err
  }
})

ipcMain.handle('update-invoice', (event, id, invoiceData) => {
  const {
    invoice_number,
    date,
    end_date = null,
    company_name = null,
    net_amount = null,
    tax_iva = null,
    paid = false,
    purchase_order_id = null,
    dispatch_guide_id = null
  } = invoiceData

  if (!invoice_number || !invoice_number.trim()) {
    throw new Error('El número de factura es obligatorio')
  }

  try {
    const stmt = db.prepare(`
      UPDATE Invoice
      SET invoice_number = ?,
          date = ?,
          end_date = ?,
          company_name = ?,
          net_amount = ?,
          tax_iva = ?,
          paid = ?,
          purchase_order_id = ?,
          dispatch_guide_id = ?
      WHERE id = ?
    `)

    const result = stmt.run(
      invoice_number,
      date,
      end_date,
      company_name,
      net_amount,
      tax_iva,
      paid ? 1 : 0,
      purchase_order_id,
      dispatch_guide_id,
      id
    )

    if (result.changes === 0) {
      throw new Error('No se encontró la factura a actualizar')
    }

    return { id, ...invoiceData }
  } catch (err) {
    console.error('❌ Error al actualizar factura:', err)
    throw err
  }
})

ipcMain.handle('delete-invoice', (event, id) => {
  try {
    const stmt = db.prepare('DELETE FROM Invoice WHERE id = ?')
    const result = stmt.run(id)

    if (result.changes === 0) {
      throw new Error('No se encontró la factura a eliminar')
    }

    return { id, deleted: true }
  } catch (err) {
    console.error('❌ Error al eliminar factura:', err)
    throw err
  }
})