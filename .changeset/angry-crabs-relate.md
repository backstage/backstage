---
'@backstage/plugin-catalog-backend': minor
---

Add ability to dry run adding a new location to the catalog API.

The location is now added in a transaction and afterwards rolled back.
This allows users to dry run this operation to see if there entity has issues.
This is probably done by automated tools in the CI/CD pipeline.
