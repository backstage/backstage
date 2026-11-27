---
'@backstage/plugin-catalog-backend-module-gerrit': patch
---

Added Gerrit support for catalog SCM events. When Gerrit `ref-updated` events reach the `gerrit` events topic, entities registered from the updated branch are refreshed right away instead of waiting for the next scheduled refresh. This only works with a single Gerrit integration configured, since Gerrit events don't include the instance they came from. With more than one, a warning is logged at startup and events are skipped. The `analyzeGerritWebhookEvent` function is exported from the alpha entry point for custom integrations.
