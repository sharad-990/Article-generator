import React, { useState } from 'react';
import './ArticleForm.css';

const ArticleForm = ({ onGenerate, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input.trim());
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
