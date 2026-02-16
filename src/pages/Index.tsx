import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProfiles from "@/components/home/FeaturedProfiles";
import MapSection from "@/components/home/MapSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProfiles />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;