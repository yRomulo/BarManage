import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    // Ordenar por timestamp (mais recente primeiro)
    const sortedHistory = storedHistory.sort((a, b) => b.timestamp - a.timestamp);
    setHistory(sortedHistory);
  }, []);

  const clearHistory = () => {
    if (window.confirm("Tem certeza que deseja limpar o histórico?")) {
      localStorage.removeItem('history');
      setHistory([]);
      alert("Histórico limpo com sucesso!");
    }
  };

  return (
    <div className="history-container">
      <div className="back">
        <Link to="/Tables" className="btn">Voltar</Link>
      </div>
      <h2>Histórico de Mesas Fechadas</h2>
      <button onClick={clearHistory} className="btn btn-clear">
        Limpar Histórico
      </button>
      {history.length === 0 ? (
        <p>Nenhuma mesa foi fechada ainda.</p>
      ) : (
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <h3>Responsável: {entry.responsible}</h3>
              <p>Mesa {entry.tableNumber}</p>
              <ul>
                {entry.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} ({item.quantity}x) - R${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> R${entry.total.toFixed(2)}</p>
              <p><small>Fechada em: {new Date(entry.timestamp).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;
