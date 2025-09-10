import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ArticleCard.css';

const ArticleCard = ({ article, index }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(article.title);
      setCopySuccess('Title copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy title: ', err);
    }
  };

  const handleCopySubtitle = async () => {
    try {
      await navigator.clipboard.writeText(article.subtitle);
      setCopySuccess('Subtitle copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy subtitle: ', err);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(article.content);
      setCopySuccess('Content copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy content: ', err);
    }
  };

  const handleCopyAll = async () => {
    const fullArticle = `# ${article.title}\n\n## ${article.subtitle}\n\n${article.content}`;
    try {
      await navigator.clipboard.writeText(fullArticle);
      setCopySuccess('Full article copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy full article: ', err);
    }
  };

  return (
    <div className="article-card">
      <div className="article-header">
        <div className="article-number">Article {index}</div>
        <div className="article-status">
          {article.aiDetected ? (
            <span className="status-badge status-warning">AI Detected</span>
          ) : (
            <span className="status-badge status-success">Human-like</span>
          )}
        </div>
      </div>
      
      <div className="article-content">
        <div className="article-title-section">
          <h3 className="article-title">{article.title}</h3>
          <button 
            className="copy-btn" 
            onClick={handleCopyTitle}
            title="Copy title"
          >
            📋
          </button>
        </div>
        
        <div className="article-subtitle-section">
          <p className="article-subtitle">{article.subtitle}</p>
          <button 
            className="copy-btn" 
            onClick={handleCopySubtitle}
            title="Copy subtitle"
          >
            📋
          </button>
        </div>
        
        {showPreview ? (
          <div className="article-preview">
            <ReactMarkdown className="markdown-content">
              {article.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="article-excerpt">
            {article.content.substring(0, 200)}...
          </div>
        )}
        
        {copySuccess && (
          <div className="copy-success">
            {copySuccess}
          </div>
        )}
      </div>
      
      <div className="article-actions">
        <button
          className="btn btn-secondary"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        
        <button
          className="btn btn-primary"
          onClick={handleCopyContent}
          title="Copy article content"
        >
          📋 Copy Content
        </button>
        
        <button
          className="btn btn-success"
          onClick={handleCopyAll}
          title="Copy full article with title and subtitle"
        >
          📄 Copy Full Article
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
