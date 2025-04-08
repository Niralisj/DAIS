import { MessageSquare, ArrowBigUp, Trash2 } from 'lucide-react';
import '../style/6.css'; 

export default function PostCard({ post, onClick, onUpvote, currentUser }) {

    // Use props directly for user checks
    const userIsLoggedIn = !!currentUser;
    const currentUserName = currentUser?.name;
    const isAuthor = userIsLoggedIn && currentUserName === post?.author; 

    // Derived state from props
    const postUpvotedBy = Array.isArray(post?.upvotedBy) ? post.upvotedBy : [];
    const hasUpvoted = userIsLoggedIn && postUpvotedBy.includes(currentUserName);
    const upvoteCount = post?.upvotes ?? 0;
    const commentCount = post?.commentCount ?? 0;

    const handleUpvoteClick = (e) => {
        e.stopPropagation();
        if (userIsLoggedIn) {
            onUpvote(); 
        } else {
            alert("Please log in to upvote.");
        }
    };

    const handleDeleteRequest = (e) => {
        e.stopPropagation(); // Prevent card click
        if (!isAuthor) return; // Should not happen if button isn't rendered, but safe check

        // Dispatch a custom event with the post ID. Forum.js will listen for this.
        if (window.confirm(`Are you sure you want to delete your post "${post.title}"?`)) {
             const deleteEvent = new CustomEvent('deletePostRequest', { detail: post.id });
             window.dispatchEvent(deleteEvent);
             // No need for alert here, Forum.js handles the actual deletion & feedback
        }
    };

    // --- Rendering ---
    if (!post) return null;

    const displayCategories = Array.isArray(post.categories) ? post.categories : (post.category ? [post.category] : []);

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
            onClick={() => onClick(post)}
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-x-4 gap-y-1">
                    {/* Meta Info */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                        {/* ... category/author/date display ... */}
                        {displayCategories.length > 0 && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
                                {displayCategories[0]}
                            </span>
                        )}
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">Posted by {post.author || 'Unknown'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">{post.createdAt || 'Some time ago'}</span>
                    </div>

                    {/* *** Conditional Delete Button for Own Post *** */}
                    {isAuthor && (
                        <button
                            onClick={handleDeleteRequest} // Dispatch event
                            className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-gray-700 transition-colors"
                            title="Delete my post"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Title */}
                <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title || 'Untitled Post'}
                </h2>

                {/* Content Snippet */}
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {post.content || ''}
                </p>

                {/* Actions: Upvote / Comments */}
                <div className="mt-4 flex items-center space-x-4 text-sm">
                    <button
                        className={`flex items-center space-x-1 transition-colors ${!userIsLoggedIn ? 'text-gray-400 cursor-not-allowed' : hasUpvoted ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'}`}
                        onClick={handleUpvoteClick}
                        title={userIsLoggedIn ? (hasUpvoted ? 'Remove upvote' : 'Upvote') : 'Sign in to upvote'}
                        disabled={!userIsLoggedIn}
                    >
                        <ArrowBigUp className={`h-5 w-5 ${hasUpvoted ? 'fill-current' : ''}`} strokeWidth={1.5} />
                        <span>{upvoteCount}</span>
                    </button>

                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400" title="View comments">
                        <MessageSquare className="h-5 w-5" strokeWidth={1.5} />
                        <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}