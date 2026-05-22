import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const pricingFeatures = [
  'Lifetime access',
  'All 5 themes',
  'Wallpaper customization',
  'Cross-device sync',
  'Free updates forever'
]

export default function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="pricing-header container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Simple pricing. No surprises.
        </motion.h2>
      </div>

      <motion.div
        className="pricing-card"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pricing-badge">Launch Offer</div>

        <div className="pricing-price">
          <span className="pricing-original">₹199</span>
          <span className="pricing-current">₹119</span>
        </div>

        <p className="pricing-limited">First 100 users only</p>

        <ul className="pricing-features">
          {pricingFeatures.map((feat) => (
            <li key={feat}>
              <span className="pricing-check">✓</span>
              {feat}
            </li>
          ))}
        </ul>

        <Link to="/pay">
          <button className="pricing-cta">Get Folio — ₹119</button>
        </Link>

        <p className="pricing-signin">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </section>
  )
}
