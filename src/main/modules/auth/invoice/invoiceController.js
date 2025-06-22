import { ipcMain } from 'electron'
import * as invoices from '../invoice/invoiceService'

export function registerInvoice() {

    ipcMain.handle('invoices:getAll', () => invoices.getAllInvoices() )

    ipcMain.handle('invoices:create', (invoice_number, date, company_name, net_amount, tax_iva, purchase_order, dispatch_guide) => 
    invoices.createInvoice(invoice_number, date, company_name, net_amount, tax_iva, purchase_order, dispatch_guide)
    )

}