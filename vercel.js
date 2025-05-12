
// This file is the main entry point for Vercel serverless functions
const app = require('./api/index.js');

// Log the environment for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Database connection attempt using:', process.env.DATABASE_URL ? 'Environment variable' : 'Default connection string');

// Export the Express app for Vercel
module.exports = app;
