import React, { useState } from 'react';
import './ContentTemplates.css';

const ContentTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateData, setTemplateData] = useState({});

  const templates = [
    {
      id: 'how-to-article',
      name: 'How-To Article',
      icon: '📖',
      description: 'Step-by-step instructional articles',
      fields: ['title', 'introduction', 'steps', 'conclusion', 'tips'],
      preview: '# [Title]\n\n[Introduction]\n\n## Step-by-Step Guide\n\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n## Conclusion\n\n[Conclusion]\n\n## Pro Tips\n\n- [Tip 1]\n- [Tip 2]'
    },
    {
      id: 'listicle-article',
      name: 'Listicle Article',
      icon: '📋',
      description: 'Numbered list articles (Top 10, Best 5, etc.)',
      fields: ['title', 'introduction', 'listItems', 'conclusion', 'takeaway'],
      preview: '# [Title]\n\n[Introduction]\n\n## The List\n\n1. **[Item 1]** - [Description]\n2. **[Item 2]** - [Description]\n3. **[Item 3]** - [Description]\n\n## Conclusion\n\n[Conclusion]\n\n## Key Takeaway\n\n[Takeaway]'
    },
    {
      id: 'opinion-piece',
      name: 'Opinion Piece',
      icon: '💭',
      description: 'Personal opinion and editorial articles',
      fields: ['title', 'hook', 'mainArgument', 'supportingPoints', 'conclusion'],
      preview: '# [Title]\n\n[Hook - Opening statement]\n\n## My Take\n\n[Main Argument]\n\n## Why I Believe This\n\n- [Supporting Point 1]\n- [Supporting Point 2]\n- [Supporting Point 3]\n\n## Final Thoughts\n\n[Conclusion]'
    },
    {
      id: 'news-analysis',
      name: 'News Analysis',
      icon: '📰',
      description: 'Breaking down current events and news',
      fields: ['headline', 'summary', 'analysis', 'implications', 'outlook'],
      preview: '# [Headline]\n\n## What Happened\n\n[Summary]\n\n## Breaking It Down\n\n[Analysis]\n\n## What This Means\n\n[Implications]\n\n## Looking Ahead\n\n[Outlook]'
    },
    {
      id: 'comparison-article',
      name: 'Comparison Article',
      icon: '⚖️',
      description: 'Comparing different options, products, or approaches',
      fields: ['title', 'introduction', 'option1', 'option2', 'verdict'],
      preview: '# [Title]\n\n[Introduction]\n\n## Option 1: [Name]\n\n**Pros:**\n- [Pro 1]\n- [Pro 2]\n\n**Cons:**\n- [Con 1]\n- [Con 2]\n\n## Option 2: [Name]\n\n**Pros:**\n- [Pro 1]\n- [Pro 2]\n\n**Cons:**\n- [Con 1]\n- [Con 2]\n\n## The Verdict\n\n[Final Recommendation]'
    },
    {
      id: 'case-study',
      name: 'Case Study',
      icon: '🔬',
      description: 'In-depth analysis of real-world examples',
      fields: ['title', 'background', 'challenge', 'solution', 'results'],
      preview: '# [Title]\n\n## Background\n\n[Background Information]\n\n## The Challenge\n\n[What Problem Was Faced]\n\n## The Solution\n\n[How It Was Solved]\n\n## Results\n\n[What Happened Next]\n\n## Key Learnings\n\n[What We Can Learn]'
    },
    {
      id: 'tutorial-article',
      name: 'Tutorial Article',
      icon: '🎓',
      description: 'Educational tutorials and guides',
      fields: ['title', 'prerequisites', 'stepByStep', 'examples', 'nextSteps'],
      preview: '# [Title]\n\n## Prerequisites\n\n- [Prerequisite 1]\n- [Prerequisite 2]\n\n## Step-by-Step Tutorial\n\n### Step 1: [Title]\n[Instructions]\n\n### Step 2: [Title]\n[Instructions]\n\n### Step 3: [Title]\n[Instructions]\n\n## Examples\n\n[Real Examples]\n\n## Next Steps\n\n[What to Do Next]'
    },
    {
      id: 'review-article',
      name: 'Review Article',
      icon: '⭐',
      description: 'Product, service, or experience reviews',
      fields: ['title', 'overview', 'pros', 'cons', 'rating'],
      preview: '# [Title] Review\n\n## Overview\n\n[What You\'re Reviewing]\n\n## What I Liked\n\n- [Positive Point 1]\n- [Positive Point 2]\n- [Positive Point 3]\n\n## What Could Be Better\n\n- [Negative Point 1]\n- [Negative Point 2]\n\n## My Rating\n\n[Rating]/10 - [Summary]'
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setTemplateData({});
  };

  const handleFieldChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateContent = () => {
    if (!selectedTemplate) return;
    
    // Generate content based on template and data
    let content = selectedTemplate.preview;
    
    // Replace placeholders with actual data
    Object.keys(templateData).forEach(field => {
      const placeholder = `[${field.charAt(0).toUpperCase() + field.slice(1)}]`;
      content = content.replace(new RegExp(placeholder, 'g'), templateData[field] || placeholder);
    });
    
    return content;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Content copied to clipboard!');
    });
  };

  return (
    <div className="content-templates">
      <div className="templates-header">
        <h2>📝 Article Templates</h2>
        <p>Choose from professional templates for different article types</p>
      </div>

      <div className="templates-content">
        {/* Template Selection */}
        <div className="template-selection">
          <h3>Select Template</h3>
          <div className="templates-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${selectedTemplate?.id === template.id ? 'active' : ''}`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="template-icon">{template.icon}</div>
                <h4>{template.name}</h4>
                <p>{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Template Form */}
        {selectedTemplate && (
          <div className="template-form">
            <h3>Fill Template Details</h3>
            <div className="form-fields">
              {selectedTemplate.fields.map((field) => (
                <div key={field} className="form-field">
                  <label htmlFor={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  {field === 'mainContent' || field === 'body' || field === 'benefits' ? (
                    <textarea
                      id={field}
                      value={templateData[field] || ''}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={`Enter ${field}...`}
                      rows="4"
                    />
                  ) : (
                    <input
                      type="text"
                      id={field}
                      value={templateData[field] || ''}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={`Enter ${field}...`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Content Preview */}
        {selectedTemplate && (
          <div className="content-preview">
            <h3>Generated Content</h3>
            <div className="preview-content">
              <pre>{generateContent()}</pre>
            </div>
            <div className="preview-actions">
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(generateContent())}
              >
                📋 Copy Content
              </button>
              <button 
                className="download-btn"
                onClick={() => {
                  const blob = new Blob([generateContent()], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                💾 Download
              </button>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="template-tips">
          <h3>💡 Template Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🎯</div>
              <h4>Be Specific</h4>
              <p>Fill in all template fields with specific, relevant information for better results.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">✏️</div>
              <h4>Customize</h4>
              <p>Edit the generated content to match your brand voice and style.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📊</div>
              <h4>Test & Iterate</h4>
              <p>Try different variations and test what works best with your audience.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔄</div>
              <h4>Reuse</h4>
              <p>Save successful templates as favorites for future use.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTemplates;
