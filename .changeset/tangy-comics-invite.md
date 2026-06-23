---
'@backstage/cli-module-actions': minor
'@backstage/backend-defaults': minor
---

Added a new `/.backstage/actions/v1/sources` endpoint that exposes the configured `backend.actions.pluginSources` from app-config, allowing CLI clients to discover available action sources without manual configuration. The `actions sources list` and `actions list` commands now fetch plugin sources from the Backstage backend instead of requiring manual local configuration. The `actions sources add` and `actions sources remove` commands have been removed as they are no longer needed.
