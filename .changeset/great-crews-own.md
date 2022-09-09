---
'@backstage/cli': patch
---

Add support for supplying `testFilePatterns` when generating eslint config.

Any additional patterns supplied in `testFilePatterns` will be used when applying test-specific linting configuration. Note that the test running configuration in Backstage is opinionated about which files contain _tests_ - with that in mind, this option is mostly useful for supplying patterns which match test support files (utils, mocks, etc).

To supply the new option, pass it in the options object passed as the second parameter to `eslint-factory`:

```javascript
module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  testFilePatterns: ['src/**/__tests__/**'],
});
```
