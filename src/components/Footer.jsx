import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer relative z-10">
      <div className="footer-inner">
        <div className="footer-logo">Folio</div>

        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <a href="mailto:sumanthangadi7@gmail.com">Contact</a>
        </div>

        <div className="footer-made">
          Made with <span>♥</span> in Bengaluru
        </div>
      </div>
    </footer>
  )
}
