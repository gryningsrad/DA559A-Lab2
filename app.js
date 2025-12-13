import { app } from './express.js';
import dotenv from 'dotenv';

// Start the server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}`);
});

server.on('error', (err)  => {
  console.error('Server error:', err);
});

function shutdown() {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  } )
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);