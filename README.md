# Simple Todos API (Node.js + Express)

A basic backend API for a todos list with user authentication, using in-memory storage.

## Features
- User signup and login (JWT authentication)
- CRUD for todos (per user)
- Simple, in-memory data storage
- Optional: Simple HTML/JS frontend

## Setup
1. Install dependencies:
   ```bash
   npm install express cors jsonwebtoken bcryptjs
   ```
2. Start the server:
   ```bash
   node app.js
   ```

API will run on `http://localhost:3000/` by default. 