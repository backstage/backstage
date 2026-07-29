---
'@backstage/plugin-catalog-backend': patch
---

Audit events for entity routes (`/entities`, `/entities/by-uid/:uid`, `/refresh`, etc.) are now generated automatically from the OpenAPI spec instead of being created manually in each route handler. Audit event ids and metadata are unchanged, and a client aborting the connection before the response completes is now correctly recorded as a failed audit event instead of leaving it pending indefinitely.
