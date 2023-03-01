---
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-catalog-backend-module-github': patch
---

Introduce a `conflictHandler` that can be passed in to allow for custom entity conflict resolution strategies to solve consistency issues present in event-based and auto-discovery based entity ingestion.
