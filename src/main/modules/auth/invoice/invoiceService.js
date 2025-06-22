import { getDatabase } from '../../database/localDb.js'

const db = getDatabase()

export function getAllInvoices() {

    return db.prepare('SELECT * FROM Invoice').all()

}

export function createInvoice(invoice_number, date, company_name, net_amount, tax_iva, purchase_order, dispatch_guide){

    return db.prepare('INSERT INTO Invoice (invoice_number, date, company_name, net_amount, tax_iva, purchase_order, dispatch_guide) VALUES (?, ?, ?, ?, ?, ?)')
    .run(invoice_number, date, company_name, net_amount, tax_iva, purchase_order, dispatch_guide)

}