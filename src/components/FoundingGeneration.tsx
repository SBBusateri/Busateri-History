import { FileText, Info, MessageSquare } from "lucide-react";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import FoundingGenInfo from "@/components/FoundingGenInfo.tsx";
import FoundingGenDocs from "@/components/FoundingGenDocs.tsx";
import FoundingGenDiscussion from "@/components/FoundingGenDiscussion.tsx";

const FoundingGeneration = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <section id="founding-generation" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
          The Busateri Family
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Information</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Discussion</span>
              <span className="sm:hidden">Talk</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <FoundingGenInfo />
          </TabsContent>

          <TabsContent value="documents">
            <FoundingGenDocs />
          </TabsContent>

          <TabsContent value="discussions">
            <FoundingGenDiscussion activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FoundingGeneration;