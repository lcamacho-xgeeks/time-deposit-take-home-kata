module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'domains',
      testMatch: ['<rootDir>/src/*/domain/src/**/*.test.ts']
    },
    {
      displayName: 'integration', 
      testMatch: ['<rootDir>/src/*/adapters/src/**/*.integration.test.ts'],
    },
    {
      displayName: 'adapters',
      testMatch: ['<rootDir>/src/*/adapters/src/**/*.test.ts'],
      testPathIgnorePatterns: ['integration']
    },
    {
      displayName: 'applications',
      testMatch: ['<rootDir>/src/apps/*/src/**/*.test.ts']
    }
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};