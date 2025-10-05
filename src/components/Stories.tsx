import { BookOpen, Heart, Home, Star } from "lucide-react";

const stories = [
  {
    icon: Home,
    title: "The Old Homestead",
    preview: "Stories of the family home where generations gathered, creating memories that still warm our hearts today.",
  },
  {
    icon: Heart,
    title: "Love Stories",
    preview: "Tales of romance that brought families together, proving that love truly knows no bounds across time and distance.",
  },
  {
    icon: Star,
    title: "Achievements",
    preview: "Celebrating the accomplishments, both big and small, that made our family proud through the decades.",
  },
  {
    icon: BookOpen,
    title: "Traditions",
    preview: "The customs and rituals passed down through generations that keep our family bonds strong and our heritage alive.",
  },
];

const Stories = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
          Family Stories
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Tales passed down through generations, keeping our heritage alive
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story, index) => {
            const Icon = story.icon;
            return (
              <div 
                key={index}
                className="bg-background rounded-lg p-8 vintage-shadow transition-smooth hover:shadow-xl group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground mb-6 group-hover:scale-110 transition-smooth">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {story.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {story.preview}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stories;
