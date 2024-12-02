import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function Tables() {
  const [tables, setTables] = useState([]);
  const [stock, setStock] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [responsible, setResponsible] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');

  useEffect(() => {
    const storedTables = JSON.parse(localStorage.getItem('tables')) || [];
    const storedStock = JSON.parse(localStorage.getItem('stock')) || [];
    setTables(storedTables);
    setStock(storedStock);
  }, []);

  const handleTableClick = (index) => {
    setSelectedTable(index);
    if (tables[index]?.responsible) {
      setResponsible('');
    }
  };

  const handleAssignTable = () => {
    const updatedTables = [...tables];
    updatedTables[selectedTable] = {
      responsible: responsible || tables[selectedTable]?.responsible,
      items: tables[selectedTable]?.items || [],
    };
    setTables(updatedTables);
    localStorage.setItem('tables', JSON.stringify(updatedTables));
    setSelectedTable(null);
    setResponsible('');
  };

  const handleAddItemToTable = () => {
    if (!selectedItem || !selectedQuantity) {
      alert('Preencha os campos de item e quantidade!');
      return;
    }

    const item = stock.find((i) => i.name === selectedItem);
    if (!item || item.quantity < selectedQuantity) {
      alert('Quantidade insuficiente no estoque!');
      return;
    }

    const updatedStock = stock.map((i) =>
      i.name === selectedItem ? { ...i, quantity: i.quantity - selectedQuantity } : i
    );
    const updatedTables = [...tables];
    const currentItems = updatedTables[selectedTable]?.items || [];
    updatedTables[selectedTable] = {
      ...updatedTables[selectedTable],
      items: [
        ...currentItems,
        { name: selectedItem, quantity: selectedQuantity, price: item.price },
      ],
    };

    setStock(updatedStock);
    setTables(updatedTables);
    localStorage.setItem('stock', JSON.stringify(updatedStock));
    localStorage.setItem('tables', JSON.stringify(updatedTables));
    setSelectedItem('');
    setSelectedQuantity('');
  };

  const handleCloseTable = () => {
    const updatedTables = [...tables];
    const table = updatedTables[selectedTable];
    const total = table.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    // Criar o registro para o histórico
    const closedTableEntry = {
      tableNumber: selectedTable + 1,
      responsible: table.responsible,
      items: table.items,
      total,
      timestamp: Date.now(),
    };
  
    // Salvar no histórico
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    const updatedHistory = [...storedHistory, closedTableEntry];
    localStorage.setItem('history', JSON.stringify(updatedHistory));
  
    alert(
      `Mesa ${selectedTable + 1} fechada! \nItens Consumidos:\n` +
        table.items
          .map(
            (item) =>
              `- ${item.name} (${item.quantity}x) - R$${(
                item.price * item.quantity
              ).toFixed(2)}`
          )
          .join('\n') +
        `\nTotal: R$${total.toFixed(2)}`
    );
  
    // Remover a mesa fechada
    updatedTables[selectedTable] = null;
    setTables(updatedTables);
    localStorage.setItem('tables', JSON.stringify(updatedTables));
    setSelectedTable(null);
  };
  

  const handleAddTable = () => {
    const updatedTables = [...tables, null];
    setTables(updatedTables);
    localStorage.setItem('tables', JSON.stringify(updatedTables));
  };

  const handleRemoveTable = (index) => {
    if (tables[index]) {
      alert('A comanda precisa estar vazia para ser removida!');
      return;
    }
    const updatedTables = tables.filter((_, idx) => idx !== index);
    setTables(updatedTables);
    localStorage.setItem('tables', JSON.stringify(updatedTables));
  };

  return (
    <div className="tables-container">
      <div className="back">
        <Link to="/Dashboard" className="btn">Voltar</Link>
        <Link to="/History" className="btn">Ver Histórico</Link>
      </div>
      <h2>Gerenciamento de Comandas</h2>
      <div className="tables-grid">
        {tables.map((table, index) => (
          <div
            key={index}
            className={`table-icon ${table ? 'occupied' : 'available'}`}
            onClick={() => handleTableClick(index)}
          >
            Comanda {index + 1}: {table?.responsible &&  <span> {table.responsible}</span>}
          </div>
        ))}
      </div>
      <button onClick={handleAddTable} className="btn">Adicionar Comanda</button>
      {tables.length > 0 && (
        <button
          onClick={() => handleRemoveTable(tables.length - 1)}
          className="btn"
        >
          Remover Última Comanda
        </button>
      )}

      {selectedTable !== null && (
        <div className="form-container">
          {tables[selectedTable] ? (
            <>
              <h3>Itens na Comanda {selectedTable + 1}</h3>
              <ul>
                {tables[selectedTable].items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} ({item.quantity}x) - R${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <h3>Adicionar Item à Comanda</h3>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="input-field-tables"
              >
                <option value="">Selecione um item</option>
                {stock.map((item, idx) => (
                  <option key={idx} value={item.name}>
                    {item.name} R${item.price} (Estoque: {item.quantity}) 
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantidade"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                className="input-field-tables"
              />
              <button onClick={handleAddItemToTable} className="btn">Adicionar Item</button>
              <button onClick={handleCloseTable} className="btn">Fechar Comanda</button>
            </>
          ) : (
            <>
              <h3>Atribuir Responsável à Comanda {selectedTable + 1}</h3>
              <input
                type="text"
                placeholder="Nome do Responsável"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="input-field-tables"
              />
              <button onClick={handleAssignTable} className="btn">Atribuir</button>
            </>
          )}
          <button onClick={() => setSelectedTable(null)} className="btn">Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default Tables;
