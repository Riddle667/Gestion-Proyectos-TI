import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/home/Home'
import Layout from './components/layout/sidebar'
import PurchaseOrder from './pages/PurchaseOrder/PurchaseOrder'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/home' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="PurchaseOrder" element={<PurchaseOrder />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
