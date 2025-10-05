import { Calendar } from "lucide-react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const events: TimelineEvent[] = [
  {
    year: "1920s",
    title: "The Beginning",
    description: "Our family story begins with the immigration of our ancestors, seeking new opportunities and a better life."
  },
  {
    year: "1950s",
    title: "Building Foundations",
    description: "The family established roots in their new home, building businesses and creating lasting community connections."
  },
  {
    year: "1980s",
    title: "Growing Together",
    description: "Multiple generations came together, sharing wisdom and creating traditions that continue to this day."
  },
  {
    year: "2000s",
    title: "Modern Era",
    description: "The family expands globally while maintaining strong bonds and preserving our heritage for future generations."
  },
];

const Timeline = () => {
  return (
    <section id="timeline" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
          Our Journey Through Time
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Milestones and memories that shaped our family's story
        </p>
        
        <div className="space-y-12">
          {events.map((event, index) => (
            <div 
              key={index}
              className="flex flex-col md:flex-row gap-8 items-start group"
            >
              <div className="flex-shrink-0 md:w-32">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent text-accent-foreground vintage-shadow transition-smooth group-hover:scale-110">
                  <Calendar className="h-8 w-8" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-card rounded-lg p-6 vintage-shadow transition-smooth hover:shadow-xl">
                  <span className="text-accent font-bold text-2xl">{event.year}</span>
                  <h3 className="text-2xl font-bold text-card-foreground mt-2 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
