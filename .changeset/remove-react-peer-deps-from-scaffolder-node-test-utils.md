---
'@backstage/plugin-scaffolder-node-test-utils': patch
---

Removed unnecessary `react`, `react-dom`, `react-router-dom`, and `@types/react` peer and dev dependencies. This package is a `node-library` and does not use React in its source code, causing spurious peer dependency warnings in new Backstage installations.
