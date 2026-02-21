---
'@backstage/plugin-catalog-backend': minor
---

Added opentelemetry metrics for SCM events:

- `catalog.events.scm.messages` with attribute `eventType`: Counter for the number of SCM events actually received by the catalog backend. The `eventType` is currently either `location` or `repository`.
