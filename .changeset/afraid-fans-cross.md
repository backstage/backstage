---
'@backstage/create-app': patch
'@backstage/cli': patch
---

Add `config.d.ts` files to the list of included file in `tsconfig.json`.

This allows ESLint to detect issues or deprecations in those files.
