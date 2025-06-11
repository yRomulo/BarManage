const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Middleware para logs
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Criar nova mesa
router.post('/', (req, res) => {
  const { number } = req.body;
  db.run(
    'INSERT INTO tables (number) VALUES (?)',
    [number],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, number });
    }
  );
});

// Listar todas as mesas
router.get('/', (req, res) => {
  db.all('SELECT * FROM tables ORDER BY number', [], (err, tables) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tables);
  });
});

// Detalhes da mesa com itens
router.get('/:id/details', async (req, res) => {
  try {
    const tableId = req.params.id;
    
    // 1. Busca os dados básicos da mesa
    const table = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM tables WHERE id = ?', [tableId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!table) {
      return res.status(404).json({ error: 'Mesa não encontrada' });
    }

    // 2. Busca os itens da mesa (CONSULTA CORRIGIDA)
    const items = await new Promise((resolve, reject) => {
      db.all(
        `SELECT ti.id, ti.quantity, ti.price, 
                s.id as stock_id, s.name, s.category
         FROM table_items ti
         JOIN stock s ON ti.stock_id = s.id  
         WHERE ti.table_id = ?`,
        [tableId],
        (err, rows) => {
          if (err) {
            console.error('Erro na consulta SQL:', err);
            reject(err);
          }
          resolve(rows);
        }
      );
    });

    // 3. Calcula o total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      ...table,
      items: items || [],
      total
    });

  } catch (error) {
    console.error('Erro completo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
});

// Adicionar item à mesa
router.post('/:id/items', async (req, res) => {
  const { id } = req.params;
  const { item_id, quantity, price } = req.body;

  try {
    // Verifica se o item já existe na mesa
    const existingItem = await new Promise((resolve) => {
      db.get(
        'SELECT * FROM table_items WHERE table_id = ? AND item_id = ?',
        [id, item_id],
        (err, row) => resolve(row)
      );
    });

    if (existingItem) {
      // Atualiza quantidade se o item já existir
      await new Promise((resolve) => {
        db.run(
          'UPDATE table_items SET quantity = quantity + ? WHERE id = ?',
          [quantity, existingItem.id],
          function(err) {
            if (err) throw err;
            resolve();
          }
        );
      });
    } else {
      // Adiciona novo item
      await new Promise((resolve) => {
        db.run(
          'INSERT INTO table_items (table_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [id, item_id, quantity, price],
          function(err) {
            if (err) throw err;
            resolve();
          }
        );
      });
    }

    // Atualiza status da mesa
    db.run(
      'UPDATE tables SET status = "open" WHERE id = ?',
      [id]
    );

    res.status(201).json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fechar comanda e salvar no histórico
router.post('/history', (req, res) => {
  const { table_number, responsible, items, total } = req.body;
  
  db.run(
    `INSERT INTO history (table_number, responsible, items, total)
     VALUES (?, ?, ?, ?)`,
    [table_number, responsible, items, total],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Remover mesa
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM tables WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Mesa não encontrada' });
    res.json({ deleted: true });
  });
});

module.exports = router;