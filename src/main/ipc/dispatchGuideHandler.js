import { ipcMain } from 'electron'
import { getDatabase } from '../database/localDb'

const db = getDatabase()

// Obtener todas las guías de despacho
ipcMain.handle('get-dispatch-guides', () => {
  try {
    console.log('📋 Consultando guías de despacho...')
    const rows = db
      .prepare(`
        SELECT
          DispatchGuide.*,
          PurchaseOrder.purchase_order_number AS purchase_order_number
        FROM DispatchGuide
        LEFT JOIN PurchaseOrder ON DispatchGuide.purchase_order_id = PurchaseOrder.id
        ORDER BY DispatchGuide.id DESC
      `)
      .all()
    console.log(`📋 Obtenidas ${rows.length} guías de despacho con datos relacionados`)
    return rows
  } catch (err) {
    console.error('❌ Error al consultar DispatchGuide con joins:', err)
    throw err
  }
})

// Agregar nueva guía de despacho
ipcMain.handle('add-dispatch-guide', (event, dispatchGuideData) => {
  const {
    dispatch_guide_number,
    recipient_name = null,
    rut = null,
    business_activity = null,
    address = null,
    district = null,
    city = null,
    contact = null,
    transport_type = null,
    purchase_order_id = null
  } = dispatchGuideData

  if (!dispatch_guide_number || !dispatch_guide_number.trim()) {
    throw new Error('El número de guía de despacho es obligatorio')
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO DispatchGuide
      (dispatch_guide_number, recipient_name, rut, business_activity, address, district, city, contact, transport_type, purchase_order_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      dispatch_guide_number,
      recipient_name,
      rut,
      business_activity,
      address,
      district,
      city,
      contact,
      transport_type,
      purchase_order_id
    )

    console.log(`📋 Guía de despacho agregada con ID: ${result.lastInsertRowid}`)
    return { id: result.lastInsertRowid, ...dispatchGuideData }
  } catch (err) {
    console.error('❌ Error al agregar guía de despacho:', err)
    throw err
  }
})

// Actualizar guía de despacho
ipcMain.handle('update-dispatch-guide', (event, id, updatedData) => {
  try {
    const stmt = db.prepare(`
      UPDATE DispatchGuide
      SET
        dispatch_guide_number = ?,
        recipient_name = ?,
        rut = ?,
        business_activity = ?,
        address = ?,
        district = ?,
        city = ?,
        contact = ?,
        transport_type = ?,
        purchase_order_id = ?
      WHERE id = ?
    `)

    const result = stmt.run(
      updatedData.dispatch_guide_number,
      updatedData.recipient_name,
      updatedData.rut,
      updatedData.business_activity,
      updatedData.address,
      updatedData.district,
      updatedData.city,
      updatedData.contact,
      updatedData.transport_type,
      updatedData.purchase_order_id || null,
      id
    )

    if (result.changes === 0) throw new Error('No se encontró la guía a actualizar')

    console.log('✏️ Guía de despacho actualizada:', { id, ...updatedData })
    return { id, ...updatedData }
  } catch (err) {
    console.error('❌ Error al actualizar guía de despacho:', err)
    throw err
  }
})

// Eliminar guía de despacho
ipcMain.handle('delete-dispatch-guide', (event, id) => {
  try {
    const stmt = db.prepare(`DELETE FROM DispatchGuide WHERE id = ?`)
    const result = stmt.run(id)

    if (result.changes === 0) throw new Error('No se encontró la guía a eliminar')

    console.log('🗑️ Guía de despacho eliminada:', id)
    return { id, deleted: true }
  } catch (err) {
    console.error('❌ Error al eliminar guía de despacho:', err)
    throw err
  }
})
