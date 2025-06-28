import { ipcMain } from 'electron'
import { authenticateUser } from './authService.js'
import { setLoggedUser, getLoggedUser } from './authSession.js'

export function registerAuthHandlers() {
  ipcMain.handle('auth:login', async (_event, credentials) => {
    const { email, password } = credentials
    try {
      const user = await authenticateUser(email, password)
      setLoggedUser(user)
      return { success: true, user }
    } catch (error) {
      return { success: false, message: error.message }
    }
  })

  ipcMain.handle('auth:getCurrentUser', () => {
    return getLoggedUser()
  })
}
