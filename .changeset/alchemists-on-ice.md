---
'@backstage/plugin-catalog-backend': patch
---

Add support for `fields` sub-selection of just parts of an entity when listing
entities in the catalog backend.

Example: `.../entities?fields=metadata.name,spec.type` will return partial
entity objects with only those exact fields present and the rest cut out.
Fields do not have to be simple scalars - you can for example do
`fields=metadata`.
