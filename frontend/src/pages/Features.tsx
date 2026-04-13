import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FeaturesHero from './features/FeaturesHero'
import FeaturesGrid from './features/FeaturesGrid'
import BeforeAfter from './features/BeforeAfter'
import UseCases from './features/UseCases'
import FeaturesCTA from './features/FeaturesCTA'

export default function Features() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      <FeaturesHero />
      <FeaturesGrid />
      <BeforeAfter />
      <UseCases />
      <FeaturesCTA />
      <Footer />
    </div>
  )
}
