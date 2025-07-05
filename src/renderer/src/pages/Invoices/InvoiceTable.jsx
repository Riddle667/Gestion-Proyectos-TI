import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PropTypes from 'prop-types'

// 👉 Aquí defines directamente la función
const formatCurrency = (value) => {
  if (!value) return '-'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(parseFloat(value))
}

const InvoiceTable = ({ invoices, onEdit, onDelete }) => {
  if (invoices.length === 0) {
    return <p className="no-invoices">No hay facturas registradas.</p>
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>N° Factura</th>
            <th>Fecha</th>
            <th>Fecha Término</th>
            <th>Empresa</th>
            <th>Neto</th>
            <th>IVA</th>
            <th>Orden Compra</th>
            <th>Guía Despacho</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.invoice_number}</td>
              <td>{inv.date}</td>
              <td>{inv.end_date || '-'}</td>
              <td>{inv.company_name}</td>
              <td>{formatCurrency(inv.net_amount)}</td>
              <td>{inv.tax_iva}%</td>
              <td>{inv.purchase_order_number || '-'}</td>
              <td>{inv.dispatch_guide_number || '-'}</td>
              <td>
                <div className="icon-group">
                  <button title="Editar" className="icon-btn edit" onClick={() => onEdit(inv)}>
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    title="Eliminar"
                    className="icon-btn delete"
                    onClick={() => onDelete(inv.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
InvoiceTable.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      invoice_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.string,
      company_name: PropTypes.string,
      net_amount: PropTypes.number,
      tax_iva: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      purchase_order_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dispatch_guide_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default InvoiceTable
