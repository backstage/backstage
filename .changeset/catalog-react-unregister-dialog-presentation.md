---
'@backstage/plugin-catalog-react': patch
---

The success message shown after deleting an entity from the unregister dialog now names the entity the same way the rest of the catalog does, using the Catalog Presentation API. For example, a user's or group's profile display name is now used when there is one, and an entity without a title outside the default namespace is shown with its namespace.
