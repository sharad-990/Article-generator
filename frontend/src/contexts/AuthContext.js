import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const userData = await response.json();
      
      if (userData.success) {
        setUser({
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          avatar: userData.avatarUrl,
          createdAt: userData.createdAt
        });
        return { success: true };
      } else {
        return { success: false, error: userData.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please check if the backend is running.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const userData = await response.json();
      
      if (userData.success) {
        setUser({
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          avatar: userData.avatarUrl,
          createdAt: userData.createdAt
        });
        return { success: true };
      } else {
        return { success: false, error: userData.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please check if the backend is running.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear all user-specific data
    localStorage.removeItem('articleHistory');
    localStorage.removeItem('articleFavorites');
    localStorage.removeItem('articleCategories');
    localStorage.removeItem('user');
  };

  const updateProfile = (updates) => {
    if (user) {
      setUser(prev => ({ ...prev, ...updates }));
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
