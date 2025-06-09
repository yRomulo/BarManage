import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
function App() {
  return (
    <div className="app-container">
      <h1>Bem-vindo ao Sistema de Gerenciamento de Bar</h1>
      <div className="links">
        <Link to="/login" className="btn">Login</Link>
        
      </div>
    </div>
  );
}

export default App;
