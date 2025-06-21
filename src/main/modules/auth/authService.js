import { getDatabase } from '../../database/localDb.js'

export async function authenticateUser(email, password) {
  const db = getDatabase()

  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM User WHERE email = ? AND password = ?',
      [email, password],
      (err, row) => {
        if (err) {
          console.error('Error en la consulta:', err)
          reject(new Error('Error interno'))
        } else if (row) {
          resolve(row)
        } else {
          reject(new Error('Credenciales inválidas'))
        }
      }
    )
  })
}
