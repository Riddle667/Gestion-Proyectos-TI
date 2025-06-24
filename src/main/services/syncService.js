const localDb = require('../database/localDb')
const cloudDb = require('../database/cloudDb')

// List of tables to syn
const tables = ['User', 'Invoice', 'DispatchGuide', 'PurchaseOrder']

// Función que obtiene todos los datos de una tabla desde una base
function getAllRows(db, tableName) {
  return db.prepare(`SELECT * FROM ${tableName}`).all()
}

// Limpia y reinserta datos en la base destino
function restoreTableData(destinationDb, tableName, data) {
  const columns = Object.keys(data[0]).join(', ')
  const placeholders = Object.keys(data[0])
    .map(() => '?')
    .join(', ')
  const insertStmt = destinationDb.prepare(
    `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`
  )

  destinationDb.prepare(`DELETE FROM ${tableName}`).run()

  const insertMany = destinationDb.transaction((rows) => {
    for (const row of rows) {
      insertStmt.run(Object.values(row))
    }
  })

  insertMany(data)
}

// Backup: Local → Nube
function backupToCloud() {
  tables.forEach((table) => {
    const data = getAllRows(localDb, table)
    if (data.length > 0) {
      restoreTableData(cloudDb, table, data)
    }
  })
  return 'Backup completo desde local hacia nube.'
}

// Restore: Nube → Local
function restoreFromCloud() {
  tables.forEach((table) => {
    const data = getAllRows(cloudDb, table)
    if (data.length > 0) {
      restoreTableData(localDb, table, data)
    }
  })
  return 'Restauración completa desde nube hacia local.'
}

module.exports = { backupToCloud, restoreFromCloud }
