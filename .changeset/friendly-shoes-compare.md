---
'@backstage/plugin-catalog': patch
---

Add `CatalogIndexPage` and `CatalogEntityPage`, two new extensions that replace the existing `Router` component.

Add `EntityLayout` to replace `EntityPageLayout`, using children instead of an element property, and allowing for collection of all `RouteRef` mount points used within tabs.

Add `EntitySwitch` to be used to select components based on entity data, along with accompanying `isKind`, `isNamespace`, and `isComponentType` filters.
