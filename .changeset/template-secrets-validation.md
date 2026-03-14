---
'@backstage/plugin-scaffolder-backend': minor
---

Added secrets schema validation for task creation, retry, and dry-run endpoints. When a template defines `spec.secrets.schema`, the API validates provided secrets against the schema and returns a `400` error if validation fails.
