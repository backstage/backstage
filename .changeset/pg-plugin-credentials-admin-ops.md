---
'@backstage/backend-defaults': patch
---

Fixed a regression in the PostgreSQL database connector where the credentials and role configured for a specific plugin under `backend.database.plugin.<pluginId>` were ignored when checking for and creating the plugin's database or schema, and when setting the role on the plugin's connections. The base `backend.database` credentials and role were used instead, which made per-plugin credentials fail at startup or create databases owned by the wrong user. Plugin-level `connection` and `role` are now honored again for these operations.
