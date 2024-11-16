import React from 'react';
import ReactDOM from 'react-dom/client'; // Alterado para a nova API de React 18
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Usando Routes ao invés de Switch
import App from './App';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Stock from './Pages/Stock';
import Tables from './Pages/Tables';
import './index.css';

// Criando o root com a nova API
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/tables" element={<Tables />} />
      <Route path="/" element={<App />} />
    </Routes>
  </Router>
);
