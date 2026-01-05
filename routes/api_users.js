import express from 'express';
import { conn } from '../db/database.js';
import { apiKeyMiddleware } from '../src/apikeymiddleware.js';

export const router = express.Router();

// Test api
router.get('/health', (req, res) => {
  res.json({ 
    status: 'API is running' 
  });
});

// Get all users
router.get('/users', async (req, res) =>  {
  
  const sql = 'SELECT * FROM users';
  
  const [results] = await conn.query(sql) ;
  res.json({ 
    status: 'success',
    count: results.length,
    data: results }
  )});

// Get user by ID
router.get('/users/:id', async (req, res) =>  {
  
  const sql = 'SELECT * FROM users WHERE id = ?';
  
  const [results] = await conn.query(sql, [req.params.id]) ;

  if (results.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ 
    status: 'success',
    count: results.length,
    data: results })
});

  // Create new user
router.post('/users', async (req, res) =>  {
  const user = req.body;

  const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  
  const [results] = await conn.query(sql, [
    user.username, 
    user.password,
    user.email
  ]) ;

  const newUserId = results.insertId;

  const sql2 = 'SELECT * FROM users WHERE id = ?';
  
  const [newUserRows] = await conn.query(sql2, [newUserId]) ;   

  res.status(201).json({ 
    status: 'success',
    count: newUserRows.length,
    data: newUserRows }
)});

// Update user
router.put('/users/:id', async (req, res) =>  {
  const user = req.body;
  const userId = req.params.id;

  const sql = 'UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?';
  
  const [results] = await conn.query(sql, [
    user.username, 
    user.password,
    user.email,
    userId
  ]);

  if (results.affectedRows === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Fetch the updated user
  const sql2 = 'SELECT * FROM users WHERE id = ?';
  const [updatedUserRows] = await conn.query(sql2, [userId]) ;   

  res.json({ 
    status: 'success',
    count: updatedUserRows.length,
    data: updatedUserRows })

});

// Delete user
router.delete('/users/:id', apiKeyMiddleware, async (req, res) =>  {
  const userId = req.params.id;

  const sql = 'DELETE FROM users WHERE id = ?';
  const [results] = await conn.query(sql, [userId]);

  if (results.affectedRows === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(204).send();
});

export default router;