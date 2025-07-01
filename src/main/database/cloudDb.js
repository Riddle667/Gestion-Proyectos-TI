import mysql from 'mysql2/promise'

const mysqlConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'montecristo',
  port: 3306
}

let cloudConnection = null

export async function initCloudDatabase() {
  try {
    cloudConnection = await mysql.createConnection(mysqlConfig)
    console.log('✅ Conectado a la base de datos en la nube')

    await cloudConnection.execute(`SET foreign_key_checks = 0`)

    await cloudConnection.execute(`
      CREATE TABLE IF NOT EXISTS User (
        id INT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'viewer'
      ) ENGINE=InnoDB
    `)

    await cloudConnection.execute(`
      CREATE TABLE IF NOT EXISTS PurchaseOrder (
        id INT AUTO_INCREMENT PRIMARY KEY,
        purchase_order_number VARCHAR(100) NOT NULL UNIQUE,
        company_name VARCHAR(255),
        company_representative VARCHAR(255),
        date DATE,
        order_amount DECIMAL(12,2)
      ) ENGINE=InnoDB
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
        purchase_order_id INT NULL,
        FOREIGN KEY (purchase_order_id) REFERENCES PurchaseOrder(id)
          ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `)

    await cloudConnection.execute(`
      CREATE TABLE IF NOT EXISTS Invoice (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(100) NOT NULL UNIQUE,
        date DATE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        net_amount DECIMAL(12,2) NOT NULL,
        tax_iva DECIMAL(12,2) NOT NULL,
        purchase_order_id INT NULL,
        dispatch_guide_id INT NULL,
        FOREIGN KEY (purchase_order_id) REFERENCES PurchaseOrder(id)
          ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (dispatch_guide_id) REFERENCES DispatchGuide(id)
          ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `)

    await cloudConnection.execute(`SET foreign_key_checks = 1`)
    console.log('✅ Tablas con claves foráneas creadas/verificadas')
  } catch (err) {
    console.error('❌ Error conectando o creando tablas en la nube:', err.message)
  }
}

export function getCloudDatabase() {
  if (!cloudConnection) {
    throw new Error(
      '❌ La conexión cloud no está inicializada. Llama a initCloudDatabase() primero.'
    )
  }
  return cloudConnection
}
