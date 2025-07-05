import EditIcon from '@mui/icons-material/Search'
import PropTypes from 'prop-types'

// 👉 Aquí defines directamente la función
const formatCurrency = (value) => {
  if (!value) return '-'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(parseFloat(value))
}

const InvoiceTable = ({ invoices, onDetails }) => {
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
            <th>Fecha Inicio</th>
            <th>Fecha Término</th>
            <th>Empresa</th>
            <th>Monto</th>
            <th>Ver detalles</th>
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
              <td>
                <div className="icon-group">
                  <button title="Detalle" 
                  className="icon-btn details" 
                  onClick={() => onDetails(inv)}>
                    <EditIcon fontSize="small" />
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
    })
  ).isRequired,
  onDetails: PropTypes.func.isRequired,
}

export default InvoiceTable
