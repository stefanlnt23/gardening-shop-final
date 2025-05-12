
// This file is the main entry point for Vercel serverless functions
const app = require('./api/index.js');

// Log the DATABASE_URL environment variable (without actual credentials)
console.log('Database connection attempt is using URL:', process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL is not set');

module.exports = app;
