import { ipcMain } from 'electron'
import { getDatabase } from '../database/localDb'

const db = getDatabase()

// Obtener todas las guías de despacho
ipcMain.handle('get-dispatch-guides', () => {
  try {
    console.log('📋 Consultando guías de despacho...')
    const rows = db.prepare('SELECT * FROM DispatchGuide ORDER BY id DESC').all()
    console.log(`📋 Obtenidas ${rows.length} guías de despacho`)
    return rows
  } catch (err) {
    console.error('❌ Error al consultar DispatchGuide:', err)
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
    purchase_order = null
  } = dispatchGuideData

  // Validar campo requerido
  if (!dispatch_guide_number || !dispatch_guide_number.trim()) {
    throw new Error('El número de guía de despacho es obligatorio')
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO DispatchGuide
      (dispatch_guide_number, recipient_name, rut, business_activity, address, district, city, contact, transport_type, purchase_order)
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
      purchase_order
    )

    console.log(`📋 Guía de despacho agregada con ID: ${result.lastInsertRowid}`)

    return { id: result.lastInsertRowid, ...dispatchGuideData }
  } catch (err) {
    console.error('❌ Error al agregar guía de despacho:', err)
    throw err
  }
})