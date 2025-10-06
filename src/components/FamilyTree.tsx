import { Users, ChevronRight, Maximize2, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

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
  documents?: string[];
  children?: FamilyMember[];
}

const foundingCouple: FamilyMember = {
  id: "Giuseppe Busateri",
  name: "Giuseppe Busateri",
  generation: "1880 - 1957",
  spouse: {
    name: "Ninfa 'Micelli' Busateri",
    generation: "1882 - 1968",
  },
  children: [
    { 
      id: "Theodore Salvatore Busateri", 
      name: "Theodore Salvatore Busateri", 
      generation: "1905 - 1992",
      spouse: {
        name: "Rose Marie 'Bruno' Busateri ",
        generation: "1906 - 1998",
      },      
      information: "Information about Child 1 will go here.",
      documents: ["Child 1 - Document 1", "Child 1 - Document 2"],
      children: [
        { id: "gc1-1", name: "Grandchild 1-1", generation: "1980s - 2010s" },
        { id: "gc1-2", name: "Grandchild 1-2", generation: "1980s - 2010s" },
        { id: "gc1-3", name: "Grandchild 1-3", generation: "1980s - 2010s" },
      ]
    },
    { 
      id: "Giuseppe Joseph Busateri Jr", 
      name: "Giuseppe Joseph Busateri Jr", 
      generation: "1907 - 1982",
      spouse: {
        name: "spuse",
        generation: "1884 - 1962",
      },
      information: "Information about Child 2 will go here.",
      documents: ["Child 2 - Document 1", "Child 2 - Document 2"],
      children: [
        { id: "gc2-1", name: "Grandchild 2-1", generation: "1980s - 2010s" },
        { id: "gc2-2", name: "Grandchild 2-2", generation: "1980s - 2010s" },
        { id: "gc2-3", name: "Grandchild 2-3", generation: "1980s - 2010s" },
      ]
    },
    { 
      id: "Biagio Busateri", 
      name: "Biagio Busateri", 
      generation: "1909 - 1914",
      information: "Information about Child 3 will go here.",
      documents: ["Child 3 - Document 1", "Child 3 - Document 2"],
    },
    { 
      id: "Grace Marie Busateri", 
      name: "Grace Marie Busateri", 
      generation: "1911 - 1987",
      spouse: {
        name: "Emanuel William 'Garacci' Busateri",
        generation: "1909 - 1993",
      },
      information: "Information about Child 4 will go here.",
      documents: ["Child 4 - Document 1", "Child 4 - Document 2"],
      children: [
        { id: "gc4-1", name: "Grandchild 4-1", generation: "1980s - 2010s" },
        { id: "gc4-2", name: "Grandchild 4-2", generation: "1980s - 2010s" },
        { id: "gc4-3", name: "Grandchild 4-3", generation: "1980s - 2010s" },
      ]
    },
    { 
      id: "Anthony Frank Busateri Sr", 
      name: "Anthony Frank Busateri Sr", 
      generation: "1950s - 1980s",
      spouse: {
        name: "spuse",
        generation: "1884 - 1962",
      },
      information: "Information about Child 5 will go here.",
      documents: ["Child 5 - Document 1", "Child 5 - Document 2"],
      children: [
        { id: "gc5-1", name: "Grandchild 5-1", generation: "1980s - 2010s" },
        { id: "gc5-2", name: "Grandchild 5-2", generation: "1980s - 2010s" },
        { id: "gc5-3", name: "Grandchild 5-3", generation: "1980s - 2010s" },
      ]
    },
    { 
      id: "Charles Ben Busateri", 
      name: "Charles Ben Busateri", 
      generation: "1915 - 2006",
      spouse: {
        name: "Bertha J 'Sikora' Busateri ",
        generation: "1918 - 2011",
      },
      information: "Information about Child 6 will go here.",
      documents: ["Child 6 - Document 1", "Child 6 - Document 2"],
      children: [
        { id: "gc6-1", name: "Grandchild 6-1", generation: "1980s - 2010s" },
        { id: "gc6-2", name: "Grandchild 6-2", generation: "1980s - 2010s" },
        { id: "gc6-3", name: "Grandchild 6-3", generation: "1980s - 2010s" },
      ]
    },
    { 
      id: "Frank Jowett Busateri", 
      name: "Frank Jowett Busateri", 
      generation: "1919 - 2001",
      spouse: {
        name: "Marie Otilla 'Wolfe' Busateri ",
        generation: "1918 - 2005",
      },
      information: "Information about Child 7 will go here.",
      documents: ["Child 7 - Document 1", "Child 7 - Document 2"],
      children: [
        { id: "gc7-1", name: "Grandchild 7-1", generation: "1980s - 2010s" },
        { id: "gc7-2", name: "Grandchild 7-2", generation: "1980s - 2010s" },
        { id: "gc7-3", name: "Grandchild 7-3", generation: "1980s - 2010s" },
      ]
    },
    { 
      id: "John Joseph Busateri", 
      name: "John Joseph Busateri", 
      generation: "1920 - 2009",
      spouse: {
        name: "Sophie 'Christy' Busateri",
        generation: "1921 - 1999",
      },
      information: "Information about Child 8 will go here.",
      documents: ["Child 8 - Document 1", "Child 8 - Document 2"],
      children: [
        { id: "gc8-1", name: "Grandchild 8-1", generation: "1980s - 2010s" },
        { id: "gc8-2", name: "Grandchild 8-2", generation: "1980s - 2010s" },
        { id: "gc8-3", name: "Grandchild 8-3", generation: "1980s - 2010s" },
      ]
    },
    { 
      id: "Theresa M Busateri", 
      name: "Theresa M Busateri", 
      generation: "1922 - 2002",
      spouse: {
        name: "spuse",
        generation: "1884 - 1962",
      },
      information: "Information about Child 9 will go here.",
      documents: ["Child 9 - Document 1", "Child 9 - Document 2"],
      children: [
        { id: "gc9-1", name: "Grandchild 9-1", generation: "1980s - 2010s" },
        { id: "gc9-2", name: "Grandchild 9-2", generation: "1980s - 2010s" },
        { id: "gc9-3", name: "Grandchild 9-3", generation: "1980s - 2010s" },
      ]
    },
    { 
      id: "Carl Manuel Busateri", 
      name: "Carl Manuel Busateri", 
      generation: "1924 - 1990",
      spouse: {
        name: "spuse",
        generation: "1884 - 1962",
      },
      information: "Information about Child 10 will go here.",
      documents: ["Child 10 - Document 1", "Child 10 - Document 2"],
      children: [
        { id: "gc10-1", name: "Grandchild 10-1", generation: "1980s - 2010s" },
        { id: "gc10-2", name: "Grandchild 10-2", generation: "1980s - 2010s" },
        { id: "gc10-3", name: "Grandchild 10-3", generation: "1980s - 2010s" },
      ]
    },
    { 
      id: "Thomas T Busateri", 
      name: "Thomas T Busateri", 
      generation: "1928 - 2003",
      spouse: {
        name: "Marion Ann 'Tuska' Busateri",
        generation: "1930 - 2016",
      },
      information: "Information about Child 11 will go here.",
      documents: ["Child 11 - Document 1", "Child 11 - Document 2"],
      children: [
        { id: "gc11-1", name: "Grandchild 11-1", generation: "1980s - 2010s" },
        { id: "gc11-2", name: "Grandchild 11-2", generation: "1980s - 2010s" },
        { id: "gc11-3", name: "Grandchild 11-3", generation: "1980s - 2010s" },
      ]
    },
  ],
};

