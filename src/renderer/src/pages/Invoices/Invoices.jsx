import { useState, useEffect } from 'react'
import './invoices.css'
import InvoiceTable from './InvoiceTable'
import InvoiceFormModal from './InvoiceFormModal'
import useModalAndFeedback from '../../components/useModalAndFeedback'

const Invoices = () => {
  const [invoices, setInvoices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [user, setUser] = useState(null)
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [dispatchGuides, setDispatchGuides] = useState([])
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    date: '',
    endDate: '',
    companyName: '',
    netAmount: '',
    taxIva: '',
    purchaseOrderId: '',
    dispatchGuideId: '',
    paid: false
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
    fetchInvoices()
    fetchRelatedData()
    window.api.getCurrentUser().then(setUser)
  }, [])

  const fetchInvoices = async () => {
    const data = await window.electronAPI.getInvoices()
    setInvoices(data)
  }

  const fetchRelatedData = async () => {
    const [orders, guides] = await Promise.all([
      window.electronAPI.getPurchaseOrders(),
      window.electronAPI.getDispatchGuides()
    ])
    setPurchaseOrders(orders)
    setDispatchGuides(guides)
  }

  const handleEdit = (invoice) => {
    setFormData({
      invoiceNumber: invoice.invoice_number,
      date: invoice.date,
      endDate: invoice.end_date || '',
      companyName: invoice.company_name,
      netAmount: invoice.net_amount,
      taxIva: invoice.tax_iva,
      purchaseOrderId: invoice.purchase_order_id || '',
      dispatchGuideId: invoice.dispatch_guide_id || '',
      paid: !!invoice.paid
    })
    setEditingId(invoice.id)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    openModal('¿Estás seguro de que deseas eliminar esta factura?', async () => {
      await window.electronAPI.deleteInvoice(id)
      showFeedback('✅ Factura eliminada correctamente.', 'success')
      fetchInvoices()
    })
  }

  const handleSave = async () => {
    const payload = {
      invoice_number: formData.invoiceNumber,
      date: formData.date,
      end_date: formData.endDate,
      company_name: formData.companyName,
      net_amount: formData.netAmount,
      tax_iva: formData.taxIva,
      purchase_order_id: formData.purchaseOrderId || null,
      dispatch_guide_id: formData.dispatchGuideId || null,
      paid: formData.paid ? 1 : 0
    }

    if (isEditing) {
      await window.electronAPI.updateInvoice(editingId, payload)
    } else {
      await window.electronAPI.addInvoice(payload)
    }

    setIsModalOpen(false)
    setEditingId(null)
    setIsEditing(false)
    showFeedback('✅ Factura guardada correctamente.', 'success')
    fetchInvoices()
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTogglePaid = async (invoice) => {
    const updatedInvoice = { ...invoice, paid: invoice.paid ? 0 : 1 }
    await window.electronAPI.updateInvoice(invoice.id, updatedInvoice)
    fetchInvoices()
  }

  return (
    <div className="invoice-container">
      <div className="card">
        <div className="header-section">
          <h2>Facturas</h2>
          {user?.role === 'admin' && (
            <button
              className="btn-primary"
              onClick={() => {
                setIsModalOpen(true)
                setIsEditing(false)
                setFormData({
                  invoiceNumber: '',
                  date: '',
                  endDate: '',
                  companyName: '',
                  netAmount: '',
                  taxIva: '',
                  purchaseOrderId: '',
                  dispatchGuideId: '',
                  paid: false
                })
              }}
            >
              + Nueva Factura
            </button>
          )}
        </div>

        <InvoiceTable
          invoices={invoices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePaid={handleTogglePaid}
        />
      </div>

      <InvoiceFormModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        formData={formData}
        purchaseOrders={purchaseOrders}
        dispatchGuides={dispatchGuides}
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

export default Invoices