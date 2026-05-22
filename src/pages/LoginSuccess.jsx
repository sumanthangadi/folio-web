import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Chrome, ArrowRight, Sparkles } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}
const stagger = { animate: { transition: { staggerChildren: 0.12 } } }

export default function LoginSuccess() {
  const [tick, setTick] = useState(false)

  useEffect(() => {
    // Trigger the checkmark animation after mount
    setTimeout(() => setTick(true), 200)
  }, [])

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>
        <motion.div variants={stagger} initial="initial" animate="animate">

          {/* Animated checkmark */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={tick ? { scale: 1, rotate: 0 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'rgba(220,38,38,0.12)',
                border: '2px solid rgba(220,38,38,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={44} color="#dc2626" />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#f5f5f5',
              marginBottom: 12,
              lineHeight: 1.1
            }}
          >
            You're all set!
          </motion.h1>

          {/* Sub text */}
          <motion.p
            variants={fadeUp}
            style={{ color: '#a3a3a3', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 48 }}
          >
            Your Google account is connected to Folio. Head back to the extension to start organising your new tab.
          </motion.p>

          {/* CTA card */}
          <motion.div
            variants={fadeUp}
            style={{
              background: 'rgba(20,20,20,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding: '32px 36px',
              marginBottom: 24,
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Chrome size={22} color="#dc2626" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: '#f5f5f5', fontWeight: 600, fontSize: '0.95rem', marginBottom: 2 }}>
                  Open your Chrome extension
                </p>
                <p style={{ color: '#737373', fontSize: '0.82rem' }}>
                  Click the Folio icon in your browser toolbar
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <Sparkles size={14} color="#dc2626" />
              <p style={{ color: '#a3a3a3', fontSize: '0.82rem' }}>
                Your bookmarks, themes and settings will sync automatically
              </p>
            </div>
          </motion.div>

          {/* Secondary hint */}
          <motion.p variants={fadeUp} style={{ color: '#525252', fontSize: '0.8rem' }}>
            You can close this tab — your session is saved. <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </motion.p>

        </motion.div>
      </div>
    </motion.div>
  )
}
