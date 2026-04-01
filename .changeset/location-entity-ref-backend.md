---
'@backstage/plugin-catalog-backend': minor
---

The `/locations` endpoints now include an `entityRef` field in their responses, representing the entity ref of the `Location` kind entity generated for each registered location. The field is also available as a filter in the `/locations/by-query` endpoint.
