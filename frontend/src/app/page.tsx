import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import ServiceBannerGrid from "@/components/ServiceBannerGrid";
import ProductListingSection from "@/components/ProductListingSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen">
      <Header />
      <HeroSlider />
      <ServiceBannerGrid />
      <ProductListingSection />
      <Footer />
    </main>
  );
}
