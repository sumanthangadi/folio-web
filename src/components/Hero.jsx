import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 }
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
}



export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <motion.div
          className="hero-content"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-tag" variants={fadeUp}>
            New Tab. Reimagined.
          </motion.div>

          <motion.h1 className="hero-headline" variants={fadeUp}>
            <span>The only bookmark</span>
            <span>manager you will</span>
            <span>ever need.</span>
          </motion.h1>

          <motion.p className="hero-subtext" variants={fadeUp}>
            Folio replaces your new tab with a beautiful, organized bookmark
            dashboard. One time. Yours forever.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeUp}>
            <button className="btn-primary">
              <ChromeIcon />
              Add to Chrome — Free
            </button>
            <Link to="/login" className="btn-ghost">
              Sign in
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function ChromeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" y1="8" x2="12" y2="8" />
      <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
      <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
  )
}
