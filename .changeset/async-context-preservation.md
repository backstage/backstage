---
'@backstage/backend-defaults': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-node': patch
'@backstage/plugin-events-backend': patch
'@backstage/plugin-events-node': patch
'@backstage/plugin-mcp-actions-backend': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-signals-backend': patch
'@backstage/plugin-techdocs-backend': patch
'@backstage/plugin-user-settings-backend': patch
---

Background work, queued work and event handlers now run in the async context they belong to, rather than in the context of whichever request happened to trigger them. For example, event subscribers run in the context they subscribed from instead of the publisher's, and scheduled tasks no longer inherit the context of the caller that scheduled them. This keeps tracing and other async context consistent.
