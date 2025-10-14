import { FamilyMember } from "@/components/FamilyTreeTypes.tsx";
import {
  ZoomIn,
  ZoomOut,
  X,
  Users,
  Heart,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface FullFamilyTreeProps {
  showFullTree: boolean;
  onClose: () => void;
  familyTree: FamilyMember[];
}

const FullFamilyTree = ({ showFullTree, onClose, familyTree }: FullFamilyTreeProps) => {
  const [zoom, setZoom] = useState(0.9);

  // Generation colors using theme with subtle variations
  const generationColors = [
    "bg-primary text-primary-foreground", // Generation 1 (Founders)
    "bg-secondary text-secondary-foreground", // Generation 2
    "bg-accent text-accent-foreground", // Generation 3
    "bg-primary/70 text-primary-foreground", // Generation 4
    "bg-secondary/70 text-secondary-foreground", // Generation 5
    "bg-accent/70 text-accent-foreground", // Generation 6
    "bg-primary/50 text-primary-foreground", // Generation 7
  ];

  // Recursive full tree renderer with generation tracking
  const renderFullTree = (member: FamilyMember, generation: number = 0) => {
    const colorClass = generationColors[generation % generationColors.length];
    
    return (
      <div key={member.id} className="flex flex-col items-center my-2 md:my-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div className={`${colorClass} px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-center shadow-md`}>
            <Users className="h-3 w-3 md:h-4 md:w-4 mx-auto mb-0.5 md:mb-1" />
            <p className="font-bold text-[10px] md:text-xs leading-tight">{member.name}</p>
            <p className="text-[8px] md:text-[10px] opacity-90 leading-tight">{member.generation}</p>
          </div>
          {member.spouse && (
            <>
              <Heart className="h-3 w-3 md:h-4 md:w-4 text-accent flex-shrink-0" />
              <div className={`${colorClass} px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-center shadow-md`}>
                <Users className="h-3 w-3 md:h-4 md:w-4 mx-auto mb-0.5 md:mb-1" />
                <p className="font-bold text-[10px] md:text-xs leading-tight">{member.spouse.name}</p>
                <p className="text-[8px] md:text-[10px] opacity-90 leading-tight">{member.spouse.generation}</p>
              </div>
            </>
          )}
        </div>

        {member.children && member.children.length > 0 && (
          <>
            <div className="w-0.5 h-6 md:h-10 bg-border" />
            <div className="flex gap-2 md:gap-4 flex-wrap justify-center max-w-full">
              {member.children.map((child) => renderFullTree(child, generation + 1))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (!showFullTree) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col z-50">
      <div className="flex justify-between items-center p-3 md:p-4 bg-background border-b border-border">
        <h3 className="text-base md:text-lg font-semibold text-primary">
          Full Family Tree View
        </h3>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 md:h-10 md:w-10"
            onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
          >
            <ZoomIn className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 md:h-10 md:w-10"
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.4))}
          >
            <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-10 md:w-10"
            onClick={onClose}
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div
          className="flex justify-center items-start transition-transform duration-200"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center top",
          }}
        >
          <div className="flex flex-col items-center">
            {familyTree.map((founder) => renderFullTree(founder, 0))}
          </div>
        </div>
      </div>

      {/* Generation Legend */}
      <div className="p-3 md:p-4 bg-background border-t border-border">
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center text-xs md:text-sm">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="bg-primary w-4 h-4 md:w-5 md:h-5 rounded" />
            <span className="text-foreground">Founders</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="bg-secondary w-4 h-4 md:w-5 md:h-5 rounded" />
            <span className="text-foreground">Gen 1</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="bg-accent w-4 h-4 md:w-5 md:h-5 rounded" />
            <span className="text-foreground">Gen 2</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="bg-primary/80 w-4 h-4 md:w-5 md:h-5 rounded" />
            <span className="text-foreground">Gen 3+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullFamilyTree;