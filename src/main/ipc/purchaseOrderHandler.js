import { ipcMain } from 'electron'
import { getDatabase } from '../database/localDb'

const db = getDatabase()

// Obtener todas las órdenes de compra
ipcMain.handle('get-purchase-orders', () => {
  try {
    const rows = db.prepare('SELECT * FROM PurchaseOrder ORDER BY id DESC').all()
    console.log(`✅ Obtenidas ${rows.length} órdenes de compra`)
    return rows
  } catch (err) {
    console.error('❌ Error al consultar PurchaseOrder:', err)
    throw err
  }
})

// Agregar nueva orden de compra
ipcMain.handle('add-purchase-order', (event, orderData) => {
  const {
    purchase_order_number,
    company_name = null,
    company_representative = null,
    date = null,
    order_amount = null
  } = orderData

  if (!purchase_order_number?.trim()) {
    throw new Error('El número de orden es requerido')
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO PurchaseOrder
      (purchase_order_number, company_name, company_representative, date, order_amount)
      VALUES (?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      purchase_order_number.trim(),
      company_name?.trim() || null,
      company_representative?.trim() || null,
      date || null,
      order_amount || null
    )

    const newOrder = {
      id: result.lastInsertRowid,
      purchase_order_number,
      company_name,
      company_representative,
      date,
      order_amount
    }

    console.log('✅ Orden registrada:', newOrder)
    return newOrder
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('Ya existe una orden con ese número')
    }
    console.error('❌ Error al insertar orden:', err)
    throw err
  }
})

// Actualizar una orden existente
ipcMain.handle('update-purchase-order', (event, id, orderData) => {
  const {
    purchase_order_number,
    company_name = null,
    company_representative = null,
    date = null,
    order_amount = null
  } = orderData

  if (!purchase_order_number?.trim()) {
    throw new Error('El número de orden es requerido')
  }

  try {
    const stmt = db.prepare(`
      UPDATE PurchaseOrder SET
        purchase_order_number = ?,
        company_name = ?,
        company_representative = ?,
        date = ?,
        order_amount = ?
      WHERE id = ?
    `)

    const result = stmt.run(
      purchase_order_number.trim(),
      company_name?.trim() || null,
      company_representative?.trim() || null,
      date || null,
      order_amount || null,
      id
    )

    if (result.changes === 0) {
      throw new Error('No se encontró la orden a actualizar')
    }

    console.log('✅ Orden actualizada:', { id, ...orderData })
    return { id, ...orderData }
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('Ya existe una orden con ese número')
    }
    console.error('❌ Error al actualizar orden:', err)
    throw err
  }
})

// Eliminar una orden
ipcMain.handle('delete-purchase-order', (event, id) => {
  try {
    const result = db.prepare('DELETE FROM PurchaseOrder WHERE id = ?').run(id)

    if (result.changes === 0) {
      throw new Error('No se encontró la orden a eliminar')
    }

    console.log('✅ Orden eliminada:', id)
    return { id, deleted: true }
  } catch (err) {
    console.error('❌ Error al eliminar orden:', err)
    throw err
  }
})

// Obtener una orden específica por ID
ipcMain.handle('get-purchase-order-by-id', (event, id) => {
  try {
    const row = db.prepare('SELECT * FROM PurchaseOrder WHERE id = ?').get(id)

    if (!row) {
      throw new Error('Orden no encontrada')
    }

    console.log('✅ Orden encontrada:', row)
    return row
  } catch (err) {
    console.error('❌ Error al consultar orden por ID:', err)
    throw err
  }
})

// Buscar órdenes por término
ipcMain.handle('search-purchase-orders', (event, searchTerm) => {
  try {
    const searchPattern = `%${searchTerm}%`

    const rows = db.prepare(`
      SELECT * FROM PurchaseOrder
      WHERE purchase_order_number LIKE ?
         OR company_name LIKE ?
         OR company_representative LIKE ?
      ORDER BY id DESC
    `).all(searchPattern, searchPattern, searchPattern)

    console.log(`✅ Encontradas ${rows.length} órdenes con término: ${searchTerm}`)
    return rows
  } catch (err) {
    console.error('❌ Error al buscar órdenes:', err)
    throw err
  }
})