const FamilyTree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember>(foundingCouple);
  const [breadcrumb, setBreadcrumb] = useState<FamilyMember[]>([foundingCouple]);
  const [viewMode, setViewMode] = useState<"interactive" | "full">("interactive");

  const handleMemberClick = (member: FamilyMember) => {
    if (member.children && member.children.length > 0) {
      setSelectedMember(member);
      setBreadcrumb([...breadcrumb, member]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setSelectedMember(newBreadcrumb[newBreadcrumb.length - 1]);
  };

  const renderFullTree = (member: FamilyMember, level: number = 0) => {
    return (
      <div key={member.id} className="flex flex-col items-center transition-smooth">
        <div className="flex items-center gap-4">
          <div className={`${level === 0 ? 'bg-primary text-primary-foreground px-6 py-3' : level === 1 ? 'bg-secondary text-secondary-foreground px-4 py-2' : 'bg-muted text-muted-foreground px-3 py-2'} rounded-lg vintage-shadow text-center transition-smooth`}>
            <Users className={`${level === 0 ? 'h-5 w-5' : 'h-4 w-4'} mx-auto mb-1`} />
            <p className={`font-semibold ${level === 0 ? 'text-sm' : 'text-xs'}`}>{member.name}</p>
            <p className="text-xs opacity-80">{member.generation}</p>
          </div>
          
          {member.spouse && (
            <>
              <Heart className="h-4 w-4 text-accent" />
              <div className={`${level === 0 ? 'bg-primary text-primary-foreground px-6 py-3' : level === 1 ? 'bg-secondary text-secondary-foreground px-4 py-2' : 'bg-muted text-muted-foreground px-3 py-2'} rounded-lg vintage-shadow text-center transition-smooth`}>
                <Users className={`${level === 0 ? 'h-5 w-5' : 'h-4 w-4'} mx-auto mb-1`} />
                  <p className={`font-semibold ${level === 0 ? 'text-sm' : 'text-xs'}`}>{member.spouse.name}</p>
                  <p className="text-xs opacity-80">{member.spouse.generation}</p>
              </div>
            </>
          )}
        </div>
        
        {member.children && member.children.length > 0 && (
          <>
            <div className="w-0.5 h-6 bg-border transition-smooth"></div>
            <div className="flex gap-4 flex-wrap justify-center">
              {member.children.map((child) => renderFullTree(child, level + 1))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
              Family Tree
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Click on family members to explore their descendants
</p>
          </div>
          {/* <Button
            onClick={() => setViewMode(viewMode === "interactive" ? "full" : "interactive")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            {viewMode === "interactive" ? "View Full Tree" : "Interactive View"}
          </Button> */}
        </div>

        {viewMode === "interactive" ? (
          <>
            {/* Breadcrumb Navigation */}
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

            {/* Current Member with smooth transitions */}
            <div className="flex flex-col items-center space-y-8 animate-fade-in">
              <div className="flex items-center gap-6">
                <div className="bg-primary text-primary-foreground px-6 py-4 rounded-lg vintage-shadow transition-smooth hover:scale-105">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-bold">{selectedMember.name}</p>
                  <p className="text-sm opacity-90">{selectedMember.generation}</p>
                </div>
                
                {selectedMember.spouse && (
                  <>
                    <Heart className="h-6 w-6 text-accent animate-pulse" />
                    <div className="bg-primary text-primary-foreground px-6 py-4 rounded-lg vintage-shadow transition-smooth hover:scale-105">
                      <Users className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-bold">{selectedMember.spouse.name}</p>
                      <p className="text-sm opacity-90">{selectedMember.spouse.generation}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Information and Documents for selected member */}
              {(selectedMember.information || selectedMember.documents) && (
                <Card className="w-full max-w-2xl animate-scale-in">
                  <CardHeader>
                    <CardTitle>About {selectedMember.name}</CardTitle>
                    <CardDescription>Family information and documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="information">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="information">Information</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                      </TabsList>
                      <TabsContent value="information" className="mt-4">
                        <p className="text-muted-foreground">{selectedMember.information}</p>
                      </TabsContent>
                      <TabsContent value="documents" className="mt-4">
                        <ul className="space-y-2">
                          {selectedMember.documents?.map((doc, idx) => (
                            <li key={idx} className="text-muted-foreground flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Children */}
              {selectedMember.children && selectedMember.children.length > 0 && (
                <>
                  <div className="w-0.5 h-12 bg-border"></div>
                  <div className="flex gap-6 flex-wrap justify-center">
                    {selectedMember.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleMemberClick(child)}
                        className="flex flex-col items-center cursor-pointer group animate-fade-in"
                      >
                        <div className="bg-secondary text-secondary-foreground px-5 py-3 rounded-lg vintage-shadow transition-smooth hover:scale-105 hover:bg-accent hover:text-accent-foreground">
                          <Users className="h-5 w-5 mx-auto mb-2" />
                          <p className="font-semibold text-sm">{child.name}</p>
                          <p className="text-xs opacity-80">{child.generation}</p>
                          {child.children && child.children.length > 0 && (
                            <ChevronRight className="h-4 w-4 mx-auto mt-1 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="mt-16 text-center">
              <p className="text-muted-foreground italic">
              </p>
            </div>
          </>
        ) : (
          <div className="overflow-x-auto pb-8 animate-fade-in">
            <div className="min-w-max flex justify-center scale-90 origin-top transition-smooth">
              {renderFullTree(foundingCouple)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FamilyTree;
