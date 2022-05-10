---
'@backstage/create-app': patch
---

Removed the database choice from the `create-app` command.

This reduces the step from development to production by always installing the dependencies and templating the production configuration in `app-config.production.yaml`.

Added `app-config.local.yaml` to allow for local configuration overrides.
To replicate this behavior in an existing installation simply `touch app-config.local.yaml` in the project root and apply your local configuration.

`better-sqlite3` has been moved to devDependencies, for existing installations using postgres in production and SQLite in development it's recommended to move SQLite into the devDependencies section to avoid unnecessary dependencies during builds.

in `packages/backend/package.json`

```diff
  "dependencies": {
    ...
    "pg": "^8.3.0",
-   "better-sqlite3": "^7.5.0",
    "winston": "^3.2.1"
  },
  "devDependencies": {
    ...
    "@types/luxon": "^2.0.4",
+   "better-sqlite3": "^7.5.0"
  }
```
