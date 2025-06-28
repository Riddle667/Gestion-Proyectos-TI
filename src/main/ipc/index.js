import { ipcMain } from 'electron'
import { getDatabase } from '../database/localDb.js'
import { initCloudDatabase, getCloudDatabase } from '../database/cloudDb.js'

const localDb = getDatabase()
let cloudDb // Será inicializada correctamente más abajo

// Tablas a sincronizar
const tables = ['User', 'Invoice', 'DispatchGuide', 'PurchaseOrder']

// Función para sincronizar desde local hacia nube (SQLite → MySQL)
async function backupToCloud() {
  try {
    for (const table of tables) {
      const rows = localDb.prepare(`SELECT * FROM ${table}`).all()

      if (!Array.isArray(rows)) {
        console.error(`❌ Los datos obtenidos de ${table} no son un array`)
        continue
      }

      if (rows.length === 0) continue

      await cloudDb.execute(`DELETE FROM ${table}`)

      for (const row of rows) {
        const columns = Object.keys(row)
        const placeholders = columns.map(() => '?').join(', ')
        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
        await cloudDb.execute(sql, Object.values(row))
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
