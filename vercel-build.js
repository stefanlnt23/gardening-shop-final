
// This script helps with the Vercel build process
const { execSync } = require('child_process');

console.log('Starting Vercel build process...');

try {
  // Build the frontend application
  console.log('Building frontend application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Frontend build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
