import { FamilyMember } from "@/components/FamilyTreeTypes.tsx";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface FullFamilyTreeProps {
  showFullTree: boolean;
  onClose: () => void;
  familyTree: FamilyMember[];
}

const FullFamilyTree = ({ showFullTree, onClose, familyTree }: FullFamilyTreeProps) => {
  const [zoom, setZoom] = useState(0.34);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Center horizontally, start top
  useEffect(() => {
    if (showFullTree && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = 0;
    }
  }, [showFullTree]);

  const generationColors = useMemo(
    () => [
      "bg-primary text-primary-foreground",
      "bg-secondary text-secondary-foreground",
      "bg-accent text-accent-foreground",
      "bg-primary/70 text-primary-foreground",
      "bg-secondary/70 text-secondary-foreground",
      "bg-accent/70 text-accent-foreground",
      "bg-primary/50 text-primary-foreground",
    ],
    []
  );

  const renderFullTree = useCallback(
    (member: FamilyMember, generation: number = 0) => {
      const colorClass = generationColors[generation % generationColors.length];
      const hasChildren = member.children && member.children.length > 0;
      const isFounder = generation === 0;

      // vertical staggering
      const verticalGap =
        generation === 0 ? "mb-6 md:mb-8" :
        generation === 1 ? "mb-10 md:mb-14" :
        generation === 2 ? "mb-14 md:mb-20" :
        generation === 3 ? "mb-20 md:mb-28" : "mb-24 md:mb-32";

      // vertical connector height per generation
      const verticalHeight =
        generation === 0 ? "h-10 md:h-12" :
        generation === 1 ? "h-10 md:h-12" :
        generation === 2 ? "h-14 md:h-16" :
        generation === 3 ? "h-16 md:h-20" :
        "h-20 md:h-24";

      return (
        <div key={member.id} className={`flex flex-col items-center shrink-0 ${verticalGap}`}>
          {isFounder ? (
            <div
              className={`${colorClass} px-8 py-5 md:px-12 md:py-6 rounded-xl text-center shadow-lg min-w-[260px] md:min-w-[340px]`}
            >
              <div className="flex items-center justify-center gap-6 md:gap-8">
                <div className="text-left">
                  <p className="font-bold text-base md:text-lg leading-tight">
                    {member.name}
                  </p>
                  <p className="opacity-90 text-sm md:text-base leading-tight">
                    {member.generation}
                  </p>
                </div>
                {member.spouse && <div className="text-2xl md:text-3xl opacity-60">♥</div>}
                {member.spouse && (
                  <div className="text-left">
                    <p className="font-bold text-base md:text-lg leading-tight">
                      {member.spouse.name}
                    </p>
                    <p className="opacity-90 text-sm md:text-base leading-tight">
                      {member.spouse.generation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className={`${colorClass} px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-center shadow-sm min-w-[80px] md:min-w-[100px]`}
            >
              <div
                className={member.spouse ? "border-b border-current/20 pb-0.5 mb-0.5" : ""}
              >
                <p className="font-bold text-[9px] md:text-[10px] leading-tight">
                  {member.name}
                </p>
                <p className="opacity-80 text-[7px] md:text-[8px] leading-tight">
                  {member.generation}
                </p>
              </div>
              {member.spouse && (
                <div className="pt-0.5">
                  <p className="font-bold text-[9px] md:text-[10px] leading-tight">
                    {member.spouse.name}
                  </p>
                  <p className="opacity-80 text-[7px] md:text-[8px] leading-tight">
                    {member.spouse.generation}
                  </p>
                </div>
              )}
            </div>
          )}

          {hasChildren && (
            <>
              <div className={`w-0.5 bg-border ${verticalHeight}`} />
              <div className="relative flex flex-col items-center">
                {member.children!.length > 1 && (
                  <div
                    className="absolute top-0 flex items-center"
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `calc(100% - ${isFounder ? "240px" : "80px"})`,
                    }}
                  >
                    <div className="h-0.5 bg-border w-full" />
                  </div>
                )}
                <div
                  className={`flex ${
                    generation === 0
                      ? "flex-row gap-4 md:gap-6"
                      : generation === 1
                      ? "flex-row gap-1.5 md:gap-2" // tighter gap for Gen 2 -> Gen 3
                      : "flex-wrap justify-center gap-1 md:gap-2"
                  }`}
                >
                  {member.children!.map((child) => (
                    <div key={child.id} className="flex flex-col items-center shrink-0">
                      {member.children!.length > 1 && (
                        <div
                          className={`w-0.5 bg-border ${
                            generation === 0
                              ? "h-10 md:h-12"
                              : generation === 1
                              ? "h-10 md:h-12"
                              : generation === 2
                              ? "h-14 md:h-16"
                              : "h-16 md:h-20"
                          }`}
                        />
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
    },
    [generationColors]
  );

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
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}
          >
            <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10" onClick={onClose}>
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-auto p-4 md:p-6">
        <div className="min-w-[200vw] min-h-[200vh] flex items-start justify-center pt-12">
          <div
            className="transition-transform duration-300 ease-in-out"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            <div className="flex flex-row gap-12 md:gap-20 justify-center items-start">
              {familyTree.map((founder) => renderFullTree(founder, 0))}
            </div>
          </div>
        </div>
      </div>

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
