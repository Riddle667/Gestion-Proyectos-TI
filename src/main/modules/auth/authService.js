import { getDatabase } from '../../database/localDb.js'
import bcrypt from 'bcryptjs'

export async function authenticateUser(email, password) {
  const db = getDatabase()

  return new Promise((resolve, reject) => {
    try {
      const user = db.prepare('SELECT * FROM User WHERE email = ?').get(email)

      if (!user) return reject(new Error('Correo no registrado'))

      const validPassword = bcrypt.compareSync(password, user.password)

      if (!validPassword) return reject(new Error('Contraseña incorrecta'))

      // Retorna el usuario sin la contraseña
      const { password: _, ...userWithoutPassword } = user
      resolve(userWithoutPassword)
    } catch (err) {
      console.error('Error en la autenticación:', err)
      reject(new Error('Error interno'))
    }
  })
}
