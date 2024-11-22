import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function Stock() {
  const [stock, setStock] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [editingIndex, setEditingIndex] = useState(null); // Índice do item em edição

  useEffect(() => {
    const storedStock = JSON.parse(localStorage.getItem('stock')) || [];
    setStock(storedStock);
  }, []);

  const handleAddItem = () => {
    if (itemName && itemQuantity && itemPrice) {
      const newItem = {
        name: itemName,
        quantity: parseInt(itemQuantity, 10),
        price: parseFloat(itemPrice),
      };
      const updatedStock = [...stock, newItem];
      setStock(updatedStock);
      localStorage.setItem('stock', JSON.stringify(updatedStock));
      setItemName('');
      setItemQuantity('');
      setItemPrice('');
    } else {
      alert('Preencha todos os campos!');
    }
  };

  const handleDeleteItem = (index) => {
    const updatedStock = stock.filter((_, idx) => idx !== index);
    setStock(updatedStock);
    localStorage.setItem('stock', JSON.stringify(updatedStock));
  };

  const handleEditItem = (index) => {
    setEditingIndex(index); // Define o índice do item sendo editado
  };

  const handleSaveEdit = (index) => {
    const updatedStock = [...stock];
    updatedStock[index] = {
      name: itemName || stock[index].name,
      quantity: itemQuantity ? parseInt(itemQuantity, 10) : stock[index].quantity,
      price: itemPrice ? parseFloat(itemPrice) : stock[index].price,
    };
    setStock(updatedStock);
    localStorage.setItem('stock', JSON.stringify(updatedStock));
    setEditingIndex(null); // Finaliza o modo de edição
    setItemName('');
    setItemQuantity('');
    setItemPrice('');
  };

  return (
    <div className="stock-container">
      <div className="back">
        <Link to="/Dashboard" className="btn">Voltar</Link>
      </div>
      <h2>Gerenciamento de Estoque aaaaa</h2>
      <div className="add-item-container">
        <input
          type="text"
          placeholder="Nome do Item"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Preço"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
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
              {editingIndex === index ? (
                <>
                  {/* Campos de edição */}
                  <td>
                    <input
                      type="text"
                      defaultValue={item.name}
                      onChange={(e) => setItemName(e.target.value)}
                      className="input-field"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      defaultValue={item.quantity}
                      onChange={(e) => setItemQuantity(e.target.value)}
                      className="input-field"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      defaultValue={item.price}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="input-field"
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSaveEdit(index)} className="btn">Salvar</button>
                    <button onClick={() => setEditingIndex(null)} className="btn">Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  {/* Campos normais */}
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>R${item.price}</td>
                  <td>
                    <button onClick={() => handleEditItem(index)} className="btn">Editar</button>
                    <button onClick={() => handleDeleteItem(index)} className="btn">Remover</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stock;
