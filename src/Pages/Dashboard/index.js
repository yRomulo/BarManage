import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';
import './styles.css';

function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove o usuário do localStorage
    navigate('/'); // Redireciona para a tela de login
  };

  return (
    <div className="dashboard-container">
      <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      <h2>Painel de Controle</h2>
      <div className="dashboard-links">
        <Link to="/stock" className="btn">Estoque</Link>
        <Link to="/tables" className="btn">Gerenciar comandas</Link>
      </div>
    </div>
  );
}

export default Dashboard;
