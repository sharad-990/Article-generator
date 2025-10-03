import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageNavigation from './PageNavigation';
import GeneratePage from './GeneratePage';
import LibraryPage from './LibraryPage';
import HistoryPage from './HistoryPage';
import AnalyticsPage from './AnalyticsPage';
import SettingsPage from './SettingsPage';
import TrendingSidebar from './TrendingSidebar';
import Header from './Header';
import './MainApp.css';

const MainApp = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState('generate');
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'generate':
        return <GeneratePage />;
      case 'library':
        return <LibraryPage />;
      case 'history':
        return <HistoryPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'preferences':
        return <SettingsPage />;
      default:
        return <GeneratePage />;
    }
  };

  return (
    <div className="main-app">
      <Header onLogout={handleLogout} />
      <PageNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="app-layout">
        <main className="main-content">
          {renderPage()}
        </main>
        
        <aside className="sidebar">
          <TrendingSidebar />
        </aside>
      </div>
    </div>
  );
};

export default MainApp;
