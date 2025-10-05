import { Camera } from "lucide-react";

const PhotoGallery = () => {
  const galleryItems = [
    { title: "Early Days", era: "1920s" },
    { title: "Family Gatherings", era: "1950s" },
    { title: "Celebrations", era: "1970s" },
    { title: "New Generations", era: "1990s" },
    { title: "Modern Moments", era: "2000s" },
    { title: "Today", era: "2020s" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
          Cherished Memories
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Moments captured through the lens of time
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div 
              key={index}
              className="group relative aspect-square bg-card rounded-lg overflow-hidden vintage-shadow transition-smooth hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-smooth" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Camera className="h-12 w-12 text-accent mb-4 group-hover:scale-110 transition-smooth" />
                <h3 className="text-2xl font-bold text-card-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.era}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground italic">
            Each photograph holds a thousand memories, a moment frozen in time
          </p>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
