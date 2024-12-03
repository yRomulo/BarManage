import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
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

  const exportToExcel = () => {
    if (history.length === 0) {
      alert("Não há histórico para exportar.");
      return;
    }

    // Transformar os dados do histórico em um array de objetos
    const dataToExport = history.map(entry => ({
      Responsável: entry.responsible,
      Mesa: entry.tableNumber,
      Total: entry.total.toFixed(2),
      FechadaEm: new Date(entry.timestamp).toLocaleString(),
      Itens: entry.items.map(item => `${item.name} (${item.quantity}x)`).join(', '),
    }));

    // Criar uma nova planilha
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Histórico');
    const Data = new Date (Date.now());
    // Exportar o arquivo
    XLSX.writeFile(workbook, 'historico_'+Data.toLocaleString('pt-BR', { timezone: 'UTC' })+'.xlsx');
  };

  return (
    <div className="history-container">
      <div className="back">
        <Link to="/Tables" className="btn">Voltar</Link>
      </div>
      <h2>Histórico de Comandas Fechadas</h2>
      <div className="button-container">
        <button onClick={clearHistory} className="btn btn-clear">Limpar Histórico</button>
        <button onClick={exportToExcel} className="btn btn-export">Exportar para Excel</button>
      </div>
      {history.length === 0 ? (
        <p>Nenhuma comanda foi fechada ainda.</p>
      ) : (
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <h3>Responsável: {entry.responsible}</h3>
              <p>Comanda {entry.tableNumber}</p>
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
