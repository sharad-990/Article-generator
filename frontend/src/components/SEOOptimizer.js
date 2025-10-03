import React, { useState } from 'react';
import './SEOOptimizer.css';

const SEOOptimizer = () => {
  const [content, setContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSEO = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    // Simulate API call - replace with actual SEO analysis
    setTimeout(() => {
      const analysis = {
        overallScore: 78,
        keywordDensity: 2.3,
        readabilityScore: 82,
        metaDescription: "Learn how to optimize your content for better search engine rankings with our comprehensive SEO guide.",
        suggestedTitle: "Ultimate SEO Guide: Boost Your Content Rankings in 2024",
        keywordSuggestions: [
          "SEO optimization",
          "content marketing",
          "search rankings",
          "keyword research",
          "on-page SEO"
        ],
        improvements: [
          {
            type: "warning",
            message: "Add more internal links to improve page authority",
            priority: "high"
          },
          {
            type: "info",
            message: "Consider adding more long-tail keywords",
            priority: "medium"
          },
          {
            type: "success",
            message: "Good use of headings and subheadings",
            priority: "low"
          }
        ],
        metrics: {
          wordCount: content.split(' ').length,
          headingCount: (content.match(/^#+\s/gm) || []).length,
          linkCount: (content.match(/\[.*?\]\(.*?\)/g) || []).length,
          imageCount: (content.match(/!\[.*?\]\(.*?\)/g) || []).length,
          paragraphCount: (content.split('\n\n').filter(p => p.trim()) || []).length
        }
      };
      setSeoAnalysis(analysis);
      setLoading(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div className="seo-optimizer">
      <div className="seo-header">
        <h2>🔍 SEO Optimizer</h2>
        <p>Analyze and optimize your content for better search engine rankings</p>
      </div>

      <div className="seo-content">
        {/* Input Section */}
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="target-keyword">Target Keyword</label>
            <input
              id="target-keyword"
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="Enter your main keyword..."
              className="keyword-input"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="content">Content to Analyze</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here for SEO analysis..."
              className="content-textarea"
              rows="10"
            />
          </div>
          
          <button 
            className="analyze-btn"
            onClick={analyzeSEO}
            disabled={!content.trim() || loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Analyzing...
              </>
            ) : (
              <>
                🔍 Analyze SEO
              </>
            )}
          </button>
        </div>

        {/* SEO Analysis Results */}
        {seoAnalysis && (
          <div className="analysis-results">
            {/* Overall Score */}
            <div className="score-section">
              <h3>Overall SEO Score</h3>
              <div className="score-display">
                <div 
                  className="score-circle"
                  style={{ 
                    background: `conic-gradient(${getScoreColor(seoAnalysis.overallScore)} 0deg ${seoAnalysis.overallScore * 3.6}deg, #e5e7eb ${seoAnalysis.overallScore * 3.6}deg 360deg)`
                  }}
                >
                  <div className="score-inner">
                    <span className="score-number">{seoAnalysis.overallScore}</span>
                    <span className="score-label">/100</span>
                  </div>
                </div>
                <div className="score-details">
                  <h4>Good SEO Foundation</h4>
                  <p>Your content has a solid SEO foundation with room for improvement in keyword optimization and internal linking.</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="metrics-section">
              <h3>Content Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-icon">📝</div>
                  <div className="metric-content">
                    <h4>{seoAnalysis.metrics.wordCount}</h4>
                    <p>Words</p>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon">📊</div>
                  <div className="metric-content">
                    <h4>{seoAnalysis.metrics.headingCount}</h4>
                    <p>Headings</p>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon">🔗</div>
                  <div className="metric-content">
                    <h4>{seoAnalysis.metrics.linkCount}</h4>
                    <p>Links</p>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon">🖼️</div>
                  <div className="metric-content">
                    <h4>{seoAnalysis.metrics.imageCount}</h4>
                    <p>Images</p>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon">📄</div>
                  <div className="metric-content">
                    <h4>{seoAnalysis.metrics.paragraphCount}</h4>
                    <p>Paragraphs</p>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon">🎯</div>
                  <div className="metric-content">
                    <h4>{seoAnalysis.keywordDensity}%</h4>
                    <p>Keyword Density</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Suggestions */}
            <div className="suggestions-section">
              <h3>SEO Suggestions</h3>
              <div className="suggestions-grid">
                <div className="suggestion-card">
                  <h4>📝 Suggested Title</h4>
                  <p className="suggestion-text">{seoAnalysis.suggestedTitle}</p>
                  <button className="copy-btn">📋 Copy</button>
                </div>
                
                <div className="suggestion-card">
                  <h4>📄 Meta Description</h4>
                  <p className="suggestion-text">{seoAnalysis.metaDescription}</p>
                  <button className="copy-btn">📋 Copy</button>
                </div>
                
                <div className="suggestion-card">
                  <h4>🔑 Keyword Suggestions</h4>
                  <div className="keyword-tags">
                    {seoAnalysis.keywordSuggestions.map((keyword, index) => (
                      <span key={index} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div className="improvements-section">
              <h3>Improvement Recommendations</h3>
              <div className="improvements-list">
                {seoAnalysis.improvements.map((improvement, index) => (
                  <div key={index} className="improvement-item">
                    <div className="improvement-icon">
                      {improvement.type === 'warning' && '⚠️'}
                      {improvement.type === 'info' && 'ℹ️'}
                      {improvement.type === 'success' && '✅'}
                    </div>
                    <div className="improvement-content">
                      <p className="improvement-message">{improvement.message}</p>
                      <span 
                        className="improvement-priority"
                        style={{ color: getPriorityColor(improvement.priority) }}
                      >
                        {improvement.priority} priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Readability Score */}
            <div className="readability-section">
              <h3>Readability Analysis</h3>
              <div className="readability-score">
                <div className="readability-bar">
                  <div 
                    className="readability-fill"
                    style={{ 
                      width: `${seoAnalysis.readabilityScore}%`,
                      backgroundColor: getScoreColor(seoAnalysis.readabilityScore)
                    }}
                  ></div>
                </div>
                <div className="readability-details">
                  <span className="readability-number">{seoAnalysis.readabilityScore}/100</span>
                  <span className="readability-label">Readability Score</span>
                </div>
              </div>
              <p className="readability-description">
                {seoAnalysis.readabilityScore >= 80 
                  ? "Excellent! Your content is easy to read and understand."
                  : seoAnalysis.readabilityScore >= 60
                  ? "Good readability. Consider shortening some sentences."
                  : "Consider simplifying your language and sentence structure."
                }
              </p>
            </div>
          </div>
        )}

        {/* Quick SEO Tips */}
        <div className="seo-tips">
          <h3>💡 Quick SEO Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🎯</div>
              <h4>Keyword Optimization</h4>
              <p>Use your target keyword in the title, first paragraph, and naturally throughout the content.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📝</div>
              <h4>Quality Content</h4>
              <p>Write comprehensive, valuable content that answers user questions thoroughly.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔗</div>
              <h4>Internal Linking</h4>
              <p>Link to other relevant pages on your site to improve page authority.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📱</div>
              <h4>Mobile Optimization</h4>
              <p>Ensure your content is mobile-friendly and loads quickly on all devices.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🖼️</div>
              <h4>Image Optimization</h4>
              <p>Use descriptive alt text and optimize image file sizes for faster loading.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📊</div>
              <h4>Structure</h4>
              <p>Use proper heading hierarchy (H1, H2, H3) to organize your content clearly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOOptimizer;



