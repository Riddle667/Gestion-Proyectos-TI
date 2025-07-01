import { ipcMain } from 'electron'
import { getDatabase } from '../database/localDb.js'
import { initCloudDatabase, getCloudDatabase } from '../database/cloudDb.js'

const localDb = getDatabase()
let cloudDb // Será inicializada correctamente más abajo

// Tablas a sincronizar
const tables = ['User', 'PurchaseOrder', 'DispatchGuide', 'Invoice']

// Función para sincronizar desde local hacia nube (SQLite → MySQL)
async function backupToCloud() {
  try {
    for (const table of tables) {
      const rows = localDb.prepare(`SELECT * FROM ${table}`).all()
      if (!Array.isArray(rows) || rows.length === 0) continue

      await cloudDb.execute(`DELETE FROM ${table}`)

      for (const row of rows) {
        const columns = Object.keys(row)
        const placeholders = columns.map(() => '?').join(', ')
        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`

        let values = Object.values(row)

        // Validar claves foráneas solo en la tabla Invoice
        if (table === 'Invoice') {
          const purchaseOrderId = row.purchase_order_id
          const dispatchGuideId = row.dispatch_guide_id

          const [po] = await cloudDb.execute(`SELECT id FROM PurchaseOrder WHERE id = ?`, [
            purchaseOrderId
          ])
          const [dg] = await cloudDb.execute(`SELECT id FROM DispatchGuide WHERE id = ?`, [
            dispatchGuideId
          ])

          const validPO = po.length > 0
          const validDG = dg.length > 0

          const colIndexPO = columns.indexOf('purchase_order_id')
          const colIndexDG = columns.indexOf('dispatch_guide_id')

          if (colIndexPO !== -1) values[colIndexPO] = validPO ? purchaseOrderId : null
          if (colIndexDG !== -1) values[colIndexDG] = validDG ? dispatchGuideId : null
        }

        await cloudDb.execute(sql, values)
      }
    }

    return '✅ Backup completo desde local hacia nube.'
  } catch (err) {
    console.error('❌ Error durante backup:', err)
    throw new Error('❌ Error al hacer backup')
  }
}

// Función para sincronizar desde nube hacia local (MySQL → SQLite)
async function restoreFromCloud() {
  try {
    for (const table of tables) {
      const [rows] = await cloudDb.execute(`SELECT * FROM ${table}`)
      if (rows.length === 0) continue

      const columns = Object.keys(rows[0])
      const placeholders = columns.map(() => '?').join(', ')
      const insertStmt = localDb.prepare(
        `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
      )

      localDb.prepare(`DELETE FROM ${table}`).run()

      const insertMany = localDb.transaction((rows) => {
        for (const row of rows) {
          // Convierte valores a formatos válidos para SQLite
          const values = Object.values(row).map((val, idx) => {
            const colName = columns[idx]

            if ((table === 'Invoice' || table === 'PurchaseOrder') && colName === 'date') {
              if (val instanceof Date) {
                return val.toISOString().split('T')[0]
              }
              if (typeof val === 'string') {
                return val.split('T')[0]
              }
              if (val == null) {
                throw new Error(`Campo 'date' en ${table} no puede ser nulo`)
              }
            }

            if (
              typeof val === 'number' ||
              typeof val === 'string' ||
              typeof val === 'bigint' ||
              val === null ||
              Buffer.isBuffer(val)
            ) {
              return val
            }

            if (typeof val === 'undefined') return null

            console.warn(`⚠️ Valor no permitido para SQLite en la tabla ${table}:`, val)
            return null
          })

          insertStmt.run(values)
        }
      })

      insertMany(rows)
    }
    return '✅ Restauración completa desde nube hacia local.'
  } catch (err) {
    console.error('❌ Error durante restauración:', err)
    throw new Error('❌ Error al restaurar')
  }
}

// Inicializa cloudDb y luego registra handlers
export async function setupSyncHandlers() {
  await initCloudDatabase()
  cloudDb = getCloudDatabase()

  ipcMain.handle('sync:backup', async () => {
    return await backupToCloud()
  })

  ipcMain.handle('sync:restore', async () => {
    return await restoreFromCloud()
  })

  console.log('✅ IPC de sincronización registrado')
}

setupSyncHandlers()
