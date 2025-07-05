import PropTypes from 'prop-types'

const formatCurrency = (value) => {
  if (!value) return '-'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(parseFloat(value))
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CL')
}

export const InvoiceViewModal = ({
  isOpen,
  invoice,
  purchaseOrder,
  dispatchGuide,
  onClose
}) => {
  if (!isOpen || !invoice) return null

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const calculateTotal = () => {
    if (!invoice.net_amount || !invoice.tax_iva) return 0
    const netAmount = parseFloat(invoice.net_amount)
    const taxAmount = netAmount * (parseFloat(invoice.tax_iva) / 100)
    return netAmount + taxAmount
  }

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Detalles de Factura</h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="invoice-details">
            <div className="detail-section">
              <h4>Información General</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>N° Factura:</label>
                  <span className="detail-value">{invoice.invoice_number || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Fecha:</label>
                  <span className="detail-value">{formatDate(invoice.date)}</span>
                </div>
                <div className="detail-item">
                  <label>Fecha de Término:</label>
                  <span className="detail-value">{formatDate(invoice.end_date)}</span>
                </div>
                <div className="detail-item">
                  <label>Empresa:</label>
                  <span className="detail-value">{invoice.company_name || '-'}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Montos</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Monto Neto:</label>
                  <span className="detail-value amount">{formatCurrency(invoice.net_amount)}</span>
                </div>
                <div className="detail-item">
                  <label>IVA:</label>
                  <span className="detail-value">{invoice.tax_iva || '-'}%</span>
                </div>
                <div className="detail-item">
                  <label>Monto IVA:</label>
                  <span className="detail-value amount">
                    {invoice.net_amount && invoice.tax_iva 
                      ? formatCurrency(parseFloat(invoice.net_amount) * (parseFloat(invoice.tax_iva) / 100))
                      : '-'}
                  </span>
                </div>
                <div className="detail-item total">
                  <label>Total:</label>
                  <span className="detail-value amount total-amount">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Documentos Relacionados</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Orden de Compra:</label>
                  <span className="detail-value">
                    {purchaseOrder?.purchase_order_number || 
                     invoice.purchase_order_number || '-'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Guía de Despacho:</label>
                  <span className="detail-value">
                    {dispatchGuide?.dispatch_guide_number || 
                     invoice.dispatch_guide_number || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

InvoiceViewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  invoice: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    invoice_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    end_date: PropTypes.string,
    company_name: PropTypes.string,
    net_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tax_iva: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    purchase_order_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dispatch_guide_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    purchase_order_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dispatch_guide_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  purchaseOrder: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    purchase_order_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  dispatchGuide: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dispatch_guide_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onClose: PropTypes.func.isRequired
}

export default InvoiceViewModal