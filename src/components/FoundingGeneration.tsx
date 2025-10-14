import { FileText, Info, X, Search, MessageSquare, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase/config";
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import ManifestJoe from "../assets/ManifestJoe.jpg";
import Census1910 from "../assets/1910Census.png";
import Census1920 from "../assets/1920Census.png";
import Census1930 from "../assets/1930Census.jpg";
import Census1940 from "../assets/1940Census.png";
import Census1950 from "../assets/1950Census.png";
import Death1957Zoom from "../assets/1957Deathzoom.png";
import FamilyPic from "../assets/FamilyPic.jpg";
import Sentinel1927 from "../assets/The_Milwaukee_Sentinel1927.jpg";

interface Discussion {
  id: string;
  text: string;
  author: string;
  type: "post";
  timestamp: Date;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  type: "comment";
  postId: string;
  timestamp: Date;
}

const FoundingGeneration = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [selectedDoc, setSelectedDoc] = useState<{ img: string; title: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  // Discussion board state
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPost, setNewPost] = useState({ text: "", author: "" });
  const [newComment, setNewComment] = useState<{ [key: string]: { text: string; author: string } }>({});
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const documents = [
    { img: ManifestJoe, title: "List of Alien Immigrants", desc: "See line 22 for Giuseppe Pusateri" },
    { img: Census1910, title: "1910 U.S. Census", desc: "Shows Giuseppe listed as Pusateri in Milwaukee." },
    { img: Census1920, title: "1920 U.S. Census", desc: "Name changes to Busateri after arrival in the U.S." },
    { img: Census1930, title: "1930 U.S. Census", desc: "Continued Census family records in Milwaukee." },
    { img: Census1940, title: "1940 U.S. Census", desc: "Continued Census family records in Milwaukee." },
    { img: Census1950, title: "1950 U.S. Census", desc: "Final census before Giuseppe's passing." },
    { img: Death1957Zoom, title: "1957 Obituary", desc: "Obituary from newspaper in 1957" },
    { img: FamilyPic, title: "Family Photo", desc: "Portrait of Giuseppe and Ninfa 1920s Milwaukee." },
    { img: Sentinel1927, title: "The Milwaukee Sentinel (1927)", desc: "Newspaper reference to Busateri family events." },
  ];

  // Load discussions and comments
  useEffect(() => {
    if (activeTab === "discussions") {
      loadDiscussions();
    }
  }, [activeTab]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const discussionsRef = collection(db, "discussions");
      
      // Simplified queries without orderBy to avoid index requirements
      const postsQuery = query(discussionsRef, where("type", "==", "post"));
      const commentsQuery = query(discussionsRef, where("type", "==", "comment"));

      const [postsSnapshot, commentsSnapshot] = await Promise.all([
        getDocs(postsQuery),
        getDocs(commentsQuery)
      ]);

      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Discussion[];

      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Comment[];

      // Sort in memory instead of in query
      postsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      commentsData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      console.log("Loaded discussions:", postsData.length, "posts and", commentsData.length, "comments");
      console.log("Posts:", postsData);

      setDiscussions(postsData);
      setComments(commentsData);
    } catch (err) {
      console.error("Error loading discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.text.trim()) return;

    try {
      await addDoc(collection(db, "discussions"), {
        text: newPost.text,
        author: newPost.author.trim() || "Anonymous",
        type: "post",
        timestamp: new Date(),
      });

      setNewPost({ text: "", author: "" });
      setIsPostExpanded(false);
      await loadDiscussions();
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const comment = newComment[postId];
    if (!comment || !comment.text.trim()) return;

    try {
      await addDoc(collection(db, "discussions"), {
        text: comment.text,
        author: comment.author.trim() || "Anonymous",
        type: "comment",
        postId: postId,
        timestamp: new Date(),
      });

      setNewComment({ ...newComment, [postId]: { text: "", author: "" } });
      await loadDiscussions();
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  const getCommentsForPost = (postId: string) => {
    return comments.filter(c => c.postId === postId);
  };

  useEffect(() => {
    setZoomLevel(1);
  }, [selectedDoc]);

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

          <TabsContent value="info" className="space-y-6">
            <div className="bg-card p-8 rounded-lg vintage-shadow text-center">
              <div className="flex justify-center mb-8">
                <img
                  src={FamilyPic}
                  alt="Giuseppe and Ninfa Busateri Family"
                  className="rounded-xl shadow-md max-w-md w-full object-cover border border-border"
                />
              </div>
              <div className="prose prose-lg max-w-none text-foreground">
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  Giuseppe (Joseph) and Ninfa Pusateri's journey began in Saint Agnes, Sicily—today known as the seaside town of Sant'Agata di Militello, nestled along Sicily's northern coast in the Metropolitan City of Messina. At the turn of the 20th century, and at only 20 years old, they looked toward America for a better life. Giuseppe (Joseph) left first in 1901, departing from Napoli aboard the S.S. Washington. After weeks aboard a crowded steamship, he arrived at the Port of New York through Ellis Island, with his destination listed as Milwaukee, Wisconsin.
                </p>
                
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  Ninfa followed soon after, around 1905, braving the same ocean voyage to reunite with her husband. Together, they built a new life in Milwaukee—carrying with them their Sicilian faith, language, and traditions that would root the Busateri family's story in America. Giuseppe and Ninfa remained in and around Milwaukee, raising 15 children over 23 years. Giuseppe (Joseph) worked for the Wisconsin Transport Company for 44 years before retiring. He passed away in 1957, followed by Ninfa in 1968.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Their surname transitioned from Pusateri to Busateri sometime after their arrival, a change reflected in census records—Giuseppe (Joseph) signed "Pusateri" in 1910 and "Busateri" in 1920. (See document section for source references.)
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
                These historical records trace the Busateri family's journey from Sicily to Milwaukee between 1910 and 1957.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            <div className="bg-card p-4 md:p-8 rounded-lg vintage-shadow">
              <h3 className="text-2xl font-bold mb-6 text-primary">Family Discussion Board</h3>
              
              {/* Compact New Post Form */}
              <form onSubmit={handlePostSubmit} className="mb-6">
                {!isPostExpanded ? (
                  <div 
                    onClick={() => setIsPostExpanded(true)}
                    className="w-full p-3 md:p-4 border-2 border-border rounded-lg bg-secondary/30 cursor-text hover:bg-secondary/50 hover:border-primary/50 transition-all"
                  >
                    <p className="text-muted-foreground text-sm md:text-base">
                      💭 Share a memory, ask a question, or start a discussion...
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-secondary/50 rounded-lg space-y-3 border-2 border-primary/30 shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-foreground">New Post</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsPostExpanded(false);
                          setNewPost({ text: "", author: "" });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="post-text">Your Message *</Label>
                      <Textarea
                        id="post-text"
                        value={newPost.text}
                        onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                        placeholder="Share a memory, ask a question, or start a discussion..."
                        className="min-h-[100px]"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <Label htmlFor="post-author">Your Name (optional)</Label>
                      <Input
                        id="post-author"
                        value={newPost.author}
                        onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                        placeholder="Leave blank to post anonymously"
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      <Send className="h-4 w-4" />
                      Post
                    </Button>
                  </div>
                )}
              </form>

              {/* Discussion Posts */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground text-lg mb-4">Recent Discussions</h4>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-2 text-muted-foreground">Loading discussions...</p>
                  </div>
                ) : discussions.length === 0 ? (
                  <div className="text-center py-12 bg-secondary/20 rounded-lg border-2 border-dashed border-border">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground text-lg font-medium">No discussions yet</p>
                    <p className="text-muted-foreground text-sm mt-2">Be the first to start one!</p>
                  </div>
                ) : (
                  discussions.map((post) => {
                    const postComments = getCommentsForPost(post.id);
                    const isExpanded = expandedPost === post.id;

                    return (
                      <div key={post.id} className="p-4 md:p-5 bg-background border-2 border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <p className="font-bold text-foreground text-base">{post.author}</p>
                              <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                                {post.timestamp.toLocaleDateString()} • {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-foreground mb-4 break-words whitespace-pre-wrap leading-relaxed">{post.text}</p>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                              className="gap-2 text-xs -ml-2 hover:bg-secondary"
                            >
                              <MessageSquare className="h-4 w-4" />
                              {postComments.length} {postComments.length === 1 ? "Comment" : "Comments"}
                            </Button>

                            {isExpanded && (
                              <div className="mt-4 space-y-3 pl-0 md:pl-4 md:border-l-4 border-primary/30">
                                {postComments.length > 0 && postComments.map((comment) => (
                                  <div key={comment.id} className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-secondary/30 rounded-lg border border-border">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                                      {comment.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <p className="font-semibold text-sm text-foreground">{comment.author}</p>
                                        <span className="text-xs text-muted-foreground">
                                          {comment.timestamp.toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-foreground break-words whitespace-pre-wrap leading-relaxed">{comment.text}</p>
                                    </div>
                                  </div>
                                ))}

                                <div className="mt-4 space-y-2 p-3 md:p-4 bg-background rounded-lg border-2 border-border">
                                  <Label className="text-sm">Add a comment</Label>
                                  <Textarea
                                    value={newComment[post.id]?.text || ""}
                                    onChange={(e) => setNewComment({
                                      ...newComment,
                                      [post.id]: { ...newComment[post.id], text: e.target.value }
                                    })}
                                    placeholder="Share your thoughts..."
                                    className="min-h-[60px] text-sm"
                                  />
                                  <Input
                                    value={newComment[post.id]?.author || ""}
                                    onChange={(e) => setNewComment({
                                      ...newComment,
                                      [post.id]: { ...newComment[post.id], text: newComment[post.id]?.text || "", author: e.target.value }
                                    })}
                                    placeholder="Your name (optional)"
                                    className="text-sm"
                                  />
                                  <Button
                                    onClick={() => handleCommentSubmit(post.id)}
                                    size="sm"
                                    className="w-full gap-2"
                                    disabled={!newComment[post.id]?.text?.trim()}
                                  >
                                    <Send className="h-3 w-3" />
                                    Post Comment
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
    </section>
  );
};

export default FoundingGeneration;