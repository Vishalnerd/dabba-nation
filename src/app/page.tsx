import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/home/HeroSection";
import PlansSection from "./components/home/PlansSection";
import HowItWorks from "./components/home/HowItWorks";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dabba Nation - Home",
  description:
    "Welcome to Dabba Nation, your go-to destination for delicious and affordable meal boxes.",
};
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
