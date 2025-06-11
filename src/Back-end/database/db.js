// Configuração do banco de dados com todas as tabelas necessárias
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/bar.db', (err) => {
  if (err) console.error(err.message);
  console.log('Conectado ao banco de dados.');
});

// Criação das tabelas
db.serialize(() => {
  // Tabela de mesas
  db.run(`CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER NOT NULL UNIQUE,
    responsible TEXT,
    status TEXT CHECK(status IN ('open', 'closed')) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  
  // Tabela de itens do estoque
  db.run(`CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  
  // Tabela de itens das comandas
  db.run(`CREATE TABLE IF NOT EXiSTS table_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id INTEGER NOT NULL,
  stock_id INTEGER NOT NULL,  -- ou item_id
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id) REFERENCES stock(id)
);`);
  
  // Tabela de histórico
  db.run(`CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number INTEGER NOT NULL,
    responsible TEXT NOT NULL,
    items TEXT NOT NULL, -- JSON com os itens
    total REAL NOT NULL,
    closed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;