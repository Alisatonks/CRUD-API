export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
	moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
  verbose: true,
};
