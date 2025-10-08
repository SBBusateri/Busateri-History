import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Users, ChevronRight, Heart, Plus, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface Spouse {
  name: string;
  generation?: string;
}

interface FamilyMember {
  id: string;
  name: string;
  generation?: string;
  spouse?: Spouse;
  information?: string;
  children?: FamilyMember[];
}

interface FirestoreMember {
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

const normalizeName = (name?: string) =>
  name ? name.trim().toLowerCase().replace(/\s+sr\.?$/i, "") : "";

// build tree and sort children by birth year
const buildFamilyTree = (data: FirestoreMember[]): FamilyMember | null => {
  if (!data || data.length === 0) return null;

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

  const founderEntries = data.filter((d) => !d.parent || d.parent.toLowerCase() === "");

  // prevent double founders
  const suppressed = new Set<string>();
  for (const f of founderEntries) {
    if (f.spouse) {
      const spouseKey = normalizeName(f.spouse);
      const spouseRaw = rawMap.get(spouseKey);
      if (spouseRaw && (!spouseRaw.parent || spouseRaw.parent.toLowerCase() === "")) {
        suppressed.add(spouseKey);
      }
    }
  }

  // add spouse info
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

      member.spouse = { name: d.spouse, generation: spouseGeneration || undefined };
    }
  });

  // link children
  data.forEach((d) => {
    if (d.parent && d.parent.toLowerCase() !== "") {
      const parentKey = normalizeName(d.parent);
      const childKey = normalizeName(d.name);
      if (suppressed.has(childKey)) return;

      const parent = membersMap.get(parentKey);
      const child = membersMap.get(childKey);
      if (parent && child) {
        parent.children = parent.children || [];
        if (!parent.children.find((c) => normalizeName(c.name) === childKey)) {
          parent.children.push(child);
        }

        // sort children by birth year
        parent.children.sort((a, b) => {
          const getYear = (gen?: string) => parseInt(gen?.split(" - ")[0] || "9999");
          return getYear(a.generation) - getYear(b.generation);
        });
      }
    }
  });

  let rootKey: string | undefined;
  for (const f of founderEntries) {
    const k = normalizeName(f.name);
    if (!suppressed.has(k)) {
      rootKey = k;
      break;
    }
  }
  if (!rootKey && founderEntries.length > 0)
    rootKey = normalizeName(founderEntries[0].name);

  return rootKey ? membersMap.get(rootKey) || null : null;
};

