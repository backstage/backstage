---
'@backstage/cli-module-actions': minor
'@backstage/backend-defaults': minor
---

Added a new `/.backstage/actions/v1/sources` endpoint that exposes the configured `backend.actions.pluginSources` from app-config, allowing CLI clients to discover available action sources without manual configuration. The `actions sources list` and `actions list` commands now always fetch plugin sources from the Backstage backend and merge them with local additions and exclusions. Local sources added via `actions sources add` and removed via `actions sources remove` are stored as local metadata and merged with server-provided sources.
