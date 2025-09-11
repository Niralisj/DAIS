
// src/pages/ForumPage.js
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed
import '../index.css'; // Main CSS with Tailwind imports

// Adjust component import paths as needed
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import CreatePostButton from './components/CreatePostButton';
import CreatePostModal from './components/CreatePostModal';
import PostDialog from './components/PostDialog';

// --- Sample Data and LocalStorage Helpers ---
const samplePosts = [
    // Add sample posts here if needed, or rely solely on localStorage
    { id: '1', title: 'Welcome!', content: 'First post content.', author: 'Admin', categories: ['Announcements'], createdAt: new Date(Date.now() - 7200000).toISOString(), upvotes: 42, commentCount: 2, upvotedBy: [], comments: [{ id: 'c1', postId: '1', content: 'Great platform!', author: 'UserA', createdAt: new Date(Date.now() - 3600000).toISOString(), upvotes: 5, upvotedBy:[], parentId: null }, { id: 'c2', postId: '1', content: 'Looking forward to using it.', author: 'UserB', createdAt: new Date(Date.now() - 1800000).toISOString(), upvotes: 2, upvotedBy:[], parentId: null }, {id: 'c3', postId: '1', content: 'Me too!', author: 'UserA', createdAt: new Date(Date.now() - 600000).toISOString(), upvotes: 1, upvotedBy:[], parentId: 'c2'}] },
    { id: '2', title: 'Best practices', content: 'Engage respectfully!', author: 'Moderator', categories: ['General'], createdAt: new Date(Date.now() - 14400000).toISOString(), upvotes: 28, commentCount: 0, upvotedBy: [], comments: [] },
];

const getStoredPosts = () => {
    const savedPosts = localStorage.getItem('forumPosts');
    try {
        const parsed = savedPosts ? JSON.parse(savedPosts) : samplePosts;
        // Validate and sanitize data structure
        return Array.isArray(parsed) ? parsed.map(p => ({
             id: p.id || `p${Math.random()}`, // Ensure ID exists
             title: p.title || 'Untitled Post',
             content: p.content || '',
             author: p.author || 'Anonymous',
             categories: Array.isArray(p.categories) ? p.categories : [],
             createdAt: p.createdAt || new Date().toISOString(),
             upvotes: typeof p.upvotes === 'number' ? p.upvotes : 0,
             upvotedBy: Array.isArray(p.upvotedBy) ? p.upvotedBy : [],
             comments: Array.isArray(p.comments) ? p.comments.map(c => ({ // Sanitize comments too
                 id: c.id || `c${Math.random()}`,
                 content: c.content || '',
                 author: c.author || 'Anonymous',
                 createdAt: c.createdAt || new Date().toISOString(),
                 upvotes: typeof c.upvotes === 'number' ? c.upvotes : 0,
                 upvotedBy: Array.isArray(c.upvotedBy) ? c.upvotedBy : [],
                 parentId: c.parentId !== undefined ? c.parentId : null, // Ensure parentId exists
                 postId: c.postId || p.id // Ensure postId reference is correct
             })) : [],
             commentCount: Array.isArray(p.comments) ? p.comments.length : 0 // Calculate count
        })) : samplePosts; // Fallback to samples if parsing fails or data is not array
    } catch (e) {
        console.error("Failed to parse stored posts:", e);
        localStorage.removeItem('forumPosts'); // Clear potentially corrupted data
        return samplePosts; // Return default samples
    }
};


const storePosts = (posts) => {
    try {
        // Basic validation before storing
        if (!Array.isArray(posts)) {
            throw new Error("Attempted to store non-array value as posts");
        }
        const postsToStore = posts.map(p => ({
             // Select only necessary fields or ensure structure is correct
             id: p.id,
             title: p.title,
             content: p.content,
             author: p.author,
             categories: p.categories,
             createdAt: p.createdAt,
             upvotes: p.upvotes,
             upvotedBy: p.upvotedBy,
             comments: p.comments, // Assuming comments structure is handled in getStoredPosts/update logic
             commentCount: p.commentCount,
        }));
        localStorage.setItem('forumPosts', JSON.stringify(postsToStore));
        // Dispatch custom event for immediate feedback within the app if needed
        window.dispatchEvent(new Event('postsUpdated'));
    } catch (e) {
        console.error("Failed to store posts:", e);
        // Consider user feedback here, e.g., alert("Could not save changes.")
    }
};
// --- End Helpers ---

