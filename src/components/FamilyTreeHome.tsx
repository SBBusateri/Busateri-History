import { useEffect, useState, useRef, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  Users,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Button } from "./ui/button";
import { FamilyMember, FirestoreMember, normalizeName, buildFamilyTree } from "@/components/FamilyTreeTypes.tsx";
import AddFamilyForm from "@/components/AddFamilyForm.tsx";
import EditFamilyMember from "@/components/EditFamilyMember.tsx";
import FullFamilyTree from "@/components/FullFamilyTree.tsx";

// Reusable MemberBox component with responsive sizing
interface MemberBoxProps {
  member: FamilyMember;
  showSpouseAsBox?: boolean;
  isLarge?: boolean;
  onClick?: () => void;
}

const MemberBox = ({ member, showSpouseAsBox = false, isLarge = false, onClick }: MemberBoxProps) => {
  // Responsive classes for mobile vs desktop
  const boxClass = isLarge 
    ? "bg-primary text-primary-foreground px-4 py-3 md:px-6 md:py-4 rounded-lg vintage-shadow" 
    : "bg-secondary text-secondary-foreground px-3 py-2 md:px-5 md:py-3 rounded-lg vintage-shadow hover:scale-105 hover:bg-accent hover:text-accent-foreground transition-transform";
  
  const iconSize = isLarge ? "h-4 w-4 md:h-6 md:w-6" : "h-4 w-4 md:h-5 md:w-5";
  const nameClass = isLarge ? "font-bold text-sm md:text-base" : "font-semibold text-xs md:text-sm";
  const genClass = isLarge ? "text-xs md:text-sm opacity-90" : "text-[10px] md:text-xs opacity-80";
  const heartClass = isLarge ? "h-4 w-4 md:h-6 md:w-6 text-accent animate-pulse" : "h-4 w-4 md:h-5 md:w-5 text-accent";

  return (
    <button onClick={onClick} className="flex flex-col items-center cursor-pointer group animate-fade-in">
      {showSpouseAsBox && member.spouse ? (
        <div className="flex items-center gap-2 md:gap-4">
          <div className={boxClass}>
            <Users className={`${iconSize} mx-auto mb-1 md:mb-2`} />
            <p className={nameClass}>{member.name}</p>
            <p className={genClass}>{member.generation}</p>
          </div>
          <Heart className={heartClass} />
          <div className={boxClass}>
            <Users className={`${iconSize} mx-auto mb-1 md:mb-2`} />
            <p className={nameClass}>{member.spouse.name}</p>
            <p className={genClass}>{member.spouse.generation}</p>
          </div>
        </div>
      ) : (
        <>
          <div className={boxClass}>
            <Users className={`${iconSize} mx-auto mb-1 md:mb-2`} />
            <p className={nameClass}>{member.name}</p>
            <p className={genClass}>{member.generation}</p>
          </div>
          {member.spouse && !showSpouseAsBox && (
            <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
              <Heart className="h-3 w-3 md:h-4 md:w-4 text-accent" />
              <p className="text-xs md:text-sm">{member.spouse.name}</p>
            </div>
          )}
        </>
      )}
    </button>
  );
};

