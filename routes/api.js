import express from 'express';
import { conn } from '../db/database.js';

export const router = express.Router();

// Test api
router.get('/test', (req, res) => {
  res.json({ 
    status: 'API is running' 
  });
});

router.get('/users', async (req, res) =>  {
  
  const sql = 'SELECT * FROM users';
  
  const [results] = await conn.query(sql) ;
  res.json({ users: results }
  )});

  router.get('/tasks', async (req, res) =>  {
  
  const sql = 'SELECT * FROM tasks';
  
  const [results] = await conn.query(sql) ;
  res.json({ users: results }
  )});

router.get('/user/:id', async (req, res) =>  {
  
  const sql = 'SELECT * FROM users WHERE id = ?';
  
  const [results] = await conn.query(sql, [req.params.id]) ;
  res.json({ users: results }
  )});

router.get('/usertasks', async (req, res) =>  {
  
  const sql = 'SELECT * FROM users INNER JOIN tasks ON users.id = tasks.user_id ORDER BY users.username';
  
  const [results] = await conn.query(sql) ;
  res.json({ users: results }
  )});

router.get('/usertasks-filter', async (req, res) =>  {
  
  const sql = `
  SELECT * FROM users 
    INNER JOIN tasks 
    ON users.id = tasks.user_id 
    WHERE users.username LIKE ?
    ORDER BY users.username
    `;
  
  let search = req.query.search || '';
  search = '%' + search + '%';

  const [results] = await conn.query(sql, [search]) ;
  res.json({ users: results }
  )});

export default router;