---
'@backstage/eslint-plugin': patch
---

Fixed `visitImports` to return an empty object instead of `undefined` for forward-compatibility with TypeScript 7's stricter return type checking.
