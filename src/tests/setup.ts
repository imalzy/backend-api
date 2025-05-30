import { v4 as uuidv4 } from 'uuid';

// Mock UUID to make tests deterministic
jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => 'test-uuid-1234')
}));

// Suppress console logs during tests unless explicitly testing them
const originalConsoleError = console.error;
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

// Only suppress logs in test environment
if (process.env.NODE_ENV === 'test') {
  global.console.error = jest.fn();
  global.console.log = jest.fn();
  global.console.warn = jest.fn();
}

// Clean up after all tests
afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
});