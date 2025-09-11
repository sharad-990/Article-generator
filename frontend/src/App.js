import React, { useState } from 'react';
import ArticleGenerator from './components/ArticleGenerator';
import TrendingSidebar from './components/TrendingSidebar';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="app-layout">
        <main className="main-content">
          <ArticleGenerator />
        </main>
        <aside className="sidebar">
          <TrendingSidebar />
        </aside>
      </div>
    </div>
  );
}

export default App;
