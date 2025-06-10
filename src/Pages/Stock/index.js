import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import axios from 'axios';

function Stock() {
  const [stock, setStock] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [editingId, setEditingId] = useState(null); // Índice do item em edição
  const [itemCategory, setItemCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState(""); // Novo estado para busca por categoria
  const [sorting, setSorting] = useState({ field: "", ascending: true });

  const API_URL = 'http://localhost:3001/api/stock';

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await axios.get(API_URL);
      setStock(response.data);
    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
    }
  };

  const handleAddItem = async () => {
    if (itemName && itemQuantity && itemPrice && itemCategory) {
      try {
        await axios.post(API_URL, {
          name: itemName,
          category: itemCategory,
          quantity: parseInt(itemQuantity, 10),
          price: parseFloat(itemPrice)
        });
        fetchStock();
        setItemName("");
        setItemQuantity("");
        setItemPrice("");
        setItemCategory("");
      } catch (error) {
        console.error("Erro ao adicionar item:", error);
      }
    } else {
      alert("Preencha todos os campos!");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStock();
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const handleEditItem = (item) => {
    setEditingId(item.id);
    setItemName(item.name);
    setItemQuantity(item.quantity.toString());
    setItemPrice(item.price.toString());
    setItemCategory(item.category);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_URL}/${editingId}`, {
        name: itemName,
        category: itemCategory,
        quantity: parseInt(itemQuantity, 10),
        price: parseFloat(itemPrice)
      });
      fetchStock();
      cancelEdit();
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setItemName("");
    setItemQuantity("");
    setItemPrice("");
    setItemCategory("");
  };

  const handleSort = (field) => {
    const isAscending = sorting.field === field ? !sorting.ascending : true;
    const sortedStock = [...stock].sort((a, b) => {
      if (a[field] < b[field]) return isAscending ? -1 : 1;
      if (a[field] > b[field]) return isAscending ? 1 : -1;
      return 0;
    });
    setSorting({ field, ascending: isAscending });
    setStock(sortedStock);
  };

  // Filtragem dos itens com base no nome e na categoria
  const filteredStock = stock.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.category.toLowerCase().includes(searchCategory.toLowerCase())
  );

  return (
    <div className="stock-container">
      <div className="back">
        <Link to="/Dashboard" className="btn">
          Voltar
        </Link>
      </div>
      <h2>Gerenciamento de Estoque</h2>
      <div className="add-item-container">
        <input
          type="text"
          placeholder="Nome do Item"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={itemCategory}
          onChange={(e) => setItemCategory(e.target.value)}
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
        <button onClick={handleAddItem} className="btn">
          Adicionar Item
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Pesquisar por categoria..."
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="input-field"
        />
      </div>
      <table className="stock-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Nome</th>
            <th onClick={() => handleSort("category")}>Categoria</th>
            <th onClick={() => handleSort("quantity")}>Quantidade</th>
            <th onClick={() => handleSort("price")}>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredStock.map((item) => (
            <tr key={item.id}>
              {editingId  === item.id ? (
                <>
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
                      type="text"
                      defaultValue={item.category}
                      onChange={(e) => setItemCategory(e.target.value)}
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
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="btn"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn"
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>R${item.price}</td>
                  <td>
                    <button
                      onClick={() => handleEditItem(item.id)}
                      className="btn"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="btn"
                    >
                      Remover
                    </button>
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
