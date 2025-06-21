import { getDatabase } from '../../../db/db.js'
const db = getDatabase()


export async function authenticateUser(email, password) {
  const db = getDatabase()

  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE email = ? AND password = ?',
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
