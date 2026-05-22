import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: '96px' }}>
      <Navbar />
      <main className="flex-1 w-full pb-24">
        
        {/* Hero Section */}
        <div className="text-center py-16 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Terms of Service
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Last updated: May 2026
          </p>
        </div>

        {/* Content Container */}
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-12">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>1. Acceptance of Terms</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>
                  By accessing and using the Folio Chrome Extension and web application ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                </p>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>2. Description of Service</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>
                  Folio is a premium new tab dashboard extension designed to enhance your browsing experience. We offer a free trial period, after which a one-time lifetime payment is required to continue using the Service.
                </p>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>3. Payments and Refunds</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>
                  Payments are processed securely via Razorpay. We offer a lifetime access license. Due to the nature of digital goods and the provision of a fully-featured free trial, we do not offer refunds once the lifetime access has been purchased.
                </p>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>4. User Responsibilities</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>You are responsible for:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Maintaining the security of your Google account used to authenticate with Folio.</li>
                  <li>Ensuring that your use of the Service complies with all applicable laws and regulations.</li>
                </ul>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>5. Disclaimer of Warranties</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>
                  The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
                </p>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>6. Limitation of Liability</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>
                  In no event shall Folio be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
              </div>
            </section>
            
            <hr style={{ borderColor: 'var(--border)' }} />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>7. Contact</h2>
              <div style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                <p>
                  For any questions regarding these Terms, please contact us at:{' '}
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
