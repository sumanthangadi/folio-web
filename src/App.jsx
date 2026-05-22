import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Pay from './pages/Pay'
import LoginSuccess from './pages/LoginSuccess'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
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
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
