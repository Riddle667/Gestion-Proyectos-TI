import { Outlet, useNavigate } from 'react-router-dom'
import './SideBar.css'

export default function Layout() {
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
          <li onClick={() => handleRedirect('/invoices')}>Facturas</li>
          <li onClick={() => handleRedirect('/ordenes')}>Ordenes de Compra</li>
          <li onClick={() => handleRedirect('/guias')}>Guías de Despacho</li>
        </ul>
      </div>
      <Outlet />
    </div>
  )
}
