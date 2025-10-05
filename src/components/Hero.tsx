import heroImage from "@/assets/hero-family.jpg";
import { ArrowDown } from "lucide-react";

const Hero = () => {

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
          Our Family Legacy
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 font-light animate-fade-in-delay">
          Preserving memories, celebrating heritage, and honoring generations past
        </p>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-8 w-8 text-primary-foreground/70" />
      </div>
    </section>
  );
};

export default Hero;
