---
'@backstage/cli': patch
---

The ESLint configuration for packages with the `common-library` role now reports named imports from `lodash`, such as `import { trimEnd } from 'lodash'`. Common libraries are published with an ESM build, and these imports cause that build to fail when imported from ESM projects in Node.js. Use `import lodash from 'lodash'` instead.
