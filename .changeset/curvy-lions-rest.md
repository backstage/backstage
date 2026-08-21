---
'@backstage/plugin-scaffolder-backend-module-sentry': minor
---

**BREAKING**: Restrict Sentry API requests to the configured API base URL. Move custom action-level `apiBaseUrl` values to `scaffolder.sentry.apiBaseUrl` before upgrading.
