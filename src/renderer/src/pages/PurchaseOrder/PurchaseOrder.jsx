import { useEffect, useState } from 'react'
import './PurchaseOrder.css'
import InvoiceFormModal from '../Invoices/InvoiceFormModal'
import DispatchGuideFormModal from '../DispatchGuide/DispatchGuideFormModal'
import useModalAndFeedback from '../../components/useModalAndFeedback'

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isDispatchGuideModalOpen, setIsDispatchGuideModalOpen] = useState(false)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [newOrder, setNewOrder] = useState(null)
  const [newGuide, setNewGuide] = useState(null)
  const [askInvoiceAfterGuide, setAskInvoiceAfterGuide] = useState(false)
  const [formData, setFormData] = useState({
    purchaseOrderNumber: '',
    companyName: '',
    companyRepresentative: '',
    date: '',
    orderAmount: ''
  })
  const [dispatchGuideFormData, setDispatchGuideFormData] = useState({
    dispatchGuideNumber: '',
    recipientName: '',
    rut: '',
    businessActivity: '',
    address: '',
    district: '',
    purchaseOrderId: ''
  })
  const [invoiceFormData, setInvoiceFormData] = useState({
    invoiceNumber: '',
    date: '',
    endDate: new Date().toISOString().split('T')[0], // Fecha de término por defecto hoy
    companyName: '',
    netAmount: '',
    taxIva: '',
    purchaseOrderId: '',
    dispatchGuideId: ''
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
    fetchOrders()
    window.api.getCurrentUser().then((u) => {
      setUser(u)
    })
  }, [])

  useEffect(() => {
    if (!isDispatchGuideModalOpen && askInvoiceAfterGuide) {
      openModal('¿Deseas crear una Factura para esta orden?', async () => {
        setInvoiceFormData({
          invoiceNumber: '',
          date: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0], // Fecha de término por defecto hoy
          companyName: newOrder?.company_name || '',
          netAmount: newOrder?.order_amount || '',
          taxIva: '19',
          purchaseOrderId: newOrder?.id || '',
          dispatchGuideId: '' // podrías vincular luego
        })
        setIsInvoiceModalOpen(true)
      })
      setAskInvoiceAfterGuide(false)
    }
  }, [isDispatchGuideModalOpen])

  const fetchOrders = async () => {
    try {
      const data = await window.electronAPI.getPurchaseOrders()
      setOrders(data)
    } catch (error) {
      console.error('❌ Error al obtener órdenes:', error)
    }
  }

  const handleAddOrder = async () => {
    if (!formData.purchaseOrderNumber.trim()) {
      alert('El número de orden es requerido')
      return
    }

    try {
      // 1. Crear orden de compra
      const newOrder = {
        purchase_order_number: formData.purchaseOrderNumber,
        company_name: formData.companyName,
        company_representative: formData.companyRepresentative,
        date: formData.date,
        order_amount: formData.orderAmount
      }

      const newOrderId = await window.electronAPI.addPurchaseOrder(newOrder)
      await setNewOrder(newOrderId)

      // 2. Resetear formulario y cerrar modal
      setFormData({
        purchaseOrderNumber: '',
        companyName: '',
        companyRepresentative: '',
        date: '',
        orderAmount: ''
      })
      setIsModalOpen(false)

      // 3. Recargar órdenes
      fetchOrders()

      openModal('¿Deseas crear una Guía de Despacho para esta orden?', async () => {
        setDispatchGuideFormData({
          dispatchGuideNumber: '',
          recipientName: newOrder.company_representative || '',
          rut: '',
          businessActivity: '',
          address: '',
          district: '',
          city: '',
          contact: '',
          transportType: '',
          purchaseOrderId: newOrderId
        })
        setIsDispatchGuideModalOpen(true)
        setAskInvoiceAfterGuide(true)
      })
    } catch (error) {
      alert('❌ Error al agregar orden: ' + error)
    }
  }

  const handleSaveInvoice = async () => {
    const payload = {
      invoice_number: invoiceFormData.invoiceNumber,
      date: invoiceFormData.date,
      end_date: invoiceFormData.endDate,
      company_name: invoiceFormData.companyName,
      net_amount: invoiceFormData.netAmount,
      tax_iva: invoiceFormData.taxIva,
      purchase_order_id: invoiceFormData.purchaseOrderId || null,
      dispatch_guide_id: invoiceFormData.dispatchGuideId || null
    }

    try {
      await window.electronAPI.addInvoice(payload)

      setIsInvoiceModalOpen(false)
      showFeedback('✅ Factura creada correctamente.', 'success')

      // Si tienes una función para refrescar facturas, puedes llamarla aquí
      // fetchInvoices()
    } catch (error) {
      console.error('❌ Error al guardar la factura:', error)
      showFeedback('❌ Error al guardar la factura.', 'error')
    }
  }

  const handleSaveDispatchGuide = async () => {
    const payload = {
      dispatch_guide_number: dispatchGuideFormData.dispatchGuideNumber,
      recipient_name: dispatchGuideFormData.recipientName,
      rut: dispatchGuideFormData.rut,
      business_activity: dispatchGuideFormData.businessActivity,
      address: dispatchGuideFormData.address,
      district: dispatchGuideFormData.district,
      city: dispatchGuideFormData.city,
      contact: dispatchGuideFormData.contact,
      transport_type: dispatchGuideFormData.transportType,
      purchase_order_id: dispatchGuideFormData.purchaseOrderId || null
    }

    try {
      const newGuide = await window.electronAPI.addDispatchGuide(payload)

      await setNewGuide(newGuide)
      setIsDispatchGuideModalOpen(false)
      showFeedback('✅ Guía de despacho creada correctamente.', 'success')

      // Si tienes una función para actualizar la lista de guías
      // fetchDispatchGuides()
    } catch (error) {
      console.error('❌ Error al guardar la guía de despacho:', error)
      showFeedback('❌ Error al guardar la guía de despacho.', 'error')
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
      purchaseOrderNumber: '',
      companyName: '',
      companyRepresentative: '',
      date: '',
      orderAmount: ''
    })
    setIsModalOpen(false)
  }

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancelModal()
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  }

  const formatAmount = (amount) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(parseFloat(amount))
  }

  return (
    <div className="purchase-order-container">
      <div className="card">
        <div className="header-section">
          <h2>Órdenes de Compra</h2>

          {user && user.role === 'admin' && (
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              + Nueva Orden
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <p className="no-orders">No hay órdenes registradas.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>N° Orden</th>
                  <th>Empresa</th>
                  <th>Representante</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td className="order-number">{order.purchase_order_number}</td>
                    <td>{order.company_name || '-'}</td>
                    <td>{order.company_representative || '-'}</td>
                    <td>{formatDate(order.date)}</td>
                    <td className="amount">{formatAmount(order.order_amount)}</td>
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
              <h3>Nueva Orden de Compra</h3>
              <button className="btn-close" onClick={handleCancelModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="purchaseOrderNumber">Número de Orden *</label>
                  <input
                    id="purchaseOrderNumber"
                    type="text"
                    placeholder="Ej: PO-2025-001"
                    value={formData.purchaseOrderNumber}
                    onChange={(e) => handleInputChange('purchaseOrderNumber', e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyName">Nombre de la Empresa</label>
                  <input
                    id="companyName"
                    type="text"
                    placeholder="Ej: Empresa ABC S.A."
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyRepresentative">Representante</label>
                  <input
                    id="companyRepresentative"
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={formData.companyRepresentative}
                    onChange={(e) => handleInputChange('companyRepresentative', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Fecha</label>
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="orderAmount">Monto de la Orden</label>
                  <input
                    id="orderAmount"
                    type="number"
                    placeholder="Ej: 150000"
                    min="0"
                    step="0.01"
                    value={formData.orderAmount}
                    onChange={(e) => handleInputChange('orderAmount', e.target.value)}
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
                onClick={handleAddOrder}
                disabled={!formData.purchaseOrderNumber.trim()}
              >
                Crear Orden
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal para Guía de Despacho */}
      <DispatchGuideFormModal
        isOpen={isDispatchGuideModalOpen}
        formData={dispatchGuideFormData}
        purchaseOrder={newOrder}
        onChange={(field, value) =>
          setDispatchGuideFormData((prev) => ({ ...prev, [field]: value }))
        }
        onCancel={() => setIsDispatchGuideModalOpen(false)}
        onSave={handleSaveDispatchGuide} // Debes definir esta función
      />
      {/* Modal para Factura */}
      <InvoiceFormModal
        isOpen={isInvoiceModalOpen}
        isEditing={false}
        formData={invoiceFormData}
        purchaseOrder={newOrder}
        dispatchGuide={newGuide}
        onChange={(field, value) => setInvoiceFormData((prev) => ({ ...prev, [field]: value }))}
        onCancel={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice} // Debes definir esta función
      />
      {console.log(newOrder)}
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

export default PurchaseOrder
