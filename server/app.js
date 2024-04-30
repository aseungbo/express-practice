const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB에 연결
mongoose.connect('mongodb://localhost:27017')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
  });


const { Schema } = mongoose;
const TodoSchema = new Schema({
  text: String,
  date: {
    type: Date,
    default: Date.now,
  },
})

const Todo = mongoose.model('Todo', TodoSchema);

let todos = [];

app.get('/todos', async (req, res) => {
  const todos = await Todo.find({});
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const todo =  new Todo({text: text})
  const result = await todo.save().then(() => {
    res.status(201).json(todo);
  }).catch((err) => console.error(err));
});

app.put('/todos', async (req, res) => {
  const newTodo = req.body;
  const result = await Todo.updateOne({_id: newTodo._id}, {$set: {text: newTodo.text}})
  res.sendStatus(200);
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await Todo.deleteOne({ _id: id })
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
