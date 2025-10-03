import React, { useState, useEffect } from 'react';
import './UserPreferences.css';

const UserPreferences = () => {
  const [preferences, setPreferences] = useState({
    defaultLength: 'medium',
    defaultTone: 'engaging',
    defaultTemplate: 'general',
    defaultCategory: 'all',
    autoSave: true,
    notifications: true,
    theme: 'light',
    language: 'en',
    wordCount: true,
    aiDetection: true
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const savePreferences = (newPreferences) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  };

  const handlePreferenceChange = (key, value) => {
    savePreferences({ [key]: value });
  };

  const resetPreferences = () => {
    const defaultPrefs = {
      defaultLength: 'medium',
      defaultTone: 'engaging',
      defaultTemplate: 'general',
      defaultCategory: 'all',
      autoSave: true,
      notifications: true,
      theme: 'light',
      language: 'en',
      wordCount: true,
      aiDetection: true
    };
    setPreferences(defaultPrefs);
    localStorage.setItem('userPreferences', JSON.stringify(defaultPrefs));
  };

  return (
    <div className="user-preferences">
      <div className="preferences-header">
        <h1>⚙️ User Preferences</h1>
        <p>Customize your article generation experience</p>
      </div>

      <div className="preferences-content">
        <div className="preference-section">
          <h3>📝 Default Article Settings</h3>
          <div className="preference-group">
            <label className="preference-label">Default Length</label>
            <select
              value={preferences.defaultLength}
              onChange={(e) => handlePreferenceChange('defaultLength', e.target.value)}
              className="preference-select"
            >
              <option value="short">Short (300-500 words)</option>
              <option value="medium">Medium (800-1200 words)</option>
              <option value="long">Long (1500+ words)</option>
            </select>
          </div>

          <div className="preference-group">
            <label className="preference-label">Default Tone</label>
            <select
              value={preferences.defaultTone}
              onChange={(e) => handlePreferenceChange('defaultTone', e.target.value)}
              className="preference-select"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="urgent">Urgent</option>
              <option value="engaging">Engaging</option>
              <option value="inspirational">Inspirational</option>
            </select>
          </div>

          <div className="preference-group">
            <label className="preference-label">Default Template</label>
            <select
              value={preferences.defaultTemplate}
              onChange={(e) => handlePreferenceChange('defaultTemplate', e.target.value)}
              className="preference-select"
            >
              <option value="general">General Article</option>
              <option value="howto">How-To Guide</option>
              <option value="listicle">Listicle</option>
              <option value="story">Story-Driven</option>
              <option value="comparison">Comparison</option>
            </select>
          </div>

          <div className="preference-group">
            <label className="preference-label">Default Category</label>
            <select
              value={preferences.defaultCategory}
              onChange={(e) => handlePreferenceChange('defaultCategory', e.target.value)}
              className="preference-select"
            >
              <option value="all">All Topics</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="business">Business</option>
              <option value="health">Health</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="science">Science</option>
            </select>
          </div>
        </div>

        <div className="preference-section">
          <h3>🔔 App Settings</h3>
          <div className="preference-group">
            <label className="preference-toggle">
              <input
                type="checkbox"
                checked={preferences.autoSave}
                onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Auto-save articles to library</span>
            </label>
          </div>

          <div className="preference-group">
            <label className="preference-toggle">
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Enable notifications</span>
            </label>
          </div>

          <div className="preference-group">
            <label className="preference-toggle">
              <input
                type="checkbox"
                checked={preferences.wordCount}
                onChange={(e) => handlePreferenceChange('wordCount', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Show word count in preview</span>
            </label>
          </div>

          <div className="preference-group">
            <label className="preference-toggle">
              <input
                type="checkbox"
                checked={preferences.aiDetection}
                onChange={(e) => handlePreferenceChange('aiDetection', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Show AI detection status</span>
            </label>
          </div>
        </div>

        <div className="preference-section">
          <h3>🌐 Display Settings</h3>
          <div className="preference-group">
            <label className="preference-label">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="preference-select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
        </div>

        <div className="preference-actions">
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            💾 Save & Apply
          </button>
          <button
            className="btn btn-secondary"
            onClick={resetPreferences}
          >
            🔄 Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;

