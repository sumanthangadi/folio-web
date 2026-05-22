import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { AuthService } from '../services/auth'

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.25 } }
}

const stagger = { animate: { transition: { staggerChildren: 0.1 } } }
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [debugStatus, setDebugStatus] = useState('')
  const navigate = useNavigate()

  const params = new URLSearchParams(window.location.search);
  const source = params.get('source');

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      // Pass source so it's preserved in the OAuth success redirect URL
      await AuthService.loginWithGoogleWeb(source)
    } catch (err) {
      console.error(err)
      setError('Failed to log in. Please try again.')
      setLoading(false)
    }
  }

  // Effect to check if we just returned from a successful OAuth login
  useEffect(() => {
    const checkSession = async () => {
      setDebugStatus('Checking session...');
      
      try {
        const { account } = await import('../lib/appwrite');
        
        // Appwrite SDK v13+ OAuth flow: after redirect, URL contains userId + secret
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');
        
        if (userId && secret) {
          setDebugStatus('Finalizing login...');
          try {
            await account.createSession(userId, secret);
            window.history.replaceState({}, document.title, source ? `/login?source=${source}` : '/login');
          } catch (sessionErr) {
            console.warn('[Login] createSession error:', sessionErr.message);
          }
        }
        
        const user = await account.get();
        setDebugStatus(`Logged in as ${user.email} — redirecting...`);
        
        try {
          await AuthService.syncUserToDB(user);
        } catch (syncErr) {
          console.warn('[Login] DB sync failed:', syncErr);
        }
        
        // Create a JWT so the extension can authenticate without cookie access
        const EXTENSION_ID = 'lbondlpbeinmgjebicfanaoibhdibfei';
        try {
          const { account: acct } = await import('../lib/appwrite');
          const jwt = await acct.createJWT();
          // Send JWT + user info to extension
          if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage(EXTENSION_ID, {
              type: 'SET_JWT',
              jwt: jwt.jwt,
              userId: user.$id,
              email: user.email,
              name: user.name,
            }, (response) => {
              console.log('[Login] Extension notified with JWT', response);
            });
          }
        } catch (jwtErr) {
          console.warn('[Login] Could not create JWT for extension:', jwtErr.message);
        }
        
        navigate('/login-success');
        
      } catch (e) {
        const errMsg = e?.message || e?.toString() || 'Unknown error';
        const errCode = e?.code || '';
        setDebugStatus(`Session error: [${errCode}] ${errMsg}`);
        console.error('[Login] Full error:', e);
      }
    };
    
    checkSession();
  }, [navigate, source]);

  return (
    <motion.div className="login-page" {...pageTransition}>
      {debugStatus && (
        <div style={{ 
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a2e', border: '1px solid #333', borderRadius: 12,
          padding: '8px 20px', fontSize: '0.8rem', color: '#a3a3a3', zIndex: 999
        }}>
          {debugStatus}
        </div>
      )}
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="login-layout">
        <motion.div className="login-branding" variants={stagger} initial="initial" animate="animate">
          <motion.div className="login-brand-logo" variants={fadeUp}>Folio</motion.div>
          <motion.h1 className="login-brand-headline" variants={fadeUp}>
            Your new tab,<br />reimagined.
          </motion.h1>
          <motion.p className="login-brand-sub" variants={fadeUp}>
            Sign in to sync your bookmarks, themes and wallpapers across every device.
          </motion.p>

          <motion.div className="login-brand-features" variants={stagger}>
            <motion.div className="login-brand-feature" variants={fadeUp}>
              <div className="login-feature-dot" />
              <span>Sync across devices</span>
            </motion.div>
            <motion.div className="login-brand-feature" variants={fadeUp}>
              <div className="login-feature-dot" />
              <span>Cloud backup</span>
            </motion.div>
            <motion.div className="login-brand-feature" variants={fadeUp}>
              <div className="login-feature-dot" />
              <span>Personalized experience</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="login-card"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="login-card-heading">Welcome back</h2>
          <p className="login-card-sub">Sign in to continue to Folio</p>
          
          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}

          <button 
            className="btn-google" 
            onClick={handleLogin}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          <p className="login-terms" style={{ marginTop: '24px' }}>
            By signing in you agree to our <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
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
