---
'@backstage/plugin-catalog': patch
---

- Added `RelatedEntitesCard` as a base implementation of displaying entities that are related to another entity.
- Added `HasResourcesCard` to display resources that are part of a system.
- Added `DependsOnComponentsCard` to display components that are dependencies of a component.
- Added `DependsOnResourcesCard` to display resources that are dependencies of a component.
- Refactored `HasComponentsCard` to use base `RelatedEntitiesCard`. Card remains backwards compatible.
- Refactored `HasSubcomponentsCard` to use base `RelatedEntitiesCard`. Card remains backwards compatible.
- Refactored `HasSystemsCard` to use base `RelatedEntitiesCard`. Card remains backwards compatible.
- Updated the example app to take advantage of these new components.
