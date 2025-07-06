import PropTypes from 'prop-types'

const DispatchGuideFormModal = ({
  isOpen,
  isEditing,
  formData,
  purchaseOrder,
  purchaseOrders,
  onChange,
  onCancel,
  onSave
}) => {
  if (!isOpen) return null

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onCancel()
  }

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEditing ? 'Editar Guía de Despacho' : 'Nueva Guía de Despacho'}</h3>
          <button className="btn-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            {[
              {
                id: 'dispatchGuideNumber',
                label: 'N° Guía *',
                type: 'text',
                placeholder: 'Ej: GD-2025-001'
              },
              {
                id: 'recipientName',
                label: 'Nombre del Destinatario',
                type: 'text',
                placeholder: 'Ej: Juan Pérez'
              },
              { id: 'rut', label: 'RUT', type: 'text', placeholder: 'Ej: 12.345.678-9' },
              {
                id: 'businessActivity',
                label: 'Actividad Comercial',
                type: 'text',
                placeholder: 'Ej: Servicios de consultoría'
              },
              {
                id: 'address',
                label: 'Dirección',
                type: 'text',
                placeholder: 'Ej: Av. Providencia 123'
              },
              { id: 'district', label: 'Comuna', type: 'text', placeholder: 'Ej: Providencia' },
              { id: 'city', label: 'Ciudad', type: 'text', placeholder: 'Ej: Santiago' },
              { id: 'contact', label: 'Contacto', type: 'text', placeholder: 'Ej: +56 9 1234 5678' }
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="form-group">
                <label htmlFor={id}>{label}</label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={(e) => onChange(id, e.target.value)}
                />
              </div>
            ))}

            <div className="form-group">
              <label htmlFor="transportType">Tipo de Transporte</label>
              <select
                id="transportType"
                value={formData.transportType}
                onChange={(e) => onChange('transportType', e.target.value)}
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
              <label htmlFor="purchaseOrderId">Orden de Compra</label>
              <select
                id="purchaseOrderId"
                value={formData.purchaseOrderId}
                onChange={(e) => onChange('purchaseOrderId', e.target.value)}
              >
                <option value="">-- Seleccionar --</option>
                {purchaseOrders && purchaseOrders.length > 0 ? (
                  purchaseOrders.map((po) => (
                    <option key={po.id} value={po.id}>
                      {po.purchase_order_number}
                    </option>
                  ))
                ) : purchaseOrder ? (
                  <option value={purchaseOrder.id}>{purchaseOrder.purchase_order_number}</option>
                ) : (
                  <option disabled>No hay órdenes de compra disponibles</option>
                )}
                {console.log(purchaseOrder)}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className="btn-primary"
            onClick={() => onSave(formData)}
            disabled={
              !formData.dispatchGuideNumber ||
              !formData.recipientName ||
              !formData.rut ||
              !formData.address ||
              !formData.city ||
              !formData.transportType
            }
          >
            {isEditing ? 'Actualizar' : 'Crear Guía'}
          </button>
        </div>
      </div>
    </div>
  )
}

DispatchGuideFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  purchaseOrder: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    purchase_order_number: PropTypes.string
  }),
  purchaseOrders: PropTypes.array.isRequired,
  //dispatchGuides: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

export default DispatchGuideFormModal
