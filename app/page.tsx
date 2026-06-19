import HeroSection    from '@/components/sections/HeroSection'
import ProductionGrid from '@/components/sections/ProductionGrid'
import AboutSection   from '@/components/sections/AboutSection'
import EseShowcase    from '@/components/sections/EseShowcase'
import CommunitySection from '@/components/sections/CommunitySection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductionGrid />
      <AboutSection />
      <EseShowcase />
      <CommunitySection />
    </>
  )
}
