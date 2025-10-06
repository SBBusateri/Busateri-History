import heroImage from "@/assets/hero-family.jpg";
import { ArrowDown } from "lucide-react";
import SantAgata from "../assets/SantAgata.jpg";

const Hero = () => {

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("founding-generation");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${SantAgata})` }}
      >
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
          The Busateri Legacy
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 font-light animate-fade-in-delay">
          Preserving history, celebrating heritage, and honoring generations past
        </p>
      </div>

      {/* Scroll Arrow */}
      <button
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hover:scale-110 transition-transform"
        aria-label="Scroll to next section"
      >
        <ArrowDown className="h-8 w-8 text-primary-foreground/70" />
      </button>
    </section>
  );
};

export default Hero;
