import { FamilyMember } from "@/components/FamilyTreeTypes.tsx"; // Assume shared types
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

  // Recursive full tree renderer
  const renderFullTree = (member: FamilyMember) => (
    <div key={member.id} className="flex flex-col items-center my-4">
      <div className="flex items-center gap-4">
        <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-center">
          <Users className="h-4 w-4 mx-auto mb-1" />
          <p className="font-bold text-sm">{member.name}</p>
          <p className="text-xxs opacity-80">{member.generation}</p>
        </div>
        {member.spouse && (
          <>
            <Heart className="h-4 w-4 text-accent" />
            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-center">
              <Users className="h-4 w-4 mx-auto mb-1" />
              <p className="font-bold text-sm">{member.spouse.name}</p>
              <p className="text-xxs opacity-80">{member.spouse.generation}</p>
            </div>
          </>
        )}
      </div>

      {member.children && member.children.length > 0 && (
        <>
          <div className="w-0.5 h-10 bg-border" />
          <div className="flex gap-4 flex-wrap justify-center">
            {member.children.map((child) => renderFullTree(child))}
          </div>
        </>
      )}
    </div>
  );

  if (!showFullTree) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col z-50">
      <div className="flex justify-between items-center p-4 bg-background border-b border-border">
        <h3 className="text-lg font-semibold text-primary">
          Full Family Tree View
        </h3>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.4))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div
          className="flex justify-center items-start transition-transform duration-200"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center top",
          }}
        >
          <div className="flex flex-col items-center">
            {familyTree.map((founder) => renderFullTree(founder))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullFamilyTree;