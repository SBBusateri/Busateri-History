import { FileText, Info, X, Search } from "lucide-react"; // Added Search icon for reset
import { useState, useRef, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import ManifestJoe from "../assets/ManifestJoe.jpg";
import Census1910 from "../assets/1910Census.png";
import Census1920 from "../assets/1920Census.png";
import Census1930 from "../assets/1930Census.jpg";
import Census1940 from "../assets/1940Census.png";
import Census1950 from "../assets/1950Census.png";
import Death1957Zoom from "../assets/1957Deathzoom.png";
import FamilyPic from "../assets/FamilyPic.jpg";
import Sentinel1927 from "../assets/The_Milwaukee_Sentinel1927.jpg";

const FoundingGeneration = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [selectedDoc, setSelectedDoc] = useState<{ img: string; title: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1); // New: Zoom state
  const imageRef = useRef<HTMLImageElement>(null); // Ref for wheel events

  const documents = [
    { img: ManifestJoe, title: "List of Alien Immigrants", desc: "See line 22 for Giuseppe Pusateri" },
    { img: Census1910, title: "1910 U.S. Census", desc: "Shows Giuseppe listed as Pusateri in Milwaukee." },
    { img: Census1920, title: "1920 U.S. Census", desc: "Name changes to Busateri after arrival in the U.S." },
    { img: Census1930, title: "1930 U.S. Census", desc: "Continued Census family records in Milwaukee." },
    { img: Census1940, title: "1940 U.S. Census", desc: "Continued Census family records in Milwaukee." },
    { img: Census1950, title: "1950 U.S. Census", desc: "Final census before Giuseppe’s passing." },
    { img: Death1957Zoom, title: "1957 Obituary", desc: "Obituary from newspaper in 1957" },
    { img: FamilyPic, title: "Family Photo", desc: "Portrait of Giuseppe and Ninfa 1920s Milwaukee." },
    { img: Sentinel1927, title: "The Milwaukee Sentinel (1927)", desc: "Newspaper reference to Busateri family events." },
  ];

  // Reset zoom when opening a new doc or closing
  useEffect(() => {
    if (selectedDoc) {
      setZoomLevel(1);
    } else {
      setZoomLevel(1);
    }
  }, [selectedDoc]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01; // Sensitivity
    setZoomLevel((prev) => {
      const newZoom = Math.min(Math.max(prev + delta, 0.5), 3); // Clamp 0.5x to 3x
      return newZoom;
    });
  };

  const resetZoom = () => setZoomLevel(1);

  return (
    <section id="founding-generation" className="py-20 px-4 bg-background">
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
            <div className="bg-card p-8 rounded-lg vintage-shadow text-center">
              <div className="flex justify-center mb-8">
                <img
                  src={FamilyPic}
                  alt="Giuseppe and Ninfa Busateri Family"
                  className="rounded-xl shadow-md max-w-md w-full object-cover border border-border"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary"></h3>
              <div className="prose prose-lg max-w-none text-foreground">
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  Giuseppe (Joseph) and Ninfa Pusateri’s journey began in Saint Agnes, Sicily—today known as the seaside town of Sant’Agata di Militello, nestled along Sicily’s northern coast in the Metropolitan City of Messina. At the turn of the 20th century, and at only 20 years old, they looked toward America for a better life. Giuseppe (Joseph) left first in 1901, departing from Napoli aboard the S.S. Washington. After weeks aboard a crowded steamship, he arrived at the Port of New York through Ellis Island, with his destination listed as Milwaukee, Wisconsin.
                </p>
                
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  Ninfa followed soon after, around 1905, braving the same ocean voyage to reunite with her husband. Together, they built a new life in Milwaukee—carrying with them their Sicilian faith, language, and traditions that would root the Busateri family’s story in America. Giuseppe and Ninfa remained in and around Milwaukee, raising 15 children over 23 years. Giuseppe (Joseph) worked for the Wisconsin Transport Company for 44 years before retiring. He passed away in 1957, followed by Ninfa in 1968.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Their surname transitioned from Pusateri to Busateri sometime after their arrival, a change reflected in census records—Giuseppe (Joseph) signed “Pusateri” in 1910 and “Busateri” in 1920. (See document section for source references.)
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="bg-card p-8 rounded-lg vintage-shadow">
              <h3 className="text-2xl font-bold mb-6 text-primary">Historical Documents</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <img src={doc.img} alt={doc.title} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <p className="font-semibold text-foreground">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">{doc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm text-muted-foreground italic text-center">
                These historical records trace the Busateri family’s journey from Sicily to Milwaukee between 1910 and 1957.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Single shared Dialog for the modal */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className={`relative w-full h-full flex items-center justify-center transition-all duration-200 ${
            zoomLevel > 1 ? 'overflow-auto' : 'overflow-hidden'
          }`}>
            {/* Header controls */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center bg-background/80 text-foreground px-3 py-1 rounded text-sm">
              <span>{selectedDoc?.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={resetZoom}
                  className="flex items-center gap-1 hover:bg-accent px-2 py-1 rounded transition-colors"
                  title="Reset Zoom"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="hover:bg-accent px-2 py-1 rounded transition-colors"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Image wrapper for centering */}
            <div className="flex items-center justify-center w-full h-full p-4">
              {selectedDoc && (
                <img
                  ref={imageRef}
                  src={selectedDoc.img}
                  alt={selectedDoc.title}
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                  }}
                  onWheel={handleWheel}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FoundingGeneration;