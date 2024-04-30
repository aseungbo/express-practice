const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let todos = [];

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const newTodo = { id: Date.now(), text };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos', (req, res) => {
  const newTodo = req.body;
  const todoIndex = todos.findIndex(todo => todo.id === parseInt(newTodo.id));
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todos[todoIndex] = newTodo;
  res.json(todos[todoIndex]);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id !== parseInt(id));
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
