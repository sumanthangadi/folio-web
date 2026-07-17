import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Pay from './pages/Pay'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Admin from './pages/Admin'
import Blobs from './components/Blobs'

function App() {
  const location = useLocation()

  return (
    <>
      <Blobs />
      <div className="grain-overlay" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin-x3010" element={<Admin />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
