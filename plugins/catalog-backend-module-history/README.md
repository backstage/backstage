# @backstage/plugin-catalog-backend-module-history

This module amends your catalog backend with history functionality, tracking insertions, updates, and deletions of entities.

## Getting started

```shell
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-history
```

In `packages/backend/src/index.ts` add the module:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend-module-history'));
```
