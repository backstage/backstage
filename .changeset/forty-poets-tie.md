---
'@backstage/plugin-catalog-react': patch
---

Decouple tags picker from backend entities

`EntityTagPicker` fetches all the tags independently and it doesn't require all the entities to be available client side.
