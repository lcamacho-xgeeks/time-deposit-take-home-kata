module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'root',
      testMatch: ['<rootDir>/src/tests/**/*.test.ts']
    },
    {
      displayName: 'domains',
      testMatch: ['<rootDir>/src/domains/*/src/**/*.test.ts']
    },
    {
      displayName: 'adapters',
      testMatch: ['<rootDir>/src/adapters/*/src/**/*.test.ts']
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