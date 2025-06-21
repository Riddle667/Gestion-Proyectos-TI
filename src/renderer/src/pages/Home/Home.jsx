import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  const handleRedirect = (route) => {
    console.log(`🔁 Redireccionando a: ${route}`)
    navigate(route)
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="line"></div>
        <div className="line"></div>
        <h3>Panel Principal</h3>
        <ul>
          <li onClick={() => handleRedirect('/facturas')}>Facturas</li>
          <li onClick={() => handleRedirect('/ordenes')}>Ordenes de Compra</li>
          <li onClick={() => handleRedirect('/guias')}>Guías de Despacho</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="welcome-box">
          <h2>Bienvenido al Gestor Montecristo</h2>
          <p>Selecciona una opción en el menú lateral para comenzar.</p>
        </div>
      </div>
    </div>
  )
}
