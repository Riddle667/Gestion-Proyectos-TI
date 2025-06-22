import React, { useEffect, useState } from 'react'
import './PurchaseOrder.css'

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    purchaseOrderNumber: '',
    companyName: '',
    companyRepresentative: '',
    date: '',
    orderAmount: ''
  })

  const fetchOrders = async () => {
    try {
      const data = await window.electronAPI.getPurchaseOrders()
      setOrders(data)
    } catch (error) {
      console.error('❌ Error al obtener órdenes:', error)
    }
  }

  const handleAddOrder = async () => {
    // Validar campos requeridos
    if (!formData.purchaseOrderNumber.trim()) {
      alert('El número de orden es requerido')
      return
    }

    try {
      await window.electronAPI.addPurchaseOrder({
        purchase_order_number: formData.purchaseOrderNumber,
        company_name: formData.companyName,
        company_representative: formData.companyRepresentative,
        date: formData.date,
        order_amount: formData.orderAmount
      })
      
      // Resetear formulario
      setFormData({
        purchaseOrderNumber: '',
        companyName: '',
        companyRepresentative: '',
        date: '',
        orderAmount: ''
      })
      
      setIsModalOpen(false)
      fetchOrders()
    } catch (error) {
      alert('Error al agregar orden: ' + error)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
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

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="purchase-order-container">
      <div className="card">
        <div className="header-section">
          <h2>Órdenes de Compra</h2>
          <button 
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Nueva Orden
          </button>
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
              <button 
                className="btn-close"
                onClick={handleCancelModal}
              >
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
              <button 
                className="btn-secondary"
                onClick={handleCancelModal}
              >
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
    </div>
  )
}

export default PurchaseOrder