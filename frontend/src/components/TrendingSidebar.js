import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import { useCategory } from '../contexts/CategoryContext';
import './TrendingSidebar.css';

const TrendingSidebar = () => {
  const { selectedCategory } = useCategory();
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewArticle, setPreviewArticle] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    loadTrendingArticles();
  }, [selectedCategory]);

  // Cache key for localStorage
  const getCacheKey = (category) => `trending_articles_${category}`;
  const getCacheTimestampKey = (category) => `trending_articles_timestamp_${category}`;

  // Load articles from cache or fetch from API
  const loadTrendingArticles = async () => {
    const cacheKey = getCacheKey(selectedCategory);
    const timestampKey = getCacheTimestampKey(selectedCategory);
    
    // Try to load from cache first
    const cachedArticles = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);
    
    if (cachedArticles && cachedTimestamp) {
      try {
        const articles = JSON.parse(cachedArticles);
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        
        // Check if cache is less than 24 hours old (optional: you can remove this check for permanent caching)
        const isCacheValid = (now - timestamp) < (24 * 60 * 60 * 1000);
        
        if (isCacheValid) {
          setTrendingArticles(articles);
          setIsCached(true);
          setLoading(false);
          setError(null);
          return;
        }
      } catch (err) {
        console.error('Error parsing cached articles:', err);
        // If cache is corrupted, clear it and fetch fresh data
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(timestampKey);
      }
    }
    
    // If no cache or cache is invalid, fetch from API
    await fetchTrendingArticles();
  };

  const fetchTrendingArticles = async () => {
    setLoading(true);
    setIsCached(false);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/trending?category=${selectedCategory}`);
      const data = await response.json();
      
      if (data.success) {
        setTrendingArticles(data.articles);
        setError(null);
        
        // Cache the articles
        const cacheKey = getCacheKey(selectedCategory);
        const timestampKey = getCacheTimestampKey(selectedCategory);
        localStorage.setItem(cacheKey, JSON.stringify(data.articles));
        localStorage.setItem(timestampKey, Date.now().toString());
        setIsCached(false);
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
    // Clear cache for this category
    const cacheKey = getCacheKey(selectedCategory);
    const timestampKey = getCacheTimestampKey(selectedCategory);
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(timestampKey);
    
    // Fetch fresh data
    await fetchTrendingArticles();
  };

  // Function to clear all cached articles (useful for debugging or manual cache clear)
  const clearAllCache = () => {
    const categories = ['all', 'tech', 'business', 'lifestyle', 'health', 'travel', 'food', 'sports'];
    categories.forEach(category => {
      localStorage.removeItem(getCacheKey(category));
      localStorage.removeItem(getCacheTimestampKey(category));
    });
    console.log('All trending articles cache cleared');
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

  const formatContent = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text **text**
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text *text*
      .replace(/^# (.*$)/gm, '<h1>$1</h1>') // H1 headers # Header
      .replace(/^## (.*$)/gm, '<h2>$1</h2>') // H2 headers ## Header
      .replace(/^### (.*$)/gm, '<h3>$1</h3>') // H3 headers ### Header
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>') // H4 headers #### Header
      .replace(/^- (.*$)/gm, '<li>$1</li>') // List items - Item
      .replace(/\n\n/g, '</p><p>') // Double line breaks for paragraphs
      .replace(/\n/g, '<br>') // Single line breaks
      .replace(/^/, '<p>') // Start with paragraph
      .replace(/$/, '</p>'); // End with paragraph
  };

  const handleCopyContent = (content) => {
    try {
      // Format the content
      const htmlContent = formatContent(content);
      
      // Create a temporary div to ensure proper HTML structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Get the formatted HTML
      const formattedHtml = tempDiv.innerHTML;
      
      // Create clipboard item with both HTML and plain text
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([formattedHtml], { type: 'text/html' }),
        'text/plain': new Blob([content], { type: 'text/plain' })
      });

      navigator.clipboard.write([clipboardItem]).then(() => {
        alert('Content copied with formatting!');
      }).catch((err) => {
        console.log('HTML copy failed, trying plain text:', err);
        // Fallback to plain text
        navigator.clipboard.writeText(content).then(() => {
          alert('Content copied to clipboard!');
        }).catch(() => {
          alert('Failed to copy content');
        });
      });
    } catch (error) {
      console.error('Error formatting content:', error);
      // Fallback to plain text
      navigator.clipboard.writeText(content).then(() => {
        alert('Content copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy content');
      });
    }
  };

  const handleCopyFullArticle = (article) => {
    try {
      // Format title and subtitle
      const formattedTitle = article.title.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const formattedSubtitle = article.subtitle.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Format content using the same function
      const formattedContent = formatContent(article.content);

      const htmlArticle = `
        <h1>${formattedTitle}</h1>
        <h2>${formattedSubtitle}</h2>
        <div>${formattedContent}</div>
      `;

      const plainArticle = `${article.title}\n\n${article.subtitle}\n\n${article.content}`;
      
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlArticle], { type: 'text/html' }),
        'text/plain': new Blob([plainArticle], { type: 'text/plain' })
      });

      navigator.clipboard.write([clipboardItem]).then(() => {
        alert('Full article copied with formatting!');
      }).catch((err) => {
        console.log('HTML copy failed, trying plain text:', err);
        // Fallback to plain text
        navigator.clipboard.writeText(plainArticle).then(() => {
          alert('Full article copied to clipboard!');
        }).catch(() => {
          alert('Failed to copy full article');
        });
      });
    } catch (error) {
      console.error('Error formatting full article:', error);
      // Fallback to plain text
      const plainArticle = `${article.title}\n\n${article.subtitle}\n\n${article.content}`;
      navigator.clipboard.writeText(plainArticle).then(() => {
        alert('Full article copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy full article');
      });
    }
  };

  const handlePreviewArticle = (article) => {
    setPreviewArticle(article);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewArticle(null);
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'all': 'All Topics',
      'tech': 'Technology',
      'finance': 'Finance',
      'lifestyle': 'Lifestyle',
      'business': 'Business',
      'health': 'Health',
      'education': 'Education',
      'entertainment': 'Entertainment',
      'travel': 'Travel',
      'food': 'Food',
      'sports': 'Sports'
    };
    return categoryMap[category] || 'All Topics';
  };

  if (loading && !isCached) {
    return (
      <div className="trending-sidebar">
        <div className="trending-header">
          <div className="trending-title-section">
            <h3>🔥 {getCategoryDisplayName(selectedCategory)} Trending</h3>
          </div>
          <button onClick={handleRefresh} className="refresh-btn loading" disabled>
            ⏳
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
          <div className="trending-title-section">
            <h3>🔥 {getCategoryDisplayName(selectedCategory)} Trending</h3>
            {isCached && (
              <span className="cache-indicator" title="Showing cached articles">
                💾 Cached
              </span>
            )}
          </div>
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
    <>
      <div className="trending-sidebar">
        <div className="trending-header">
          <div className="trending-title-section">
            <h3>🔥 {getCategoryDisplayName(selectedCategory)} Trending</h3>
            {isCached && (
              <span className="cache-indicator" title="Showing cached articles">
                💾 Cached
              </span>
            )}
          </div>
          <button 
            onClick={handleRefresh} 
            className={`refresh-btn ${loading ? 'loading' : ''}`} 
            title={isCached ? "Refresh to get latest articles" : "Refresh trending articles"}
            disabled={loading}
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
        
        <div className="trending-content">
          <div className="trending-articles">
           {trendingArticles.length === 0 ? (
             <div className="no-articles">
               <p>No trending articles found for this category.</p>
               <button onClick={handleRefresh} className="retry-btn">
                 Try Again
               </button>
             </div>
           ) : (
             trendingArticles.map((article, index) => (
            <div key={index} className="trending-article-card luxury-card">
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
           ))
           )}
          </div>
          
          <div className="trending-footer">
            <p>💡 Use the copy buttons to grab any content!</p>
            <p>🔄 Updated daily with fresh viral content</p>
            <p>📊 Showing {getCategoryDisplayName(selectedCategory)} trending articles</p>
          </div>
        </div>
      </div>

      {/* Preview Modal - Rendered using Portal outside DOM tree */}
      {showPreview && previewArticle && createPortal(
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
                <ReactMarkdown className="markdown-content">
                  {previewArticle.content}
                </ReactMarkdown>
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
        </div>,
        document.body
      )}
    </>
  );
};

export default TrendingSidebar;
