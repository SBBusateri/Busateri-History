// FamilyTreeTypes.tsx
export interface Spouse {
    name: string;
    generation?: string;
  }
  
  export interface FamilyMember {
    id: string;
    name: string;
    generation?: string;
    spouse?: Spouse;
    information?: string;
    children?: FamilyMember[];
  }
  
  export interface FirestoreMember {
    id: string;
    name: string;
    birth?: string;
    death?: string;
    spouse?: string;
    spouse_birth?: string;
    spouse_death?: string;
    about?: string;
    parent?: string;
  }
  
  export const normalizeName = (name?: string) =>
    name ? name.trim().toLowerCase().replace(/\s+sr\.?$/i, "") : "";
  
  export const buildFamilyTree = (data: FirestoreMember[]): FamilyMember[] => {
    if (!data || data.length === 0) return [];
  
    const rawMap = new Map<string, FirestoreMember>();
    data.forEach((d) => rawMap.set(normalizeName(d.name), d));
  
    const membersMap = new Map<string, FamilyMember>();
    data.forEach((d) => {
      const key = normalizeName(d.name);
      membersMap.set(key, {
        id: d.id,
        name: d.name,
        generation: [d.birth, d.death].filter(Boolean).join(" - "),
        information: d.about,
        children: [],
      });
    });
  
    const founderEntries = data.filter(
      (d) => !d.parent || d.parent.toLowerCase() === "founders"
    );
  
    const suppressed = new Set<string>();
    for (const f of founderEntries) {
      if (f.spouse) {
        const spouseKey = normalizeName(f.spouse);
        const spouseRaw = rawMap.get(spouseKey);
        if (spouseRaw && spouseRaw.parent?.toLowerCase() === "founders") {
          suppressed.add(spouseKey);
        }
      }
    }
  
    // Link spouses
    data.forEach((d) => {
      const key = normalizeName(d.name);
      const member = membersMap.get(key);
      if (!member) return;
  
      if (d.spouse) {
        const spouseKey = normalizeName(d.spouse);
        const spouseRaw = rawMap.get(spouseKey);
        const spouseGeneration = spouseRaw
          ? [spouseRaw.birth, spouseRaw.death].filter(Boolean).join(" - ")
          : [d.spouse_birth, d.spouse_death].filter(Boolean).join(" - ");
  
        member.spouse = {
          name: d.spouse,
          generation: spouseGeneration || undefined,
        };
      }
    });
  
    // Link children
    data.forEach((d) => {
      if (d.parent && d.parent.toLowerCase() !== "") {
        const parentKey = normalizeName(d.parent);
        const childKey = normalizeName(d.name);
        if (suppressed.has(childKey)) return;
  
        const parent = membersMap.get(parentKey);
        const child = membersMap.get(childKey);
        if (parent && child) {
          // Skip if the child is actually the parent's spouse
          if (parent.spouse && normalizeName(parent.spouse.name) === childKey) return;
  
          parent.children = parent.children || [];
          if (!parent.children.find((c) => normalizeName(c.name) === childKey)) {
            parent.children.push(child);
          }
        }
      }
    });
  
    // Sort children by birth year (oldest → youngest)
    membersMap.forEach((member) => {
      member.children?.sort((a, b) => {
        const aYear = parseInt(a.generation?.split(" - ")[0] || "0");
        const bYear = parseInt(b.generation?.split(" - ")[0] || "0");
        return aYear - bYear;
      });
    });
  
    // Return both founders as an array
    const founders: FamilyMember[] = [];
    for (const f of founderEntries) {
      const k = normalizeName(f.name);
      if (!suppressed.has(k)) {
        const member = membersMap.get(k);
        if (member) founders.push(member);
      }
    }
  
    return founders;
  };