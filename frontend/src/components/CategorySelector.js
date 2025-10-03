import React from 'react';
import { useCategory } from '../contexts/CategoryContext';
import './CategorySelector.css';

const CategorySelector = ({ onCategoryChange, selectedCategory }) => {
  const { categories } = useCategory();

  return (
    <div className="category-selector">
      <h4>Select Category:</h4>
      <div className="category-grid">
        <button
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          <span className="category-icon">🌟</span>
          <span className="category-name">All Topics</span>
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            style={{ '--category-color': category.color }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
