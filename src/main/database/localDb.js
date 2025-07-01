// src/main/database/localDb.js
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const dbDir = path.join(process.cwd(), 'src', 'main', 'database')
const dbPath = path.join(dbDir, 'local.db')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)
console.log('✅ Base de datos conectada en:', dbPath)

// Activar soporte para claves foráneas
db.pragma('foreign_keys = ON')

// Crear tablas (sincronizadamente)
db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'normal'
  );

  CREATE TABLE IF NOT EXISTS PurchaseOrder (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_order_number TEXT NOT NULL UNIQUE,
    company_name TEXT,
    company_representative TEXT,
    date TEXT,
    order_amount REAL
  );

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
    purchase_order_id INTEGER,
    FOREIGN KEY (purchase_order_id) REFERENCES PurchaseOrder(id)
      ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Invoice (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT NOT NULL UNIQUE,
    date TEXT NOT NULL,
    company_name TEXT NOT NULL,
    net_amount REAL NOT NULL,
    tax_iva REAL NOT NULL,
    purchase_order_id INTEGER,
    dispatch_guide_id INTEGER,
    FOREIGN KEY (purchase_order_id) REFERENCES PurchaseOrder(id)
      ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (dispatch_guide_id) REFERENCES DispatchGuide(id)
      ON DELETE SET NULL ON UPDATE CASCADE
  );
`)

export function getDatabase() {
  return db
}
