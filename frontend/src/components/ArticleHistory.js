import React, { useState } from 'react';
import { useArticleHistory } from '../contexts/ArticleHistoryContext';
import './ArticleHistory.css';

const ArticleHistory = () => {
  const { 
    articleHistory, 
    favorites, 
    removeFromFavorites, 
    clearHistory, 
    clearFavorites,
    isFavorite 
  } = useArticleHistory();
  
  const [activeTab, setActiveTab] = useState('history');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = articleHistory.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFavorites = favorites.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyTitle = (title) => {
    navigator.clipboard.writeText(title).then(() => {
      alert('Title copied to clipboard!');
    });
  };

  const handleCopySubtitle = (subtitle) => {
    navigator.clipboard.writeText(subtitle).then(() => {
      alert('Subtitle copied to clipboard!');
    });
  };

  const handleCopyContent = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      alert('Content copied to clipboard!');
    });
  };

  const handleCopyFullArticle = (article) => {
    const fullArticle = `${article.title}\n\n${article.subtitle}\n\n${article.content}`;
    navigator.clipboard.writeText(fullArticle).then(() => {
      alert('Full article copied to clipboard!');
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderArticleCard = (article) => (
    <div key={article.id} className="history-article-card">
      <div className="article-header">
        <div className="article-meta">
          <span className="article-category">{article.category}</span>
          <span className="article-date">{formatDate(article.timestamp)}</span>
        </div>
        <div className="article-actions">
          <button 
            className="copy-btn" 
            onClick={() => handleCopyTitle(article.title)}
            title="Copy title"
          >
            📋
          </button>
        </div>
      </div>
      
      <h4 className="article-title">{article.title}</h4>
      <p className="article-subtitle">{article.subtitle}</p>
      
      <div className="article-content-preview">
        {article.content.substring(0, 150)}...
      </div>
      
      <div className="article-actions-row">
        <button 
          className="action-btn preview-btn"
          onClick={() => handleCopyContent(article.content)}
        >
          📄 Copy Content
        </button>
        <button 
          className="action-btn full-btn"
          onClick={() => handleCopyFullArticle(article)}
        >
          📋 Copy Full
        </button>
      </div>
    </div>
  );

  return (
    <div className="article-history">
      <div className="history-header">
        <h3>📚 Article History</h3>
        <div className="history-tabs">
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History ({articleHistory.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites ({favorites.length})
          </button>
        </div>
      </div>

      <div className="history-search">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="history-actions">
        {activeTab === 'history' && (
          <button 
            className="clear-btn"
            onClick={clearHistory}
            disabled={articleHistory.length === 0}
          >
            🗑️ Clear History
          </button>
        )}
        {activeTab === 'favorites' && (
          <button 
            className="clear-btn"
            onClick={clearFavorites}
            disabled={favorites.length === 0}
          >
            🗑️ Clear Favorites
          </button>
        )}
      </div>

      <div className="history-content">
        {activeTab === 'history' && (
          <>
            {filteredHistory.length === 0 ? (
              <div className="empty-state">
                <p>No articles in history yet.</p>
                <p>Generate some articles to see them here!</p>
              </div>
            ) : (
              <div className="articles-grid">
                {filteredHistory.map(renderArticleCard)}
              </div>
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <>
            {filteredFavorites.length === 0 ? (
              <div className="empty-state">
                <p>No favorite articles yet.</p>
                <p>Add articles to favorites to see them here!</p>
              </div>
            ) : (
              <div className="articles-grid">
                {filteredFavorites.map(renderArticleCard)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleHistory;
