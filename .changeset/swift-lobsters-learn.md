---
'@backstage/catalog-model': patch
'@backstage/plugin-catalog-backend': patch
---

Added support for the "members" field of the Group entity, allowing specification of direct members from the Group side of the relationship. Added support to the BuiltinKindsEntityProcessor to generate the appropriate relationships.
