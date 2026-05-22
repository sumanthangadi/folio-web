import { motion } from 'framer-motion'
import { FolderOpen, Palette, Infinity } from 'lucide-react'

const features = [
  {
    icon: FolderOpen,
    title: 'Organized',
    desc: 'Sections like your phone. Everything where you expect it.'
  },
  {
    icon: Palette,
    title: 'Beautiful',
    desc: '5 themes. Wallpapers. Yours to customize.'
  },
  {
    icon: Infinity,
    title: 'Forever Yours',
    desc: 'One time payment. No subscriptions. Ever.'
  }
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1]
    }
  })
}

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="features-header container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Everything you need. Nothing you don't.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Built for people who value clarity and beauty.
        </motion.p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <motion.div
            className="feature-card"
            key={f.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <div className="feature-icon">
              <f.icon size={22} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
