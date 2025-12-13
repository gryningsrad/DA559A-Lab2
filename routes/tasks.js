import express from 'express';

export const router = express.Router();

// Test api
router.get('/test', (req, res) => {
  res.send({ status: 'API is running' });
});

export default router;