---
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
---

Fixed incremental ingestion getting stuck when a provider emits the same entity more than once in a single page or event. Since the previous release, this made every attempt to ingest that page fail on PostgreSQL with `ON CONFLICT DO UPDATE command cannot affect row a second time`, so the provider never got past it. Now only the last copy of each entity is kept, and a warning names the provider and some of the repeated entity refs.

Providers should still emit each entity at most once per page. If the copies differ and arrive in a different order on each run, the stored entity can change on every run.