function ForumPage() {
    const { user, isAuthenticated, isLoadingUser } = useAuth(); // Removed token as it wasn't directly used here

    // State variables
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null); // Post object or null
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null); // Category name or null
    const [posts, setPosts] = useState(getStoredPosts); // Use lazy initialization

    // --- Effects ---

    // Listener for storage changes (other tabs) and custom 'postsUpdated' event (this tab)
    useEffect(() => {
        const refreshPostsAndSelection = () => {
            console.log("ForumPage: Refreshing posts from storage.");
            const updatedPostsFromStorage = getStoredPosts();
            setPosts(updatedPostsFromStorage);

            // Use functional state update for selectedPost to get the latest value
            setSelectedPost(currentSelected => {
                if (currentSelected) {
                    const refreshedPost = updatedPostsFromStorage.find(p => p.id === currentSelected.id);
                    console.log("ForumPage: Refreshed selected post data:", refreshedPost);
                    return refreshedPost || null; // Close dialog if post was deleted
                }
                return null; // No post was selected
            });
        };

        const handleStorageChange = (event) => {
            if (event.key === 'forumPosts') {
                console.log("ForumPage: 'storage' event detected.");
                refreshPostsAndSelection();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('postsUpdated', refreshPostsAndSelection); // Listen to our custom event

        // Cleanup listeners on component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('postsUpdated', refreshPostsAndSelection);
        };
    }, []); // Empty dependency array: setup listeners once


    // --- Handlers wrapped in useCallback for stable references ---

    const handleCreatePost = useCallback((newPostData) => {
        // Auth check
        if (!isAuthenticated || !user) {
            alert("Please log in to create a post.");
            return;
        }
        console.log("ForumPage: handleCreatePost called.");

        const newPost = {
            id: `p${Date.now()}`,
            ...newPostData, // Should include title, content, categories (array of names)
            author: user.name || 'Anonymous', // Use user info from context
            createdAt: new Date().toISOString(), // Standard format
            upvotes: 0,
            upvotedBy: [],
            comments: [],
            commentCount: 0,
        };

        // Functional update for posts state
        setPosts(currentPosts => {
            const updatedPosts = [newPost, ...currentPosts];
            storePosts(updatedPosts); // Save and dispatch 'postsUpdated'
            return updatedPosts;
        });
        // CreatePostModal handles closing itself via its onClose prop on success
    }, [isAuthenticated, user]); // Dependencies: only need auth state

    const handleUpvotePost = useCallback((postId) => {
        if (!isAuthenticated || !user) {
            alert("Please log in to upvote.");
            return;
        }
        console.log(`ForumPage: handleUpvotePost called for ${postId}`);

        setPosts(currentPosts => {
            let postUpdated = false;
            const updatedPosts = currentPosts.map(post => {
                if (post.id === postId) {
                    postUpdated = true;
                    const upvotedBy = Array.isArray(post.upvotedBy) ? post.upvotedBy : [];
                    const hasUpvoted = upvotedBy.includes(user.name); // Adjust if using user.id
                    const newUpvotes = hasUpvoted ? (post.upvotes || 0) - 1 : (post.upvotes || 0) + 1;
                    const newUpvotedBy = hasUpvoted
                        ? upvotedBy.filter(u => u !== user.name) // Adjust if using user.id
                        : [...upvotedBy, user.name]; // Adjust if using user.id
                    return { ...post, upvotes: Math.max(0, newUpvotes), upvotedBy: newUpvotedBy }; // Prevent negative votes
                }
                return post;
            });

            if (postUpdated) {
                storePosts(updatedPosts); // Save only if a change occurred
            }
            return updatedPosts;
        });
    }, [isAuthenticated, user]); // Dependencies: only need auth state

    const handleDeletePost = useCallback((postIdToDelete) => {
        if (!isAuthenticated || !user) {
            alert("You must be logged in to delete posts.");
            return;
        }
        console.log(`ForumPage: handleDeletePost called for ${postIdToDelete}`);

        // Find post first to check ownership (using functional update to get latest posts)
        setPosts(currentPosts => {
            const postToDelete = currentPosts.find(p => p.id === postIdToDelete);

            if (!postToDelete) {
                console.warn("Delete requested for non-existent post:", postIdToDelete);
                return currentPosts; // No change
            }

            // Authorization check
            if (postToDelete.author !== user.name) { // Adjust if using user.id
                alert("You can only delete your own posts.");
                return currentPosts; // No change
            }

            // Confirmation should happen before calling this handler (e.g., in PostDialog/PostCard)
            // if (!window.confirm(`Are you sure you want to delete the post "${postToDelete.title}"?`)) {
            //     return currentPosts; // User cancelled
            // }

            const remainingPosts = currentPosts.filter(p => p.id !== postIdToDelete);
            storePosts(remainingPosts); // Save changes

            // If the deleted post was the one selected, close the dialog
            // This needs access to setSelectedPost, but functional update works without listing selectedPost as dependency
            setSelectedPost(currentSelected => (currentSelected?.id === postIdToDelete ? null : currentSelected));

            return remainingPosts; // Return the updated state
        });
    }, [isAuthenticated, user]); // Dependencies: only need auth state

    const handleAddComment = useCallback((postId, commentContent, parentId = null) => {
        if (!isAuthenticated || !user) {
            alert("Please log in to comment.");
            return;
        }
        console.log(`ForumPage: handleAddComment to post ${postId}, parent: ${parentId}`);

        const newComment = {
            id: `c${Date.now()}`,
            content: commentContent,
            author: user.name || 'Anonymous', // Use user info
            createdAt: new Date().toISOString(),
            upvotes: 0,
            upvotedBy: [],
            parentId: parentId,
            postId: postId, // Keep reference to parent post
        };

        setPosts(currentPosts => {
            let postUpdated = false;
            const updatedPosts = currentPosts.map(post => {
                if (post.id === postId) {
                    postUpdated = true;
                    // Ensure comments array exists and add the new comment
                    const updatedComments = Array.isArray(post.comments) ? [...post.comments, newComment] : [newComment];
                    return {
                        ...post,
                        comments: updatedComments,
                        commentCount: updatedComments.length // Update count
                    };
                }
                return post;
            });

            if (postUpdated) {
                storePosts(updatedPosts); // Save changes
            }
            return updatedPosts;
        });
        // We removed the immediate setSelectedPost update here.
        // The useEffect listener will catch the 'postsUpdated' event and refresh the dialog data.
    }, [isAuthenticated, user]); // Dependencies: only need auth state

    const handleUpvoteComment = useCallback((postId, commentId) => {
        if (!isAuthenticated || !user) {
            alert("Please log in to upvote comments.");
            return;
        }
        console.log(`ForumPage: handleUpvoteComment for comment ${commentId} on post ${postId}`);

        setPosts(currentPosts => {
            let postFoundAndCommentUpdated = false;
            const updatedPosts = currentPosts.map(post => {
                if (post.id === postId && Array.isArray(post.comments)) {
                    let commentUpdated = false;
                    const updatedComments = post.comments.map(comment => {
                        if (comment.id === commentId) {
                            commentUpdated = true;
                            const upvotedBy = Array.isArray(comment.upvotedBy) ? comment.upvotedBy : [];
                            const hasUpvoted = upvotedBy.includes(user.name); // Adjust if using user.id
                            const newUpvotes = hasUpvoted ? (comment.upvotes || 0) - 1 : (comment.upvotes || 0) + 1;
                            const newUpvotedBy = hasUpvoted
                                ? upvotedBy.filter(u => u !== user.name) // Adjust if using user.id
                                : [...upvotedBy, user.name]; // Adjust if using user.id
                            return { ...comment, upvotes: Math.max(0, newUpvotes), upvotedBy: newUpvotedBy };
                        }
                        return comment;
                    });

                    if (commentUpdated) {
                        postFoundAndCommentUpdated = true;
                        return { ...post, comments: updatedComments }; // Return post with updated comments
                    }
                }
                return post; // Return post unchanged if not the target or no comment updated
            });

            if (postFoundAndCommentUpdated) {
                storePosts(updatedPosts); // Save changes
            }
            return updatedPosts;
        });
        // We removed the immediate setSelectedPost update here.
        // The useEffect listener will catch the 'postsUpdated' event and refresh the dialog data.
    }, [isAuthenticated, user]); // Dependencies: only need auth state

    // Memoized filtering logic
    const filteredPosts = useCallback(() => {
        return posts.filter((post) => {
            // Basic check if post object is valid
            if (!post || typeof post.title !== 'string' || typeof post.content !== 'string') {
                console.warn("Filtering invalid post object:", post);
                return false;
            }
            const lowerSearchQuery = searchQuery.toLowerCase();
            const matchesSearch = searchQuery
                ? (post.title.toLowerCase().includes(lowerSearchQuery) ||
                    post.content.toLowerCase().includes(lowerSearchQuery) ||
                    post.author?.toLowerCase().includes(lowerSearchQuery)) // Optional chaining for author
                : true;
            const matchesCategory = selectedCategory
                ? (Array.isArray(post.categories) && post.categories.includes(selectedCategory))
                : true;
            return matchesSearch && matchesCategory;
        });
    }, [posts, searchQuery, selectedCategory]); // Dependencies for filtering


    // --- Render Logic ---
    if (isLoadingUser) {
        return <div className="flex justify-center items-center min-h-screen text-gray-500">Loading Session...</div>;
    }

    // Get the filtered list for rendering
    const postsToDisplay = filteredPosts();

 
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <main className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
                <div className="grid grid-cols-12 gap-4 lg:gap-8">
                    {/* Sidebar */}
                    <aside className="col-span-12 lg:col-span-3 xl:col-span-2 mb-4 lg:mb-0">
                        <Sidebar
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    </aside>

                    {/* Main Content Area */}
                    <section className="col-span-12 lg:col-span-9 xl:col-span-10 min-w-0">
                        {selectedCategory && (
                            <div className="mb-4 flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Category: <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedCategory}</span>
                                </h2>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                >
                                    Clear filter
                                </button>
                            </div>
                        )}

                        {/* Post List */}
                        <div className="space-y-4">
                            {postsToDisplay.length > 0 ? (
                                postsToDisplay.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        currentUser={user}
                                        onClick={() => setSelectedPost(post)}
                                        onUpvote={() => handleUpvotePost(post.id)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchQuery || selectedCategory
                                            ? 'No posts found matching your criteria.'
                                            : 'No posts yet. Be the first to create one!'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {isAuthenticated && (
                <CreatePostButton onClick={() => setShowCreatePost(true)} />
            )}

            <CreatePostModal
                isOpen={showCreatePost}
                onClose={() => setShowCreatePost(false)}
                onCreatePost={handleCreatePost}
            />

            {selectedPost && (
                <PostDialog
                    key={selectedPost.id}
                    post={selectedPost}
                    currentUser={user}
                    onClose={() => setSelectedPost(null)}
                    onUpvotePost={handleUpvotePost}
                    onDeletePost={handleDeletePost}
                    onAddComment={handleAddComment}
                    onUpvoteComment={handleUpvoteComment}
                />
            )}
        </div>
    );
}
export default ForumPage;