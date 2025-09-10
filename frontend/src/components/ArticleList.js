import React from 'react';
import ArticleCard from './ArticleCard';
import './ArticleList.css';

const ArticleList = ({ articles }) => {
  return (
    <div className="article-list-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Generated Articles</h2>
          <p className="card-subtitle">
            Preview the content and copy what you need to your preferred platform
          </p>
        </div>
        
        <div className="article-grid">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              article={article}
              index={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
