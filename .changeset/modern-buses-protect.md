---
'@backstage/plugin-catalog-react': patch
---

When a user has zero owned entities when viewing an entity kind in the catalog
page, it will be automatically redirected to see all the entities. Furthermore,
for the kind User and Group there are no longer the owned selector.
