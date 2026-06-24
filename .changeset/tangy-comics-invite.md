---
'@backstage/cli-module-actions': minor
'@backstage/backend-defaults': minor
---

Added a new `/.backstage/actions/v1/sources` endpoint that exposes the configured `backend.actions.pluginSources` from app-config, allowing CLI clients to discover available action sources without manual configuration. The `actions sources list` and `actions list` commands now automatically fetch plugin sources from the Backstage backend when no local sources are configured. Local sources added and removed via `actions sources add` and `actions sources remove` write to local metadata and merge with the server-provided list.
