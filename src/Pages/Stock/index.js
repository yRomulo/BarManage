import React, { useState, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../../utils/LocalStorage';
import './styles.css';

function Stock() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    setStock(getFromLocalStorage('stock') || []);
  }, []);

  const handleAddItem = () => {
    const newItem = { name, quantity, price };
    const updatedStock = [...stock, newItem];
    setStock(updatedStock);
    saveToLocalStorage('stock', updatedStock);
  };

  const handleRemoveItem = (index) => {
    const updatedStock = stock.filter((_, i) => i !== index);
    setStock(updatedStock);
    saveToLocalStorage('stock', updatedStock);
  };

  const handleEditItem = (index, updatedItem) => {
    const updatedStock = stock.map((item, i) => (i === index ? updatedItem : item));
    setStock(updatedStock);
    saveToLocalStorage('stock', updatedStock);
  };

  return (
    <div className="stock-container">
      <h2>Estoque</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Nome do item"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input-field"
        />
        <button onClick={handleAddItem} className="btn">Adicionar Item</button>
      </div>

      <table className="stock-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => handleRemoveItem(index)} className="btn">Remover</button>
                <button onClick={() => handleEditItem(index, { ...item, quantity: item.quantity + 1 })} className="btn">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stock;
