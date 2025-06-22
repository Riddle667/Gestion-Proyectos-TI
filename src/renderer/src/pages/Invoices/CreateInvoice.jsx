import './Invoices'

const CreateInvoice = () => {
  const handleBack = () => {
    console.log('Navegando de vuelta a facturas')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Formulario enviado')
  }

  return (
    <div className="invoice-container">
      <div className="invoice-wrapper">
        {/* Header */}
        <div className="invoice-header">
          <h1 className="invoice-title">Crear Nueva Factura</h1>
          <button onClick={handleBack} className="invoice-back-button">
            ← Volver a Facturas
          </button>
        </div>

        {/* Form Card */}
        <div className="invoice-card">
          <div className="invoice-card-header">
            <h2 className="invoice-card-title">Datos de la Factura</h2>
          </div>

          <form onSubmit={handleSubmit} className="invoice-form">
            <div className="invoice-grid">
              <div>
                <label className="invoice-label">
                  Número de Factura <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="invoice_number"
                  className="invoice-input"
                  placeholder="Ingrese número de factura"
                />
              </div>

              <div>
                <label className="invoice-label">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input type="date" name="date" className="invoice-input" />
              </div>
            </div>

            <div>
              <label className="invoice-label">
                Nombre de la Empresa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                className="invoice-input"
                placeholder="Ingrese nombre de la empresa"
              />
            </div>

            <div className="invoice-grid">
              <div>
                <label className="invoice-label">
                  Monto Neto <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="net_amount"
                  className="invoice-input"
                  placeholder="0.00"
                  step="0.01"
                />
                <p className="invoice-note">Ingrese el monto sin IVA</p>
              </div>

              <div>
                <label className="invoice-label">
                  IVA <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="tax_iva"
                  className="invoice-input"
                  placeholder="0.00"
                  step="0.01"
                />
                <p className="invoice-note">Monto del IVA aplicado</p>
              </div>
            </div>

            <div className="invoice-grid">
              <div>
                <label className="invoice-label">Orden de Compra</label>
                <input
                  type="text"
                  name="purchase_order"
                  className="invoice-input"
                  placeholder="Número de orden de compra"
                />
              </div>

              <div>
                <label className="invoice-label">Guía de Despacho</label>
                <input
                  type="text"
                  name="dispatch_guide"
                  className="invoice-input"
                  placeholder="Número de guía de despacho"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button type="submit" className="invoice-submit">
                Crear Factura
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateInvoice
