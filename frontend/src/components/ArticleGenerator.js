import React, { useState } from 'react';
import { useArticleHistory } from '../contexts/ArticleHistoryContext';
import { useCategory } from '../contexts/CategoryContext';
import ArticleForm from './ArticleForm';
import ArticleList from './ArticleList';
import CategorySelector from './CategorySelector';
import './ArticleGenerator.css';

const ArticleGenerator = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { addToHistory } = useArticleHistory();
  const { selectedCategory, setSelectedCategory, getCategoryById } = useCategory();

  const handleGenerateArticles = async (params) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/generateArticles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: params.input,
          length: params.length,
          tone: params.tone,
          template: params.template,
          category: selectedCategory
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.articles);
        setSuccess(`Successfully generated ${data.articles.length} articles!`);
        
        // Add each article to history with category
        data.articles.forEach(article => {
          const articleWithCategory = {
            ...article,
            category: selectedCategory === 'all' ? 'Generated' : getCategoryById(selectedCategory)?.name || 'Generated'
          };
          addToHistory(articleWithCategory);
        });
      } else {
        setError(data.message || 'Failed to generate articles');
      }
    } catch (err) {
      setError('Network error. Please check if the backend is running.');
      console.error('Error generating articles:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="article-generator">
      <div className="container">
        <div className="hero">
          <h1>Create Viral Articles</h1>
          <p>Generate high-quality, engaging articles that you can copy and use on any platform</p>
        </div>

        <CategorySelector 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <ArticleForm 
          onGenerate={handleGenerateArticles}
          loading={loading}
        />

        {articles.length > 0 && (
          <ArticleList 
            articles={articles}
          />
        )}
      </div>
    </div>
  );
};

export default ArticleGenerator;
