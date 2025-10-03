import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './ContentLibrary.css';

const ContentLibrary = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadSavedArticles();
  }, []);

  const loadSavedArticles = () => {
    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    setSavedArticles(saved);
  };

  const saveArticle = (article) => {
    const articleToSave = {
      ...article,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      tags: []
    };
    
    const updated = [...savedArticles, articleToSave];
    setSavedArticles(updated);
    localStorage.setItem('savedArticles', JSON.stringify(updated));
  };

  const deleteArticle = (id) => {
    const updated = savedArticles.filter(article => article.id !== id);
    setSavedArticles(updated);
    localStorage.setItem('savedArticles', JSON.stringify(updated));
  };

  const addTag = (id, tag) => {
    const updated = savedArticles.map(article => 
      article.id === id 
        ? { ...article, tags: [...(article.tags || []), tag] }
        : article
    );
    setSavedArticles(updated);
    localStorage.setItem('savedArticles', JSON.stringify(updated));
  };

  const removeTag = (id, tagToRemove) => {
    const updated = savedArticles.map(article => 
      article.id === id 
        ? { ...article, tags: article.tags.filter(tag => tag !== tagToRemove) }
        : article
    );
    setSavedArticles(updated);
    localStorage.setItem('savedArticles', JSON.stringify(updated));
  };

  const filteredArticles = savedArticles
    .filter(article => {
      const matchesFilter = filter === 'all' || article.category === filter;
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.savedAt) - new Date(a.savedAt);
        case 'oldest':
          return new Date(a.savedAt) - new Date(b.savedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const categories = ['all', 'tech', 'finance', 'lifestyle', 'business', 'health', 'entertainment', 'sports', 'science'];

  return (
    <div className="content-library">
      <div className="library-header">
        <h1>📚 Content Library</h1>
        <p>Manage and organize your saved articles</p>
      </div>

      <div className="library-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      <div className="library-stats">
        <div className="stat-card">
          <div className="stat-number">{savedArticles.length}</div>
          <div className="stat-label">Total Articles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{new Set(savedArticles.map(a => a.category)).size}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{savedArticles.reduce((acc, article) => acc + (article.tags?.length || 0), 0)}</div>
          <div className="stat-label">Tags</div>
        </div>
      </div>

      <div className="articles-grid">
        {filteredArticles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No articles found</h3>
            <p>Start generating articles to build your content library!</p>
          </div>
        ) : (
          filteredArticles.map(article => (
            <div key={article.id} className="library-article-card">
              <div className="article-header">
                <div className="article-meta">
                  <span className="article-category">{article.category}</span>
                  <span className="article-date">
                    {new Date(article.savedAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteArticle(article.id)}
                  title="Delete article"
                >
                  🗑️
                </button>
              </div>

              <div className="article-content">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-subtitle">{article.subtitle}</p>
                <div className="article-excerpt">
                  <ReactMarkdown className="markdown-content">
                    {article.content.substring(0, 150)}...
                  </ReactMarkdown>
                </div>
              </div>

              <div className="article-tags">
                {article.tags?.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button
                      className="tag-remove"
                      onClick={() => removeTag(article.id, tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tag..."
                  className="tag-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      addTag(article.id, e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              <div className="article-actions">
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    try {
                      // Format content with improved function
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

                      const formattedContent = formatContent(article.content);
                      
                      // Create a temporary div to ensure proper HTML structure
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = formattedContent;
                      const formattedHtml = tempDiv.innerHTML;

                      const clipboardItem = new ClipboardItem({
                        'text/html': new Blob([formattedHtml], { type: 'text/html' }),
                        'text/plain': new Blob([article.content], { type: 'text/plain' })
                      });

                      await navigator.clipboard.write([clipboardItem]);
                      alert('Article copied with formatting!');
                    } catch (err) {
                      console.log('HTML copy failed, trying plain text:', err);
                      // Fallback to plain text
                      try {
                        await navigator.clipboard.writeText(article.content);
                        alert('Article copied to clipboard!');
                      } catch (fallbackErr) {
                        alert('Failed to copy article');
                      }
                    }
                  }}
                >
                  📋 Copy
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    // Create formatted content with markdown-style formatting
                    const formattedContent = article.content
                      .replace(/\*\*(.*?)\*\*/g, '**$1**') // Keep bold markers
                      .replace(/\*(.*?)\*/g, '*$1*') // Keep italic markers
                      .replace(/^# (.*$)/gm, '# $1') // Keep header markers
                      .replace(/^## (.*$)/gm, '## $1')
                      .replace(/^### (.*$)/gm, '### $1')
                      .replace(/^#### (.*$)/gm, '#### $1')
                      .replace(/^- (.*$)/gm, '- $1'); // Keep list markers

                    const fullArticle = `# ${article.title}\n\n## ${article.subtitle}\n\n${formattedContent}`;
                    const element = document.createElement('a');
                    const file = new Blob([fullArticle], { type: 'text/plain' });
                    element.href = URL.createObjectURL(file);
                    element.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                >
                  📄 Export
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentLibrary;
