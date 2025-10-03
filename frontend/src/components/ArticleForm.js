import React, { useState } from 'react';
import './ArticleForm.css';

const ArticleForm = ({ onGenerate, loading }) => {
  const [input, setInput] = useState('');
  const [articleLength, setArticleLength] = useState('medium');
  const [tone, setTone] = useState('engaging');
  const [template, setTemplate] = useState('general');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate({
        input: input.trim(),
        length: articleLength,
        tone: tone,
        template: template
      });
    }
  };

  return (
    <div className="article-form-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Generate Articles</h2>
          <p className="card-subtitle">
            Enter a title, keyword, or one-liner to generate 3 viral-quality articles
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-group">
            <label htmlFor="input" className="form-label">
              What would you like to write about?
            </label>
            <textarea
              id="input"
              className="form-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'The future of artificial intelligence', 'How to build better habits', 'Why remote work is here to stay'"
              rows={4}
              required
            />
          </div>

          {/* Content Customization Options */}
          <div className="form-options">
            <div className="option-group">
              <label className="option-label">Article Length</label>
              <div className="option-buttons">
                <button
                  type="button"
                  className={`option-btn ${articleLength === 'short' ? 'active' : ''}`}
                  onClick={() => setArticleLength('short')}
                >
                  📝 Short (300-500 words)
                </button>
                <button
                  type="button"
                  className={`option-btn ${articleLength === 'medium' ? 'active' : ''}`}
                  onClick={() => setArticleLength('medium')}
                >
                  📄 Medium (800-1200 words)
                </button>
                <button
                  type="button"
                  className={`option-btn ${articleLength === 'long' ? 'active' : ''}`}
                  onClick={() => setArticleLength('long')}
                >
                  📚 Long (1500+ words)
                </button>
              </div>
            </div>

            <div className="option-group">
              <label className="option-label">Tone & Style</label>
              <div className="option-buttons">
                <button
                  type="button"
                  className={`option-btn ${tone === 'professional' ? 'active' : ''}`}
                  onClick={() => setTone('professional')}
                >
                  💼 Professional
                </button>
                <button
                  type="button"
                  className={`option-btn ${tone === 'casual' ? 'active' : ''}`}
                  onClick={() => setTone('casual')}
                >
                  😊 Casual
                </button>
                <button
                  type="button"
                  className={`option-btn ${tone === 'urgent' ? 'active' : ''}`}
                  onClick={() => setTone('urgent')}
                >
                  ⚡ Urgent
                </button>
                <button
                  type="button"
                  className={`option-btn ${tone === 'engaging' ? 'active' : ''}`}
                  onClick={() => setTone('engaging')}
                >
                  🎯 Engaging
                </button>
                <button
                  type="button"
                  className={`option-btn ${tone === 'inspirational' ? 'active' : ''}`}
                  onClick={() => setTone('inspirational')}
                >
                  ✨ Inspirational
                </button>
              </div>
            </div>

            <div className="option-group">
              <label className="option-label">Content Template</label>
              <div className="option-buttons">
                <button
                  type="button"
                  className={`option-btn ${template === 'general' ? 'active' : ''}`}
                  onClick={() => setTemplate('general')}
                >
                  📰 General Article
                </button>
                <button
                  type="button"
                  className={`option-btn ${template === 'howto' ? 'active' : ''}`}
                  onClick={() => setTemplate('howto')}
                >
                  🔧 How-To Guide
                </button>
                <button
                  type="button"
                  className={`option-btn ${template === 'listicle' ? 'active' : ''}`}
                  onClick={() => setTemplate('listicle')}
                >
                  📋 Listicle
                </button>
                <button
                  type="button"
                  className={`option-btn ${template === 'story' ? 'active' : ''}`}
                  onClick={() => setTemplate('story')}
                >
                  📖 Story-Driven
                </button>
                <button
                  type="button"
                  className={`option-btn ${template === 'comparison' ? 'active' : ''}`}
                  onClick={() => setTemplate('comparison')}
                >
                  ⚖️ Comparison
                </button>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating Articles...
                </>
              ) : (
                'Generate 3 Articles'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
