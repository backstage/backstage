---
'@backstage/create-app': patch
---

`knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

You can do the same in your own Backstage repository to ensure that you get future node 18+ relevant updates, by having the following lines in your `packages/backend/package.json`:

```
"dependencies": {
  // ...
  "knex": "^3.0.0"
},
"devDependencies": {
  // ...
  "better-sqlite3": "^9.0.0",
```
