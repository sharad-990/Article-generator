import React from 'react';
import ContentLibrary from './ContentLibrary';
import './LibraryPage.css';

const LibraryPage = () => {
  return (
    <div className="library-page">
      <div className="page-header">
        <h1>Content Library</h1>
        <p>Manage and organize your saved articles</p>
      </div>
      <div className="page-content">
        <ContentLibrary />
      </div>
    </div>
  );
};

export default LibraryPage;



