import { MessageSquare, Send, ThumbsUp, X } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, increment } from "firebase/firestore";
import { db } from "../firebase/config";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface Discussion {
  id: string;
  text: string;
  author: string;
  type: "post";
  timestamp: Date;
  upvotes: number;
  upvotedBy: string[]; // Track who upvoted to prevent duplicates
}

interface Comment {
  id: string;
  text: string;
  author: string;
  type: "comment";
  postId: string;
  timestamp: Date;
}

interface FoundingGenDiscussionProps {
  activeTab: string;
}

const FoundingGenDiscussion = ({ activeTab }: FoundingGenDiscussionProps) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPost, setNewPost] = useState({ text: "", author: "" });
  const [newComment, setNewComment] = useState<{ [key: string]: { text: string; author: string } }>({});
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  // Load user's vote history from localStorage
  useEffect(() => {
    const savedVotes = localStorage.getItem('discussionVotes');
    if (savedVotes) {
      setUserVotes(new Set(JSON.parse(savedVotes)));
    }
  }, []);

  useEffect(() => {
    if (activeTab === "discussions") {
      loadDiscussions();
    }
  }, [activeTab]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const discussionsRef = collection(db, "discussions");
      
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
        upvotes: doc.data().upvotes || 0,
        upvotedBy: doc.data().upvotedBy || [],
      })) as Discussion[];

      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Comment[];

      // Sort by upvotes first, then by comment count, then by date
      postsData.sort((a, b) => {
        const aCommentCount = commentsData.filter(c => c.postId === a.id).length;
        const bCommentCount = commentsData.filter(c => c.postId === b.id).length;
        
        // Primary: upvotes (descending)
        if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
        
        // Secondary: comment count (descending)
        if (bCommentCount !== aCommentCount) return bCommentCount - aCommentCount;
        
        // Tertiary: date (newest first)
        return b.timestamp.getTime() - a.timestamp.getTime();
      });

      commentsData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      console.log("Loaded discussions:", postsData.length, "posts and", commentsData.length, "comments");

      setDiscussions(postsData);
      setComments(commentsData);
    } catch (err) {
      console.error("Error loading discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId: string) => {
    // Check if user already voted
    if (userVotes.has(postId)) {
      return; // Already voted
    }

    try {
      const postRef = doc(db, "discussions", postId);
      await updateDoc(postRef, {
        upvotes: increment(1)
      });

      // Update local state
      const newVotes = new Set(userVotes);
      newVotes.add(postId);
      setUserVotes(newVotes);
      localStorage.setItem('discussionVotes', JSON.stringify([...newVotes]));

      // Refresh discussions
      await loadDiscussions();
    } catch (err) {
      console.error("Error upvoting post:", err);
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
        upvotes: 0,
        upvotedBy: [],
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

  return (
    <div className="space-y-6">
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
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-foreground text-lg">Recent Discussions</h4>
            <p className="text-xs text-muted-foreground">Sorted by upvotes & activity</p>
          </div>
          
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
              const hasVoted = userVotes.has(post.id);

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
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Upvote Button */}
                        <Button
                          variant={hasVoted ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpvote(post.id)}
                          disabled={hasVoted}
                          className="gap-2 text-xs"
                        >
                          <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} />
                          {post.upvotes > 0 && <span>{post.upvotes}</span>}
                          <span>{hasVoted ? 'Upvoted' : 'Upvote'}</span>
                        </Button>

                        {/* Comments Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                          className="gap-2 text-xs hover:bg-secondary"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {postComments.length} {postComments.length === 1 ? "Comment" : "Comments"}
                        </Button>
                      </div>

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
    </div>
  );
};

export default FoundingGenDiscussion;