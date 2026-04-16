import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HomeLeft from './home/HomeLeft'
import HomeRight from './home/HomeRight'

export default function Home() {
  return (
    <div className="flex flex-col bg-near-black min-h-screen lg:h-screen lg:overflow-hidden">
      {/* Navbar blends into left-column cream background */}
      <Navbar noBorder />

      {/* Two-column split */}
      <div className="px-3 flex-1 flex flex-col lg:flex-row lg:min-h-0 lg:overflow-hidden">
        <HomeLeft />
        <HomeRight />
      </div>

      {/* Full footer in right-column dark style */}
      <Footer noBorder />
    </div>
  )
}

