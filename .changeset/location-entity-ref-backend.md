---
'@backstage/plugin-catalog-backend': minor
---

Location responses now include an `entityRef` field with the stable entity reference for each location. The `entityRef` field is also filterable via `POST /locations/by-query`. Added `PUT /locations/:id` endpoint for updating the type and target of an existing location.
