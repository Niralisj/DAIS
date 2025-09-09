import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import '../index.css';
// Adjust import paths based on your structure
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import CreatePostButton from '../components/CreatePostButton';
import WelcomeModal from '../components/WelcomeModal';
import CreatePostModal from '../components/CreatePostModal';
import PostDialog from '../components/PostDialog';

// Sample posts and localStorage helpers (Keep as before)
const samplePosts = [
    {
        id: '1',
        title: 'Welcome to ForumFlow!',
        content:
            'This is our brand new forum platform. We hope you enjoy the clean and modern interface. Feel free to explore and share your thoughts!',
        author: 'Admin',
        categories: ['Announcements'], // Using array for categories
        createdAt: '2h ago',
        upvotes: 42,
        commentCount: 12, // Maintain comment count
        upvotedBy: [], // List of users who upvoted
        comments: [], // Placeholder for comments if managing locally
    },
    {
        id: '2',
        title: 'Best practices for forum engagement',
        content:
            'Here are some tips on how to get the most out of our community: Be kind, stay relevant, and contribute meaningfully to discussions.',
        author: 'Moderator',
        categories: ['General Discussion'],
        createdAt: '4h ago',
        upvotes: 28,
        commentCount: 8,
        upvotedBy: [],
        comments: [],
    },
    {
        id: '3',
        title: 'How do I customize my profile?',
        content:
            "I'm new here and wondering how to add an avatar and customize my profile settings. Any help would be appreciated!",
        author: 'NewUser123',
        categories: ['Questions & Help'],
        createdAt: '6h ago',
        upvotes: 15,
        commentCount: 5,
        upvotedBy: [],
        comments: [],
    },
];

// Helper functions to interact with localStorage for posts
const getStoredPosts = () => {
    const savedPosts = localStorage.getItem('forumPosts');
    try {
        // Ensure structure matches expected format, especially `categories` and `upvotedBy`
        const parsed = savedPosts ? JSON.parse(savedPosts) : samplePosts;
        return Array.isArray(parsed) ? parsed.map(p => ({
            ...p,
            categories: Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []), // Ensure categories is array
            upvotedBy: Array.isArray(p.upvotedBy) ? p.upvotedBy : [], // Ensure upvotedBy is array
            commentCount: p.commentCount || 0, // Ensure commentCount exists
            comments: Array.isArray(p.comments) ? p.comments : [] // Ensure comments array exists
        })) : samplePosts;
    } catch (e) {
        console.error("Failed to parse stored posts:", e);
        return samplePosts; // Fallback to sample posts on parse error
    }
};

const storePosts = (posts) => {
    try {
        localStorage.setItem('forumPosts', JSON.stringify(posts));
        // Dispatch event AFTER storing
        window.dispatchEvent(new Event('postsUpdated'));
    } catch (e) {
        console.error("Failed to store posts:", e);
    }
};

