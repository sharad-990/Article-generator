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

  const handleCopyContent = async () => {
    try {
      // Format the content
      const formattedContent = formatContent(article.content);
      
      // Create a temporary div to ensure proper HTML structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formattedContent;
      
      // Get the formatted HTML
      const formattedHtml = tempDiv.innerHTML;

      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([formattedHtml], { type: 'text/html' }),
        'text/plain': new Blob([article.content], { type: 'text/plain' })
      });

      await navigator.clipboard.write([clipboardItem]);
      setCopySuccess('Content copied with formatting!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.log('HTML copy failed, trying plain text:', err);
      // Fallback to plain text
      try {
        await navigator.clipboard.writeText(article.content);
        setCopySuccess('Content copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy content: ', fallbackErr);
        setCopySuccess('Failed to copy content');
        setTimeout(() => setCopySuccess(''), 2000);
      }
    }
  };

  const handleCopyAll = async () => {
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

      const plainArticle = `# ${article.title}\n\n## ${article.subtitle}\n\n${article.content}`;
      
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlArticle], { type: 'text/html' }),
        'text/plain': new Blob([plainArticle], { type: 'text/plain' })
      });

      await navigator.clipboard.write([clipboardItem]);
      setCopySuccess('Full article copied with formatting!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.log('HTML copy failed, trying plain text:', err);
      // Fallback to plain text
      try {
        const fullArticle = `# ${article.title}\n\n## ${article.subtitle}\n\n${article.content}`;
        await navigator.clipboard.writeText(fullArticle);
        setCopySuccess('Full article copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy full article: ', fallbackErr);
        setCopySuccess('Failed to copy full article');
        setTimeout(() => setCopySuccess(''), 2000);
      }
    }
  };

  const handleExportPDF = () => {
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
    setCopySuccess('Article exported as TXT!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const handleExportWord = () => {
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
    element.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setCopySuccess('Article exported as DOC!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const handleExportHTML = () => {
    // Convert markdown-like formatting to HTML
    const formattedTitle = article.title.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const formattedSubtitle = article.subtitle.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const formattedContent = article.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/^# (.*$)/gm, '<h1>$1</h1>') // H1 headers
      .replace(/^## (.*$)/gm, '<h2>$1</h2>') // H2 headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>') // H3 headers
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>') // H4 headers
      .replace(/^- (.*$)/gm, '<li>$1</li>') // List items
      .replace(/\n/g, '<br>'); // Line breaks

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${article.title}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
          h1 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
          h2 { color: #666; margin-top: 30px; }
          h3 { color: #555; margin-top: 25px; }
          h4 { color: #666; margin-top: 20px; }
          p { margin-bottom: 15px; }
          strong { font-weight: bold; }
          em { font-style: italic; }
          li { margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <h1>${formattedTitle}</h1>
        <h2>${formattedSubtitle}</h2>
        <div>${formattedContent}</div>
      </body>
      </html>
    `;
    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setCopySuccess('Article exported as HTML!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const handleSaveToLibrary = () => {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    const articleToSave = {
      ...article,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      category: 'Generated',
      tags: []
    };
    
    // Check if article already exists
    const exists = savedArticles.some(saved => 
      saved.title === article.title && saved.subtitle === article.subtitle
    );
    
    if (exists) {
      setCopySuccess('Article already in library!');
    } else {
      const updated = [...savedArticles, articleToSave];
      localStorage.setItem('savedArticles', JSON.stringify(updated));
      setCopySuccess('Article saved to library!');
    }
    
    setTimeout(() => setCopySuccess(''), 2000);
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
            <ReactMarkdown className="markdown-content">
              {article.content.substring(0, 200)}...
            </ReactMarkdown>
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
        
        <button
          className="btn btn-info"
          onClick={handleSaveToLibrary}
          title="Save article to content library"
        >
          💾 Save to Library
        </button>
      </div>

      <div className="article-export-actions">
        <div className="export-label">Export as:</div>
        <div className="export-buttons">
          <button
            className="btn btn-export"
            onClick={handleExportPDF}
            title="Export as TXT file"
          >
            📄 TXT
          </button>
          
          <button
            className="btn btn-export"
            onClick={handleExportWord}
            title="Export as DOC file"
          >
            📝 DOC
          </button>
          
          <button
            className="btn btn-export"
            onClick={handleExportHTML}
            title="Export as HTML file"
          >
            🌐 HTML
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
