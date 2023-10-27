---
'@backstage/core-components': patch
---

Reverted the `MissingAnnotationEmptyState` component changes due to the introduction of a cyclical dependency. In the next release these features will be reintroduced in a component with the same name in `@backstage/plugin-catalog-react`, while the component in `@backstage/core-components` is deprecated.
