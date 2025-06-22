const mysql = require('mysql2/promise')

// Configura tu conexión a la base de datos remota
const mysqlConfig = {
  host: 'your-host.mysql.com',
  user: 'your_user',
  password: 'your_password',
  database: 'montecristo',
  port: 3306
}

// Función para crear las tablas si no existen
async function initCloudDatabase() {
  try {
    const conn = await mysql.createConnection(mysqlConfig)
    console.log('✅ Conectado a la base de datos en la nube')

    // Crear tabla User
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS User (
        id INT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'viewer'
      )
    `)

    // Crear tabla Invoice
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS Invoice (
        id INT PRIMARY KEY,
        invoice_number VARCHAR(100) UNIQUE NOT NULL,
        date VARCHAR(100) NOT NULL,
        company_name VARCHAR(255),
        net_amount FLOAT,
        tax_iva FLOAT,
        purchase_order TEXT,
        dispatch_guide TEXT
      )
    `)

    // Crear tabla DispatchGuide
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS DispatchGuide (
        id INT PRIMARY KEY,
        dispatch_guide_number VARCHAR(100) UNIQUE NOT NULL,
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

    // Crear tabla PurchaseOrder
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS PurchaseOrder (
        id INT PRIMARY KEY,
        purchase_order_number VARCHAR(100) UNIQUE NOT NULL
      )
    `)

    console.log('✅ Tablas creadas/verificadas en la nube')

    await conn.end()
  } catch (err) {
    console.error('❌ Error conectando a la base remota:', err.message)
  }
}

// Ejecutar al importar
initCloudDatabase()

// Exportar si necesitas usar la conexión en otros lados
module.exports = {
  initCloudDatabase
}
