---
'@backstage/core-components': patch
---

The translation support for the `Link` component has been removed for now, in order to avoid broad breakages of tests in existing projects where the component is tested without being wrapped in an API provider.
