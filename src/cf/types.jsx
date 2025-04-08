export function getAllCategories() {
    const DEFAULT_CATEGORIES = [
      { id: '1', name: 'General Discussion', count: 0 },
      { id: '2', name: 'Announcements', count: 0 },
      { id: '3', name: 'Questions & Help', count: 0 },
      { id: '4', name: 'Show & Tell', count: 0 },
      { id: '5', name: 'Off-Topic', count: 0 },
    ];
  
    const savedCategories = JSON.parse(localStorage.getItem('forumCategories') || '[]');
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
  
    // Combine default and custom categories
    const allCategories = [
      ...DEFAULT_CATEGORIES,
      ...savedCategories.filter((cat) => !DEFAULT_CATEGORIES.some((defaultCat) => defaultCat.name === cat.name)),
    ];
  
    // Update counts for all categories
    return allCategories.map((category) => ({
      ...category,
      count: posts.filter((post) => post.category === category.name).length,
    }));
  }