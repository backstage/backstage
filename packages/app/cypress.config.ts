const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    "baseUrl": "http://localhost:3000",
    "fixturesFolder": false,
    "supportFile": "cypress/**/*.js"
  }
});
