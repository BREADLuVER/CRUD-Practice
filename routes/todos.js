const express = require('express');
const { todos } = require('../models/data');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply JWT middleware to all routes
router.use(authMiddleware);

// GET /todos - List all todos for the logged-in user
router.get('/', (req, res) => {
  const userTodos = todos.filter(todo => todo.userId === req.user.id);
  res.json(userTodos);
});

// GET /todos/:id - Get a single todo (only if owned by user)
router.get('/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo || todo.userId !== req.user.id) {
    return res.status(404).json({ message: 'Todo not found.' });
  }
  res.json(todo);
});

// POST /todos - Create a new todo
router.post('/', (req, res) => {
  const { title, description = '', completed = false } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }
  const todo = {
    id: todos.length + 1,
    title,
    description,
    completed,
    userId: req.user.id
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT /todos/:id - Update a todo (only if owned by user)
router.put('/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo || todo.userId !== req.user.id) {
    return res.status(404).json({ message: 'Todo not found.' });
  }
  const { title, description, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
});

// DELETE /todos/:id - Delete a todo (only if owned by user)
router.delete('/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id) && t.userId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Todo not found.' });
  }
  todos.splice(index, 1);
  res.json({ message: 'Todo deleted.' });
});

module.exports = router; 