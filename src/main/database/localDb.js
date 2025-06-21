const path = require('path')
const Database = require('better-sqlite3')

const localDb = new Database(path.join(__dirname, 'local.db'))

module.exports = localDb
