import React, { useState, useEffect } from 'react';
import './TrendingSidebar.css';

const TrendingSidebar = () => {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewArticle, setPreviewArticle] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchTrendingArticles();
  }, []);

  const fetchTrendingArticles = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/trending`);
      const data = await response.json();
      
      if (data.success) {
        setTrendingArticles(data.articles);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to load trending articles');
      console.error('Error fetching trending articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/trending/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setTrendingArticles(data.articles);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to refresh trending articles');
      console.error('Error refreshing trending articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTitle = (title) => {
    navigator.clipboard.writeText(title).then(() => {
      alert('Title copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy title');
    });
  };

  const handleCopySubtitle = (subtitle) => {
    navigator.clipboard.writeText(subtitle).then(() => {
      alert('Subtitle copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy subtitle');
    });
  };

  const handleCopyContent = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      alert('Content copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy content');
    });
  };

  const handleCopyFullArticle = (article) => {
    const fullArticle = `${article.title}\n\n${article.subtitle}\n\n${article.content}`;
    navigator.clipboard.writeText(fullArticle).then(() => {
      alert('Full article copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy full article');
    });
  };

  const handlePreviewArticle = (article) => {
    setPreviewArticle(article);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewArticle(null);
  };

  if (loading) {
    return (
      <div className="trending-sidebar">
        <div className="trending-header">
          <h3>🔥 Trending Today</h3>
          <button onClick={handleRefresh} className="refresh-btn" disabled>
            🔄
          </button>
        </div>
        <div className="loading">Loading trending articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-sidebar">
        <div className="trending-header">
          <h3>🔥 Trending Today</h3>
          <button onClick={handleRefresh} className="refresh-btn">
            🔄
          </button>
        </div>
        <div className="error">
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-sidebar">
      <div className="trending-header">
        <h3>🔥 Trending Today</h3>
        <button onClick={handleRefresh} className="refresh-btn" title="Refresh trending articles">
          🔄
        </button>
      </div>
      
      <div className="trending-articles">
        {trendingArticles.map((article, index) => (
          <div key={index} className="trending-article-card">
            <div className="trending-article-number">#{index + 1}</div>
            <div className="trending-article-content">
              <div className="trending-article-title-row">
                <h4 className="trending-article-title">{article.title}</h4>
                <button 
                  className="copy-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyTitle(article.title);
                  }}
                  title="Copy title"
                >
                  📋
                </button>
              </div>
              <div className="trending-article-subtitle-row">
                <p className="trending-article-subtitle">{article.subtitle}</p>
                <button 
                  className="copy-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopySubtitle(article.subtitle);
                  }}
                  title="Copy subtitle"
                >
                  📋
                </button>
              </div>
              <div className="trending-article-actions">
                <button 
                  className="action-btn preview-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewArticle(article);
                  }}
                >
                  👁️ Preview
                </button>
                <button 
                  className="action-btn content-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyContent(article.content);
                  }}
                >
                  📄 Copy Content
                </button>
                <button 
                  className="action-btn full-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyFullArticle(article);
                  }}
                >
                  📋 Copy Full Article
                </button>
              </div>
              <div className="trending-article-meta">
                <span className="trending-author">👩‍💻 {article.author}</span>
                <span className="trending-status">✨ Viral Ready</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="trending-footer">
        <p>💡 Use the copy buttons to grab any content!</p>
        <p>🔄 Updated daily with fresh viral content</p>
      </div>

      {/* Preview Modal */}
      {showPreview && previewArticle && (
        <div className="preview-modal-overlay" onClick={closePreview}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Article Preview</h3>
              <button className="close-btn" onClick={closePreview}>×</button>
            </div>
            <div className="preview-content">
              <h2 className="preview-title">{previewArticle.title}</h2>
              <h3 className="preview-subtitle">{previewArticle.subtitle}</h3>
              <div className="preview-body">
                {previewArticle.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="preview-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="preview-actions">
              <button 
                className="action-btn content-btn"
                onClick={() => handleCopyContent(previewArticle.content)}
              >
                📄 Copy Content
              </button>
              <button 
                className="action-btn full-btn"
                onClick={() => handleCopyFullArticle(previewArticle)}
              >
                📋 Copy Full Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingSidebar;
