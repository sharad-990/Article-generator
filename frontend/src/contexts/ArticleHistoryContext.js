import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ArticleHistoryContext = createContext();

export const useArticleHistory = () => {
  const context = useContext(ArticleHistoryContext);
  if (!context) {
    throw new Error('useArticleHistory must be used within an ArticleHistoryProvider');
  }
  return context;
};

export const ArticleHistoryProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  const getUserKey = (key) => {
    return isAuthenticated ? `${key}_${user?.id}` : key;
  };

  const [articleHistory, setArticleHistory] = useState(() => {
    const saved = localStorage.getItem(getUserKey('articleHistory'));
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(getUserKey('articleFavorites'));
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(getUserKey('articleHistory'), JSON.stringify(articleHistory));
    }
  }, [articleHistory, isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(getUserKey('articleFavorites'), JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated, user?.id]);

  // Load user-specific data when user changes
  useEffect(() => {
    if (isAuthenticated) {
      const savedHistory = localStorage.getItem(getUserKey('articleHistory'));
      const savedFavorites = localStorage.getItem(getUserKey('articleFavorites'));
      
      setArticleHistory(savedHistory ? JSON.parse(savedHistory) : []);
      setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
    } else {
      // Clear data when user logs out
      setArticleHistory([]);
      setFavorites([]);
    }
  }, [isAuthenticated, user?.id]);

  const addToHistory = async (article) => {
    const articleWithId = {
      ...article,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      category: 'Generated'
    };
    
    // Save to MongoDB via backend API
    if (isAuthenticated && user?.id) {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        await fetch(`${API_BASE_URL}/api/articles/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            article: articleWithId,
            category: 'Generated'
          }),
        });
      } catch (error) {
        console.error('Failed to save article to database:', error);
      }
    }
    
    setArticleHistory(prev => [articleWithId, ...prev.slice(0, 49)]); // Keep last 50
  };

  const addToFavorites = (article) => {
    const articleWithId = {
      ...article,
      id: article.id || Date.now().toString(),
      timestamp: article.timestamp || new Date().toISOString(),
      category: article.category || 'Generated'
    };
    
    if (!favorites.find(fav => fav.id === articleWithId.id)) {
      setFavorites(prev => [articleWithId, ...prev]);
    }
  };

  const removeFromFavorites = (articleId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== articleId));
  };

  const clearHistory = () => {
    setArticleHistory([]);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const isFavorite = (articleId) => {
    return favorites.some(fav => fav.id === articleId);
  };

  const value = {
    articleHistory,
    favorites,
    addToHistory,
    addToFavorites,
    removeFromFavorites,
    clearHistory,
    clearFavorites,
    isFavorite
  };

  return (
    <ArticleHistoryContext.Provider value={value}>
      {children}
    </ArticleHistoryContext.Provider>
  );
};
