import { FamilyMember } from "@/components/FamilyTreeTypes.tsx";
import { ZoomIn, ZoomOut, X, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";

interface FullFamilyTreeProps {
  showFullTree: boolean;
  onClose: () => void;
  familyTree: FamilyMember[];
}

const FullFamilyTree = ({ showFullTree, onClose, familyTree }: FullFamilyTreeProps) => {
  const [zoom, setZoom] = useState(0.34);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Center the scroll position when the tree opens
  useEffect(() => {
    if (showFullTree && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Center horizontally
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      // Optionally adjust vertical position (keeping some top padding visible)
      container.scrollTop = 0;
    }
  }, [showFullTree]);

  const generationColors = [
    "bg-primary text-primary-foreground", // Generation 1 (Founders)
    "bg-secondary text-secondary-foreground", // Generation 2
    "bg-accent text-accent-foreground", // Generation 3
    "bg-primary/70 text-primary-foreground", // Generation 4
    "bg-secondary/70 text-secondary-foreground", // Generation 5
    "bg-accent/70 text-accent-foreground", // Generation 6
    "bg-primary/50 text-primary-foreground", // Generation 7
  ];

  // Recursive full tree renderer
  const renderFullTree = (member: FamilyMember, generation: number = 0) => {
    const colorClass = generationColors[generation % generationColors.length];
    const hasChildren = member.children && member.children.length > 0;
    const isFounder = generation === 0;

    return (
      <div key={member.id} className="flex flex-col items-center shrink-0">
        {/* Member box - special styling for founders */}
        {isFounder ? (
          <div className={`${colorClass} px-6 py-3 md:px-8 md:py-4 rounded-lg text-center shadow-md min-w-[200px] md:min-w-[280px]`}>
            <div className="flex items-center justify-center gap-6 md:gap-8">
              {/* Member info */}
              <div className="text-left">
                <p className="font-bold text-sm md:text-base leading-tight">{member.name}</p>
                <p className="opacity-90 text-xs md:text-sm leading-tight">{member.generation}</p>
              </div>
              
              {/* Separator heart */}
              {member.spouse && (
                <div className="text-xl md:text-2xl opacity-60">♥</div>
              )}
              
              {/* Spouse info */}
              {member.spouse && (
                <div className="text-left">
                  <p className="font-bold text-sm md:text-base leading-tight">{member.spouse.name}</p>
                  <p className="opacity-90 text-xs md:text-sm leading-tight">{member.spouse.generation}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`${colorClass} px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-center shadow-sm min-w-[80px] md:min-w-[100px]`}>
            <div className={member.spouse ? "border-b border-current/20 pb-0.5 mb-0.5" : ""}>
              <p className="font-bold text-[9px] md:text-[10px] leading-tight">{member.name}</p>
              <p className="opacity-80 text-[7px] md:text-[8px] leading-tight">{member.generation}</p>
            </div>
            {member.spouse && (
              <div className="pt-0.5">
                <p className="font-bold text-[9px] md:text-[10px] leading-tight">{member.spouse.name}</p>
                <p className="opacity-80 text-[7px] md:text-[8px] leading-tight">{member.spouse.generation}</p>
              </div>
            )}
          </div>
        )}

        {hasChildren && (
          <>
            {/* Vertical connector line */}
            <div className={`w-0.5 bg-border ${generation === 0 ? "h-10 md:h-12" : generation === 1 ? "h-6 md:h-8" : "h-3 md:h-4"}`} />

            {/* Children container with proper horizontal line */}
            <div className="relative flex flex-col items-center">
              {/* Horizontal connector that stops at first and last child centers */}
              {member.children!.length > 1 && (
                <div className="absolute top-0 flex items-center" style={{ 
                  left: '50%', 
                  right: '50%',
                  transform: 'translateX(-50%)',
                  width: `calc(100% - ${isFounder ? '200px' : '80px'})`
                }}>
                  <div className="h-0.5 bg-border w-full" />
                </div>
              )}

              {/* Children layout */}
              <div className={`flex ${generation === 0 ? "flex-row gap-1 md:gap-2" : "flex-wrap justify-center gap-1 md:gap-2"}`}>
                {member.children!.map((child, idx) => (
                  <div key={child.id} className="flex flex-col items-center shrink-0">
                    {/* Vertical line connecting to horizontal line */}
                    {member.children!.length > 1 && (
                      <div className={`w-0.5 bg-border ${generation === 0 || generation === 1 ? "h-6 md:h-8" : "h-3 md:h-4"}`} />
                    )}
                    {renderFullTree(child, generation + 1)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  if (!showFullTree) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col z-50">
      {/* Header */}
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
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}
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

      {/* Tree container with extra padding for zoom scrolling */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto p-4 md:p-6">
        <div className="min-w-[200vw] min-h-[200vh] flex items-start justify-center pt-12">
          <div
            className="transition-transform duration-200"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            {/* Founders with spacing */}
            <div className="flex flex-row gap-8 md:gap-12 justify-center items-start">
              {familyTree.map((founder) => renderFullTree(founder, 0))}
            </div>
          </div>
        </div>
      </div>

      {/* Generation legend */}
      <div className="p-3 md:p-4 bg-background border-t border-border">
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center text-xs md:text-sm">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="bg-primary w-4 h-4 md:w-5 md:h-5 rounded" />
            <span className="text-foreground">Gen 1 (Founders)</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="bg-secondary w-4 h-4 md:w-5 md:h-5 rounded" />
            <span className="text-foreground">Gen 2</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="bg-accent w-4 h-4 md:w-5 md:h-5 rounded" />
            <span className="text-foreground">Gen 3</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="bg-primary/70 w-4 h-4 md:w-5 md:h-5 rounded" />
            <span className="text-foreground">Gen 4+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullFamilyTree;