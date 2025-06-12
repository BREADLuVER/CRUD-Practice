const express = require('express');
const authMiddleware = require('../middleware/auth');
const { prisma } = require('../lib/prisma');

const router = express.Router();

// Apply JWT middleware to all routes
router.use(authMiddleware);

// GET /todos - List all todos for the logged-in user
router.get('/', async (req, res) => {
  try {
    const userTodos = await prisma.todo.findMany({
      where: { userId: req.user.id },
    });
    res.json(userTodos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// GET /todos/:id - Get a single todo (only if owned by user)
router.get('/:id', async (req, res) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ message: 'Todo not found.' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching todo' });
  }
});

// POST /todos - Create a new todo
router.post('/', async (req, res) => {
  const { title, description = '', completed = false } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }
  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        completed,
        userId: req.user.id,
      },
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ message: 'Error creating todo' });
  }
});

// PUT /todos/:id - Update a todo (only if owned by user)
router.put('/:id', async (req, res) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ message: 'Todo not found.' });
    }
    const { title, description, completed } = req.body;
    const updatedTodo = await prisma.todo.update({
      where: { id: todo.id },
      data: {
        title: title !== undefined ? title : todo.title,
        description: description !== undefined ? description : todo.description,
        completed: completed !== undefined ? completed : todo.completed,
      },
    });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Error updating todo' });
  }
});

// DELETE /todos/:id - Delete a todo (only if owned by user)
router.delete('/:id', async (req, res) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ message: 'Todo not found.' });
    }
    await prisma.todo.delete({
      where: { id: todo.id },
    });
    res.json({ message: 'Todo deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

module.exports = router; 