import PropTypes from 'prop-types'

export const InvoiceFormModal = ({
  isOpen,
  isEditing,
  formData,
  purchaseOrders,
  purchaseOrder,
  dispatchGuides,
  dispatchGuide,
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
          <h3>{isEditing ? 'Editar Factura' : 'Nueva Factura'}</h3>
          <button className="btn-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            {[
              {
                id: 'invoiceNumber',
                label: 'N° Factura *',
                type: 'text',
                placeholder: 'Ej: F-0001'
              },
              { id: 'date', label: 'Fecha', type: 'date' },
              { id: 'endDate', label: 'Fecha de Término', type: 'date' },
              {
                id: 'companyName',
                label: 'Empresa',
                type: 'text',
                placeholder: 'Ej: Constructora XYZ'
              },
              {
                id: 'netAmount',
                label: 'Monto Neto',
                type: 'number',
                placeholder: 'Ej: 100000'
              },
              { id: 'taxIva', label: 'IVA', type: 'number', placeholder: 'Ej: 19' }
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
              <label htmlFor="purchaseOrderId">Orden de Compra</label>
              <select
                id="purchaseOrderId"
                value={formData.purchaseOrderId}
                onChange={(e) => onChange('purchaseOrderId', e.target.value)}
              >
                <option value="">-- Seleccionar --</option>
                {purchaseOrders?.length > 0
                  ? purchaseOrders.map((po) => (
                      <option key={po.id} value={po.id}>
                        {po.purchase_order_number}
                      </option>
                    ))
                  : purchaseOrder && (
                      <option value={purchaseOrder.id}>
                        {purchaseOrder.purchase_order_number}
                      </option>
                    )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dispatchGuideId">Guía de Despacho</label>
              <select
                id="dispatchGuideId"
                value={formData.dispatchGuideId}
                onChange={(e) => onChange('dispatchGuideId', e.target.value)}
              >
                <option value="">-- Seleccionar --</option>
                {dispatchGuides?.length > 0
                  ? dispatchGuides.map((dg) => (
                      <option key={dg.id} value={dg.id}>
                        {dg.dispatch_guide_number}
                      </option>
                    ))
                  : dispatchGuide && (
                      <option value={dispatchGuide.id}>
                        {dispatchGuide.dispatch_guide_number}
                      </option>
                    )}
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
            onClick={onSave}
            disabled={!formData.invoiceNumber.trim()}
          >
            {isEditing ? 'Actualizar' : 'Crear Factura'}
          </button>
        </div>
      </div>
    </div>
  )
}

InvoiceFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  purchaseOrders: PropTypes.array.isRequired,
  purchaseOrder: PropTypes.object,
  dispatchGuides: PropTypes.array.isRequired,
  dispatchGuide: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

export default InvoiceFormModal
