import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: '96px' }}>
      <Navbar />
      <main className="flex-1 w-full pb-24">
        
        {/* Hero Section */}
        <div className="text-center py-16 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Privacy Policy
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Last updated: May 2026
          </p>
        </div>

        {/* Content Container */}
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-12">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>1. What We Collect</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>We believe in keeping your data collection to an absolute minimum. We only collect:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Your email address (via Google OAuth)</li>
                  <li>Trial start date</li>
                  <li>Payment status</li>
                </ul>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>2. How We Use It</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>The information we collect is strictly used for:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Authenticating your account securely across devices</li>
                  <li>Verifying your payment and trial status to grant access to premium features</li>
                </ul>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>3. What We Don't Collect</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>Your privacy is our priority. We absolutely do NOT:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Track your browsing history</li>
                  <li>Read, store, or monitor your bookmarks</li>
                  <li>Sell your personal data to third parties</li>
                </ul>
                <p className="mt-4">
                  All your bookmarks and custom settings are stored locally in your browser using <code>chrome.storage.sync</code>. They sync securely via your Google account, and we have no access to them.
                </p>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>4. Third-Party Services</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>We use the following trusted third-party services to run Folio:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li><strong>Google OAuth:</strong> For secure sign-in without passwords.</li>
                  <li><strong>Razorpay:</strong> To process payments securely. We do not store your credit card details.</li>
                  <li><strong>Appwrite:</strong> Our backend database for storing your account and payment status.</li>
                </ul>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>5. Data Deletion</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>
                  If you wish to delete your account and all associated data (email and payment records), please email us from the account you wish to delete. We will process your request promptly.
                </p>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>6. Contact Us</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>
                  If you have any questions or concerns about this Privacy Policy, please contact us at:{' '}
                  <a href="mailto:sumanthangadi7@gmail.com" style={{ color: 'var(--accent)' }} className="hover:underline transition-colors">
                    sumanthangadi7@gmail.com
                  </a>
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
