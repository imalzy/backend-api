// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    'server.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/tests/**/*',
    '!src/server.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  verbose: true,
  testTimeout: 30000,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: false
};