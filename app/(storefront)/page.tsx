import Hero from '@/components/storefront/Hero'
import CategoriesSection from '@/components/storefront/CategoriesSection'
import FeaturedProductsSection from '@/components/storefront/FeaturedProductsSection'
import PromoBanner from '@/components/storefront/PromoBanner'
import BestSellers from '@/components/storefront/BestSellers'
import FeaturedVendors from '@/components/storefront/FeaturedVendors'
import TrustBadges from '@/components/storefront/TrustBadges'

export default function HomePage() {
  return (
    <>
      <Hero/>
      <CategoriesSection/>
      <FeaturedProductsSection/>
      <PromoBanner/>
      <BestSellers/>
      <FeaturedVendors/>
      <TrustBadges/>
    </>
  )
}