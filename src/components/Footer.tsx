import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-4 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-5 w-5 fill-current" />
          <p className="text-lg font-semibold">
          </p>
        </div>
        <p className="text-primary-foreground/80 mb-2">
          Preserving our legacy for generations to come
        </p>
        <p className="text-sm text-primary-foreground/60">
          © {currentYear} Our Family. All memories cherished, all stories treasured.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
