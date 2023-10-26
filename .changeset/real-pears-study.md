---
'@backstage/core-components': patch
---

Reverting the `MissingAnnotationEmptyState` component due to cyclical dependency. This component is now deprecated, please use the import from `@backstage/plugin-catalog-react` instead to use the new functionality
