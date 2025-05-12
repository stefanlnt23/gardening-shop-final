
// This file is the main entry point for Vercel serverless functions
const app = require('./api/index.js');

// Log environment for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Database connection attempt using:', process.env.DATABASE_URL ? 'Environment variable' : 'Default connection string');

// Add CORS middleware to handle Vercel domains
const cors = require('cors');
app.use(cors({
  origin: ['https://gardening-shop-finalv1.vercel.app', process.env.FRONTEND_URL || '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Add a special debug route to check if API is working
app.get('/api/debug', (req, res) => {
  res.json({
    status: 'API is running on Vercel',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
    hasDbUrl: !!process.env.DATABASE_URL
  });
});

// Export the Express app for Vercel
module.exports = app;
