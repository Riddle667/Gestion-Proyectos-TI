import { Outlet, useNavigate } from 'react-router-dom'
import './SideBar.css'
import logo from '../../assets/LOGO3.png'

export default function Layout() {
  const navigate = useNavigate()

  const handleRedirect = (route) => {
    console.log(`🔁 Redireccionando a: ${route}`)
    navigate(route)
  }

  const handleLogout = () => {
    console.log('🚪 Cerrando sesión...')
    navigate('/')
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Logo Montecristo" />
        </div>

        <div className="line"></div>
        <div className="line"></div>

        <div className="sidebar-title">Menú Principal</div>

        <ul>
          <li onClick={() => handleRedirect('/home/invoices')}>Facturas</li>
          <li onClick={() => handleRedirect('/home/PurchaseOrder')}>Ordenes de Compra</li>
          <li onClick={() => handleRedirect('/home/guias')}>Guías de Despacho</li>
        </ul>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <Outlet />
    </div>
  )
}
