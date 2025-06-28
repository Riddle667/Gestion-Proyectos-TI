// src/main/database/cloudDb.js
import mysql from 'mysql2/promise'

const mysqlConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'montecristo',
  port: 3306
}

// Conexión persistente
let cloudConnection = null

// Inicializa la base de datos en la nube y crea las tablas
export async function initCloudDatabase() {
  try {
    cloudConnection = await mysql.createConnection(mysqlConfig)
    console.log('✅ Conectado a la base de datos en la nube')

    await cloudConnection.execute(`
      CREATE TABLE IF NOT EXISTS User (
        id INT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'viewer'
      )
    `)

    await cloudConnection.execute(`
      CREATE TABLE IF NOT EXISTS Invoice (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(100) NOT NULL UNIQUE,
        date DATE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        net_amount DECIMAL(12,2) NOT NULL,
        tax_iva DECIMAL(12,2) NOT NULL,
        purchase_order VARCHAR(100),
        dispatch_guide VARCHAR(100)
      )
    `)

    await cloudConnection.execute(`
      CREATE TABLE IF NOT EXISTS DispatchGuide (
        id INT AUTO_INCREMENT PRIMARY KEY,
        dispatch_guide_number VARCHAR(100) NOT NULL UNIQUE,
        recipient_name VARCHAR(255),
        rut VARCHAR(20),
        business_activity VARCHAR(255),
        address VARCHAR(255),
        district VARCHAR(100),
        city VARCHAR(100),
        contact VARCHAR(100),
        transport_type VARCHAR(100),
        purchase_order VARCHAR(100)
      )
    `)

    await cloudConnection.execute(`
      CREATE TABLE IF NOT EXISTS PurchaseOrder (
        id INT AUTO_INCREMENT PRIMARY KEY,
        purchase_order_number VARCHAR(100) NOT NULL UNIQUE,
        company_name VARCHAR(255),
        company_representative VARCHAR(255),
        date DATE,
        order_amount DECIMAL(12,2)
      )
    `)

    console.log('✅ Tablas creadas/verificadas en la nube')
  } catch (err) {
    console.error('❌ Error conectando o creando tablas en la nube:', err.message)
  }
}

// Devuelve la conexión activa
export function getCloudDatabase() {
  if (!cloudConnection) {
    throw new Error('❌ La conexión cloud no está inicializada. Llama a initCloudDatabase() primero.')
  }
  return cloudConnection
}
