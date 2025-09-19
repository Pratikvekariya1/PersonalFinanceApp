const { execSync } = require('child_process');

// Global setup for E2E tests
beforeAll(async () => {
  // Start Appium server if not already running
  console.log('Setting up E2E test environment...');
  
  // Build Android app
  console.log('Building Android app...');
  execSync('cd android && ./gradlew assembleDebug', { stdio: 'inherit' });
  
  console.log('E2E setup complete!');
});

afterAll(async () => {
  console.log('E2E tests completed!');
});

// Global test configuration
jest.setTimeout(120000); // 2 minutes timeout for E2E tests
