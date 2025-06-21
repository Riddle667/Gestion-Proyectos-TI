import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'
import { app } from 'electron'

// Ruta absoluta hacia src/db/users.db (incluso si estás en producción)
const basePath = app.getAppPath()
const dbDir = path.join(basePath, 'src', 'db') // ajusta si mueves el archivo
const dbPath = path.join(dbDir, 'users.db')

// Asegura que exista la carpeta
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Conectar y crear tabla si no existe
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al abrir la base de datos:', err.message)
  } else {
    console.log('✅ Base de datos conectada en:', dbPath)

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'viewer'
      )
    `, (err) => {
      if (err) {
        console.error('❌ Error creando tabla users:', err.message)
      } else {
        console.log('✅ Tabla users verificada o creada')
      }
    })
  }
})

export function getDatabase() {
  return db
}
