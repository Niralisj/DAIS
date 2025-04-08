// src/components/CommentInput.js
import React, { useState } from 'react';

export default function CommentInput({
    onSubmit,
    placeholder = 'Write a comment...',
    buttonText = 'Comment',
    initialValue = '',
    onCancel,
    autoFocus = false
}) {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      console.log("CommentInput: Submitting content:", content.trim()); // Debug log
      onSubmit(content.trim());
      setContent(''); // Clear after successful submit
    } else {
       console.log("CommentInput: Submit prevented, content empty."); // Debug log
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2"> {/* Added space-y for spacing */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={3}
        // Tailwind classes for the textarea
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        required // Make textarea required to enable submit button based on content
      />
      {/* Button container */}
      <div className="flex justify-end items-center space-x-3">
        {/* Optional Cancel Button */}
        {onCancel && (
           <button
            type="button"
            onClick={onCancel}
             // Tailwind classes for a secondary/cancel button
            className="rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
           >
             Cancel
           </button>
        )}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={!content.trim()} // Disable if content (after trimming) is empty
           // Tailwind classes for the primary submit button
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}