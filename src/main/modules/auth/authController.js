import { ipcMain } from 'electron'
import { authenticateUser } from './authService.js'

export function registerAuthHandlers() {
  ipcMain.handle('auth:login', async (_event, credentials) => {
    const { email, password } = credentials
    try {
      const user = await authenticateUser(email, password)
      return { success: true, user }
    } catch (error) {
      return { success: false, message: error.message }
    }
  })
}
