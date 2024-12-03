import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Stock() {
  const [stock, setStock] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // Índice do item em edição
  const [itemCategory, setItemCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState(""); // Novo estado para busca por categoria
  const [sorting, setSorting] = useState({ field: "", ascending: true });

  useEffect(() => {
    const storedStock = JSON.parse(localStorage.getItem("stock")) || [];
    setStock(storedStock);
  }, []);

  const handleAddItem = () => {
    if (itemName && itemQuantity && itemPrice && itemCategory) {
      const newItem = {
        name: itemName,
        category: itemCategory,
        quantity: parseInt(itemQuantity, 10),
        price: parseFloat(itemPrice),
      };
      const updatedStock = [...stock, newItem];
      setStock(updatedStock);
      localStorage.setItem("stock", JSON.stringify(updatedStock));
      setItemName("");
      setItemQuantity("");
      setItemPrice("");
      setItemCategory("");
    } else {
      alert("Preencha todos os campos!");
    }
  };

  const handleDeleteItem = (index) => {
    const updatedStock = stock.filter((_, idx) => idx !== index);
    setStock(updatedStock);
    localStorage.setItem("stock", JSON.stringify(updatedStock));
  };

  const handleEditItem = (index) => {
    setEditingIndex(index); // Define o índice do item sendo editado
    setItemName(stock[index].name);
    setItemQuantity(stock[index].quantity.toString());
    setItemPrice(stock[index].price.toString());
    setItemCategory(stock[index].category);
  };

  const handleSaveEdit = (index) => {
    const updatedStock = [...stock];
    updatedStock[index] = {
      name: itemName || stock[index].name,
      quantity: itemQuantity
        ? parseInt(itemQuantity, 10)
        : stock[index].quantity,
      price: itemPrice ? parseFloat(itemPrice) : stock[index].price,
      category: itemCategory || stock[index].category,
    };
    setStock(updatedStock);
    localStorage.setItem("stock", JSON.stringify(updatedStock));
    setEditingIndex(null); // Finaliza o modo de edição
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
          {filteredStock.map((item, index) => (
            <tr key={index}>
              {editingIndex === index ? (
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
                      onClick={() => handleSaveEdit(index)}
                      className="btn"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
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
                      onClick={() => handleEditItem(index)}
                      className="btn"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteItem(index)}
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
