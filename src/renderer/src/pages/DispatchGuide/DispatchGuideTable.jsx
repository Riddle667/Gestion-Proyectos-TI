import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PropTypes from 'prop-types'

const DispatchGuideTable = ({ guides, onEdit, onDelete, user }) => {
  if (guides.length === 0) {
    return <p className="no-invoices">No hay guías de despacho registradas.</p>
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>N° Guía</th>
            <th>Destinatario</th>
            <th>RUT</th>
            <th>Actividad Comercial</th>
            <th>Dirección</th>
            <th>Comuna</th>
            <th>Ciudad</th>
            <th>Contacto</th>
            <th>Tipo de Transporte</th>
            <th>Orden de Compra</th>
            {user?.role === 'admin' && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {guides.map((gui) => (
            <tr key={gui.id}>
              <td>{gui.id}</td>
              <td>{gui.dispatch_guide_number}</td>
              <td>{gui.recipient_name}</td>
              <td>{gui.rut}</td>
              <td>{gui.business_activity}</td>
              <td>{gui.address}</td>
              <td>{gui.district}</td>
              <td>{gui.city}</td>
              <td>{gui.contact}</td>
              <td>{gui.transport_type}</td>
              <td>{gui.purchase_order_id || '-'}</td>
              {user?.role === 'admin' && (
                <td>
                  <div className="icon-group">
                    <button
                      title="Editar"
                      className="icon-btn edit"
                      onClick={() => onEdit(gui)}
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      title="Eliminar"
                      className="icon-btn delete"
                      onClick={() => onDelete(gui.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

DispatchGuideTable.propTypes = {
  guides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      dispatch_guide_number: PropTypes.string.isRequired,
      recipient_name: PropTypes.string.isRequired,
      rut: PropTypes.string.isRequired,
      business_activity: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      district: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      contact: PropTypes.string.isRequired,
      transport_type: PropTypes.string.isRequired,
      purchase_order_id: PropTypes.number
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string
  }).isRequired
}

export default DispatchGuideTable