const FamilyTreeHome = () => {
  const [familyTree, setFamilyTree] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [familyList, setFamilyList] = useState<FirestoreMember[]>([]);
  const [generations, setGenerations] = useState<FamilyMember[][]>([]);
  const [showFullTree, setShowFullTree] = useState(false);
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  const loadFamilyData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "family_members"));
      const data: FirestoreMember[] = snapshot.docs.map((doc) => {
        const d = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          name: (d.name as string) || "",
          birth: (d.birth as string) || "",
          death: (d.death as string) || "",
          spouse: (d.spouse as string) || "",
          spouse_birth: (d.spouse_birth as string) || "",
          spouse_death: (d.spouse_death as string) || "",
          about: (d.about as string) || "",
          parent: (d.parent as string) || "",
        };
      });

      setFamilyList(data);
      const tree = buildFamilyTree(data);
      setFamilyTree(tree);
      if (tree.length > 0) {
        const genArray: FamilyMember[][] = [tree];
        const queue: [FamilyMember, number][] = tree.map((t) => [t, 0]);
        while (queue.length > 0) {
          const [member, level] = queue.shift()!;
          if (member.children && member.children.length > 0) {
            genArray[level + 1] = genArray[level + 1] || [];
            genArray[level + 1].push(...member.children);
            member.children.forEach((child) => queue.push([child, level + 1]));
          }
        }
        setGenerations(genArray);
      } else {
        setSelectedMember(null);
        setBreadcrumb([]);
        setGenerations([]);
      }
      return data;
    } catch (err) {
      console.error("Error loading family tree:", err);
      return [];
    }
  };

  useEffect(() => {
    const initLoad = async () => {
      await loadFamilyData();
      setLoading(false);
    };
    initLoad();
  }, []);

  const { rawMap, membersMap } = useMemo(() => {
    const raw = new Map<string, FirestoreMember>();
    const members = new Map<string, FamilyMember>();
    familyList.forEach((d) => {
      const key = normalizeName(d.name);
      raw.set(key, d);
      members.set(key, {
        id: d.id,
        name: d.name,
        generation: [d.birth, d.death].filter(Boolean).join(" - "),
        information: d.about,
        children: [],
      });
    });

    familyList.forEach((d) => {
      const key = normalizeName(d.name);
      const member = members.get(key);
      if (!member) return;

      if (d.spouse) {
        const spouseKey = normalizeName(d.spouse);
        const spouseRaw = raw.get(spouseKey);
        const spouseGeneration = spouseRaw
          ? [spouseRaw.birth, spouseRaw.death].filter(Boolean).join(" - ")
          : [d.spouse_birth, d.spouse_death].filter(Boolean).join(" - ");

        member.spouse = {
          name: d.spouse,
          generation: spouseGeneration || undefined,
        };
      }
    });

    return { rawMap: raw, membersMap: members };
  }, [familyList]);

  const findPathToRoot = (member: FamilyMember): FamilyMember[] => {
    const pathSet = new Set<string>();
    const path: FamilyMember[] = [];
    let current = member;

    while (current) {
      const key = normalizeName(current.name);
      if (pathSet.has(key)) break;
      path.unshift(current);
      pathSet.add(key);

      const rawMember = rawMap.get(key);
      if (!rawMember || !rawMember.parent || rawMember.parent.toLowerCase() === "founders") {
        break;
      }
      const parentKey = normalizeName(rawMember.parent);
      const parent = membersMap.get(parentKey);
      if (parent) {
        current = parent;
      } else {
        break;
      }
    }

    familyTree.forEach((founder) => {
      const founderKey = normalizeName(founder.name);
      if (!pathSet.has(founderKey)) {
        path.unshift(founder);
        pathSet.add(founderKey);
      }
    });

    return path;
  };

  const handleMemberClick = (member: FamilyMember) => {
    const path = findPathToRoot(member);
    setBreadcrumb(path);
    setSelectedMember(member);
    if (breadcrumbRef.current) {
      breadcrumbRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setSelectedMember(newBreadcrumb[newBreadcrumb.length - 1]);
    if (breadcrumbRef.current) {
      breadcrumbRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const refreshTree = async () => {
    await loadFamilyData();
  };

  if (loading)
    return (
      <section className="py-20 text-center text-muted-foreground">
        <p>Loading family tree...</p>
      </section>
    );

  if (!familyTree.length)
    return (
      <section className="py-20 text-center text-muted-foreground">
        <p>No family data found in Firestore.</p>
      </section>
    );

  return (
    <section className="py-12 md:py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 text-primary">
          Family Tree
        </h2>
        <p className="text-center text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto">
          Explore all generations or click a family member to view their lineage
        </p>

        <div className="flex justify-center mb-6 md:mb-8">
          <Button
            variant="outline"
            onClick={() => setShowFullTree(true)}
            className="gap-2 text-sm md:text-base"
          >
            <Users className="h-4 w-4 md:h-5 md:w-5" />
            View Full Family Tree
          </Button>
        </div>

        {/* Breadcrumb Navigation - Compact on mobile */}
        {breadcrumb.length > 1 && (
          <div ref={breadcrumbRef}>
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-6 md:mb-8 flex-wrap">
              {breadcrumb.map((ancestor, idx) => (
                <div key={ancestor.id} className="flex items-center">
                  <button
                    onClick={() => handleBreadcrumbClick(idx)}
                    className="text-primary hover:underline text-xs md:text-base"
                  >
                    {ancestor.name}
                  </button>
                  {idx < breadcrumb.length - 1 && (
                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4 mx-1 md:mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Member Lineage - Compact spacing on mobile */}
        {selectedMember && breadcrumb.length > 1 && (
          <div className="flex flex-col items-center my-6 md:my-8">
            {breadcrumb.map((ancestor, idx) => (
              <div key={ancestor.id} className="flex flex-col items-center mb-6 md:mb-8">
                <MemberBox 
                  member={ancestor} 
                  showSpouseAsBox 
                  isLarge 
                />
                {idx === breadcrumb.length - 1 && ancestor.information && (
                  <div className="max-w-md text-center text-muted-foreground italic mt-2 px-4">
                    {ancestor.information.length > 400 ? (
                      <p className="text-sm md:text-base">
                        "{ancestor.information.slice(0, 400)}..."
                        <span className="text-primary cursor-pointer hover:underline">
                          {" "}more
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm md:text-base">"{ancestor.information}"</p>
                    )}
                  </div>
                )}
                {idx === breadcrumb.length - 1 && (
                  <EditFamilyMember 
                    member={ancestor} 
                    onSuccess={refreshTree}
                    buttonText={`Edit ${ancestor.name.split(" ")[0]}'s Info`}
                  />
                )}
                {idx === breadcrumb.length - 1 && ancestor.children && ancestor.children.length > 0 && (
                  <>
                    <div className="w-0.5 h-8 md:h-12 bg-border" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3 md:gap-6 justify-center w-full px-4">
                      {ancestor.children.map((child) => (
                        <MemberBox 
                          key={child.id} 
                          member={child} 
                          showSpouseAsBox={false} 
                          onClick={() => handleMemberClick(child)} 
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* All Generations Display - Responsive grid for mobile */}
        <div className="mt-8 md:mt-12">
          {generations.map((generation, idx) => (
            <div key={idx} className="mb-8 md:mb-12">
              <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3 md:mb-4 text-center">
                {idx === 0 ? "Founders" : `Generation ${idx + 1}`}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3 md:gap-6 justify-center px-2">
                {generation.map((member) => (
                  <MemberBox
                    key={member.id}
                    member={member}
                    showSpouseAsBox={idx === 0}
                    onClick={() => handleMemberClick(member)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Family Form */}
        <div className="mt-12 md:mt-16 text-center">
          <AddFamilyForm familyList={familyList} onSuccess={refreshTree} />
        </div>
      </div>

      <FullFamilyTree 
        showFullTree={showFullTree} 
        onClose={() => setShowFullTree(false)} 
        familyTree={familyTree} 
      />
    </section>
  );
};

export default FamilyTreeHome;