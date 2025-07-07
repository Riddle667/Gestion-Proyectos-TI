import EditIcon from '@mui/icons-material/Search'
import PropTypes from 'prop-types'

const formatCurrency = (value) => {
  if (!value) return '-'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(parseFloat(value))
}

const InvoiceTable = ({ invoices, onDetails, highlight  }) => {
  if (invoices.length === 0) {
    return <p className="no-invoices">No hay facturas registradas.</p>
  }

  const lastFiveInvoices = [...invoices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="table-container">
      <table className={highlight ? 'highlight-red' : ''}>
        <thead>
          <tr>
            <th>ID</th>
            <th>N° Factura</th>
            <th>Fecha Inicio</th>
            <th>Fecha Término</th>
            <th>Empresa</th>
            <th>Monto</th>
            <th>Pagada</th>
            <th>Ver detalles</th>
          </tr>
        </thead>
        <tbody>
          {lastFiveInvoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.invoice_number}</td>
              <td>{inv.date}</td>
              <td>{inv.end_date || '-'}</td>
              <td>{inv.company_name}</td>
              <td>{formatCurrency(inv.net_amount)}</td>
              <td>
                <span style={{ color: inv.paid === 1 ? 'green' : 'red', fontWeight: 'bold' }}>
                  {inv.paid === 1 ? 'SI' : 'NO'}
                </span>
              </td>
              <td>
                <div className="icon-group">
                  <button
                    title="Detalle"
                    className="icon-btn details"
                    onClick={() => onDetails(inv)}
                  >
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
      end_date: PropTypes.string,
      company_name: PropTypes.string,
      net_amount: PropTypes.number,
      paid: PropTypes.number
    })
  ).isRequired,
  onDetails: PropTypes.func.isRequired,
  highlight: PropTypes.bool
}

export default InvoiceTable
