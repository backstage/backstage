---
'@backstage/plugin-app-backend': patch
---

Added optional `app.publicConfig` allowlists for config key paths and extension IDs exposed to unauthenticated users of protected apps. Authenticated users retain access to all frontend-visible configuration, and existing behavior is unchanged unless filtering is enabled.
