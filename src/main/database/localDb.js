import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'

// Ruta fija al archivo en src/main/database/local.db
const dbDir = path.join(process.cwd(), 'src', 'main', 'database')
const dbPath = path.join(dbDir, 'local.db')

// Asegura que exista la carpeta
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Conectar y crear tablas
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al abrir la base de datos:', err.message)
  } else {
    console.log('✅ Base de datos conectada en:', dbPath)

    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'normal'
        )
      `)

      db.run(`
        CREATE TABLE IF NOT EXISTS Invoice (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          invoice_number TEXT NOT NULL UNIQUE,
          date TEXT NOT NULL,
          company_name TEXT NOT NULL,
          net_amount REAL NOT NULL,
          tax_iva REAL NOT NULL,
          purchase_order TEXT,
          dispatch_guide TEXT
        )
      `)

      db.run(`
        CREATE TABLE IF NOT EXISTS DispatchGuide (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          dispatch_guide_number TEXT NOT NULL UNIQUE,
          recipient_name TEXT,
          rut TEXT,
          business_activity TEXT,
          address TEXT,
          district TEXT,
          city TEXT,
          contact TEXT,
          transport_type TEXT,
          purchase_order TEXT
        )
      `)

      db.run(`
        CREATE TABLE IF NOT EXISTS PurchaseOrder (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          purchase_order_number TEXT NOT NULL UNIQUE
        )
      `)

      console.log('✅ Todas las tablas han sido creadas/verificadas')
    })
  }
})

export function getDatabase() {
  return db
}
