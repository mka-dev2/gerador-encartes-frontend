module.exports = {
    preset: 'ts-jest', // Suporte a TypeScript
    testEnvironment: 'jsdom', // Para testes que envolvem o DOM
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup com jest-dom
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    images: {
      domains: [process.env.URL],
    },
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy', // Para suportar arquivos de estilo
    },
  };