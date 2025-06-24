import { ipcMain } from 'electron'
import { getDatabase } from '../database/localDb'

const db = getDatabase()

// Obtener todas las órdenes de compra
ipcMain.handle('get-purchase-orders', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM PurchaseOrder ORDER BY id DESC', [], (err, rows) => {
      if (err) {
        console.error('❌ Error al consultar PurchaseOrder:', err)
        reject(err)
      } else {
        console.log(`✅ Obtenidas ${rows.length} órdenes de compra`)
        resolve(rows)
      }
    })
  })
})

// Agregar nueva orden de compra
ipcMain.handle('add-purchase-order', async (event, orderData) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase()

    // Extraer los datos del objeto
    const {
      purchase_order_number,
      company_name = null,
      company_representative = null,
      date = null,
      order_amount = null
    } = orderData

    // Validar campo requerido
    if (!purchase_order_number || !purchase_order_number.trim()) {
      reject('El número de orden es requerido')
      return
    }

    db.run(
      `INSERT INTO PurchaseOrder
       (purchase_order_number, company_name, company_representative, date, order_amount)
       VALUES (?, ?, ?, ?, ?)`,
      [
        purchase_order_number.trim(),
        company_name?.trim() || null,
        company_representative?.trim() || null,
        date || null,
        order_amount || null
      ],
      function (err) {
        if (err) {
          console.error('❌ Error al insertar orden:', err)
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            reject('Ya existe una orden con ese número')
          } else {
            reject(err.message)
          }
        } else {
          console.log('✅ Orden registrada:', {
            id: this.lastID,
            purchase_order_number,
            company_name,
            company_representative,
            date,
            order_amount
          })
          resolve({
            id: this.lastID,
            purchase_order_number,
            company_name,
            company_representative,
            date,
            order_amount
          })
        }
      }
    )
  })
})

// Actualizar una orden existente
ipcMain.handle('update-purchase-order', async (event, id, orderData) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase()

    const {
      purchase_order_number,
      company_name = null,
      company_representative = null,
      date = null,
      order_amount = null
    } = orderData

    if (!purchase_order_number || !purchase_order_number.trim()) {
      reject('El número de orden es requerido')
      return
    }

    db.run(
      `UPDATE PurchaseOrder
       SET purchase_order_number = ?,
           company_name = ?,
           company_representative = ?,
           date = ?,
           order_amount = ?
       WHERE id = ?`,
      [
        purchase_order_number.trim(),
        company_name?.trim() || null,
        company_representative?.trim() || null,
        date || null,
        order_amount || null,
        id
      ],
      function (err) {
        if (err) {
          console.error('❌ Error al actualizar orden:', err)
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            reject('Ya existe una orden con ese número')
          } else {
            reject(err.message)
          }
        } else if (this.changes === 0) {
          reject('No se encontró la orden a actualizar')
        } else {
          console.log('✅ Orden actualizada:', { id, ...orderData })
          resolve({ id, ...orderData })
        }
      }
    )
  })
})

// Eliminar una orden
ipcMain.handle('delete-purchase-order', async (event, id) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase()

    db.run('DELETE FROM PurchaseOrder WHERE id = ?', [id], function (err) {
      if (err) {
        console.error('❌ Error al eliminar orden:', err)
        reject(err.message)
      } else if (this.changes === 0) {
        reject('No se encontró la orden a eliminar')
      } else {
        console.log('✅ Orden eliminada:', id)
        resolve({ id, deleted: true })
      }
    })
  })
})

// Obtener una orden específica por ID
ipcMain.handle('get-purchase-order-by-id', async (event, id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM PurchaseOrder WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('❌ Error al consultar orden por ID:', err)
        reject(err)
      } else if (!row) {
        reject('Orden no encontrada')
      } else {
        console.log('✅ Orden encontrada:', row)
        resolve(row)
      }
    })
  })
})

// Buscar órdenes por número
ipcMain.handle('search-purchase-orders', async (event, searchTerm) => {
  return new Promise((resolve, reject) => {
    const searchPattern = `%${searchTerm}%`

    db.all(
      `SELECT * FROM PurchaseOrder
       WHERE purchase_order_number LIKE ?
          OR company_name LIKE ?
          OR company_representative LIKE ?
       ORDER BY id DESC`,
      [searchPattern, searchPattern, searchPattern],
      (err, rows) => {
        if (err) {
          console.error('❌ Error al buscar órdenes:', err)
          reject(err)
        } else {
          console.log(`✅ Encontradas ${rows.length} órdenes con término: ${searchTerm}`)
          resolve(rows)
        }
      }
    )
  })
})
