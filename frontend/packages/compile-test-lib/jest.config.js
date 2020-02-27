module.exports = {
  ...require('@spotify/web-scripts/config/jest.config.js'),
  setupFilesAfterEnv: ['../jest.setup.ts'],
};
