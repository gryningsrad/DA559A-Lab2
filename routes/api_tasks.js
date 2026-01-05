import express from 'express';
import { conn } from '../db/database.js';

export const router = express.Router();

// Get all tasks
router.get('/tasks', async (req, res) =>  {
  
  const sql = 'SELECT * FROM tasks';

  const [results] = await conn.query(sql) ;

  res.status(200).json({
    status: 'success',
    count: results.length,
    data: results
  });

});

router.get('/tasks/:id', async (req, res) =>  {
  
  const sql = 'SELECT * FROM tasks WHERE id = ?';
  
  const [results] = await conn.query(sql, [req.params.id]) ;

  if (results.length === 0) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.status(200).json({
    status: 'success',
    data: results
  });
});

// Create new task
router.post('/tasks', async (req, res) =>  {
  const task = req.body;

  const sql = 'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)';
  
  const [results] = await conn.query(sql, [
    task.title,
    task.description,
    task.status,
    task.user_id
  ]) ;

  const newTaskId = results.insertId;

  const sql2 = 'SELECT * FROM tasks WHERE id = ?';
  
  const [newTaskRows] = await conn.query(sql2, [newTaskId]) ;   

  res.status(201).json({...newTaskRows }

)});

// Update task
router.put('/tasks/:id', async (req, res) =>  {
  const task = req.body;
  const taskId = req.params.id;

  const sql = 'UPDATE tasks SET title = ?, description = ?, status = ?, user_id = ? WHERE id = ?';
  
  const [results] = await conn.query(sql, [
    task.title,
    task.description,
    task.status,
    task.user_id,
    taskId
  ]);

  if (results.affectedRows === 0) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Fetch the updated task
  const sql2 = 'SELECT * FROM tasks WHERE id = ?';
  const [updatedTaskRows] = await conn.query(sql2, [taskId]) ;   

  res.json({...updatedTaskRows })
});

// Delete task by ID
router.delete('/tasks/:id', async (req, res) =>  {

  const sql = 'DELETE FROM tasks WHERE id = ?';

  const [results] = await conn.query(sql, [req.params.id]) ;

  if (results.affectedRows === 0) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.status(200).json({ message: 'Task deleted successfully' });

});

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