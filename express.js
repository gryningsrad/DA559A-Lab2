import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import tasksRouter from './routes/tasks.js';
import usersRouter from './routes/users.js';
import api from './routes/api.js';

export const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware setup
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'static')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'));

// Use routes
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);
app.use('/api', api);

// Error handler for 404
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
});

// Global errorhandler
app.use((err, req, res, next) => {
  const status = err.status || 500
  console.error(err)
  res.status(status).json({
    status,
    message: err.message
  })
});