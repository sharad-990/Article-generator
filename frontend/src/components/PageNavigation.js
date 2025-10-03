import React from 'react';
import './PageNavigation.css';

const PageNavigation = ({ currentPage, onPageChange }) => {
  const pages = [
    { id: 'generate', name: 'Generate Articles', icon: '✨', description: 'Create new articles' },
    { id: 'library', name: 'Content Library', icon: '📚', description: 'Manage saved articles' },
    { id: 'history', name: 'Article History', icon: '📜', description: 'View article history' },
    { id: 'analytics', name: 'Analytics', icon: '📊', description: 'View statistics' },
    { id: 'preferences', name: 'Settings', icon: '⚙️', description: 'User preferences' }
  ];

  return (
    <nav className="page-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>Article Generator</h2>
        </div>
        <div className="nav-menu">
          {pages.map((page) => (
            <button
              key={page.id}
              className={`nav-item ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => onPageChange(page.id)}
              title={page.description}
            >
              <span className="nav-icon">{page.icon}</span>
              <span className="nav-text">{page.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PageNavigation;
