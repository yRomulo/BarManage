import React, { useState, useEffect } from 'react';
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
      items: [...currentItems, { name: selectedItem, quantity: selectedQuantity }],
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
    updatedTables[selectedTable] = null;
    setTables(updatedTables);
    localStorage.setItem('tables', JSON.stringify(updatedTables));
    setSelectedTable(null);
  };

  return (
    <div className="tables-container">
      <div className="back">
        <Link to="/Dashboard" className="btn">Voltar</Link>
      </div>
      <h2>Gerenciamento de Mesas</h2>
      <div className="tables-grid">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`table-icon ${tables[index] ? 'occupied' : 'available'}`}
              onClick={() => handleTableClick(index)}
            >
              Mesa {index + 1}
            </div>
          ))}
      </div>

      {selectedTable !== null && (
        <div className="form-container">
          {tables[selectedTable] ? (
            <>
              <h3>Adicionar Item à Mesa {selectedTable + 1}</h3>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="input-field-tables"
              >
                <option value="">Selecione um item</option>
                {stock.map((item, idx) => (
                  <option key={idx} value={item.name}>
                    {item.name} (Estoque: {item.quantity})
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
              <button onClick={handleCloseTable} className="btn">Fechar Mesa</button>
            </>
          ) : (
            <>
              <h3>Atribuir Responsável à Mesa {selectedTable + 1}</h3>
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
