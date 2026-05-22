import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Shield, Zap, Lock } from 'lucide-react'
import { PricingService } from '../services/pricing'
import { AuthService } from '../services/auth'
import { databases, functions, APPWRITE_DATABASE_ID, APPWRITE_USERS_COLLECTION_ID } from '../lib/appwrite'

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.25 } }
}

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

const features = [
  'All 5 premium themes',
  'Unlimited bookmarks & sections',
  'Custom wallpapers',
  'Cross-device sync',
  'Priority support',
  'All future updates — free forever'
]

export default function Pay() {
  const [pricing, setPricing] = useState({ isLaunchPrice: true, price: 119 })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    // Load user and dynamic pricing
    async function loadData() {
      try {
        const currentUser = await AuthService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          const status = await PricingService.getUserStatus(currentUser.$id)
          if (status) setPricing(status)
        } else {
          // If not logged in, we can only guess the general pricing based on a dummy check
          // To be perfectly accurate, we need an Appwrite Function endpoint, but for now
          // we assume the landing page visitors see the launch price if it's active globally.
          // For simplicity, we just use the default state (isLaunchPrice: true).
        }
      } catch (e) {
        console.error('Failed to load pricing data', e)
      }
    }
    loadData()

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!user) {
      alert('Please sign in first.')
      return
    }

    setError(null)
    setLoading(true)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: pricing.price * 100,
      currency: 'INR',
      name: 'Folio Lifetime License',
      description: pricing.isLaunchPrice ? 'Launch Offer (First 100)' : 'Lifetime Access',
      prefill: { email: user.email, name: user.name, contact: '9999999999' },
      theme: { color: '#dc2626' },
      modal: {
        backdropclose: false,
        escape: false,
        handleback: true,
        confirm_close: false,
        ondismiss: function () {
          setError('Payment was cancelled.')
          setLoading(false)
        },
      },
      retry: { enabled: false },
      notes: { app: 'folio' },
      handler: async function (response) {
        setLoading(true)
        try {
          // Call Appwrite function to verify and capture payment
          const execution = await functions.createExecution(
            'verify-payment',
            JSON.stringify({
              userId: user.$id,
              paymentId: response.razorpay_payment_id,
            })
          )

          const result = JSON.parse(execution.responseBody)

          if (!result.success) {
            throw new Error(result.error || 'Verification failed')
          }

          // Notify the extension background worker to clear trial cache
          const EXTENSION_ID = 'lbondlpbeinmgjebicfanaoibhdibfei'
          if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage(EXTENSION_ID, { type: 'PAYMENT_SUCCESS' })
          }

          // Redirect to success page
          window.location.href = '/login-success'
        } catch (err) {
          console.error(err)
          setError('Payment verification failed. Please contact support.')
          setLoading(false)
        }
      }
    }

    if (window.Razorpay) {
      try {
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (resp) {
          console.error('Razorpay payment.failed:', resp.error)
          setError(resp.error?.description || 'Payment failed. Please try again.')
          setLoading(false)
        })
        rzp.open()
      } catch (err) {
        console.error('Razorpay open error:', err)
        setError('Could not open payment gateway. Please try again.')
        setLoading(false)
      }
    } else {
      setError('Payment gateway failed to load. Please refresh the page.')
      setLoading(false)
    }
  }

  return (
    <motion.div className="pay-page" {...pageTransition}>
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="pay-layout">
        <motion.div className="pay-info" variants={stagger} initial="initial" animate="animate">
          <motion.div className="pay-info-logo" variants={fadeUp}>Folio</motion.div>
          <motion.h1 className="pay-info-headline" variants={fadeUp}>
            One price.<br />Yours forever.
          </motion.h1>
          <motion.p className="pay-info-sub" variants={fadeUp}>
            No subscriptions. No hidden fees. Pay once and own Folio for life — including every future update.
          </motion.p>

          <motion.ul className="pay-features-list" variants={stagger}>
            {features.map((f, i) => (
              <motion.li key={i} variants={fadeUp}>
                <span className="pay-feature-check"><Check size={16} /></span>
                {f}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div className="pay-trust" variants={fadeUp}>
            <div className="pay-trust-item">
              <Shield size={16} />
              <span>Secure payment via Razorpay</span>
            </div>
            <div className="pay-trust-item">
              <Lock size={16} />
              <span>SSL encrypted</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="pay-card"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {pricing.isLaunchPrice ? (
            <div className="pay-card-badge">🚀 Launch Offer · First 100 Users</div>
          ) : (
            <div className="pay-card-badge" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>Lifetime Access</div>
          )}

          <div className="pay-card-price-block">
            {pricing.isLaunchPrice && <span className="pay-card-original">₹299</span>}
            <span className="pay-card-currency">₹</span>
            <span className="pay-card-amount">{pricing.price}</span>
          </div>
          <p className="pay-card-price-note">One-time payment · It's completely yours</p>

          {user && (
            <div className="mb-6 text-left p-3 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Logged in as: <span style={{ color: 'var(--text-primary)' }}>{user.email}</span>
            </div>
          )}

          <div className="pay-card-divider" />

          <div className="pay-card-summary">
            <div className="pay-card-summary-row">
              <span>Folio — Lifetime License</span>
              {pricing.isLaunchPrice ? <span className="pay-card-row-strike">₹299</span> : <span>₹299</span>}
            </div>
            {pricing.isLaunchPrice && (
              <div className="pay-card-summary-row">
                <span>Launch discount</span>
                <span className="pay-card-row-green">−₹180</span>
              </div>
            )}
            <div className="pay-card-summary-row pay-card-summary-total">
              <span>Total</span>
              <span>₹{pricing.price}</span>
            </div>
          </div>
          
          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}

          <button
            className="pay-card-cta"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <>
                <Zap size={18} />
                Pay ₹{pricing.price} — Get Lifetime Access
              </>
            )}
          </button>

          <p className="pay-card-footer">
            Instant activation · No recurring charges
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
