import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/home/HeroSection";
import PlansSection from "./components/home/PlansSection";
import HowItWorks from "./components/home/HowItWorks";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PlansSection />
      <HowItWorks />
      <Footer />
    </div>
  );
}
