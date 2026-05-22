import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const items = [
  {
    src: "/Screenshots/Batman wallpaper.png",
    text: "Dark Minimalist"
  },
  {
    src: "/Screenshots/catwoman.png",
    text: "Sleek Dark Theme"
  },
  {
    src: "/Screenshots/red wallpaper.png",
    text: "Striking Crimson"
  },
  {
    src: "/Screenshots/Aurora.png",
    text: "Vibrant Aurora"
  },
  {
    src: "/Screenshots/Midnigh.png",
    text: "Deep Midnight"
  }
]

export default function Showcase() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth <= 768
      const scrollAmount = isMobile ? window.innerWidth * 0.85 + 20 : window.innerWidth * 0.35 + 40
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="horizontal-scroll-section">
      <div className="showcase-header-wrapper">
        <h2 className="showcase-headline">Wallpaper & Themes</h2>
      </div>

      <div className="horizontal-scroll-container" ref={scrollRef}>
        <div className="horizontal-scroll-content">
          {items.map((item, i) => (
            <div key={i} className="horizontal-scroll-item-wrapper">
              <h3 className="horizontal-scroll-text">{item.text}</h3>
              <div className="horizontal-scroll-item">
                <div className="horizontal-scroll-overlay" />
                <img src={item.src} alt={`Showcase ${i}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="showcase-nav">
        <button onClick={() => scroll('left')} className="showcase-nav-btn" aria-label="Scroll left">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => scroll('right')} className="showcase-nav-btn" aria-label="Scroll right">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  )
}
