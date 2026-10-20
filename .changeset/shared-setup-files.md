---
'@backstage/cli-module-test-jest': patch
---

Fixed `setupFilesAfterEnv` from the root `package.json` Jest configuration being shared between workspace packages, which caused each package's `src/setupTests` file to also be added to every other package.
