import express from 'express';
import jwt from 'jsonwebtoken';
import { jwtMiddleware } from '../src/jwtMiddleware.js';
import bcrypt from 'bcrypt';
import { conn } from '../db/database.js';

export const router = express.Router();

// Login endpoint to authenticate user and generate JWT
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let jwtToken

  try {
    jwtToken = await login(username, password);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  res.json({
    token: jwtToken,
    type: 'success',
    message: 'Authentication successful',
    payload: jwt.decode(jwtToken)
  });
});

// Perform login and generating JWT token
async function login(username, password) {

  const user = await getUser(username, password);
  if (!user) {
    throw new Error('User not found');
  }
  
  const payload = {
    sub: user.username,
    iss: 'Issue id',
    iat: Date.now(),
    role: user.role,
    username: user.username,
    permissions: ['read', 'write']
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
};

// check user in database
async function getUser(username, password) {
  const [resultset] = await conn.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  const user = resultset.length > 0 ? resultset[0] : null;

  if (!user) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch === false) {
    return null;
  }

  delete user.password
  return user;
  
};

// protected route example
router.get('/protected', jwtMiddleware, (req, res) => {
  res.json({ 
    message: 'Access to protected route granted',
    payload: res.locals.user});
});

// Create hash passwords
router.get('/create-hashed-passwords', async (req, res) => {
  const sql = "SELECT username, password FROM users";
  const [users] = await conn.execute(sql);

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await conn.execute(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, user.username]
    );
  }

  res.json({ message: 'Hashed passwords created in database' });
});