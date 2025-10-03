import React from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Track your article performance and usage statistics</p>
      </div>
      <div className="page-content">
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;



