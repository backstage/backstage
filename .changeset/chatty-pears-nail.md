---
'@backstage/plugin-catalog-backend': patch
---

When retrieving the text of a document also check if the entity is of type group. The function will then also return the display name and the description and not only the description.
