import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>📝 Article Generator</h1>
          </div>
          <nav className="nav">
            <a href="#generate" className="nav-link">Generate</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
