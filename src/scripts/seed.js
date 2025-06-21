const fs = require('fs')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbPath = path.resolve(__dirname, '../db/users.db')

// Crear carpeta db si no existe
const dir = path.dirname(dbPath)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

// Crear conexión
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  // Crear tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'viewer'
    )
  `)

  // Limpiar registros anteriores (opcional)
  db.run(`DELETE FROM users`)

  // Insertar usuarios de prueba
  const stmt = db.prepare(`INSERT INTO users (email, password, role) VALUES (?, ?, ?)`)
  const users = [
    ['admin@montecristo.cl', 'admin123', 'admin'],
    ['user1@montecristo.cl', 'user123', 'viewer'],
    ['maria@montecristo.cl', 'maria123', 'viewer'],
    ['jose@montecristo.cl', 'jose123', 'viewer'],
    ['karla@montecristo.cl', 'karla123', 'admin'],
    ['test@montecristo.cl', 'test123', 'viewer'],
    ['alex@montecristo.cl', 'alex123', 'viewer'],
    ['carlos@montecristo.cl', 'carlos123', 'admin'],
    ['ana@montecristo.cl', 'ana123', 'viewer'],
    ['pepe@montecristo.cl', 'pepe123', 'viewer']
  ]
  users.forEach(user => stmt.run(...user))
  stmt.finalize()
})

db.close(() => {
  console.log('✅ Base de datos creada y poblada en ./db/users.db')
})
