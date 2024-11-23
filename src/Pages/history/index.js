import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(storedHistory);
  }, []);

  return (
    <div className="history-container">
      <div className="back">
        <Link to="/Tables" className="btn">Voltar</Link>
      </div>
      <h2>Histórico de Mesas Fechadas</h2>
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
