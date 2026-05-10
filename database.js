const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./banco.db', (erro) => {
  if (erro) {
    console.error('Erro ao conectar no banco:', erro.message);
  } else {
    console.log('Conectado ao banco SQLite.');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jogos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,
      nota INTEGER NOT NULL,
      review TEXT NOT NULL
    )
  `);

    db.get('SELECT COUNT(*) AS total FROM jogos', [], (erro, row) => {
    if (!erro && row.total === 0) {
      db.run(`
        INSERT INTO jogos (nome, tipo, nota, review)
        VALUES
        ('The Last of Us', 'Ação/Aventura', 10, 'Uma história incrível e emocionante.')
      `);
    }
  });
});

module.exports = db;