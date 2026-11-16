---
'@backstage/plugin-catalog-backend': patch
---

The `PUT /locations/:id` endpoint now requires the `catalog.location.delete` permission in addition to `catalog.location.create`. Updating a location that changes its target replaces the location and re-registers the entities that it holds, so it requires the same permissions as the equivalent delete and create operations. Make sure that your permission policies grant `catalog.location.delete` to users who need to update locations.
