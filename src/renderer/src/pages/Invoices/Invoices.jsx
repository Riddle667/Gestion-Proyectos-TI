import { useEffect, useState } from 'react'
import './Invoices.css'

const Invoices = () => {
  const [invoices, setInvoices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    date: '',
    companyName: '',
    netAmount: '',
    taxIva: '',
    purchaseOrder: '',
    dispatchGuide: ''
  })
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchInvoices()
    window.api.getCurrentUser().then((u) => {
      setUser(u)
    })
  }, [])

  const fetchInvoices = async () => {
    try {
      const data = await window.electronAPI.getInvoices()
      setInvoices(data)
    } catch (error) {
      console.error('❌ Error al obtener facturas:', error)
    }
  }

  const handleAddInvoice = async () => {
    if (!formData.invoiceNumber.trim()) {
      alert('El número de factura es obligatorio')
      return
    }

    try {
      await window.electronAPI.addInvoice({
        invoice_number: formData.invoiceNumber,
        date: formData.date,
        company_name: formData.companyName,
        net_amount: formData.netAmount,
        tax_iva: formData.taxIva,
        purchase_order: formData.purchaseOrder,
        dispatch_guide: formData.dispatchGuide
      })

      setFormData({
        invoiceNumber: '',
        date: '',
        companyName: '',
        netAmount: '',
        taxIva: '',
        purchaseOrder: '',
        dispatchGuide: ''
      })

      setIsModalOpen(false)
      fetchInvoices()
    } catch (error) {
      alert('Error al agregar factura: ' + error)
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
      invoiceNumber: '',
      date: '',
      companyName: '',
      netAmount: '',
      taxIva: '',
      purchaseOrder: '',
      dispatchGuide: ''
    })
    setIsModalOpen(false)
  }

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancelModal()
    }
  }

  const formatCurrency = (value) => {
    if (!value) return '-'
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(parseFloat(value))
  }

  return (
    <div className="invoice-container">
      <div className="card">
        <div className="header-section">
          <h2>Facturas</h2>
          {user && user.role === 'admin' && (
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              + Nueva Factura
            </button>
          )}
        </div>

        {invoices.length === 0 ? (
          <p className="no-invoices">No hay facturas registradas.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>N° Factura</th>
                  <th>Fecha</th>
                  <th>Empresa</th>
                  <th>Neto</th>
                  <th>IVA</th>
                  <th>Orden Compra</th>
                  <th>Guía Despacho</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.id}</td>
                    <td>{inv.invoice_number}</td>
                    <td>{inv.date}</td>
                    <td>{inv.company_name}</td>
                    <td>{formatCurrency(inv.net_amount)}</td>
                    <td>{inv.tax_iva}%</td>
                    <td>{inv.purchase_order || '-'}</td>
                    <td>{inv.dispatch_guide || '-'}</td>
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
              <h3>Nueva Factura</h3>
              <button className="btn-close" onClick={handleCancelModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="invoiceNumber">N° Factura *</label>
                  <input
                    id="invoiceNumber"
                    type="text"
                    placeholder="Ej: F-0001"
                    value={formData.invoiceNumber}
                    onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                    autoFocus
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

                <div className="form-group">
                  <label htmlFor="companyName">Empresa</label>
                  <input
                    id="companyName"
                    type="text"
                    placeholder="Ej: Constructora XYZ"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="netAmount">Monto Neto</label>
                  <input
                    id="netAmount"
                    type="number"
                    placeholder="Ej: 100000"
                    value={formData.netAmount}
                    onChange={(e) => handleInputChange('netAmount', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="taxIva">IVA</label>
                  <input
                    id="taxIva"
                    type="number"
                    placeholder="Ej: 19"
                    value={formData.taxIva}
                    onChange={(e) => handleInputChange('taxIva', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="purchaseOrder">Orden de Compra</label>
                  <input
                    id="purchaseOrder"
                    type="text"
                    placeholder="Ej: OC-2025-001"
                    value={formData.purchaseOrder}
                    onChange={(e) => handleInputChange('purchaseOrder', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dispatchGuide">Guía de Despacho</label>
                  <input
                    id="dispatchGuide"
                    type="text"
                    placeholder="Ej: GD-2025-001"
                    value={formData.dispatchGuide}
                    onChange={(e) => handleInputChange('dispatchGuide', e.target.value)}
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
                onClick={handleAddInvoice}
                disabled={!formData.invoiceNumber.trim()}
              >
                Crear Factura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Invoices
