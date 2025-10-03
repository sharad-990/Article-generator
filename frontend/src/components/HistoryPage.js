import React from 'react';
import ArticleHistory from './ArticleHistory';
import './HistoryPage.css';

const HistoryPage = () => {
  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Article History</h1>
        <p>View and manage your article generation history</p>
      </div>
      <div className="page-content">
        <ArticleHistory />
      </div>
    </div>
  );
};

export default HistoryPage;



