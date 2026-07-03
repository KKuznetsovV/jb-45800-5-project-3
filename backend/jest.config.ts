import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.integration.test.ts'],
    clearMocks: true,
    passWithNoTests: true,
    testTimeout: 30000,
}

export default config
