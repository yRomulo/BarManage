import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2>Painel de Controle</h2>
      <div className="dashboard-links">
        <Link to="/stock" className="btn">Estoque</Link>
        <Link to="/tables" className="btn">Gerenciar comandas</Link>
      </div>
    </div>
  );
}

export default Dashboard;
