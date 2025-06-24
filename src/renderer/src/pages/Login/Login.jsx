import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import logo from '../../assets/LOGO.jpg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.')
      return
    }

    try {
      const result = await window.api.login({ email, password })
      if (result.success) {
        navigate('/home', { state: { user: result.user } })
      } else {
        setError(result.message || 'Credenciales incorrectas.')
      }
    } catch (err) {
      console.error('Error de autenticación:', err)
      setError('Hubo un problema al intentar iniciar sesión.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo Montecristo" className="logo" />
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit">Ingresar</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  )
}
