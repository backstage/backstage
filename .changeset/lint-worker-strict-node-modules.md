---
'@backstage/cli-module-lint': patch
---

Fixed `repo lint` failing with strict `node_modules` layouts such as pnpm's isolated linker. The lint workers now receive the `eslint` and `globby` module paths resolved from `@backstage/cli-module-lint` itself, instead of resolving them from the current working directory inside the worker.
