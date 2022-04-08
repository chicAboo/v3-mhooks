module.exports = {
  moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: process.env.COVERAGE === 'true',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!<rootDir>/dist/**/*',
  ],
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  globals: {
    'ts-jest': {
      babelConfig: './babel.config.js',
    },
  },
  testEnvironment: 'jest-environment-jsdom-global',
};
