---
'@backstage/plugin-catalog-react': minor
---

Added optional `fields` prop and `setFields` method to EntityListProvider to allow specifying which entity fields should be returned from catalog API calls. This enables optimization of API requests by reducing response payload size.
