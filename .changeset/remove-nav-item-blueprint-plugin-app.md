---
'@backstage/plugin-app': patch
---

Following the removal of `NavItemBlueprint` in `@backstage/frontend-plugin-api`, the built-in app nav was updated to keep accepting legacy `nav-item` extensions so older plugins continue to work until they migrate.
