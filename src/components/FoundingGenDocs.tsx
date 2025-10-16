import { X, Search, Upload, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import ManifestJoe from "../assets/ManifestJoe.jpg";
import Census1910 from "../assets/1910Census.png";
import Census1920 from "../assets/1920Census.png";
import Census1930 from "../assets/1930Census.jpg";
import Census1940 from "../assets/1940Census.png";
import Census1950 from "../assets/1950Census.png";
import GiuseppeBirth from "../assets/GiuseppeBirth.png";
import NinfaBirth from "../assets/NinfaBirth.png";
import wedding from "../assets/wedding.png";
import Death1957Zoom from "../assets/1957Deathzoom.png";
import FamilyPic from "../assets/FamilyPic.jpg";
import Sentinel1927 from "../assets/The_Milwaukee_Sentinel1927.jpg";

interface UserDocument {
  id: string;
  title: string;
  description: string;
  imageData: string; // Base64 data URL
  uploadedBy: string;
  uploadDate: Date;
}

const FoundingGenDocs = () => {
  const [selectedDoc, setSelectedDoc] = useState<{ img: string; title: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    uploadedBy: "",
    file: null as File | null,
    preview: "",
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const historicalDocuments = [
    { img: GiuseppeBirth, title: "Birth Certificate of Giuseppe Pusateri", desc: "Born on December 12th 1880", isHistorical: true },
    { img: NinfaBirth, title: "Birth Certificate of Ninfa “Miceli”", desc: "See line 22 for Giuseppe Pusateri", isHistorical: true },
    { img: wedding, title: "Marriage certificate", desc: "Giuseppe Pusateri and Ninfa Miceli Marriage certificate from Decmeber 23rd 1899", isHistorical: true },
    { img: ManifestJoe, title: "List of Alien Immigrants", desc: "See line 22 for Giuseppe Pusateri", isHistorical: true },
    { img: Census1910, title: "1910 U.S. Census", desc: "Shows Giuseppe listed as Pusateri in Milwaukee.", isHistorical: true },
    { img: Census1920, title: "1920 U.S. Census", desc: "Name changes to Busateri after arrival in the U.S.", isHistorical: true },
    { img: Census1930, title: "1930 U.S. Census", desc: "Continued Census family records in Milwaukee.", isHistorical: true },
    { img: Census1940, title: "1940 U.S. Census", desc: "Continued Census family records in Milwaukee.", isHistorical: true },
    { img: Census1950, title: "1950 U.S. Census", desc: "Final census before Giuseppe's passing.", isHistorical: true },
    { img: Death1957Zoom, title: "1957 Obituary", desc: "Obituary from newspaper in 1957", isHistorical: true },
    { img: FamilyPic, title: "Family Photo", desc: "Portrait of Giuseppe and Ninfa 1920s Milwaukee.", isHistorical: true },
    { img: Sentinel1927, title: "The Milwaukee Sentinel (1927)", desc: "Newspaper reference to Busateri family events.", isHistorical: true },
  ];

  useEffect(() => {
    loadUserDocuments();
  }, []);

  useEffect(() => {
    setZoomLevel(1);
  }, [selectedDoc]);

  const loadUserDocuments = async () => {
    try {
      const docsRef = collection(db, "user_documents");
      const docsQuery = query(docsRef, orderBy("uploadDate", "desc"));
      const snapshot = await getDocs(docsQuery);
      
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate() || new Date(),
      })) as UserDocument[];

      setUserDocuments(docs);
    } catch (err) {
      console.error("Error loading user documents:", err);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if too large (max 1200px on longest side)
          const maxSize = 1200;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with 0.7 quality for smaller size
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          // Check if under 800KB (safe for Firestore)
          if (dataUrl.length > 800000) {
            // Try again with lower quality
            resolve(canvas.toDataURL('image/jpeg', 0.5));
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const compressed = await compressImage(file);
        setUploadForm({ ...uploadForm, file, preview: compressed });
      } catch (err) {
        console.error("Error processing image:", err);
        alert('Error processing image. Please try a different file.');
      }
    } else {
      alert('Please select an image file (JPG, PNG, etc.)');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title.trim() || !uploadForm.preview) return;

    try {
      setUploading(true);

      // Save document with base64 image data to Firestore
      await addDoc(collection(db, "user_documents"), {
        title: uploadForm.title,
        description: uploadForm.description,
        imageData: uploadForm.preview, // Base64 data URL
        uploadedBy: uploadForm.uploadedBy.trim() || "Anonymous",
        uploadDate: new Date(),
      });

      // Reset form
      setUploadForm({ title: "", description: "", uploadedBy: "", file: null, preview: "" });
      setShowUploadForm(false);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Reload documents
      await loadUserDocuments();
    } catch (err) {
      console.error("Error uploading document:", err);
      alert("Error uploading document. The file might be too large. Please try a smaller image.");
    } finally {
      setUploading(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setZoomLevel((prev) => {
      const newZoom = Math.min(Math.max(prev + delta, 0.5), 3);
      return newZoom;
    });
  };

  const resetZoom = () => setZoomLevel(1);

  return (
    <>
      <div className="space-y-6">
        <div className="bg-card p-8 rounded-lg vintage-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-primary">Historical Documents</h3>
            <Button onClick={() => setShowUploadForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Upload Document</span>
              <span className="sm:hidden">Upload</span>
            </Button>
          </div>

          {/* Historical Documents Section */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-foreground">Original Historical Records</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {historicalDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedDoc({ img: doc.img, title: doc.title })}
                >
                  <img src={doc.img} alt={doc.title} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <p className="font-semibold text-foreground">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Uploaded Documents Section */}
          {userDocuments.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Family Contributions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {userDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="border-2 border-accent rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedDoc({ img: doc.imageData, title: doc.title })}
                  >
                    <img src={doc.imageData} alt={doc.title} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <p className="font-semibold text-foreground">{doc.title}</p>
                      <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                      <p className="text-xs text-muted-foreground italic">
                        Uploaded by {doc.uploadedBy} on {doc.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-8 text-sm text-muted-foreground italic text-center">
            These historical records relate to Giuseppe (Joseph) and Ninfa "Miceli" Busateri, from Sicily or Milwaukee between 1880 - 1957.
          </p>
        </div>
      </div>

      {/* Upload Form Dialog */}
      <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleUploadSubmit} className="space-y-4 pb-4">
            <h3 className="text-xl font-bold text-primary">Upload a Family Document</h3>
            <p className="text-sm text-muted-foreground">
              Share photos, documents, or records related to the Busateri family history. If the file is too big email it to blakebusateri@gmail.com 
            </p>

            <div>
              <Label htmlFor="doc-file">Document Image * (Max 5MB recommended)</Label>
              <Input
                id="doc-file"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                required
              />
              {uploadForm.preview && (
                <div className="mt-2">
                  <img 
                    src={uploadForm.preview} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded border border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ✓ Image ready to upload
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="doc-title">Document Title *</Label>
              <Input
                id="doc-title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="e.g., Family Wedding Photo 1950"
                required
              />
            </div>

            <div>
              <Label htmlFor="doc-desc">Description</Label>
              <Textarea
                id="doc-desc"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Describe what this document shows..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="doc-uploader">Your Name (optional)</Label>
              <Input
                id="doc-uploader"
                value={uploadForm.uploadedBy}
                onChange={(e) => setUploadForm({ ...uploadForm, uploadedBy: e.target.value })}
                placeholder="Leave blank to remain anonymous"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowUploadForm(false);
                  setUploadForm({ title: "", description: "", uploadedBy: "", file: null, preview: "" });
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading || !uploadForm.preview} className="flex-1 gap-2">
                {uploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className={`relative w-full h-full flex items-center justify-center transition-all duration-200 ${
            zoomLevel > 1 ? 'overflow-auto' : 'overflow-hidden'
          }`}>
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
    </>
  );
};

export default FoundingGenDocs;