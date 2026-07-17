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
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false)

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

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams(window.location.search);
      const extId = params.get('extId');
      await AuthService.loginWithGoogleWeb('pay', extId)
    } catch (err) {
      console.error(err)
      setError('Failed to log in. Please try again.')
      setLoading(false)
    }
  }

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

          // Show payment success modal
          setShowPaymentSuccessModal(true)
          setLoading(false)
          setTimeout(() => {
            try {
              window.close()
            } catch (err) {
              console.warn('Failed to close window:', err)
            }
          }, 4500)
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

      {user ? (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Logged in as <strong style={{ color: 'var(--text-primary)' }}>{user.email}</strong>
          </span>
          <button 
            onClick={async () => {
              await AuthService.logout();
              setUser(null);
            }}
            style={{
              fontSize: '0.8rem',
              color: '#dc2626',
              border: '1px solid rgba(220,38,38,0.2)',
              padding: '4px 12px',
              borderRadius: '100px',
              background: 'rgba(220,38,38,0.05)',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 50,
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)',
            padding: '6px 16px',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.02)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <GoogleIcon />
          Sign In
        </button>
      )}

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

          {user ? (
            <div className="mb-6 text-left p-3 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Logged in as: <span style={{ color: 'var(--text-primary)' }}>{user.email}</span>
            </div>
          ) : (
            <div className="mb-6 text-left p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Please sign in with Google below to attach the lifetime license to your account.
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

          {user ? (
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
          ) : (
            <button
              className="pay-card-cta btn-google"
              onClick={handleLogin}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: '#ffffff',
                color: '#111111',
                border: '1px solid #e5e7eb'
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <>
                  <GoogleIcon />
                  Sign in with Google to Pay
                </>
              )}
            </button>
          )}

          <p className="pay-card-footer">
            Instant activation · No recurring charges
          </p>
        </motion.div>
      </div>

      {showPaymentSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: '#0d0d0d',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '440px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(34, 197, 94, 0.1)'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#22c55e'
            }}>
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Payment Successful!</h3>
            <p style={{ fontSize: '0.95rem', color: '#a3a3a3', lineHeight: '1.6', marginBottom: '24px' }}>
              Your lifetime premium license has been activated. Head back to the extension to start enjoying your premium features.
            </p>
            <button 
              onClick={() => window.close()}
              style={{
                background: '#22c55e',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '100px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              Close Tab
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
