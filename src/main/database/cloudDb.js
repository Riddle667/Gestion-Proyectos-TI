const Database = require('better-sqlite3')

// Aquí usas una ruta remota o montada en red (ej: unidad de red, Google Drive montado, etc.)
const cloudDb = new Database('/ruta/a/la/nube/remote.db') // Puede ser en una carpeta sincronizada tipo OneDrive o GDrive

module.exports = cloudDb
