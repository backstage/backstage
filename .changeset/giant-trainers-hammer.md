---
'@backstage/plugin-catalog-backend': patch
---

In `PlaceholderProcessor`, removed unnecessary escape characters in resolvers exceptions.
The YAML placeholder resolver throws YAML document errors with the error message instead of the whole object.
