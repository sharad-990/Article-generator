import React from 'react';
import ArticleGenerator from './ArticleGenerator';
import './GeneratePage.css';

const GeneratePage = () => {
  return (
    <div className="generate-page">
      <div className="page-header">
        <h1>Generate Articles</h1>
        <p>Create high-quality, human-like articles with AI assistance</p>
      </div>
      <div className="page-content">
        <ArticleGenerator />
      </div>
    </div>
  );
};

export default GeneratePage;



