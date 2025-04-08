// src/components/CommentThread.js
import React, { useState } from 'react';
import { ArrowBigUp, MessageSquare } from 'lucide-react';
import CommentInput from './CommentInput'; // Make sure the path is correct

// Assuming Tailwind is set up globally

export default function CommentThread({
    comment,
    postId, // Need postId to call handlers correctly
    allComments, // All comments for *this* post, passed from PostDialog
    onUpvoteComment, // Handler from ForumPage via PostDialog
    onAddComment, // Handler from ForumPage via PostDialog
    currentUser, // User object from AuthContext
    depth = 0, // For indentation
}) {
    const [isReplying, setIsReplying] = useState(false);

    // Filter direct replies from the passed 'allComments' specific to this post
    const replies = allComments.filter(c => c.parentId === comment.id);

    // Check if the *current user* has upvoted. Adjust 'currentUser.name' if needed.
    const hasUpvoted = currentUser && comment.upvotedBy && comment.upvotedBy.includes(currentUser.name);
    const canInteract = !!currentUser; // Can the user upvote/reply?

    const handleReplyClick = () => {
        if (!canInteract) return;
        setIsReplying(prev => !prev); // Toggle local reply input visibility
    };

    const handleReplySubmit = (content) => {
        console.log(`CommentThread: handleReplySubmit for commentId=${comment.id}, parentId=${comment.id}`); // Debug
        // Call the main handler passed down, providing postId, content, and the parent comment's ID
        onAddComment(postId, content, comment.id);
        setIsReplying(false); // Hide input after submitting
    };

    const handleReplyCancel = () => {
        setIsReplying(false); // Hide input on cancel
    };

    const handleUpvoteClick = () => {
         if (!canInteract) return;
         console.log(`CommentThread: handleUpvoteClick for commentId=${comment.id}`); // Debug
         // Call the main upvote handler, providing postId and this comment's ID
         onUpvoteComment(postId, comment.id);
    }

    // Calculate indentation using Tailwind margin based on depth
    const indentClass = depth > 0 ? `ml-${depth * 4}` : ''; // e.g., ml-4, ml-8, ml-12 (adjust multiplier 4 as needed)

    return (
        <div className={`comment-thread mt-3 ${indentClass}`}> {/* Added mt-3 and dynamic margin */}
             {/* Main container for a single comment - styled with Tailwind */}
            <div className="comment-container bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm border border-gray-200 dark:border-gray-700">
                 {/* Comment Meta */}
                <div className="comment-meta text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{comment.author || 'Anonymous'}</span>
                    <span className="mx-1"> • </span>
                    <span>{comment.createdAt || 'Just now'}</span>
                     {comment.parentId && <span className="italic ml-2">(reply)</span>} {/* Indicate if it's a reply */}
                </div>

                 {/* Comment Content */}
                <p className="comment-content text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words mb-2">
                    {comment.content}
                </p>

                 {/* Comment Actions */}
                <div className="comment-actions flex items-center space-x-3 text-xs">
                    {/* Upvote Button */}
                    <button
                        onClick={handleUpvoteClick}
                        className={`flex items-center space-x-1 transition-colors duration-150 ${!canInteract ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : hasUpvoted ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
                        title={canInteract ? (hasUpvoted ? 'Remove upvote' : 'Upvote') : 'Log in to upvote'}
                        disabled={!canInteract}
                    >
                        <ArrowBigUp size={14} fill={hasUpvoted ? 'currentColor' : 'none'} strokeWidth={hasUpvoted? 2.5 : 2} />
                        <span>{comment.upvotes != null ? comment.upvotes : 0}</span>
                    </button>

                    {/* Reply Button */}
                    {canInteract && (
                        <button
                            onClick={handleReplyClick}
                            className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                            title="Reply to this comment"
                        >
                            <MessageSquare size={14} strokeWidth={2} />
                            {/* Change text based on state - minor visual cue */}
                            {/* <span>{isReplying ? 'Cancel' : 'Reply'}</span> */}
                             <span>Reply</span>
                        </button>
                    )}
                    {/* Add Delete/Edit buttons here if needed, checking permissions */}
                    {/* e.g., {currentUser && currentUser.name === comment.author && (<button className="text-red-500...">Delete</button>)} */}
                </div>

                {/* Conditionally render Reply Input */}
                {isReplying && (
                    <div className="reply-input-container mt-2"> {/* Keep margin */}
                        <CommentInput
                            onSubmit={handleReplySubmit}
                            onCancel={handleReplyCancel} // Pass the cancel handler
                            placeholder={`Replying to ${comment.author || 'Anonymous'}...`}
                            buttonText="Post Reply"
                            autoFocus // Focus when it appears
                        />
                    </div>
                )}
            </div>

            {/* Render Replies Recursively */}
            {replies.length > 0 && (
                // This div HOLDS the nested replies
                <div className="comment-replies mt-3"> {/* Add margin for visual separation */}
                    {replies.map(reply => (
                        <CommentThread
                            key={reply.id}
                            comment={reply}
                            postId={postId} // Pass postId down
                            allComments={allComments} // Pass down the filtered list for *this post*
                            onUpvoteComment={onUpvoteComment} // Pass handler down
                            onAddComment={onAddComment} // Pass handler down
                            currentUser={currentUser}
                            depth={depth + 1} // Increment depth
                        />
                    ))}
                </div>
            )}
        </div>
    );
}