import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Header from './components/Header.jsx'
// import Login from './components/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProductResearch from './pages/ProductResearch.jsx'
import AdvancedResearch from './pages/AdvancedResearch.jsx'
import Analytics from './pages/Analytics.jsx'
import Orders from './pages/Orders.jsx'
import Automation from './pages/Automation.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Header user={{ email: 'guest' }} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/research" element={<ProductResearch />} />
            <Route path="/advanced-research" element={<AdvancedResearch />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/automation" element={<Automation />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App