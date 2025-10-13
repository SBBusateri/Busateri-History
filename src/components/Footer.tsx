import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-4 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-lg font-semibold">
          </p>
        </div>
        <p className="text-primary-foreground/80 mb-2">
        </p>
        <p className="text-sm text-primary-foreground/60">
          © {currentYear} Busateri Legacy and History
        </p>
      </div>
    </footer>
  );
};

export default Footer;