function ForumPage() {
    // *** Use AuthContext instead of local user state ***
    const { user, isAuthenticated, isLoadingUser} = useAuth();

    const [showWelcome, setShowWelcome] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [posts, setPosts] = useState(getStoredPosts);

    // --- Remove local fetchUser useEffect, AuthContext handles it ---

    // --- Welcome Modal Logic (Keep as before) ---
    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, []);

    // --- Listener for 'postsUpdated' (Keep as before) ---
    useEffect(() => {
        const handlePostUpdate = () => {
            console.log("Forum: postsUpdated event received, reloading posts from localStorage.");
            const updatedPostsFromStorage = getStoredPosts();
            setPosts(updatedPostsFromStorage);

            // If a post dialog is open, update its data too
            if (selectedPost) {
                const refreshedSelectedPost = updatedPostsFromStorage.find((p) => p.id === selectedPost.id);
                // If the post still exists, update it, otherwise close the dialog
                setSelectedPost(refreshedSelectedPost || null);
            }
        };

        window.addEventListener('postsUpdated', handlePostUpdate);
        // Cleanup listener
        return () => window.removeEventListener('postsUpdated', handlePostUpdate);
    }, [selectedPost]);

    // --- Close Welcome Modal (Keep as before) ---
    const handleCloseWelcome = () => {
        localStorage.setItem('hasSeenWelcome', 'true');
        setShowWelcome(false);
    };

    // --- Create Post (Use user from context) ---
    const handleCreatePost = (newPostData) => {
        if (!isAuthenticated || !user) { // Use context state
            alert("Please log in to create a post.");
            return;
        }
        const post = {
            id: Date.now().toString(),
            ...newPostData,
            author: user.name || 'Anonymous', // Use context user's name
            createdAt: new Date().toLocaleString(),
            upvotes: 0,
            commentCount: 0,
            upvotedBy: [],
            comments: [],
        };
        const updatedPosts = [post, ...posts];
        setPosts(updatedPosts);
        storePosts(updatedPosts);
    };

    // --- Upvote Post (Use user from context) ---
    const handleUpvotePost = (postId) => {
        if (!isAuthenticated || !user) { // Use context state
            alert("Please log in to upvote.");
            return;
        }
        const updatedPosts = posts.map((post) => {
            if (post.id === postId) {
                const upvotedBy = Array.isArray(post.upvotedBy) ? post.upvotedBy : [];
                const hasUpvoted = upvotedBy.includes(user.name);
                return {
                    ...post,
                    upvotes: hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
                    upvotedBy: hasUpvoted
                        ? upvotedBy.filter((u) => u !== user.name)
                        : [...upvotedBy, user.name],
                };
            }
            return post;
        });
        setPosts(updatedPosts);
        storePosts(updatedPosts);
    };

    // --- Delete Own Post Logic (Use user from context) ---
    const handleDeletePost = useCallback((postIdToDelete) => {
        if (!isAuthenticated || !user) { // Use context state
            alert("You must be logged in to delete posts.");
            return;
        }
        const postToDelete = posts.find(p => p.id === postIdToDelete);
        if (!postToDelete) return;
        if (postToDelete.author !== user.name) { // Use context user's name
            alert("You can only delete your own posts.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the post "${postToDelete.title}"?`)) {
            const remainingPosts = posts.filter(p => p.id !== postIdToDelete);
            setPosts(remainingPosts);
            storePosts(remainingPosts);
            if (selectedPost && selectedPost.id === postIdToDelete) {
                setSelectedPost(null);
            }
        }
    }, [user, isAuthenticated, posts, selectedPost]); // Add isAuthenticated dependency

    // --- Listener for delete request from PostCard (Keep as before) ---
    useEffect(() => {
        const handleDeleteRequest = (event) => {
             const postId = event.detail;
             handleDeletePost(postId);
        };
        window.addEventListener('deletePostRequest', handleDeleteRequest);
        return () => window.removeEventListener('deletePostRequest', handleDeleteRequest);
    }, [handleDeletePost]);

    // --- Filter Posts (Keep as before) ---
    const filteredPosts = posts.filter((post) => {
        const matchesSearch = searchQuery
            ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.content.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchesCategory = selectedCategory
            ? Array.isArray(post.categories) && post.categories.includes(selectedCategory)
            : true;
        return matchesSearch && matchesCategory;
    });

    // --- Render Logic ---
    if (isLoadingUser) { // Use loading state from context
        return <div className="loading-container">Loading Session...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
             {/* Header now relies on AuthContext internally */}
            <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <main className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
                <div className="lg:flex lg:gap-8">
                     {/* Sidebar also relies on AuthContext internally */}
                    <Sidebar
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        // Pass available categories if needed, Sidebar fetches its own now
                        // availableCategories={[...new Set(posts.flatMap(p => p.categories))]}
                    />

                    <div className="flex-1 min-w-0">
                        {selectedCategory && (
                            <div className="mb-4 flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded shadow-sm">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Category: <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedCategory}</span>
                                </h2>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Clear filter
                                </button>
                            </div>
                        )}
                        <div className="space-y-4">
                            {filteredPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    // Pass user from CONTEXT down as currentUser
                                    currentUser={user}
                                    onClick={() => setSelectedPost(post)}
                                    onUpvote={() => handleUpvotePost(post.id)}
                                />
                            ))}
                            {filteredPosts.length === 0 && (
                                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded shadow">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No posts found matching your criteria.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

             {/* Show create button only if authenticated */}
            {isAuthenticated && <CreatePostButton onClick={() => setShowCreatePost(true)} />}

            <WelcomeModal isOpen={showWelcome} onClose={handleCloseWelcome} />

             {/* Ensure CreatePostModal uses useAuth if needed for its category fetch */}
            <CreatePostModal
                isOpen={showCreatePost}
                onClose={() => setShowCreatePost(false)}
                onCreatePost={handleCreatePost}
            />

             {/* Ensure PostDialog relies on currentUser prop */}
            {selectedPost && (
                <PostDialog
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onUpvote={() => handleUpvotePost(selectedPost.id)}
                    currentUser={user} // Pass user from CONTEXT
                    onDeletePost={handleDeletePost}
                    onUpdateComments={(postId, updatedComments) => {
                        const updatedPosts = posts.map(p => {
                            if (p.id === postId) {
                                return { ...p, comments: updatedComments, commentCount: updatedComments.length };
                            }
                            return p;
                        });
                        setPosts(updatedPosts);
                        storePosts(updatedPosts);
                    }}
                />
            )}
        </div>
    );
}

export default ForumPage;