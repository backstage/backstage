---
'@backstage/plugin-catalog-backend': minor
---

The catalog now resolves former entity refs declared in the `backstage.io/former-names` annotation through the new `GET /entities/by-former-name/{kind}/{namespace}/{name}` endpoint.

The endpoint returns a 404 when an entity currently has the requested ref, when several entities declare it as a former name, or when the caller is not allowed to read the declaring entity. Existing entities pick up the annotation the next time they are processed. No database migration is required.
