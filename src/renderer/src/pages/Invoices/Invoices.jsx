
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Invoices.css';

const Invoices = () => {

  const navigate = useNavigate();

  const handleCreateInvoice = () => {
    navigate('create');
  };

  return (
    <div style={{color: 'black'}}>
      <h1>Facturas</h1>
      
      <div>
        <button onClick={handleCreateInvoice}>Crear Nueva Factura</button>
      </div>

      <h2>Lista de Facturas</h2>
      <p>Aquí aparecerá la lista de facturas</p>
      
    </div>
  );
};

export default Invoices;