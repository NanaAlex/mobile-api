const express = require('express');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'usuario@esoft.com' && password === 'Abc123') {
    return res.status(200).json({
      token: '550e8400-e29b-41d4-a716-446655440000'
    });
  }

  return res.status(401).json({
    mensagem: 'Credenciais inválidas'
  });
});

// -> Get
app.get('/jogos', (req, res) => {
  db.all('SELECT * FROM jogos', [], (erro, rows) => {
    if (erro) {
      return res.status(500).json({
        mensagem: 'Erro ao buscar jogos'
      });
    }

    return res.status(200).json(rows);
  });
});

app.get('/jogos/:id', (req, res) => {
  const id = Number(req.params.id);

  db.get('SELECT * FROM jogos WHERE id = ?', [id], (erro, row) => {
    if (erro) {
      return res.status(500).json({
        mensagem: 'Erro ao buscar jogo'
      });
    }

    if (!row) {
      return res.status(404).json({
        mensagem: 'Jogo não encontrado'
      });
    }

    return res.status(200).json(row);
  });
});

// -> Post
app.post('/jogos', (req, res) => {
  const { nome, tipo, nota, review } = req.body;

  if (
    nome === undefined ||
    tipo === undefined ||
    nota === undefined ||
    review === undefined
  ) {
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios'
    });
  }

  db.run(
    'INSERT INTO jogos (nome, tipo, nota, review) VALUES (?, ?, ?, ?)',
    [nome, tipo, nota, review],
    function (erro) {
      if (erro) {
        return res.status(500).json({
          mensagem: 'Erro ao cadastrar jogo'
        });
      }

      return res.status(201).json({
        id: this.lastID,
        nome,
        tipo,
        nota,
        review
      });
    }
  );
});

// -> Put
app.put('/jogos/:id', (req, res) => {
  const id = Number(req.params.id);
  const { nome, tipo, nota, review } = req.body;

  if (
    nome === undefined ||
    tipo === undefined ||
    nota === undefined ||
    review === undefined
  ) {
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios'
    });
  }

  db.run(
    'UPDATE jogos SET nome = ?, tipo = ?, nota = ?, review = ? WHERE id = ?',
    [nome, tipo, nota, review, id],
    function (erro) {
      if (erro) {
        return res.status(500).json({
          mensagem: 'Erro ao atualizar jogo'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          mensagem: 'Jogo não encontrado'
        });
      }

      return res.status(200).json({
        id,
        nome,
        tipo,
        nota,
        review
      });
    }
  );
});

// -> Delete
app.delete('/jogos/:id', (req, res) => {
  const id = Number(req.params.id);

  db.run('DELETE FROM jogos WHERE id = ?', [id], function (erro) {
    if (erro) {
      return res.status(500).json({
        mensagem: 'Erro ao remover jogo'
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        mensagem: 'Jogo não encontrado'
      });
    }

    return res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});