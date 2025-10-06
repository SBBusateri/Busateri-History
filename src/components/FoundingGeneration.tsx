import { FileText, Info } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const FoundingGeneration = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
        The Busateri Family
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Information
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="bg-card p-8 rounded-lg vintage-shadow">
              <h3 className="text-2xl font-bold mb-4 text-primary"></h3> 
              <div className="prose prose-lg max-w-none text-foreground">
                <p className="mb-4 text-muted-foreground leading-relaxed">
                Giuseppe and Ninfa Pusateri’s journey likely began in the seaside town of Sant’Agata di Militello, nestled along Sicily’s northern coast in the Metropolitan City of Messina. At the turn of the 20th, at only 20 years old, they looked toward America for a better life. Giuseppe left first, between 1900 and 1901, most likely departing from Palermo, the nearest major port. After weeks aboard a crowded steamship bound for New York’s Ellis Island and destination marked as Milwaukee, Wisconsin after that.
                </p>
                
                <p className="mb-4 text-muted-foreground leading-relaxed">
                Ninfa followed soon after around 1905, braving the same ocean voyage to reunite with her husband. Together, they built their new life in Milwaukee—carrying with them their Sicilian faith, language, and traditions that would root the Busateri family’s story in America.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                Giuseppe and Ninfa Pusateri’s last name can be seen changing to Busateri after arrival between 1910 - 1920. Giuseppe wrote Pusateri on the 1910 census while he wrote Busateri 1920. 
                See document section for source.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="bg-card p-8 rounded-lg vintage-shadow">
              <h3 className="text-2xl font-bold mb-6 text-primary">Historical Documents</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-accent pl-4 py-2">
                  <p className="font-semibold text-foreground">Document 1</p>
                  <p className="text-sm text-muted-foreground">Description of the document and its significance</p>
                </div>
                <div className="border-l-4 border-accent pl-4 py-2">
                  <p className="font-semibold text-foreground">Document 2</p>
                  <p className="text-sm text-muted-foreground">Description of the document and its significance</p>
                </div>
                <div className="border-l-4 border-accent pl-4 py-2">
                  <p className="font-semibold text-foreground">Document 3</p>
                  <p className="text-sm text-muted-foreground">Description of the document and its significance</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground italic">
                Add links to historical documents, photos, certificates, or other important records here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FoundingGeneration;
