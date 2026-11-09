---
'@backstage/plugin-catalog-backend': minor
---

Added experimental endpoints for following changes to the catalog. `GET /entities/changes` returns the refs of entities that may have changed after a given position, including deletions, and can hold the request open until there are new changes. Subscriptions under `/entities/changes/subscriptions` keep track of a consumer's position on the server, and let several replicas of a service share it. Read the current state of the returned refs through `POST /entities/by-refs`. See the catalog API documentation for details. The endpoints may change while deletion tracking is being rolled out.
