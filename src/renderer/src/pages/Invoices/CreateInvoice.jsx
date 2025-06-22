import React from 'react';

const CreateInvoice = () => {
  const handleBack = () => {
    console.log('Navegando de vuelta a facturas');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado');
    // Aquí irá la lógica para crear la factura
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Crear Nueva Factura</h1>
          <button 
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-colors duration-200"
          >
            ← Volver a Facturas
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-black">Datos de la Factura</h2>
          </div>
          
          <div onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {/* Primera fila - Número y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Número de Factura <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="invoice_number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                  placeholder="Ingrese número de factura"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  name="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                />
              </div>
            </div>

            {/* Nombre de la Empresa */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Nombre de la Empresa <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="company_name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                placeholder="Ingrese nombre de la empresa"
              />
            </div>

            {/* Segunda fila - Montos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Monto Neto <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  name="net_amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                  placeholder="0.00"
                  step="0.01"
                />
                <p className="text-xs text-black mt-1">Ingrese el monto sin IVA</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  IVA <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  name="tax_iva"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                  placeholder="0.00"
                  step="0.01"
                />
                <p className="text-xs text-black mt-1">Monto del IVA aplicado</p>
              </div>
            </div>

            {/* Tercera fila - Documentos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Orden de Compra
                </label>
                <input 
                  type="text" 
                  name="purchase_order"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                  placeholder="Número de orden de compra"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Guía de Despacho
                </label>
                <input 
                  type="text" 
                  name="dispatch_guide"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                  placeholder="Número de guía de despacho"
                />
              </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-6 border-t border-gray-200">
              <button 
                type="submit"
                onClick={handleSubmit}
                className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Crear Factura
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;