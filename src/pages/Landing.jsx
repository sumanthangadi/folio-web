import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Showcase from '../components/Showcase'
import Features from '../components/Features'

import Footer from '../components/Footer'

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }
}

export default function Landing() {
  return (
    <motion.div {...pageTransition}>
      <Navbar />
      <Hero />
      <Showcase />
      <Features />

      <Footer />
    </motion.div>
  )
}
