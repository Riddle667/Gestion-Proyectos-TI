// DispatchGuide.jsx
import { useEffect, useState } from 'react'
import './DispatchGuide.css'
import DispatchGuideTable from './DispatchGuideTable'
import DispatchGuideFormModal from './DispatchGuideFormModal'
import useModalAndFeedback from '../../components/useModalAndFeedback'

const DispatchGuide = () => {
  const [guides, setGuides] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [user, setUser] = useState(null)

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
    purchaseOrderId: ''
  })

  const {
    modalVisible,
    modalMessage,
    feedbackMessage,
    feedbackType,
    openModal,
    closeModal,
    confirm,
    showFeedback
  } = useModalAndFeedback()

  useEffect(() => {
    fetchGuides()
    fetchPurchaseOrders()
    window.api.getCurrentUser().then(setUser)
  }, [])

  const fetchGuides = async () => {
    const data = await window.electronAPI.getDispatchGuides()
    setGuides(data)
  }

  const fetchPurchaseOrders = async () => {
    const data = await window.electronAPI.getPurchaseOrders()
    setPurchaseOrders(data)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.dispatchGuideNumber.trim()) {
      showFeedback('❌ El número de guía de despacho es obligatorio.', 'error')
      return false
    }
    if (!formData.recipientName.trim()) {
      showFeedback('❌ El nombre del destinatario es obligatorio.', 'error')
      return false
    }
    if (!formData.address.trim()) {
      showFeedback('❌ La dirección es obligatoria.', 'error')
      return false
    }
    if (!formData.district.trim()) {
      showFeedback('❌ La comuna es obligatoria.', 'error')
      return false
    }
    if (!formData.city.trim()) {
      showFeedback('❌ La ciudad es obligatoria.', 'error')
      return false
    }
    if (!formData.transportType.trim()) {
      showFeedback('❌ El tipo de transporte es obligatorio.', 'error')
      return false
    }
    // Validación para número duplicado:
    const duplicate = guides.some(
      (g) =>
        g.dispatch_guide_number === formData.dispatchGuideNumber &&
        g.id !== editingId
    )
    if (duplicate) {
      showFeedback('❌ Ya existe una guía con ese número.', 'error')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    const payload = {
      dispatch_guide_number: formData.dispatchGuideNumber,
      recipient_name: formData.recipientName,
      rut: formData.rut,
      business_activity: formData.businessActivity,
      address: formData.address,
      district: formData.district,
      city: formData.city,
      contact: formData.contact,
      transport_type: formData.transportType,
      purchase_order_id: formData.purchaseOrderId || null
    }

    if (isEditing) {
      await window.electronAPI.updateDispatchGuide(editingId, payload)
      showFeedback('✅ Guía actualizada correctamente.', 'success')
    } else {
      await window.electronAPI.addDispatchGuide(payload)
      showFeedback('✅ Guía creada correctamente.', 'success')
    }

    setIsModalOpen(false)
    setIsEditing(false)
    setEditingId(null)
    resetForm()
    fetchGuides()
  }

  const handleEdit = (guide) => {
    setFormData({
      dispatchGuideNumber: guide.dispatch_guide_number,
      recipientName: guide.recipient_name,
      rut: guide.rut,
      businessActivity: guide.business_activity,
      address: guide.address,
      district: guide.district,
      city: guide.city,
      contact: guide.contact,
      transportType: guide.transport_type,
      purchaseOrderId: guide.purchase_order_id || ''
    })
    setEditingId(guide.id)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    openModal('¿Estás seguro de que deseas eliminar esta guía de despacho?', async () => {
      await window.electronAPI.deleteDispatchGuide(id)
      showFeedback('✅ Guía eliminada correctamente.', 'success')
      fetchGuides()
    })
  }

  const resetForm = () => {
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
      purchaseOrderId: ''
    })
  }

  return (
    <div className="dispatch-guide-container">
      <div className="card">
        <div className="header-section">
          <h2>Guías de Despacho</h2>
          {user?.role === 'admin' && (
            <button
              className="btn-primary"
              onClick={() => {
                setIsModalOpen(true)
                setIsEditing(false)
                resetForm()
              }}
            >
              + Nueva Guía
            </button>
          )}
        </div>

        <DispatchGuideTable guides={guides} onEdit={handleEdit} onDelete={handleDelete} user={user} />
      </div>

      <DispatchGuideFormModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        formData={formData}
        purchaseOrders={purchaseOrders}
        onChange={handleInputChange}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Confirmar acción?</h2>
            <p>{modalMessage}</p>
            <div className="modal-buttons">
              <button onClick={confirm}>Confirmar</button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {feedbackMessage && <div className={`feedback-toast ${feedbackType}`}>{feedbackMessage}</div>}
    </div>
  )
}

export default DispatchGuide