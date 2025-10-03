import React, { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API
    setTimeout(() => {
      setAnalyticsData({
        totalArticles: 127,
        totalWords: 45600,
        avgReadTime: 4.2,
        topPerforming: [
          { title: "Why I'm Not Buying the New iPhone", views: 1250, engagement: 89 },
          { title: "The AI Tools I Actually Use Every Day", views: 980, engagement: 92 },
          { title: "How I Saved $10k in 3 Months", views: 2100, engagement: 95 }
        ],
        categoryBreakdown: [
          { category: 'How-To', count: 45, percentage: 35 },
          { category: 'Opinion', count: 32, percentage: 25 },
          { category: 'Tutorial', count: 28, percentage: 22 },
          { category: 'Review', count: 22, percentage: 18 }
        ],
        engagementMetrics: {
          avgEngagement: 87,
          totalViews: 15600,
          shares: 890,
          comments: 234,
          saves: 567
        },
        contentQuality: {
          readabilityScore: 78,
          seoScore: 85,
          originalityScore: 92,
          overallScore: 85
        },
        recentActivity: [
          { action: 'Article Generated', title: 'The Future of Remote Work', time: '2 hours ago' },
          { action: 'Article Shared', title: 'Why I Quit Social Media', time: '5 hours ago' },
          { action: 'Content Exported', title: 'Investment Strategies 2024', time: '1 day ago' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>📊 Article Analytics</h2>
        <div className="time-range-selector">
          <button 
            className={timeRange === '7d' ? 'active' : ''} 
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''} 
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </button>
          <button 
            className={timeRange === '90d' ? 'active' : ''} 
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics Cards */}
        <div className="metrics-cards">
          <div className="metric-card">
            <div className="metric-icon">📝</div>
            <div className="metric-content">
              <h3>{analyticsData.totalArticles}</h3>
              <p>Articles Generated</p>
              <span className="metric-change">+12% this week</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📖</div>
            <div className="metric-content">
              <h3>{analyticsData.totalWords.toLocaleString()}</h3>
              <p>Total Words</p>
              <span className="metric-change">+8% this week</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <h3>{analyticsData.avgReadTime}min</h3>
              <p>Avg Read Time</p>
              <span className="metric-change">+0.3min this week</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👁️</div>
            <div className="metric-content">
              <h3>{analyticsData.engagementMetrics.totalViews.toLocaleString()}</h3>
              <p>Total Views</p>
              <span className="metric-change">+15% this week</span>
            </div>
          </div>
        </div>

        {/* Top Performing Articles */}
        <div className="analytics-section">
          <h3>🏆 Top Performing Articles</h3>
          <div className="top-articles">
            {analyticsData.topPerforming.map((article, index) => (
              <div key={index} className="article-performance">
                <div className="article-rank">#{index + 1}</div>
                <div className="article-info">
                  <h4>{article.title}</h4>
                  <div className="article-stats">
                    <span>👁️ {article.views} views</span>
                    <span>❤️ {article.engagement}% engagement</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="analytics-section">
          <h3>📊 Content by Category</h3>
          <div className="category-breakdown">
            {analyticsData.categoryBreakdown.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-header">
                  <span className="category-name">{category.category}</span>
                  <span className="category-count">{category.count} articles</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-fill" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className="category-percentage">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Quality Score */}
        <div className="analytics-section">
          <h3>🎯 Content Quality</h3>
          <div className="quality-metrics">
            <div className="quality-item">
              <span className="quality-label">Readability</span>
              <div className="quality-bar">
                <div 
                  className="quality-fill" 
                  style={{ width: `${analyticsData.contentQuality.readabilityScore}%` }}
                ></div>
              </div>
              <span className="quality-score">{analyticsData.contentQuality.readabilityScore}/100</span>
            </div>
            <div className="quality-item">
              <span className="quality-label">SEO Score</span>
              <div className="quality-bar">
                <div 
                  className="quality-fill" 
                  style={{ width: `${analyticsData.contentQuality.seoScore}%` }}
                ></div>
              </div>
              <span className="quality-score">{analyticsData.contentQuality.seoScore}/100</span>
            </div>
            <div className="quality-item">
              <span className="quality-label">Originality</span>
              <div className="quality-bar">
                <div 
                  className="quality-fill" 
                  style={{ width: `${analyticsData.contentQuality.originalityScore}%` }}
                ></div>
              </div>
              <span className="quality-score">{analyticsData.contentQuality.originalityScore}/100</span>
            </div>
            <div className="quality-item overall">
              <span className="quality-label">Overall Score</span>
              <div className="quality-bar">
                <div 
                  className="quality-fill overall" 
                  style={{ width: `${analyticsData.contentQuality.overallScore}%` }}
                ></div>
              </div>
              <span className="quality-score">{analyticsData.contentQuality.overallScore}/100</span>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="analytics-section">
          <h3>💬 Engagement Metrics</h3>
          <div className="engagement-grid">
            <div className="engagement-item">
              <div className="engagement-icon">👁️</div>
              <div className="engagement-content">
                <h4>{analyticsData.engagementMetrics.totalViews.toLocaleString()}</h4>
                <p>Total Views</p>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-icon">📤</div>
              <div className="engagement-content">
                <h4>{analyticsData.engagementMetrics.shares}</h4>
                <p>Shares</p>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-icon">💬</div>
              <div className="engagement-content">
                <h4>{analyticsData.engagementMetrics.comments}</h4>
                <p>Comments</p>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-icon">💾</div>
              <div className="engagement-content">
                <h4>{analyticsData.engagementMetrics.saves}</h4>
                <p>Saves</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="analytics-section">
          <h3>🕒 Recent Activity</h3>
          <div className="recent-activity">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.action === 'Article Generated' && '✨'}
                  {activity.action === 'Article Shared' && '📤'}
                  {activity.action === 'Content Exported' && '📁'}
                </div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;