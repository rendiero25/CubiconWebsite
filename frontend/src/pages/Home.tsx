import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from './home/HeroSection'
import HowItWorks from './home/HowItWorks'
import ExplorePreview from './home/ExplorePreview'
import PricingSection from './home/PricingSection'
import FaqSection from './home/FaqSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <ExplorePreview />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}
