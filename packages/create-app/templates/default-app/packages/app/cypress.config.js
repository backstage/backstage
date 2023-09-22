const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fixturesFolder: false,
  retries: 3,

  e2e: {
    supportFile: false,
    baseUrl: 'http://localhost:3001',
  },
});
