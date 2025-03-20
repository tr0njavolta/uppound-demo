import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PetDetailPage from './pages/PetDetailPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header /> 
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pets/:id" element={<PetDetailPage />} />
          </Routes>
        </main>
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;
