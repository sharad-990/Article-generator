import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CategoryContext = createContext();

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  const getUserKey = (key) => {
    return isAuthenticated ? `${key}_${user?.id}` : key;
  };

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(getUserKey('articleCategories'));
    return saved ? JSON.parse(saved) : [
      { id: 'tech', name: 'Technology', icon: '💻', color: '#667eea' },
      { id: 'finance', name: 'Finance', icon: '💰', color: '#4ecdc4' },
      { id: 'lifestyle', name: 'Lifestyle', icon: '🌟', color: '#ff6b6b' },
      { id: 'business', name: 'Business', icon: '📈', color: '#45b7d1' },
      { id: 'health', name: 'Health', icon: '🏥', color: '#96ceb4' },
      { id: 'education', name: 'Education', icon: '📚', color: '#feca57' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#ff9ff3' },
      { id: 'travel', name: 'Travel', icon: '✈️', color: '#54a0ff' },
      { id: 'food', name: 'Food', icon: '🍕', color: '#5f27cd' },
      { id: 'sports', name: 'Sports', icon: '⚽', color: '#00d2d3' }
    ];
  });

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(getUserKey('articleCategories'), JSON.stringify(categories));
    }
  }, [categories, isAuthenticated, user?.id]);

  // Load user-specific categories when user changes
  useEffect(() => {
    if (isAuthenticated) {
      const savedCategories = localStorage.getItem(getUserKey('articleCategories'));
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    }
  }, [isAuthenticated, user?.id]);

  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: category.id || Date.now().toString(),
      color: category.color || '#667eea'
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (categoryId, updates) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    );
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const getCategoryColor = (categoryId) => {
    const category = getCategoryById(categoryId);
    return category ? category.color : '#667eea';
  };

  const value = {
    categories,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryColor
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
