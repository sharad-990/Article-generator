import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ArticleHistoryProvider } from './contexts/ArticleHistoryContext';
import { CategoryProvider } from './contexts/CategoryContext';
import LoginPage from './components/LoginPage';
import MainApp from './components/MainApp';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2>Loading...</h2>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  return (
    <AuthProvider>
      <ArticleHistoryProvider>
        <CategoryProvider>
          <MainApp onLogout={handleLogout} />
        </CategoryProvider>
      </ArticleHistoryProvider>
    </AuthProvider>
  );
}

export default App;
