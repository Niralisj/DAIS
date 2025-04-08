// src/components/CreatePostButton.js
import React from 'react';
import { Plus } from 'lucide-react';

// Assuming Tailwind is set up globally
export default function CreatePostButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      // Example Tailwind classes for a Floating Action Button (FAB) style
      className="fixed bottom-6 right-6 inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors z-30" // Added z-index
      title="Create New Post"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}