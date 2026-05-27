---
'@backstage/plugin-catalog-react': minor
---

Redesigned the `CatalogFilterBlueprint` alpha API from a component-rendering model to a declarative, model-based approach. Filters can now be declared as facet-based (providing a label, entity path, and selection mode) or options-based (providing static options with a `toFilter` function and API dependency injection). The old `loader`-based API is deprecated but still supported for custom filter components.

Added new exported types: `CatalogFilterDescriptor`, `CatalogFacetFilterDescriptor`, `CatalogOptionsFilterDescriptor`, `CatalogCustomFilterDescriptor`.
