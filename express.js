import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './src/errorHandler.js';

// Import routes
import tasksRouter from './routes/tasks.js';
import usersRouter from './routes/users.js';
import api_users from './routes/api_users.js';
import api_tasks from './routes/api_tasks.js';
import { router as jwt } from './routes/jwt.js';

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
app.use('/api', api_users);
app.use('/api', api_tasks);
app.use('/jwt', jwt);
app.use('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});



app.use(errorHandler.errorNotFound);
app.use(errorHandler.errorDefault);