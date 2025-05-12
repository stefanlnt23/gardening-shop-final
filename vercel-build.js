
// This script helps debug Vercel builds
console.log('Starting Vercel build process');
const { execSync } = require('child_process');

try {
  console.log('Building frontend...');
  execSync('npm run vercel-build', { stdio: 'inherit' });
  console.log('Frontend build complete!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
