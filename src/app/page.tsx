import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import FeaturesSection from "@/components/home/features-section";
import HeroSection from "@/components/home/hero-section";
import RolesSection from "@/components/home/roles-section";
import WorkflowSection from "@/components/home/workflow-section";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <RolesSection />
      </main>
      <Footer />
    </div>
  );
}
