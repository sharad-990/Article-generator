import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import Logo from './Logo';
import './Header.css';

const Header = ({ onLogout }) => {
  const { user, isAuthenticated } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const closeModals = () => {
    setShowProfile(false);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Logo size="medium" />
            </div>
            <div className="header-actions">
              <nav className="nav">
                <a href="#generate" className="nav-link">Generate</a>
                <a href="#about" className="nav-link">About</a>
              </nav>
              
              <div className="user-menu">
                <button className="user-btn" onClick={handleProfileClick}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user?.name} className="user-avatar" />
                  ) : (
                    <div className="user-avatar-fallback">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="user-name">{user?.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showProfile && <UserProfile onClose={closeModals} onLogout={onLogout} />}
    </>
  );
};

export default Header;
