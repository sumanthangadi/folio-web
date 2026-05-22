import { motion } from 'framer-motion'

const themes = [
  {
    name: 'Dark Glassmorphism',
    className: 'theme-card--dark',
    swatches: ['#0f0f0f', '#1a1a2e', '#dc2626', '#ffffff']
  },
  {
    name: 'Light Minimal',
    className: 'theme-card--light',
    swatches: ['#ffffff', '#f5f5f5', '#1a1a1a', '#dc2626']
  },
  {
    name: 'Neumorphism',
    className: 'theme-card--neumorphism',
    swatches: ['#e0e0e0', '#c8c8c8', '#333333', '#6366f1']
  },
  {
    name: 'Aurora',
    className: 'theme-card--aurora',
    swatches: ['#0f2027', '#203a43', '#2c5364', '#22d3ee']
  },
  {
    name: 'Midnight',
    className: 'theme-card--midnight',
    swatches: ['#0c0c1d', '#1a1a3e', '#8b5cf6', '#f0abfc']
  },
  {
    name: 'Sakura',
    className: 'theme-card--sakura',
    swatches: ['#0d0d0d', '#1a0a12', '#ff1464', '#ffffff']
  },
  {
    name: 'Lavender',
    className: 'theme-card--lavender',
    swatches: ['#1a1625', '#221d30', '#9d7fe3', '#e8e0f5']
  }
]

export default function ThemesShowcase() {
  return (
    <section className="themes">
      <div className="themes-header container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Seven themes. One for every mood.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Switch your vibe in one click.
        </motion.p>
      </div>

      <motion.div
        className="themes-scroll"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {themes.map((theme) => (
          <div className={`theme-card ${theme.className}`} key={theme.name}>
            <div className="theme-card-name">{theme.name}</div>
            <div className="theme-swatches">
              {theme.swatches.map((color, i) => (
                <div
                  className="theme-swatch"
                  key={i}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
