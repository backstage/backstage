---
'@backstage/repo-tools': patch
---

`repo schema openapi lint` now flags use of the reserved `id` key inside `meta` objects of `x-backstage-*` extensions when the spec targets OpenAPI 3.0.x. OpenAPI 3.0.x uses JSON Schema draft-04, where `id` is treated as a schema identifier, causing AJV validation conflicts.
