import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">Folio</Link>

        <div className="navbar-links">
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features') }}>
            Features
          </a>
          <button className="btn-chrome-nav">Add to Chrome</button>
        </div>
      </div>
    </motion.nav>
  )
}
