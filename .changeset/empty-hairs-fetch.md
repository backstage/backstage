---
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-org': patch
---

Display owner and system as entity page links in the tables of the `api-docs`
plugin.

Move `isOwnerOf` and `getEntityRelations` from `@backstage/plugin-catalog` to
`@backstage/plugin-catalog-react` and export it from there to use it by other
plugins.
