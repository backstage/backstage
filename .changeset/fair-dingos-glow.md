---
'@backstage/create-app': patch
---

Remove the `knex` package that is installed in the `packages/backend` as it's provided by the `@backstage/*` packages for you automatically. You can make the following change in your `packages/backend/package.json` if you wish to apply this change.

```diff
    "lint": "backstage-cli package lint",
    "test": "backstage-cli package test",
    "clean": "backstage-cli package clean",
-   "migrate:create": "knex migrate:make -x ts"
```

```diff
    "express": "^4.17.1",
    "express-promise-router": "^4.1.0",
-   "knex": "^0.21.6",
    "pg": "^8.3.0",
```
