import { getDatabase } from '../../database/localDb.js'

export async function authenticateUser(email, password) {
  const db = getDatabase()

  return new Promise((resolve, reject) => {
    try {
      const row = db
        .prepare('SELECT * FROM User WHERE email = ? AND password = ?')
        .get(email, password)

      if (row) resolve(row)
      else reject(new Error('Credenciales inválidas'))
    } catch (err) {
      console.error('Error en la consulta:', err)
      reject(new Error('Error interno'))
    }
  })
}
