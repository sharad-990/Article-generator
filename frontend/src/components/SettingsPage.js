import React from 'react';
import UserPreferences from './UserPreferences';
import './SettingsPage.css';

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your preferences and account settings</p>
      </div>
      <div className="page-content">
        <UserPreferences />
      </div>
    </div>
  );
};

export default SettingsPage;



