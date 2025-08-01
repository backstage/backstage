---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed the `routable` property from `ExtensionBoundary`. This property was never needed in practice and is instead inferred from whether or not the extension outputs a route reference. It can be safely removed.
