---
'@backstage/plugin-catalog-backend': minor
---

Make use of the `resolveUrl` facility of the `integration` package.

Also rename the `LocationRefProcessor` to `LocationEntityProcessor`, to match the file name. This constitutes an interface change since the class is exported, but it is unlikely to be consumed outside of the package since it sits comfortably with the other default processors inside the catalog builder.
