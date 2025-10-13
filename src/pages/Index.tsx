import Hero from "@/components/Hero";
import FoundingGeneration from "@/components/FoundingGeneration";
import FamilyTree from "@/components/FamilyTreeHome.tsx";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FoundingGeneration />
      <FamilyTree />
      <Footer />
    </div>
  );
};

export default Index;