const FamilyTree = () => {
  const [familyTree, setFamilyTree] = useState<FamilyMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [familyList, setFamilyList] = useState<FirestoreMember[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedAbout, setExpandedAbout] = useState(false);

  // form state
  const [showSpouse, setShowSpouse] = useState(false);
  const [alive, setAlive] = useState(false);
  const [spouseAlive, setSpouseAlive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birth: "",
    death: "",
    spouse: "",
    spouse_birth: "",
    spouse_death: "",
    parent: "",
    about: "",
  });

  // fetch data
  useEffect(() => {
    const fetchMembers = async () => {
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
        if (tree) {
          setSelectedMember(tree);
          setBreadcrumb([tree]);
        }
      } catch (err) {
        console.error("Error loading family tree:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleMemberClick = (member: FamilyMember) => {
    setBreadcrumb((prev) => [...prev, member]);
    setSelectedMember(member);
    setExpandedAbout(false);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setSelectedMember(newBreadcrumb[newBreadcrumb.length - 1]);
    setExpandedAbout(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // require parent + name
    if (!formData.name.trim() || !formData.parent.trim()) {
      alert("Please provide both a name and select a parent.");
      return;
    }

    const newMember = {
      name: formData.name,
      birth: formData.birth,
      death: alive ? "" : formData.death,
      spouse: showSpouse ? formData.spouse : "",
      spouse_birth: showSpouse ? formData.spouse_birth : "",
      spouse_death: showSpouse && !spouseAlive ? formData.spouse_death : "",
      parent: formData.parent || "",
      about: formData.about,
    };

    try {
      await setDoc(doc(db, "family_members", formData.name), newMember);
      setSuccessMessage(`${formData.name} successfully added!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setDialogOpen(false);

      setFormData({
        name: "",
        birth: "",
        death: "",
        spouse: "",
        spouse_birth: "",
        spouse_death: "",
        parent: "",
        about: "",
      });
    } catch (err) {
      console.error("Error adding family member:", err);
    }
  };

  if (loading)
    return (
      <section className="py-20 text-center text-muted-foreground">
        <p>Loading family tree...</p>
      </section>
    );

  if (!familyTree)
    return (
      <section className="py-20 text-center text-muted-foreground">
        <p>No family data found in Firestore.</p>
      </section>
    );

  // shorten "about"
  const renderAbout = (text?: string) => {
    if (!text) return null;
    if (text.length <= 400) return <p>“{text}”</p>;
    return (
      <p>
        “{expandedAbout ? text : text.slice(0, 400) + "..."}”{" "}
        <button
          onClick={() => setExpandedAbout(!expandedAbout)}
          className="text-primary underline ml-1"
        >
          {expandedAbout ? "Show less" : "more..."}
        </button>
      </p>
    );
  };

  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
          Family Tree
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Click on family members to explore their descendants
        </p>

        {successMessage && (
          <div className="mb-4 bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-8 flex-wrap justify-center">
          {breadcrumb.map((member, index) => (
            <div key={member.id} className="flex items-center gap-2">
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className="text-primary hover:underline font-medium"
              >
                {member.name}
              </button>
              {index < breadcrumb.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Selected Member */}
        {selectedMember && (
          <div className="flex flex-col items-center space-y-8 animate-fade-in">
            {/* Parents full boxes */}
            {breadcrumb.length > 1 && (
              <div className="flex items-center gap-6">
                <div className="bg-muted text-foreground px-6 py-4 rounded-lg vintage-shadow">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-bold">{breadcrumb[breadcrumb.length - 2].name}</p>
                  <p className="text-sm opacity-80">{breadcrumb[breadcrumb.length - 2].generation}</p>
                </div>
                {breadcrumb[breadcrumb.length - 2].spouse && (
                  <>
                    <Heart className="h-6 w-6 text-accent" />
                    <div className="bg-muted text-foreground px-6 py-4 rounded-lg vintage-shadow">
                      <Users className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-bold">{breadcrumb[breadcrumb.length - 2].spouse?.name}</p>
                      <p className="text-sm opacity-80">
                        {breadcrumb[breadcrumb.length - 2].spouse?.generation}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Selected Member */}
            <div className="flex items-center gap-6">
              <div className="bg-primary text-primary-foreground px-6 py-4 rounded-lg vintage-shadow">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <p className="font-bold">{selectedMember.name}</p>
                <p className="text-sm opacity-90">{selectedMember.generation}</p>
              </div>

              {selectedMember.spouse && (
                <>
                  <Heart className="h-6 w-6 text-accent animate-pulse" />
                  <div className="bg-primary text-primary-foreground px-6 py-4 rounded-lg vintage-shadow">
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-bold">{selectedMember.spouse.name}</p>
                    <p className="text-sm opacity-90">{selectedMember.spouse.generation}</p>
                  </div>
                </>
              )}
            </div>

            {/* About */}
            {selectedMember.information && (
              <div className="max-w-2xl text-center text-muted-foreground italic">
                {renderAbout(selectedMember.information)}
              </div>
            )}

            {/* Children */}
            {selectedMember.children && selectedMember.children.length > 0 && (
              <>
                <div className="w-0.5 h-12 bg-border" />
                <div className="flex gap-6 flex-wrap justify-center">
                  {selectedMember.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleMemberClick(child)}
                      className="flex flex-col items-center cursor-pointer group animate-fade-in"
                    >
                      <div className="bg-secondary text-secondary-foreground px-5 py-3 rounded-lg vintage-shadow hover:scale-105 hover:bg-accent hover:text-accent-foreground">
                        <Users className="h-5 w-5 mx-auto mb-2" />
                        <p className="font-semibold text-sm">{child.name}</p>
                        <p className="text-xs opacity-80">{child.generation}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Add Family Form */}
        <div className="mt-16 text-center">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" /> Add More Family
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add a New Family Member</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-muted-foreground">
                  Need to add any more family members? Fill out the form below and hit submit when done.
                </p>

                <div>
                  <Label>Full Name of Busateri</Label>
                  <Input name="name" value={formData.name} onChange={handleInputChange} required />
                </div>

                <div>
                  <Label>Birthdate (Month / Day / Year)</Label>
                  <Input name="birth" placeholder="e.g. 1905" value={formData.birth} onChange={handleInputChange} required />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={alive} onChange={() => setAlive(!alive)} />
                  <Label>Still alive?</Label>
                </div>

                {!alive && (
                  <div>
                    <Label>Deathdate (Month / Day / Year)</Label>
                    <Input name="death" placeholder="e.g. 1992" value={formData.death} onChange={handleInputChange} />
                  </div>
                )}

                <div>
                  <Label>Busateri Parent</Label>
                  <select
                    name="parent"
                    value={formData.parent}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select parent</option>
                    {familyList.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={showSpouse} onChange={() => setShowSpouse(!showSpouse)} />
                  <Label>Married?</Label>
                </div>

                {showSpouse && (
                  <>
                    <div>
                      <Label>Spouse Full Name</Label>
                      <Input name="spouse" value={formData.spouse} onChange={handleInputChange} />
                    </div>

                    <div>
                      <Label>Spouse Birthdate</Label>
                      <Input name="spouse_birth" value={formData.spouse_birth} onChange={handleInputChange} />
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={spouseAlive} onChange={() => setSpouseAlive(!spouseAlive)} />
                      <Label>Spouse Still alive?</Label>
                    </div>

                    {!spouseAlive && (
                      <div>
                        <Label>Spouse Deathdate</Label>
                        <Input name="spouse_death" value={formData.spouse_death} onChange={handleInputChange} />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <Label>About Member</Label>
                  <Textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    placeholder="Write a short bio or memory..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default FamilyTree;
