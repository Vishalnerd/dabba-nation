import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/home/HeroSection";
import PlansSection from "./components/home/PlansSection";
import WhyChooseUs from "./components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <PlansSection />
      <WhyChooseUs />
      <Footer />
    </>
  );
}
