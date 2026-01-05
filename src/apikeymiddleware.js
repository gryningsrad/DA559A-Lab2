export function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey && apiKey === process.env.API_KEY) {
    next(); // API key is valid, proceed to the next middleware/route handler
  } else {
    res.status(403).json({ message: 'Unauthorized: Invalid or missing API key' });
  }
};