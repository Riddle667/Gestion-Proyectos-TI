import { useState, useEffect } from 'react'
import './Home.css'
import InvoiceTable from './InvoiceTable.jsx'
import InvoiceViewModal from './InvoiceViewModal.jsx'

export default function Home() {
  const [invoices, setInvoices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [relatedData, setRelatedData] = useState({
    purchaseOrder: null,
    dispatchGuide: null
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const data = await window.electronAPI.getInvoices()
      setInvoices(data)
    } catch (error) {
      console.error('Error al obtener facturas:', error)
      // Si hay error, usar array vacío
      setInvoices([])
    }
  }

  const fetchRelatedData = async (invoice) => {
    try {
      let purchaseOrder = null
      let dispatchGuide = null

      // Buscar orden de compra relacionada
      if (invoice.purchase_order_id) {
        try {
          purchaseOrder = await window.electronAPI.getPurchaseOrder(invoice.purchase_order_id)
        } catch (error) {
          console.error('Error al obtener orden de compra:', error)
        }
      }

      // Buscar guía de despacho relacionada
      if (invoice.dispatch_guide_id) {
        try {
          dispatchGuide = await window.electronAPI.getDispatchGuide(invoice.dispatch_guide_id)
        } catch (error) {
          console.error('Error al obtener guía de despacho:', error)
        }
      }

      setRelatedData({
        purchaseOrder,
        dispatchGuide
      })
    } catch (error) {
      console.error('Error al obtener datos relacionados:', error)
      setRelatedData({
        purchaseOrder: null,
        dispatchGuide: null
      })
    }
  }

  const handleDetails = async (invoice) => {
    console.log('Ver detalles de factura:', invoice)
    
    // Establecer la factura seleccionada
    setSelectedInvoice(invoice)
    
    // Buscar datos relacionados
    await fetchRelatedData(invoice)
    
    // Abrir el modal
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInvoice(null)
    setRelatedData({
      purchaseOrder: null,
      dispatchGuide: null
    })
  }

  return (
    <div className="main-content">
      <div className="welcome-box">
        <h2>Bienvenido al Gestor Montecristo</h2>
        <p>Selecciona una opción en el menú lateral para comenzar.</p>
      </div>

      <div className="table-section">
        <h3>Facturas Recientes</h3>
        <InvoiceTable 
          invoices={invoices}
          onDetails={handleDetails}
        />
      </div>

      <InvoiceViewModal
        isOpen={isModalOpen}
        invoice={selectedInvoice}
        purchaseOrder={relatedData.purchaseOrder}
        dispatchGuide={relatedData.dispatchGuide}
        onClose={handleCloseModal}
      />
    </div>
  )
}