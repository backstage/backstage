---
'@backstage/plugin-catalog': minor
---

Updated catalog page filters to use the new model-based `CatalogFilterBlueprint` API. The built-in kind, type, tags, lifecycle, and namespace filters are now declared as facet models, and the processing status filter uses the new options model with a custom `toFilter` function. Model-based filters are rendered using Backstage UI `Select` components.
