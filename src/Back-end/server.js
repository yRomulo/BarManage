const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas (exemplo para produtos)
const stockRouter = require('./routes/stock');
app.use('/api/stock', stockRouter);

const tablesRouter = require('./routes/tables');
app.use('/api/tables', tablesRouter);



// Inicia o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});