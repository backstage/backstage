---
'@backstage/plugin-kubernetes-backend': patch
---

Added a new service locator `CatalogRelationServiceLocator` that only returns clusters an entity lists in `relations.dependsOn`.
