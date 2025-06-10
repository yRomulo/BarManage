const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET - Lista todos os itens
router.get('/', (req, res) => {
  db.all('SELECT * FROM stock', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST - Adiciona novo item
router.post('/', (req, res) => {
  const { name, category, quantity, price } = req.body;
  db.run(
    'INSERT INTO stock (name, category, quantity, price) VALUES (?, ?, ?, ?)',
    [name, category, quantity, price],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// PUT - Atualiza um item
router.put('/:id', (req, res) => {
  const { name, category, quantity, price } = req.body;
  db.run(
    'UPDATE stock SET name = ?, category = ?, quantity = ?, price = ? WHERE id = ?',
    [name, category, quantity, price, req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    }
  );
});

// DELETE - Remove um item
router.delete('/:id', (req, res) => {
  db.run(
    'DELETE FROM stock WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    }
  );
});

module.exports = router;