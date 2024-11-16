import React, { useState, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../../utils/LocalStorage';
import './styles.css';

function Tables() {
  const [tableNumber, setTableNumber] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [tables, setTables] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    setTables(getFromLocalStorage('tables') || []);
    setStock(getFromLocalStorage('stock') || []);
  }, []);

  const handleAddTable = () => {
    const newTable = { number: tableNumber, items: [] };
    const updatedTables = [...tables, newTable];
    setTables(updatedTables);
    saveToLocalStorage('tables', updatedTables);
  };

  const handleAddItemToTable = (tableNumber) => {
    const item = stock.find((i) => i.name === itemName);
    if (item && item.quantity >= quantity) {
      item.quantity -= quantity;
      const updatedTables = tables.map((table) =>
        table.number === tableNumber
          ? { ...table, items: [...table.items, { name: itemName, quantity, totalPrice: item.price * quantity }] }
          : table
      );
      setTables(updatedTables);
      saveToLocalStorage('tables', updatedTables);
      saveToLocalStorage('stock', stock);
    } else {
      alert('Item não disponível no estoque');
    }
  };

  const handleCloseOrder = (tableNumber) => {
    const table = tables.find((t) => t.number === tableNumber);
    const total = table.items.reduce((acc, item) => acc + item.totalPrice, 0);
    alert(`Valor total do pedido: R$${total.toFixed(2)}`);
  };

  return (
    <div className="tables-container">
      <h2>Gerenciar Mesas</h2>
      <div className="input-container">
        <input
          type="number"
          placeholder="Número da Mesa"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="input-field"
        />
        <button onClick={handleAddTable} className="btn">Adicionar Mesa</button>
      </div>

      <div className="tables-list">
        {tables.map((table, index) => (
          <div key={index} className="table">
            <h3>Mesa {table.number}</h3>
            <button onClick={() => handleCloseOrder(table.number)} className="btn">Fechar Pedido</button>
            <div>
              <select onChange={(e) => setItemName(e.target.value)} className="input-field">
                {stock.map((item, idx) => (
                  <option key={idx} value={item.name}>
                    {item.name} - {item.quantity} disponíveis
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantidade"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field"
              />
              <button onClick={() => handleAddItemToTable(table.number)} className="btn">Adicionar Item</button>
            </div>
            <ul>
              {table.items.map((item, idx) => (
                <li key={idx}>{item.name} - {item.quantity} x R${item.totalPrice.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tables;
