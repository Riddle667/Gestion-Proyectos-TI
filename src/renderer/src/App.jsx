import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/home/Home'
import Layout from './components/layout/sidebar'
import PurchaseOrder from './pages/PurchaseOrder/PurchaseOrder'
import Invoices from './pages/Invoices/Invoices'
import DispatchGuide from './pages/DispatchGuide/DispatchGuide'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/home/purchaseOrder" element={<PurchaseOrder />} />
          <Route path="/home/invoices" element={<Invoices />} />
          <Route path="/home/dispatchGuide" element={<DispatchGuide />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
