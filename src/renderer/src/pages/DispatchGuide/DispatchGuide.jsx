import { useEffect, useState } from 'react'
import './DispatchGuide.css'

const DispatchGuide = () => {
  const [guides, setGuides] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    dispatchGuideNumber: '',
    recipientName: '',
    rut: '',
    businessActivity: '',
    address: '',
    district: '',
    city: '',
    contact: '',
    transportType: '',
    purchaseOrder: ''
  })
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchGuides()
    window.api.getCurrentUser().then((u) => {
      setUser(u)
    })
  }, [])

  const fetchGuides = async () => {
    try {
      const data = await window.electronAPI.getDispatchGuides()
      setGuides(data)
    } catch (error) {
      console.error('❌ Error al obtener guías de despacho:', error)
    }
  }

  const handleAddGuide = async () => {
    // Validar campos requeridos
    if (!formData.dispatchGuideNumber.trim()) {
      alert('El número de guía de despacho es requerido')
      return
    }

    try {
      await window.electronAPI.addDispatchGuide({
        dispatch_guide_number: formData.dispatchGuideNumber,
        recipient_name: formData.recipientName,
        rut: formData.rut,
        business_activity: formData.businessActivity,
        address: formData.address,
        district: formData.district,
        city: formData.city,
        contact: formData.contact,
        transport_type: formData.transportType,
        purchase_order: formData.purchaseOrder
      })

      // Resetear formulario
      setFormData({
        dispatchGuideNumber: '',
        recipientName: '',
        rut: '',
        businessActivity: '',
        address: '',
        district: '',
        city: '',
        contact: '',
        transportType: '',
        purchaseOrder: ''
      })

      setIsModalOpen(false)
      fetchGuides()
    } catch (error) {
      alert('Error al agregar guía de despacho: ' + error)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancelModal = () => {
    setFormData({
      dispatchGuideNumber: '',
      recipientName: '',
      rut: '',
      businessActivity: '',
      address: '',
      district: '',
      city: '',
      contact: '',
      transportType: '',
      purchaseOrder: ''
    })
    setIsModalOpen(false)
  }

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancelModal()
    }
  }

  return (
    <div className="dispatch-guide-container">
      <div className="card">
        <div className="header-section">
          <h2>Guías de Despacho</h2>

          {user && user.role === 'admin' && (
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              + Nueva Guía
            </button>
          )}
        </div>

        {guides.length === 0 ? (
          <p className="no-guides">No hay guías de despacho registradas.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>N° Guía</th>
                  <th>Destinatario</th>
                  <th>RUT</th>
                  <th>Dirección</th>
                  <th>Comuna</th>
                  <th>Ciudad</th>
                  <th>Contacto</th>
                  <th>Transporte</th>
                  <th>O. Compra</th>
                </tr>
              </thead>
              <tbody>
                {guides.map((guide) => (
                  <tr key={guide.id}>
                    <td>{guide.id}</td>
                    <td className="guide-number">{guide.dispatch_guide_number}</td>
                    <td>{guide.recipient_name || '-'}</td>
                    <td>{guide.rut || '-'}</td>
                    <td>{guide.address || '-'}</td>
                    <td>{guide.district || '-'}</td>
                    <td>{guide.city || '-'}</td>
                    <td>{guide.contact || '-'}</td>
                    <td>{guide.transport_type || '-'}</td>
                    <td>{guide.purchase_order || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleModalBackdropClick}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nueva Guía de Despacho</h3>
              <button className="btn-close" onClick={handleCancelModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="dispatchGuideNumber">Número de Guía *</label>
                  <input
                    id="dispatchGuideNumber"
                    type="text"
                    placeholder="Ej: GD-2025-001"
                    value={formData.dispatchGuideNumber}
                    onChange={(e) => handleInputChange('dispatchGuideNumber', e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="recipientName">Nombre del Destinatario</label>
                  <input
                    id="recipientName"
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rut">RUT</label>
                  <input
                    id="rut"
                    type="text"
                    placeholder="Ej: 12.345.678-9"
                    value={formData.rut}
                    onChange={(e) => handleInputChange('rut', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="businessActivity">Actividad Comercial</label>
                  <input
                    id="businessActivity"
                    type="text"
                    placeholder="Ej: Servicios de consultoría"
                    value={formData.businessActivity}
                    onChange={(e) => handleInputChange('businessActivity', e.target.value)}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="address">Dirección</label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Ej: Av. Providencia 123"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="district">Comuna</label>
                  <input
                    id="district"
                    type="text"
                    placeholder="Ej: Providencia"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">Ciudad</label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Ej: Santiago"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact">Contacto</label>
                  <input
                    id="contact"
                    type="text"
                    placeholder="Ej: +56 9 1234 5678"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="transportType">Tipo de Transporte</label>
                  <select
                    id="transportType"
                    value={formData.transportType}
                    onChange={(e) => handleInputChange('transportType', e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="terrestre">Terrestre</option>
                    <option value="aereo">Aéreo</option>
                    <option value="maritimo">Marítimo</option>
                    <option value="ferroviario">Ferroviario</option>
                    <option value="propio">Transporte Propio</option>
                    <option value="terceros">Transporte de Terceros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="purchaseOrder">Orden de Compra</label>
                  <input
                    id="purchaseOrder"
                    type="text"
                    placeholder="Ej: PO-2025-001"
                    value={formData.purchaseOrder}
                    onChange={(e) => handleInputChange('purchaseOrder', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCancelModal}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={handleAddGuide}
                disabled={!formData.dispatchGuideNumber.trim()}
              >
                Crear Guía
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DispatchGuide
