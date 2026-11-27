---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-mcp-actions-backend': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-techdocs-backend': patch
'@backstage/plugin-user-settings-backend': patch
---

Work that waits in a shared concurrency queue, and cleanup that runs when a streaming connection closes, now runs in the async context of the request it belongs to rather than that of an unrelated request. This keeps tracing and other async context consistent.
