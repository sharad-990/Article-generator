import React, { useState } from 'react';
import ArticleGenerator from './components/ArticleGenerator';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <ArticleGenerator />
      </main>
    </div>
  );
}

export default App;
