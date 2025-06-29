import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import './SideBar.css'
import logo from '../../assets/LOGO3.png'

export default function Layout() {
  const navigate = useNavigate()

  const [modalVisible, setModalVisible] = useState(false)
  const [modalAction, setModalAction] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState('') // 'success' | 'error'
  const [user, setUser] = useState(null)

  useEffect(() => {
    window.api.getCurrentUser().then((u) => {
      setUser(u)
    })
  }, [])

  const handleRedirect = (route) => {
    navigate(route)
  }

  const openModal = (action) => {
    setModalAction(action)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalAction(null)
  }

  const showFeedback = (message, type = 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    setTimeout(() => {
      setFeedbackMessage('')
      setFeedbackType('')
    }, 3000)
  }

  const confirmAction = async () => {
    try {
      switch (modalAction) {
        case 'backup':
          console.log('🔄 Confirmado: Realizando backup...')
          await window.api.backup()
          showFeedback('✅ Respaldo completado correctamente.', 'success')
          break
        case 'restore':
          console.log('🔄 Confirmado: Restaurando desde la nube...')
          await window.api.restore()
          showFeedback('✅ Restauración completada correctamente.', 'success')
          break
        case 'logout':
          console.log('🚪 Confirmado: Cerrando sesión...')
          navigate('/')
          showFeedback('Sesión cerrada correctamente.', 'success')
          break
        default:
          throw new Error('Acción no válida.')
      }
    } catch (error) {
      console.error('❌ Error durante la acción:', error)
      showFeedback('❌ Ocurrió un error durante la operación.', 'error')
    } finally {
      closeModal()
    }
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="logo-container" onClick={() => handleRedirect('/home')}>
          <img src={logo} alt="Logo Montecristo" />
        </div>

        <div className="line"></div>
        <div className="line"></div>

        <div className="sidebar-title">Menú Principal</div>

        <ul>
          <li onClick={() => handleRedirect('/home/invoices')}>Facturas</li>
          <li onClick={() => handleRedirect('/home/PurchaseOrder')}>Órdenes de Compra</li>
          <li onClick={() => handleRedirect('/home/DispatchGuide')}>Guías de Despacho</li>
        </ul>

        {user && user.role === 'admin' && (
          <div className="sidebar-actions">
            <button className="backup-button" onClick={() => openModal('backup')}>
              Respaldar
            </button>
            <button className="restore-button" onClick={() => openModal('restore')}>
              Restaurar
            </button>
          </div>
        )}

        <button className="logout-button" onClick={() => openModal('logout')}>
          Cerrar Sesión
        </button>
      </div>

      <Outlet />

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro?</h2>
            <p>
              {modalAction === 'backup' &&
                '¿Deseas realizar un respaldo de los datos locales a la nube?'}
              {modalAction === 'restore' &&
                '¿Deseas restaurar los datos desde la nube? Esto podría sobrescribir la información local.'}
              {modalAction === 'logout' && '¿Deseas cerrar la sesión actual?'}
            </p>
            <div className="modal-buttons">
              <button onClick={confirmAction}>Confirmar</button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {feedbackMessage && <div className={`feedback-toast ${feedbackType}`}>{feedbackMessage}</div>}
    </div>
  )
}
