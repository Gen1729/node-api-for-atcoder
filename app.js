const express = require('express');
const app = express();

app.use(express.json());

// ルート
app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel');
});

// パスパラメータ: GET /users/123
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});

// クエリパラメータ: GET /search?q=apple&limit=10
app.get('/search', (req, res) => {
  const { q, limit } = req.query;
  res.json({ q, limit });
});

// ローカル開発のときだけ app.listen する
if (process.env.NODE_ENV !== 'production') {
  const port = 3000;
  app.listen(port, () => {
    console.log(`Local Express server on http://localhost:${port}`);
  });
}

// Vercel 用に app を export
module.exports = app;
