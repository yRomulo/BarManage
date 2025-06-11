import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const API_URL = 'http://localhost:3001/api/tables';
const STOCK_API = 'http://localhost:3001/api/stock';

function Tables() {
  // Estados
  const [tables, setTables] = useState([]);
  const [stock, setStock] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [responsible, setResponsible] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Busca inicial dos dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tablesRes, stockRes] = await Promise.all([
          axios.get(`${API_URL}?status=avaliable`),
          axios.get(STOCK_API)
        ]);
        setTables(tablesRes.data);
        setStock(stockRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  // Atualiza os itens da mesa selecionada
  useEffect(() => {
  const fetchTableDetails = async () => {
    if (!selectedTable?.id) return;
    
    try {
      console.log(`Buscando detalhes da mesa ${selectedTable.id}`);
      const res = await axios.get(`${API_URL}/${selectedTable.id}/details`);
      
      if (res.data) {
        setSelectedTable({
          ...selectedTable, // Mantém os dados existentes
          ...res.data,     // Atualiza com os novos dados
          items: res.data.items || [], // Garante que items seja um array
          total: res.data.total || 0   // Garante um total padrão
        });
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Mantém a mesa selecionada mesmo com erro
      setSelectedTable(prev => ({
        ...prev,
        items: [],
        total: 0
      }));
    }
  };

  fetchTableDetails();
}, [refreshTrigger, selectedTable?.id]); // Depende apenas do ID

  // Adicionar item à comanda
  const handleAddItemToTable = async () => {
    try {
      // Validações
      if (!selectedTable?.id) throw new Error('Nenhuma mesa selecionada');
      if (!selectedItem || !selectedQuantity) throw new Error('Preencha todos os campos');
      if (selectedQuantity <= 0) throw new Error('Quantidade inválida');

      // Verifica estoque
      if (selectedItem.quantity < selectedQuantity) {
        throw new Error(`Quantidade insuficiente em estoque (${selectedItem.quantity} disponíveis)`);
      }

      // Atualiza estoque no backend
      await axios.put(`${STOCK_API}/${selectedItem.id}`, {
        quantity: selectedItem.quantity - selectedQuantity
      });

      // Adiciona item à mesa
      await axios.post(`${API_URL}/${selectedTable.id}/items`, {
        item_id: selectedItem.id,
        quantity: selectedQuantity,
        price: selectedItem.price
      });

      // Atualiza estados
      setRefreshTrigger(prev => prev + 1);
      setStock(prevStock => prevStock.map(item => 
        item.id === selectedItem.id 
          ? { ...item, quantity: item.quantity - selectedQuantity } 
          : item
      ));
      resetItemForm();
      alert('Item adicionado com sucesso!');

    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert(`Erro: ${error.response?.data?.error || error.message}`);
    }
  };

  // Editar item da comanda
  const handleEditItem = async () => {
    try {
      if (!editingItem) return;
      
      // Atualiza no backend
      await axios.put(`${API_URL}/${selectedTable.id}/items/${editingItem.id}`, {
        quantity: editingItem.quantity,
        price: editingItem.price
      });

      setRefreshTrigger(prev => prev + 1);
      setEditingItem(null);
      alert('Item atualizado com sucesso!');

    } catch (error) {
      console.error('Erro ao editar item:', error);
      alert(`Erro: ${error.response?.data?.error || error.message}`);
    }
  };

  // Fechar comanda
  const handleCloseTable = async () => {
  try {
    if (!selectedTable) return;

    // Calcula o total
    const total = selectedTable.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );

    // Envia para o histórico
    await axios.post(`${API_URL}/history`, {
      table_number: selectedTable.number,
      responsible: selectedTable.responsible,
      items: JSON.stringify(selectedTable.items),
      total
    });

    // Remove a mesa (ou marca como fechada)
    await axios.delete(`${API_URL}/${selectedTable.id}`);

    // Atualiza a lista
    setRefreshTrigger(prev => prev + 1);
    setSelectedTable(null);
    
    alert(`Comanda fechada! Total: R$ ${total.toFixed(2)}`);

  } catch (error) {
    console.error("Erro ao fechar comanda:", error);
    alert(`Erro: ${error.response?.data?.error || error.message}`);
  }
};

  // Remover comanda aberta
  const handleRemoveTable = async () => {
    try {
      if (!selectedTable) return;
      
      if (selectedTable.status === 'occupied') {
        throw new Error('Não é possível remover comandas fechadas');
      }

      // Devolve itens ao estoque (se houver)
      if (selectedTable.items?.length) {
        await Promise.all(
          selectedTable.items.map(item => 
            axios.put(`${STOCK_API}/${item.item_id}`, {
              quantity: item.quantity
            })
          )
        );
      }

      // Remove a comanda
      await axios.delete(`${API_URL}/${selectedTable.id}`);

      // Atualiza estados
      setTables(prev => prev.filter(t => t.id !== selectedTable.id));
      setSelectedTable(null);
      alert('Comanda removida com sucesso!');

    } catch (error) {
      console.error('Erro ao remover comanda:', error);
      alert(`Erro: ${error.response?.data?.error || error.message}`);
    }
  };

  // Funções auxiliares
  const resetItemForm = () => {
    setSelectedItem(null);
    setSelectedQuantity(1);
    setSelectedCategory('');
  };

  const categories = [...new Set(stock.map(item => item.category))];

  return (
    <div className="tables-container">
      {/* Cabeçalho */}
      <div className="header">
        <Link to="/Dashboard" className="btn">Voltar</Link>
        <h2>Gerenciamento de Comandas</h2>
        <Link to="/History" className="btn">Histórico</Link>
      </div>

      {/* Lista de mesas */}
      <div className="tables-grid">
        {tables.map(table => (
          <div 
            key={table.id}
            className={`table-card ${table.status}`}
            onClick={() => setSelectedTable(table)}
          >
            <h3>Mesa {table.number}</h3>
            {table.responsible && <p>Responsável: {table.responsible}</p>}
            <p>Status: {table.status === 'avaliable' ? 'Aberta' : 'Fechada'}</p>
          </div>
        ))}
      </div>

      {/* Painel de detalhes */}
      {selectedTable && (
        <div className="table-details">
          <h3>Comanda - Mesa {selectedTable.number}</h3>
          
          {selectedTable.status === 'avaliable' ? (
            <>
              {/* Formulário de responsável */}
              {!selectedTable.responsible && (
                <div className="form-group">
                  <input
                    type="text"
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Nome do responsável"
                  />
                  <button 
                    onClick={async () => {
                      await axios.put(`${API_URL}/${selectedTable.id}`, {
                        responsible,
                        status: 'avaliable'
                      });
                      setRefreshTrigger(prev => prev + 1);
                    }}
                  >
                    Atribuir
                  </button>
                </div>
              )}

              {/* Lista de itens */}
              <div className="items-list">
                <h4>Itens:</h4>
                {selectedTable.items?.map(item => (
                  <div key={item.id} className="item-card">
                    {editingItem?.id === item.id ? (
                      <div className="edit-form">
                        <span>{item.name}</span>
                        <input
                          type="number"
                          value={editingItem.quantity}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            quantity: Number(e.target.value)
                          })}
                        />
                        <button onClick={handleEditItem}>Salvar</button>
                        <button onClick={() => setEditingItem(null)}>Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <span>{item.name} ({item.quantity}x) - R$ {item.price.toFixed(2)}</span>
                        <div>
                          <button onClick={() => setEditingItem(item)}>Editar</button>
                          <button 
                            onClick={async () => {
                              await axios.delete(`${API_URL}/${selectedTable.id}/items/${item.id}`);
                              setRefreshTrigger(prev => prev + 1);
                            }}
                          >
                            Remover
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Formulário para adicionar itens */}
              <div className="add-item-form">
                <h4>Adicionar Item:</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {selectedCategory && (
                  <select
                    value={selectedItem?.id || ''}
                    onChange={(e) => {
                      const itemId = Number(e.target.value);
                      const item = stock.find(i => i.id === itemId);
                      setSelectedItem(item);
                    }}
                  >
                    <option value="">Selecione um item</option>
                    {stock
                      .filter(item => item.category === selectedCategory)
                      .map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Estoque: {item.quantity})
                        </option>
                      ))}
                  </select>
                )}

                <input
                  type="number"
                  min="1"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  disabled={!selectedItem}
                />

                <button
                  onClick={handleAddItemToTable}
                  disabled={!selectedItem}
                >
                  Adicionar
                </button>
              </div>

              {/* Ações da comanda */}
              <div className="actions">
                <button onClick={handleCloseTable} className="btn-danger">
                  Fechar Comanda
                </button>
                <button onClick={handleRemoveTable} className="btn-warning">
                  Remover Comanda
                </button>
              </div>
            </>
          ) : (
            <div className="closed-table">
              <p>Comanda fechada em {new Date(selectedTable.closed_at).toLocaleString()}</p>
              <p>Total: R$ {selectedTable.total?.toFixed(2) || '0.00'}</p>
            </div>
          )}

          <button onClick={() => setSelectedTable(null)}>Voltar</button>
        </div>
      )}
    </div>
  );
}

export default Tables;