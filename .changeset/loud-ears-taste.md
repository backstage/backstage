---
'@backstage/create-app': patch
---

The `better-sqlite3` dependency has been moved back to production `"dependencies"` in `packages/backend/package.json`, with instructions in the Dockerfile to move it to `"devDependencies"` if desired. There is no need to apply this change to existing apps, unless you want your production image to have SQLite available as a database option.
