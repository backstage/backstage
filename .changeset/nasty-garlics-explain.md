---
'@backstage/backend-common': patch
---

Bump to the latest version of the Knex library.

You will most likely want to bump your own `packages/backend/package.json` as well:

```diff
-    "knex": "^0.21.18",
+    "knex": "^0.95.1",
```

Note that the recent versions of the Knex library have some changes that may affect your internal plugins' database migration files. Importantly, they now support `ALTER TABLE` on SQLite, and no longer accidentally remove indices when making some modifications. It now also exports the `Knex` typescript type as a named export.

```ts
import { Knex } from 'knex';
```
